"""Refresh a college's menus and nutrition labels.

    python3 -m dining.refresh --college umd --days 7

Menus are re-read every run; labels are cached by recipe id because the same
recipe reappears across halls, meals and days.
"""

import argparse
import sys
from datetime import date, datetime, timedelta

import requests

from . import db
from .colleges import get_adapter
from .models import FoodItem, MenuEntry


def refresh(college: str, days: int, db_path: str, label_ttl_days: int, verbose: bool = True):
    adapter = get_adapter(college)
    conn = db.connect(db_path)
    today = date.today()
    dates = [today + timedelta(days=offset) for offset in range(days)]

    entries: list[MenuEntry] = []
    failures: list[str] = []

    for day in dates:
        for location_id, location_name in adapter.locations.items():
            for meal in adapter.meals:
                url = adapter.menu_url(location_id, day, meal)
                try:
                    found = adapter.parse_menu(adapter.fetch(url), location_id, day, meal)
                except requests.RequestException as exc:
                    failures.append(f"menu {location_name} {day} {meal}: {exc}")
                    continue

                entries.extend(found)
                if verbose:
                    print(f"  {day} {location_name:28} {meal:10} {len(found):4} items")

    # One label per recipe id, reusing any menu appearance to build the URL.
    wanted: dict[str, MenuEntry] = {}
    for entry in entries:
        wanted.setdefault(entry.item_external_id, entry)

    cutoff = datetime.now() - timedelta(days=label_ttl_days)
    cached = db.known_item_ids(conn, college, cutoff)
    todo = [(rid, e) for rid, e in wanted.items() if rid not in cached]

    print(f"\n{len(entries)} menu rows, {len(wanted)} unique recipes "
          f"({len(cached & wanted.keys())} cached, {len(todo)} to fetch)")

    items: list[FoodItem] = []
    for index, (recipe_id, entry) in enumerate(todo, start=1):
        url = adapter.label_url(entry.location_id, entry.service_date, recipe_id)
        try:
            items.append(adapter.parse_label(adapter.fetch(url), recipe_id, url))
        except requests.RequestException as exc:
            failures.append(f"label {recipe_id}: {exc}")
            continue

        if verbose and (index % 50 == 0 or index == len(todo)):
            print(f"  labels {index}/{len(todo)}")

        if len(items) >= 100:
            db.upsert_items(conn, items)
            items = []

    db.upsert_items(conn, items)
    db.replace_menu_entries(conn, college, dates, entries)

    repaired = db.merge_icon_allergens(conn, college)
    print(f"merged menu-icon allergens into {repaired} item(s)")

    stored = conn.execute(
        "SELECT COUNT(*) AS n FROM items WHERE college = ?", (college,)
    ).fetchone()["n"]
    print(f"\nDone. {stored} recipes stored, {len(entries)} menu rows across {days} days.")

    if failures:
        print(f"{len(failures)} request(s) failed:", file=sys.stderr)
        for line in failures[:10]:
            print(f"  {line}", file=sys.stderr)

    conn.close()


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--college", default="umd")
    parser.add_argument("--days", type=int, default=7,
                        help="days forward to scrape (UMD publishes 7)")
    parser.add_argument("--db", default=str(db.DEFAULT_DB))
    parser.add_argument("--label-ttl-days", type=int, default=30,
                        help="re-fetch a recipe's label if it is older than this")
    args = parser.parse_args()

    refresh(args.college, args.days, args.db, args.label_ttl_days)


if __name__ == "__main__":
    main()
