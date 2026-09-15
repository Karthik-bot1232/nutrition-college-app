"""Export a college's published week of menus and nutrition facts.

    python3 -m dining.export --college umd --days 7 --format json -o week.json
    python3 -m dining.export --college umd --days 7 --format csv  -o week.csv

Reads what dining.refresh already stored and never touches the network, so run
a refresh first if the window you want is not in the database yet.

JSON is normalized: each recipe's label appears once under "items" and the
"days" tree points at recipes by id, because a single recipe shows up in dozens
of hall/meal/day slots and inlining it would multiply the file size. CSV is the
flat counterpart -- one row per appearance, every nutrient its own column.
"""

import argparse
import csv
import json
import sys
from datetime import date, datetime, timedelta

from . import db
from .colleges import get_adapter
from .models import NUTRIENT_FIELDS

SELECT = """
SELECT e.service_date, e.meal, e.location_id, e.location_name, e.station,
       e.portion, e.tags, e.item_external_id,
       i.name, i.serving_size, i.ingredients, i.allergens, i.allergens_raw,
       i.diets, i.has_allergen_data, i.source_url, {nutrients}
FROM menu_entries e
LEFT JOIN items i ON i.college = e.college AND i.external_id = e.item_external_id
WHERE e.college = ? AND e.service_date BETWEEN ? AND ?
"""

CSV_COLUMNS = [
    "college", "service_date", "weekday", "meal", "location_id", "location_name",
    "station", "recipe_id", "name", "portion", "serving_size",
    *NUTRIENT_FIELDS,
    "allergens", "allergen_data_published", "diets", "menu_tags", "nutrition_suspect",
    "source_url", "ingredients",
]


def _json_list(value) -> list:
    return json.loads(value) if value else []


def collect(conn, college: str, dates: list[date]):
    sql = SELECT.format(nutrients=", ".join(f"i.{f}" for f in NUTRIENT_FIELDS))
    return conn.execute(
        sql, (college, dates[0].isoformat(), dates[-1].isoformat())
    ).fetchall()


def _implied_calories(row) -> float | None:
    """Atwater energy from the macros; None when one of them is missing."""
    protein, fat, carbs = row["protein_g"], row["total_fat_g"], row["total_carbs_g"]
    if protein is None or fat is None or carbs is None:
        return None
    return 4 * protein + 9 * fat + 4 * carbs


def _nutrition_suspect(row) -> bool:
    """True when a label's own macros cannot produce its calorie count.

    A few recipes publish batch-level protein against a per-portion calorie
    count -- one UMD soup lists 66g protein in 374 kcal, which is impossible.
    They are rare (~0.25%) but they top any "highest protein" ranking, so they
    need a marker. The published numbers are still copied through unchanged;
    deciding what to do about them belongs to the caller, not the scraper.

    The thresholds are deliberately loose: rounding, fiber and sugar alcohols
    all move the Atwater estimate a little, so only a 50%+ overshoot that is
    also 80+ kcal in absolute terms counts as broken.
    """
    implied, calories = _implied_calories(row), row["calories"]
    if implied is None or calories is None or calories < 20:
        return False
    return implied > calories * 1.5 and implied - calories > 80


def _catalog_entry(row) -> dict:
    """Everything that belongs to the recipe itself, not to one appearance."""
    return {
        "recipe_id": row["item_external_id"],
        "name": row["name"] or "",
        "serving_size": row["serving_size"],
        "calories": row["calories"],
        "nutrients": {f: row[f] for f in NUTRIENT_FIELDS if f != "calories"},
        "allergens": _json_list(row["allergens"]),
        "allergens_as_published": _json_list(row["allergens_raw"]),
        # False means nobody published allergens, which is not "contains nothing".
        "allergen_data_published": bool(row["has_allergen_data"]),
        "diets": _json_list(row["diets"]),
        "ingredients": row["ingredients"],
        "source_url": row["source_url"],
        "has_nutrition": row["calories"] is not None,
        # Label contradicts itself; see _nutrition_suspect.
        "nutrition_suspect": _nutrition_suspect(row),
    }


def build_document(adapter, rows, dates: list[date]) -> dict:
    meal_rank = {meal: n for n, meal in enumerate(adapter.meals)}
    location_rank = {lid: n for n, lid in enumerate(adapter.locations)}

    items: dict[str, dict] = {}
    tree: dict[str, dict] = {}
    location_names: dict[str, str] = {}

    for row in rows:
        recipe_id = row["item_external_id"]
        if recipe_id not in items:
            items[recipe_id] = _catalog_entry(row)
        location_names[row["location_id"]] = row["location_name"]

        station = (tree.setdefault(row["service_date"], {})
                       .setdefault(row["meal"], {})
                       .setdefault(row["location_id"], {})
                       .setdefault(row["station"] or "", []))
        station.append({
            "recipe_id": recipe_id,
            "name": row["name"] or "",
            "portion": row["portion"] or None,
            "menu_tags": _json_list(row["tags"]),
        })

    days = []
    for day in dates:
        key = day.isoformat()
        meals = []
        for meal, by_location in sorted(
            tree.get(key, {}).items(), key=lambda kv: meal_rank.get(kv[0], 99)
        ):
            locations = []
            for location_id, by_station in sorted(
                by_location.items(), key=lambda kv: location_rank.get(kv[0], 99)
            ):
                locations.append({
                    "location_id": location_id,
                    "location_name": location_names.get(location_id, ""),
                    "stations": [
                        {"station": name or None,
                         "items": sorted(entries, key=lambda e: e["name"])}
                        for name, entries in sorted(by_station.items())
                    ],
                })
            meals.append({"meal": meal, "locations": locations})

        days.append({
            "date": key,
            "weekday": day.strftime("%A"),
            "published": bool(meals),
            "meals": meals,
        })

    missing = [d["date"] for d in days if not d["published"]]
    return {
        "college": adapter.slug,
        "college_name": adapter.name,
        "generated_at": datetime.now().isoformat(timespec="seconds"),
        "week": {
            "start": dates[0].isoformat(),
            "end": dates[-1].isoformat(),
            "days": len(dates),
        },
        "coverage": {
            "days_requested": len(dates),
            "days_with_menus": len(dates) - len(missing),
            "dates_without_menus": missing,
            "menu_rows": len(rows),
            "unique_recipes": len(items),
            "recipes_without_nutrition": sum(
                1 for i in items.values() if not i["has_nutrition"]
            ),
            "recipes_without_allergen_data": sum(
                1 for i in items.values() if not i["allergen_data_published"]
            ),
            "recipes_with_suspect_nutrition": sum(
                1 for i in items.values() if i["nutrition_suspect"]
            ),
        },
        "items": items,
        "days": days,
    }


def write_csv(handle, college: str, rows) -> None:
    writer = csv.DictWriter(handle, fieldnames=CSV_COLUMNS, extrasaction="ignore")
    writer.writeheader()
    for row in rows:
        day = date.fromisoformat(row["service_date"])
        record = {
            "college": college,
            "service_date": row["service_date"],
            "weekday": day.strftime("%A"),
            "meal": row["meal"],
            "location_id": row["location_id"],
            "location_name": row["location_name"],
            "station": row["station"] or "",
            "recipe_id": row["item_external_id"],
            "name": row["name"] or "",
            "portion": row["portion"] or "",
            "serving_size": row["serving_size"] or "",
            "allergens": "; ".join(_json_list(row["allergens"])),
            "allergen_data_published": int(bool(row["has_allergen_data"])),
            "diets": "; ".join(_json_list(row["diets"])),
            "menu_tags": "; ".join(_json_list(row["tags"])),
            "nutrition_suspect": int(_nutrition_suspect(row)),
            "source_url": row["source_url"] or "",
            "ingredients": row["ingredients"] or "",
        }
        record.update({f: row[f] for f in NUTRIENT_FIELDS})
        writer.writerow(record)


def main():
    parser = argparse.ArgumentParser(description=__doc__,
                                     formatter_class=argparse.RawDescriptionHelpFormatter)
    parser.add_argument("--college", default="umd")
    parser.add_argument("--db", default=str(db.DEFAULT_DB))
    parser.add_argument("--days", type=int, default=7, help="length of the window")
    parser.add_argument("--start", help="first date, YYYY-MM-DD (default: today)")
    parser.add_argument("--format", choices=("json", "csv"), default="json")
    parser.add_argument("-o", "--out", help="output file (default: stdout)")
    args = parser.parse_args()

    adapter = get_adapter(args.college)
    start = date.fromisoformat(args.start) if args.start else date.today()
    dates = [start + timedelta(days=n) for n in range(args.days)]

    conn = db.connect(args.db)
    rows = collect(conn, args.college, dates)
    conn.close()

    if not rows:
        raise SystemExit(
            f"No stored menus for {args.college} between {dates[0]} and {dates[-1]}. "
            f"Run: python3 -m dining.refresh --college {args.college} --days {args.days}"
        )

    handle = open(args.out, "w", newline="", encoding="utf-8") if args.out else sys.stdout
    try:
        if args.format == "csv":
            write_csv(handle, args.college, rows)
            missing = []
        else:
            document = build_document(adapter, rows, dates)
            missing = document["coverage"]["dates_without_menus"]
            json.dump(document, handle, indent=2, ensure_ascii=False)
            handle.write("\n")
    finally:
        if args.out:
            handle.close()

    if args.out:
        print(f"Wrote {args.out} — {len(rows)} menu rows, "
              f"{dates[0]} to {dates[-1]}", file=sys.stderr)
    if missing:
        print(f"No menus stored for: {', '.join(missing)}", file=sys.stderr)


if __name__ == "__main__":
    main()
