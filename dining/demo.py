"""Run the web UI on sample data, with no database.

    python3 -m dining.demo                  # http://127.0.0.1:8000
    python3 -m dining.demo --port 8080 --open

For working on the front end: it serves `dining/web` exactly as `dining.serve`
does, but answers the API from `sample_menu.json` (sampled from real UMD
menus) instead of Postgres. Every day of a two-week window gets a slice of that
fixture, so date paging, search and the builder all have something to show.
Stdlib only -- no psycopg, no .env.
"""

import argparse
import json
import random
import re
import webbrowser
from datetime import date, timedelta
from functools import partial
from http.server import BaseHTTPRequestHandler, ThreadingHTTPServer
from pathlib import Path
from urllib.parse import parse_qs, urlparse

ROOT = Path(__file__).resolve().parent
WEB_ROOT = ROOT / "web"
FIXTURE = ROOT / "sample_menu.json"

LOCATIONS = {"16": "South Campus Dining Hall", "19": "Yahentamitsi Dining Hall",
             "51": "251 North"}
HALL_IDS = {name: lid for lid, name in LOCATIONS.items()}
MEALS = ("Breakfast", "Lunch", "Dinner")
# Mirrors UMDAdapter.hours; not imported, because that module needs bs4.
HOURS = {
    "weekday": {"Breakfast": ("07:00", "10:30"), "Lunch": ("11:00", "16:00"),
                "Dinner": ("16:00", "21:00")},
    "weekend": {"Breakfast": ("08:00", "10:00"), "Lunch": ("10:00", "16:00"),
                "Dinner": ("16:00", "20:00")},
}
ALLERGENS = ("dairy", "eggs", "fish", "shellfish", "tree_nuts", "peanuts", "gluten",
             "soy", "sesame", "coconut", "alcohol", "pork", "pea_protein")
NUTRIENTS = ("total_fat_g", "saturated_fat_g", "trans_fat_g", "cholesterol_mg",
             "sodium_mg", "total_carbs_g", "dietary_fiber_g", "soluble_fiber_g",
             "insoluble_fiber_g", "total_sugars_g", "added_sugars_g", "protein_g",
             "calcium_mg", "iron_mg", "potassium_mg", "vitamin_a_mcg", "vitamin_c_mg")
CONTENT_TYPES = {".html": "text/html", ".js": "text/javascript", ".css": "text/css",
                 ".svg": "image/svg+xml", ".png": "image/png", ".webmanifest": "application/manifest+json",
                 ".json": "application/json"}


def load_fixture() -> list[dict]:
    return json.loads(FIXTURE.read_text())


def to_item(raw: dict) -> dict:
    nutrients = {k: None for k in NUTRIENTS}
    nutrients.update(protein_g=raw["protein"], total_carbs_g=raw["carbs"],
                     total_fat_g=raw["fat"], dietary_fiber_g=raw["fiber"],
                     total_sugars_g=raw["sugar"], sodium_mg=raw["sodium"])
    cal = raw["calories"]
    ounces = re.match(r"^\s*([\d.]+)\s*(?:oz|ounce)", raw["servingSize"] or "", re.I)
    implausible = bool(ounces and cal and cal / float(ounces.group(1)) > 260) or (
        (cal or 0) > 1000 or (raw["protein"] or 0) > 80 or (raw["sodium"] or 0) > 5000)
    implied = None
    if None not in (raw["protein"], raw["fat"], raw["carbs"]):
        implied = 4 * raw["protein"] + 9 * raw["fat"] + 4 * raw["carbs"]
    suspect = bool(implied and cal and cal >= 20 and implied > cal * 1.5
                   and implied - cal > 80)
    return {
        "recipe_id": raw["id"].split("-")[0], "name": raw["name"],
        "serving_size": raw["servingSize"], "calories": cal, "nutrients": nutrients,
        "allergens": raw["allergens"], "allergen_data_published": raw["allergenDataPublished"],
        "diets": raw["dietaryTags"], "has_nutrition": cal is not None,
        "nutrition_suspect": suspect, "label_implausible": implausible,
    }


class Store:
    """The fixture spread over a window of days: each day keeps a stable,
    seeded ~85% of every station, so days differ but reloads do not."""

    def __init__(self, days: int = 14):
        self.rows = load_fixture()
        monday = date.today() - timedelta(days=date.today().weekday())
        self.dates = [(monday + timedelta(days=i)).isoformat() for i in range(days)]
        self.entries = []   # (date, meal, location_id, station, row)
        for d in self.dates:
            rng = random.Random(d)
            weekend = date.fromisoformat(d).weekday() >= 5
            for row in self.rows:
                if weekend and row["mealPeriod"] == "Breakfast" \
                        and row["diningHall"] != "251 North":
                    continue   # the real site publishes no weekend breakfast here
                if rng.random() < 0.85:
                    self.entries.append((d, row["mealPeriod"], HALL_IDS[row["diningHall"]],
                                         row["station"], row))

    def item(self, row, **extra) -> dict:
        return {**to_item(row), **extra}


def placement(e) -> dict:
    d, meal, lid, station, row = e
    return {"date": d, "meal": meal, "location_id": lid, "location_name": LOCATIONS[lid],
            "station": station, "portion": row["servingSize"], "menu_tags": []}


def api_meta(store: Store, q) -> dict:
    counts: dict[str, int] = {}
    for d, meal, lid, _, _ in store.entries:
        key = f"{d}|{meal}|{lid}"
        counts[key] = counts.get(key, 0) + 1
    return {"college": "umd", "college_name": "University of Maryland",
            "locations": [{"id": k, "name": v} for k, v in LOCATIONS.items()],
            "meals": list(MEALS), "hours": HOURS, "dates": store.dates, "today": date.today().isoformat(),
            "allergens": list(ALLERGENS), "counts": counts, "demo": True}


def api_menu(store: Store, q) -> dict:
    day = q.get("date", [date.today().isoformat()])[0]
    meal = q.get("meal", ["Lunch"])[0]
    location = q.get("location", ["16"])[0]
    halls: dict[str, dict] = {}
    n = 0
    for d, m, lid, station, row in store.entries:
        if d != day or m != meal or (location != "all" and lid != location):
            continue
        n += 1
        hall = halls.setdefault(lid, {})
        hall.setdefault(station, []).append(
            store.item(row, portion=row["servingSize"], menu_tags=[]))
    return {"date": day, "meal": meal, "location_id": location, "count": n,
            "locations": [{
                "location_id": lid, "location_name": LOCATIONS[lid],
                "count": sum(len(v) for v in halls[lid].values()),
                "stations": [{"station": s, "items": sorted(i, key=lambda x: x["name"])}
                             for s, i in sorted(halls[lid].items())],
            } for lid in LOCATIONS if lid in halls]}


def api_search(store: Store, q) -> dict:
    term = q.get("q", [""])[0].strip().lower()
    scope = q.get("scope", ["day"])[0]
    day = q.get("date", [date.today().isoformat()])[0]
    meal = (q.get("meal") or [""])[0]
    loc = (q.get("location") or [""])[0]
    min_p = float(q["min_protein"][0]) if q.get("min_protein", [""])[0] else None
    max_c = float(q["max_calories"][0]) if q.get("max_calories", [""])[0] else None
    without = [w for w in q.get("without", []) if w]
    diets = [d for d in q.get("diet", []) if d]
    hide_unknown = bool(without) and not q.get("include_unknown")

    items: dict[str, dict] = {}
    for e in store.entries:
        d, m, lid, station, row = e
        if term and term not in row["name"].lower():
            continue
        if scope == "day" and d != day:
            continue
        if meal and meal != "all" and m != meal:
            continue
        if loc and loc != "all" and lid != loc:
            continue
        if min_p is not None and (row["protein"] or 0) < min_p:
            continue
        if max_c is not None and (row["calories"] is None or row["calories"] > max_c):
            continue
        if any(a in row["allergens"] for a in without):
            continue
        if hide_unknown and not row["allergenDataPublished"]:
            continue
        if any(x not in row["dietaryTags"] for x in diets):
            continue
        rid = row["id"].split("-")[0]
        if rid not in items:
            items[rid] = store.item(row, served_at=[])
        items[rid]["served_at"].append(placement(e))

    results = list(items.values())
    sort = q.get("sort", ["name"])[0]
    if sort == "protein":
        results.sort(key=lambda i: (i["label_implausible"] or i["nutrition_suspect"],
                                    -(i["nutrients"]["protein_g"] or 0)))
    elif sort == "calories":
        results.sort(key=lambda i: (i["calories"] is None, i["calories"] or 0))
    else:
        results.sort(key=lambda i: i["name"].lower())
    limit = int(q.get("limit", ["200"])[0])
    return {"count": len(results), "hidden_unknown_allergens": hide_unknown,
            "items": results[:limit]}


def api_item(store: Store, q) -> dict:
    rid = q.get("id", [""])[0]
    hits = [e for e in store.entries if e[4]["id"].split("-")[0] == rid]
    if not hits:
        return {"error": "No such recipe"}
    item = store.item(hits[0][4], allergens_as_published=hits[0][4]["allergens"],
                      ingredients=None, source_url=None, fetched_at=None)
    item["served_at"] = [placement(e) for e in sorted(hits, key=lambda e: (e[0], e[1]))]
    return item


def api_stats(store: Store, q) -> dict:
    items = {r["id"].split("-")[0]: to_item(r) for r in store.rows}
    per: dict[tuple, int] = {}
    for _, meal, lid, _, _ in store.entries:
        per[(LOCATIONS[lid], meal)] = per.get((LOCATIONS[lid], meal), 0) + 1
    return {"recipes": len(items), "menu_rows": len(store.entries), "days": len(store.dates),
            "first_date": store.dates[0], "last_date": store.dates[-1],
            "without_nutrition": sum(1 for i in items.values() if i["calories"] is None),
            "without_allergen_data": sum(1 for i in items.values()
                                         if not i["allergen_data_published"]),
            "nutrition_suspect": sum(1 for i in items.values() if i["nutrition_suspect"]),
            "label_implausible": sum(1 for i in items.values() if i["label_implausible"]),
            "last_fetched": None,
            "per_meal": [{"location_name": h, "meal": m, "n": n}
                         for (h, m), n in sorted(per.items())]}


ROUTES = {"/api/meta": api_meta, "/api/menu": api_menu, "/api/search": api_search,
          "/api/item": api_item, "/api/stats": api_stats}


class Handler(BaseHTTPRequestHandler):
    def __init__(self, *args, store: Store, **kwargs):
        self.store = store
        super().__init__(*args, **kwargs)

    def do_GET(self):
        parsed = urlparse(self.path)
        route = ROUTES.get(parsed.path)
        if route:
            return self._send(json.dumps(route(self.store, parse_qs(parsed.query))).encode(),
                              "application/json")
        target = (WEB_ROOT / (parsed.path.lstrip("/") or "index.html")).resolve()
        if not target.is_file() or WEB_ROOT not in target.parents:
            return self.send_error(404)
        self._send(target.read_bytes(),
                   CONTENT_TYPES.get(target.suffix, "application/octet-stream"))

    def _send(self, body: bytes, kind: str):
        self.send_response(200)
        self.send_header("Content-Type", kind)
        self.send_header("Content-Length", str(len(body)))
        self.send_header("Cache-Control", "no-store")
        self.end_headers()
        self.wfile.write(body)

    def log_message(self, fmt, *args):
        pass


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--host", default="127.0.0.1")
    parser.add_argument("--port", type=int, default=8000)
    parser.add_argument("--open", action="store_true")
    args = parser.parse_args()
    store = Store()
    httpd = ThreadingHTTPServer((args.host, args.port), partial(Handler, store=store))
    url = f"http://{args.host}:{args.port}"
    print(f"Demo data: {len(store.rows)} items over {len(store.dates)} days\n"
          f"Serving {url}  (ctrl-c to stop)", flush=True)
    if args.open:
        webbrowser.open(url)
    try:
        httpd.serve_forever()
    except KeyboardInterrupt:
        print("\nstopped")


if __name__ == "__main__":
    main()
