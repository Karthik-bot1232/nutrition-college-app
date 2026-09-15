"""Browse what the scraper collected.

    python3 -m dining.query menu --hall 16 --meal Lunch
    python3 -m dining.query find --min-protein 25 --max-calories 500 --without Gluten
"""

import argparse
import json
from datetime import date

from . import db
from .allergens import CANONICAL, normalize

SELECT_JOINED = """
SELECT e.service_date, e.meal, e.location_name, e.station, e.portion, e.tags,
       i.name, i.serving_size, i.allergens, i.has_allergen_data, i.diets,
       i.calories, i.protein_g, i.total_carbs_g, i.total_fat_g,
       i.sodium_mg, i.dietary_fiber_g, i.total_sugars_g
FROM menu_entries e
JOIN items i ON i.college = e.college AND i.external_id = e.item_external_id
"""


def _print(rows, show_where: bool):
    if not rows:
        print("No matching items.")
        return

    for row in rows:
        if not row["has_allergen_data"]:
            allergens = "UNKNOWN - no allergen data published"
        else:
            allergens = ", ".join(json.loads(row["allergens"])) or "none"
        diets = ", ".join(json.loads(row["diets"]))
        where = f"  [{row['location_name']} · {row['meal']} · {row['station']}]" if show_where else ""
        print(f"\n{row['name']}{where}")
        print(f"  {row['serving_size'] or row['portion'] or '?'} · "
              f"{row['calories'] or 0:.0f} cal · {row['protein_g'] or 0:.1f}g protein · "
              f"{row['total_carbs_g'] or 0:.1f}g carbs · {row['total_fat_g'] or 0:.1f}g fat · "
              f"{row['sodium_mg'] or 0:.0f}mg sodium")
        print(f"  allergens: {allergens}" + (f"   diets: {diets}" if diets else ""))


def cmd_menu(conn, args):
    day = args.date or date.today().isoformat()
    sql = SELECT_JOINED + """
    WHERE e.college = ? AND e.service_date = ? AND e.meal = ? AND e.location_id = ?
    ORDER BY e.station, i.name
    """
    rows = conn.execute(sql, (args.college, day, args.meal, args.hall)).fetchall()
    print(f"{args.meal} on {day} — {len(rows)} items")
    _print(rows, show_where=False)


def cmd_find(conn, args):
    day = args.date or date.today().isoformat()
    sql = SELECT_JOINED + " WHERE e.college = ? AND e.service_date = ?"
    params: list = [args.college, day]

    if args.meal:
        sql += " AND e.meal = ?"
        params.append(args.meal)
    if args.hall:
        sql += " AND e.location_id = ?"
        params.append(args.hall)
    if args.min_protein is not None:
        sql += " AND i.protein_g >= ?"
        params.append(args.min_protein)
    if args.max_calories is not None:
        sql += " AND i.calories <= ?"
        params.append(args.max_calories)
    hidden = 0
    for term in args.without or []:
        canonical = normalize(term)
        if canonical is None:
            raise SystemExit(f"Unknown allergen {term!r}. Known: {', '.join(CANONICAL)}")

        # Allergen names are stored as a JSON array of canonical strings.
        sql += " AND i.allergens NOT LIKE ?"
        params.append(f'%"{canonical}"%')

        if not args.include_unknown:
            # An item nobody published allergens for is not the same as a safe
            # item, so exclude it rather than implying it is free of anything.
            sql += " AND i.has_allergen_data = 1"

    if args.without and not args.include_unknown:
        hidden = conn.execute(
            "SELECT COUNT(DISTINCT i.external_id) AS n FROM menu_entries e "
            "JOIN items i ON i.college = e.college AND i.external_id = e.item_external_id "
            "WHERE e.college = ? AND e.service_date = ? AND i.has_allergen_data = 0",
            (args.college, day),
        ).fetchone()["n"]

    sql += " ORDER BY i.protein_g DESC, i.calories ASC LIMIT ?"
    params.append(args.limit)

    rows = conn.execute(sql, params).fetchall()
    print(f"{len(rows)} matches on {day}")
    if hidden:
        print(f"({hidden} item(s) hidden: no allergen data published. "
              f"Use --include-unknown to see them.)")
    _print(rows, show_where=True)


def cmd_stats(conn, args):
    items = conn.execute(
        "SELECT COUNT(*) n, SUM(calories IS NULL) missing_cal, SUM(ingredients IS NULL) missing_ing "
        "FROM items WHERE college = ?", (args.college,)).fetchone()
    entries = conn.execute(
        "SELECT COUNT(*) n, COUNT(DISTINCT service_date) days FROM menu_entries WHERE college = ?",
        (args.college,)).fetchone()
    orphans = conn.execute(
        "SELECT COUNT(*) n FROM menu_entries e LEFT JOIN items i "
        "ON i.college = e.college AND i.external_id = e.item_external_id "
        "WHERE e.college = ? AND i.external_id IS NULL", (args.college,)).fetchone()

    print(f"recipes stored     {items['n']}")
    print(f"  missing calories {items['missing_cal']}")
    print(f"  missing ingreds  {items['missing_ing']}")
    print(f"menu rows          {entries['n']} across {entries['days']} days")
    print(f"rows w/o a label   {orphans['n']}")

    print("\nper hall / meal:")
    for row in conn.execute(
        "SELECT location_name, meal, COUNT(*) n FROM menu_entries WHERE college = ? "
        "GROUP BY location_name, meal ORDER BY location_name, meal", (args.college,)):
        print(f"  {row['location_name']:28} {row['meal']:10} {row['n']:5}")


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--college", default="umd")
    parser.add_argument("--db", default=str(db.DEFAULT_DB))
    sub = parser.add_subparsers(dest="command", required=True)

    menu = sub.add_parser("menu", help="everything served at one hall/meal")
    menu.add_argument("--hall", default="16")
    menu.add_argument("--meal", default="Lunch")
    menu.add_argument("--date")
    menu.set_defaults(func=cmd_menu)

    find = sub.add_parser("find", help="filter by nutrition and allergens")
    find.add_argument("--hall")
    find.add_argument("--meal")
    find.add_argument("--date")
    find.add_argument("--min-protein", type=float)
    find.add_argument("--max-calories", type=float)
    find.add_argument("--without", action="append", help="allergen to exclude; repeatable")
    find.add_argument("--include-unknown", action="store_true",
                      help="also show items with no published allergen data")
    find.add_argument("--limit", type=int, default=20)
    find.set_defaults(func=cmd_find)

    stats = sub.add_parser("stats", help="coverage and data-quality summary")
    stats.set_defaults(func=cmd_stats)

    args = parser.parse_args()
    conn = db.connect(args.db)
    args.func(conn, args)
    conn.close()


if __name__ == "__main__":
    main()
