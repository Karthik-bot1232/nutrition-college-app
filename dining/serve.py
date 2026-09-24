"""Browse the collected menus in a browser.

    python3 -m dining.serve                    # http://127.0.0.1:8000
    python3 -m dining.serve --port 8080 --open

Read-only: it serves whatever `refresh` already stored, so run a refresh first.
Stdlib only, so it runs wherever the scraper runs.
"""

import argparse
import json
import re
import webbrowser
from datetime import date
from functools import partial
from http.server import BaseHTTPRequestHandler, ThreadingHTTPServer
from pathlib import Path
from urllib.parse import parse_qs, urlparse

from psycopg.types.json import Jsonb

from . import db
from .allergens import CANONICAL, normalize
from .colleges import get_adapter
from .export import _nutrition_suspect
from .models import NUTRIENT_FIELDS

WEB_ROOT = Path(__file__).resolve().parent / "web"
CONTENT_TYPES = {
    ".html": "text/html",
    ".js": "text/javascript",
    ".css": "text/css",
    ".svg": "image/svg+xml",
    # Browsers ignore a manifest served as anything else, so the app
    # silently stays un-installable.
    ".webmanifest": "application/manifest+json",
    ".json": "application/json",
}

#: Exactly what `_item_json` reads for a card, rather than `i.*`. `ingredients`
#: is by far the widest column and no card shows it, so selecting it shipped a
#: paragraph per row across the country to be thrown away. Cards do not use
#: `allergens_raw`, `source_url` or `fetched_at` either -- `api_item` selects
#: those for the one recipe whose detail panel is open.
_CARD_COLUMNS = ", ".join(f"i.{column}" for column in (
    "external_id", "name", "serving_size", "allergens", "has_allergen_data",
    "diets", *NUTRIENT_FIELDS))

SELECT_JOINED = f"""
SELECT e.service_date::text AS service_date, e.meal, e.location_id,
       e.location_name, e.station, e.portion, e.tags, {_CARD_COLUMNS}
FROM menu_entries e
JOIN items i ON i.college = e.college AND i.external_id = e.item_external_id
"""


#: Pure fat is ~255 kcal/oz, so nothing real exceeds it. Olive oil, the densest
#: thing UMD publishes, measures 250.6.
MAX_KCAL_PER_OZ = 260
_OUNCES = re.compile(r"^\s*([\d.]+)\s*(?:oz|ounce)", re.I)


def _serving_ounces(serving_size: str | None) -> float | None:
    match = _OUNCES.match(serving_size or "")
    return float(match.group(1)) if match else None


def _label_implausible(row) -> bool:
    """True when a label cannot describe one serving of real food.

    Different failure from `_nutrition_suspect`: those labels contradict
    themselves, so comparing macros against calories catches them. These are
    internally consistent and simply enormous -- every macro scaled up together,
    a whole pan published as a portion. UMD serves a tilapia at 283g protein /
    2051 kcal / 28,384mg sodium for "1 ea"; nothing about it is self-contradictory.

    Two tests. Calorie density is the sharp one and needs a weighed portion:
    above `MAX_KCAL_PER_OZ` the food would have to be denser than fat. The
    absolute bounds are the loose fallback for "1 each" portions, where there is
    no weight to divide by -- they do catch a few genuinely huge composite
    sandwiches, which is the right way to be wrong for a nutrition app.

    These sit at the top of any protein ranking, which is exactly the query this
    UI exists to answer, so cards get a badge and the protein sort drops them to
    the bottom. Published numbers are still shown unchanged.
    """
    ounces = _serving_ounces(row["serving_size"])
    if ounces and row["calories"] and row["calories"] / ounces > MAX_KCAL_PER_OZ:
        return True
    return ((row["calories"] or 0) > 1000
            or (row["protein_g"] or 0) > 80
            or (row["sodium_mg"] or 0) > 5000)


def _item_json(row, full: bool = False) -> dict:
    item = {
        "recipe_id": row["external_id"],
        "name": row["name"],
        "serving_size": row["serving_size"],
        "calories": row["calories"],
        "nutrients": {f: row[f] for f in NUTRIENT_FIELDS if f != "calories"},
        "allergens": row["allergens"] or [],
        "allergen_data_published": bool(row["has_allergen_data"]),
        "diets": row["diets"] or [],
        "has_nutrition": row["calories"] is not None,
        "nutrition_suspect": _nutrition_suspect(row),
        "label_implausible": _label_implausible(row),
    }
    if full:
        item["allergens_as_published"] = row["allergens_raw"] or []
        item["ingredients"] = row["ingredients"]
        item["source_url"] = row["source_url"]
        item["fetched_at"] = row["fetched_at"].isoformat() if row["fetched_at"] else None
    return item


def _placement(row) -> dict:
    return {
        "date": row["service_date"],
        "meal": row["meal"],
        "location_id": row["location_id"],
        "location_name": row["location_name"],
        "station": row["station"],
        "portion": row["portion"],
        "menu_tags": row["tags"] or [],
    }


def api_meta(conn, college: str) -> dict:
    adapter = get_adapter(college)
    dates = [r["service_date"] for r in conn.execute(
        "SELECT DISTINCT service_date::text AS service_date FROM menu_entries "
        "WHERE college = ? ORDER BY 1", (college,))]
    counts = {f"{r['service_date']}|{r['meal']}|{r['location_id']}": r["n"]
              for r in conn.execute(
                  "SELECT service_date::text AS service_date, meal, location_id, "
                  "COUNT(*) AS n FROM menu_entries WHERE college = ? "
                  "GROUP BY 1, 2, 3", (college,))}
    return {
        "college": college,
        "college_name": adapter.name,
        "locations": [{"id": lid, "name": name} for lid, name in adapter.locations.items()],
        "meals": list(adapter.meals),
        "dates": dates,
        "today": date.today().isoformat(),
        "allergens": list(CANONICAL),
        "counts": counts,
    }


def api_menu(conn, college: str, q: dict) -> dict:
    """One meal. `location=all` returns every hall instead of just one."""
    day = q.get("date", [date.today().isoformat()])[0]
    meal = q.get("meal", ["Lunch"])[0]
    location = q.get("location", ["16"])[0]

    sql = SELECT_JOINED + " WHERE e.college = ? AND e.service_date = ? AND e.meal = ?"
    params: list = [college, day, meal]
    if location != "all":
        sql += " AND e.location_id = ?"
        params.append(location)
    sql += " ORDER BY e.location_name, e.station, i.name"
    rows = conn.execute(sql, params).fetchall()

    halls: dict[str, dict] = {}
    for row in rows:
        hall = halls.setdefault(row["location_id"], {
            "location_id": row["location_id"],
            "location_name": row["location_name"],
            "stations": {},
        })
        item = _item_json(row)
        item["portion"] = row["portion"]
        item["menu_tags"] = row["tags"] or []
        hall["stations"].setdefault(row["station"] or "Other", []).append(item)

    # The adapter's own order, so halls do not shuffle between requests.
    order = list(get_adapter(college).locations)
    grouped = [{
        "location_id": h["location_id"],
        "location_name": h["location_name"],
        "count": sum(len(v) for v in h["stations"].values()),
        "stations": [{"station": n, "items": i} for n, i in h["stations"].items()],
    } for h in sorted(halls.values(), key=lambda h: order.index(h["location_id"]))]

    return {"date": day, "meal": meal, "location_id": location,
            "count": len(rows), "locations": grouped}


def api_search(conn, college: str, q: dict) -> dict:
    """Search item names, optionally scoped to one day / meal / hall.

    Filters mirror `query find`: an item whose allergen data was never published
    is hidden by an --without filter rather than treated as free of it.
    """
    sql = SELECT_JOINED + " WHERE e.college = ?"
    params: list = [college]

    term = q.get("q", [""])[0].strip()
    if term:
        sql += " AND (i.name ILIKE ?" + (" OR i.ingredients ILIKE ?)"
                                         if q.get("ingredients") else ")")
        params.append(f"%{term}%")
        if q.get("ingredients"):
            params.append(f"%{term}%")
    if q.get("scope", ["day"])[0] == "day":
        sql += " AND e.service_date = ?"
        params.append(q.get("date", [date.today().isoformat()])[0])
    for key, column in (("meal", "e.meal"), ("location", "e.location_id")):
        value = (q.get(key) or [""])[0]
        # "all" is the UI's every-hall / every-meal pill, not a row value: matching
        # on it literally is how a search silently returns nothing.
        if value and value != "all":
            sql += f" AND {column} = ?"
            params.append(value)
    if q.get("min_protein") and q["min_protein"][0]:
        sql += " AND i.protein_g >= ?"
        params.append(float(q["min_protein"][0]))
    if q.get("max_calories") and q["max_calories"][0]:
        sql += " AND i.calories <= ?"
        params.append(float(q["max_calories"][0]))

    excluded = [t for t in q.get("without", []) if t]
    for raw in excluded:
        canonical = normalize(raw)
        if canonical is None:
            return {"error": f"Unknown allergen {raw!r}"}
        # jsonb containment, so "nuts" can no longer match "tree_nuts".
        sql += " AND NOT (i.allergens @> ?)"
        params.append(Jsonb([canonical]))
    hide_unknown = excluded and not q.get("include_unknown")
    if hide_unknown:
        sql += " AND i.has_allergen_data"
    for diet in q.get("diet", []):
        if diet:
            sql += " AND i.diets @> ?"
            params.append(Jsonb([diet]))

    rows = conn.execute(sql, params).fetchall()

    # One recipe shows up at several halls and meals; collapse to one card that
    # lists where it is served rather than repeating the label many times.
    items: dict[str, dict] = {}
    for row in rows:
        item = items.get(row["external_id"])
        if item is None:
            item = items[row["external_id"]] = _item_json(row)
            item["served_at"] = []
        item["served_at"].append(_placement(row))

    results = list(items.values())
    sort = q.get("sort", ["name"])[0]
    if sort == "protein":
        # Pan-sized labels would otherwise own the top of this list.
        results.sort(key=lambda i: (i["label_implausible"] or i["nutrition_suspect"],
                                    -(i["nutrients"]["protein_g"] or 0)))
    elif sort == "calories":
        results.sort(key=lambda i: (i["calories"] is None, i["calories"] or 0))
    else:
        results.sort(key=lambda i: i["name"].lower())

    limit = int(q.get("limit", ["200"])[0])
    return {
        "count": len(results),
        "hidden_unknown_allergens": bool(hide_unknown),
        "items": results[:limit],
    }


def api_item(conn, college: str, q: dict) -> dict:
    recipe_id = q.get("id", [""])[0]
    row = conn.execute(
        "SELECT * FROM items WHERE college = ? AND external_id = ?", (college, recipe_id)
    ).fetchone()
    if row is None:
        return {"error": "No such recipe"}

    item = _item_json(row, full=True)
    item["served_at"] = [_placement(r) for r in conn.execute(
        "SELECT service_date::text AS service_date, meal, location_id, location_name, "
        "       station, portion, tags "
        "FROM menu_entries WHERE college = ? AND item_external_id = ? "
        "ORDER BY service_date, meal", (college, recipe_id))]
    return item


def api_stats(conn, college: str) -> dict:
    """Coverage and label quality for everything stored, i.e. `query stats` for the UI."""
    # Only the columns the counters below read: this scans every stored recipe,
    # and pulling ingredients too made it the slowest endpoint by an order of
    # magnitude once the database stopped being a local file.
    items = conn.execute(
        "SELECT calories, has_allergen_data, fetched_at, serving_size, "
        "       protein_g, total_fat_g, total_carbs_g, sodium_mg "
        "FROM items WHERE college = ?", (college,)).fetchall()
    rows = conn.execute(
        "SELECT COUNT(*) AS n, COUNT(DISTINCT service_date) AS days, "
        "MIN(service_date)::text AS first, MAX(service_date)::text AS last "
        "FROM menu_entries WHERE college = ?", (college,)).fetchone()
    fetched = [i["fetched_at"] for i in items if i["fetched_at"]]

    per_meal = [dict(r) for r in conn.execute(
        "SELECT location_name, meal, COUNT(*) AS n FROM menu_entries WHERE college = ? "
        "GROUP BY 1, 2 ORDER BY 1, 2", (college,))]

    return {
        "recipes": len(items),
        "menu_rows": rows["n"],
        "days": rows["days"],
        "first_date": rows["first"],
        "last_date": rows["last"],
        "without_nutrition": sum(1 for i in items if i["calories"] is None),
        "without_allergen_data": sum(1 for i in items if not i["has_allergen_data"]),
        "nutrition_suspect": sum(1 for i in items if _nutrition_suspect(i)),
        "label_implausible": sum(1 for i in items if _label_implausible(i)),
        "last_fetched": max(fetched).isoformat() if fetched else None,
        "per_meal": per_meal,
    }


ROUTES = {"/api/menu": api_menu, "/api/search": api_search, "/api/item": api_item}


class Handler(BaseHTTPRequestHandler):
    server_version = "dining/1.0"

    def __init__(self, *args, college: str, **kwargs):
        self.college = college
        super().__init__(*args, **kwargs)

    def do_GET(self):
        parsed = urlparse(self.path)
        if not parsed.path.startswith("/api/"):
            return self._static(parsed.path)
        try:
            # One pooled connection for the length of the request. This server
            # runs a thread per request, so holding a connection per thread
            # would open a Postgres connection per browser request and run
            # Supabase out of them within a few reloads.
            with self.server.pool.connection() as raw:
                conn = db.Database(raw)
                if parsed.path == "/api/meta":
                    return self._json(api_meta(conn, self.college))
                if parsed.path == "/api/stats":
                    return self._json(api_stats(conn, self.college))
                handler = ROUTES.get(parsed.path)
                if handler:
                    return self._json(
                        handler(conn, self.college, parse_qs(parsed.query)))
            self.send_error(404)
        except Exception as exc:  # a broken query should not kill the server
            self._json({"error": f"{type(exc).__name__}: {exc}"}, status=500)

    def _json(self, payload, status: int = 200):
        body = json.dumps(payload).encode()
        self.send_response(status)
        self.send_header("Content-Type", "application/json")
        self.send_header("Content-Length", str(len(body)))
        # The service worker is the only cache that should hold menu data.
        # Left cacheable, the browser's own HTTP cache answers first -- even
        # with the network off -- so the app cannot tell a live menu from a
        # remembered one, and a stale menu is worse than an honest gap.
        self.send_header("Cache-Control", "no-store")
        self.end_headers()
        self.wfile.write(body)

    def _static(self, path: str):
        target = (WEB_ROOT / (path.lstrip("/") or "index.html")).resolve()
        if not target.is_file() or WEB_ROOT not in target.parents:
            self.send_error(404)
            return
        body = target.read_bytes()
        self.send_response(200)
        self.send_header("Content-Type",
                         CONTENT_TYPES.get(target.suffix, "application/octet-stream"))
        self.send_header("Content-Length", str(len(body)))
        self.send_header("Cache-Control", "no-store")
        self.end_headers()
        self.wfile.write(body)

    def log_message(self, fmt, *args):
        if not self.path.startswith("/api/"):
            return
        print(f"  {fmt % args}")


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--college", default="umd")
    parser.add_argument("--dsn", help="Postgres connection string (default: $DATABASE_URL)")
    parser.add_argument("--host", default="127.0.0.1")
    parser.add_argument("--port", type=int, default=8000)
    parser.add_argument("--open", action="store_true", help="open a browser window")
    args = parser.parse_args()

    connections = db.pool(args.dsn)
    with connections.connection() as raw:
        days = db.Database(raw).execute(
            "SELECT COUNT(DISTINCT service_date) AS n FROM menu_entries WHERE college = ?",
            (args.college,)).fetchone()["n"]
    if not days:
        raise SystemExit(f"No menus stored for {args.college!r}. "
                         f"Run: python3 -m dining.refresh --college {args.college}")

    handler = partial(Handler, college=args.college)
    httpd = ThreadingHTTPServer((args.host, args.port), handler)
    httpd.pool = connections
    url = f"http://{args.host}:{args.port}"
    print(f"{get_adapter(args.college).name} — {days} days of menus\n"
          f"Serving {url}  (ctrl-c to stop)", flush=True)
    if args.open:
        webbrowser.open(url)
    try:
        httpd.serve_forever()
    except KeyboardInterrupt:
        print("\nstopped")
    finally:
        connections.close()


if __name__ == "__main__":
    main()
