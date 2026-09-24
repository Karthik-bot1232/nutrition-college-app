"""Fill in a college's menus and nutrition labels from the published site.

    python3 -m dining.refresh --college umd --days 14

The database is the source of truth; scraping only fills its gaps. A menu slot
(date / hall / meal) already stored is not fetched again, and neither is a label
for a recipe id already stored, so a weekly run costs only the newly published
days. `--force` re-scrapes the window anyway, for when the college edits a menu
it already published.
"""

import argparse
import sys
from datetime import date, datetime, timedelta, timezone

import requests

from . import db
from .colleges import get_adapter
from .models import FoodItem, MenuEntry


def refresh(college: str, days: int, dsn: str | None = None,
            label_ttl_days: int = 0, force: bool = False, verbose: bool = True):
    adapter = get_adapter(college)
    conn = db.connect(dsn)
    today = date.today()
    dates = [today + timedelta(days=offset) for offset in range(days)]

    stored = set() if force else db.stored_menu_slots(conn, college)
    conn.release()   # nothing held open while the menus are scraped

    entries: list[MenuEntry] = []
    failures: list[str] = []
    #: Only the slots actually fetched, so the write does not clear skipped ones.
    scraped: list[tuple[date, str, str]] = []
    skipped = 0

    for day in dates:
        for location_id, location_name in adapter.locations.items():
            for meal in adapter.meals:
                if (day, location_id, meal) in stored:
                    skipped += 1
                    continue

                url = adapter.menu_url(location_id, day, meal)
                try:
                    found = adapter.parse_menu(adapter.fetch(url), location_id, day, meal)
                except requests.RequestException as exc:
                    failures.append(f"menu {location_name} {day} {meal}: {exc}")
                    continue

                scraped.append((day, location_id, meal))
                entries.extend(found)
                if verbose:
                    print(f"  {day} {location_name:28} {meal:10} {len(found):4} items")

    if skipped:
        print(f"{skipped} menu slot(s) already stored, not re-fetched "
              f"(--force to re-scrape them)")

    # One label per recipe id, reusing any menu appearance to build the URL.
    wanted: dict[str, MenuEntry] = {}
    for entry in entries:
        wanted.setdefault(entry.item_external_id, entry)

    cutoff = (datetime.now(timezone.utc) - timedelta(days=label_ttl_days)
              if label_ttl_days else None)
    cached = db.known_item_ids(conn, college, cutoff)
    todo = [(rid, e.location_id, e.service_date) for rid, e in wanted.items()
            if rid not in cached]

    # Recipes on a menu we stored earlier whose label never landed. Without this
    # they are unreachable: their slot is stored, so nothing re-reads the menu.
    retry = [(rid, lid, day) for rid, lid, day in db.orphan_entries(conn, college)
             if rid not in cached and rid not in wanted]
    todo.extend(retry)
    conn.release()   # nor while the labels are

    print(f"\n{len(entries)} new menu rows, {len(wanted)} unique recipes "
          f"({len(cached & wanted.keys())} already labelled, {len(todo)} to fetch"
          + (f", {len(retry)} retried" if retry else "") + ")")

    items: list[FoodItem] = []
    for index, (recipe_id, location_id, day) in enumerate(todo, start=1):
        url = adapter.label_url(location_id, day, recipe_id)
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
    db.replace_menu_entries(conn, college, scraped, entries)

    repaired = db.merge_icon_allergens(conn, college)
    print(f"merged menu-icon allergens into {repaired} item(s)")

    stored_now = conn.execute(
        "SELECT COUNT(*) AS n FROM items WHERE college = ?", (college,)
    ).fetchone()["n"]
    rows_now = conn.execute(
        "SELECT COUNT(*) AS n FROM menu_entries WHERE college = ?", (college,)
    ).fetchone()["n"]
    print(f"\nDone. {stored_now} recipes and {rows_now} menu rows in the database.")

    if failures:
        print(f"{len(failures)} request(s) failed:", file=sys.stderr)
        for line in failures[:10]:
            print(f"  {line}", file=sys.stderr)

    conn.close()


def main():
    parser = argparse.ArgumentParser(description=__doc__,
                                     formatter_class=argparse.RawDescriptionHelpFormatter)
    parser.add_argument("--college", default="umd")
    parser.add_argument("--days", type=int, default=14,
                        help="days forward to consider (UMD publishes at least 14)")
    parser.add_argument("--dsn", help="Postgres connection string (default: $DATABASE_URL)")
    parser.add_argument("--force", action="store_true",
                        help="re-scrape menu slots already in the database")
    parser.add_argument("--label-ttl-days", type=int, default=0,
                        help="re-fetch a stored label once it is older than this; "
                             "0 (the default) never re-fetches one")
    args = parser.parse_args()

    refresh(args.college, args.days, args.dsn, args.label_ttl_days, args.force)


if __name__ == "__main__":
    main()
