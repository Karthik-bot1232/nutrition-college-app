"""One-time copy of the old local nutrition.db into Supabase.

    python3 -m dining.migrate                      # copies ./nutrition.db
    python3 -m dining.migrate --sqlite other.db
    python3 -m dining.migrate --dry-run            # read and convert, write nothing

Safe to run twice: every row is an upsert keyed exactly the way the live tables
are, so a second run changes nothing and a run after a half-finished one simply
finishes it. The sqlite file is only read, never modified or deleted.
"""

import argparse
import json
import sqlite3
from datetime import datetime, timezone
from pathlib import Path

from psycopg.types.json import Jsonb

from . import db
from .models import NUTRIENT_FIELDS

DEFAULT_SQLITE = Path(__file__).resolve().parent.parent / "nutrition.db"
#: Rows per round trip. Large enough that 13k rows is seconds, small enough
#: that one bad row does not take a whole table's worth of work down with it.
CHUNK = 500


def _columns(src: sqlite3.Connection, table: str) -> set[str]:
    return {row["name"] for row in src.execute(f"PRAGMA table_info({table})")}


def _list(value) -> list:
    """The old schema kept these as JSON text; they are jsonb now."""
    if not value:
        return []
    try:
        parsed = json.loads(value)
    except (TypeError, ValueError):
        return []
    return parsed if isinstance(parsed, list) else []


def _timestamp(value):
    """Old rows wrote a naive local isoformat; keep the instant it meant."""
    if not value:
        return datetime.now(timezone.utc)
    try:
        return datetime.fromisoformat(value).astimezone()
    except ValueError:
        return datetime.now(timezone.utc)


def _flush(conn, sql, batch, dry_run):
    if batch and not dry_run:
        conn.executemany(sql, batch)
        conn.commit()
    return len(batch)


def copy_items(src, conn, dry_run: bool) -> int:
    present = _columns(src, "items")
    columns = ["college", "external_id", "name", "serving_size", "ingredients",
               "allergens", "allergens_raw", "diets", "has_allergen_data",
               "source_url", "fetched_at", *NUTRIENT_FIELDS]
    placeholders = ", ".join("?" for _ in columns)
    updates = ", ".join(f"{c} = excluded.{c}" for c in columns
                        if c not in ("college", "external_id"))
    sql = (f"INSERT INTO items ({', '.join(columns)}) VALUES ({placeholders}) "
           f"ON CONFLICT (college, external_id) DO UPDATE SET {updates}")

    def optional(row, column, default=None):
        return row[column] if column in present else default

    batch, total = [], 0
    for row in src.execute("SELECT * FROM items"):
        batch.append([
            row["college"], row["external_id"], row["name"], row["serving_size"],
            row["ingredients"],
            Jsonb(_list(row["allergens"])),
            Jsonb(_list(optional(row, "allergens_raw"))),
            Jsonb(_list(optional(row, "diets"))),
            bool(optional(row, "has_allergen_data", 0)),
            row["source_url"], _timestamp(row["fetched_at"]),
            *[row[f] for f in NUTRIENT_FIELDS],
        ])
        if len(batch) >= CHUNK:
            total += _flush(conn, sql, batch, dry_run)
            batch = []
            print(f"  items {total}")
    total += _flush(conn, sql, batch, dry_run)
    return total


def copy_entries(src, conn, dry_run: bool) -> int:
    sql = ("INSERT INTO menu_entries "
           "(college, location_id, location_name, service_date, meal, station, "
           " item_external_id, portion, tags) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?) "
           "ON CONFLICT (college, location_id, service_date, meal, station, "
           "             item_external_id, portion) "
           "DO UPDATE SET location_name = excluded.location_name, tags = excluded.tags")

    batch, total = [], 0
    for row in src.execute("SELECT * FROM menu_entries"):
        batch.append([
            row["college"], row["location_id"], row["location_name"],
            row["service_date"], row["meal"], row["station"] or "",
            row["item_external_id"], row["portion"] or "", Jsonb(_list(row["tags"])),
        ])
        if len(batch) >= CHUNK:
            total += _flush(conn, sql, batch, dry_run)
            batch = []
            print(f"  menu rows {total}")
    total += _flush(conn, sql, batch, dry_run)
    return total


def main():
    parser = argparse.ArgumentParser(description=__doc__,
                                     formatter_class=argparse.RawDescriptionHelpFormatter)
    parser.add_argument("--sqlite", default=str(DEFAULT_SQLITE),
                        help="the old local database to read")
    parser.add_argument("--dsn", help="Postgres connection string (default: $DATABASE_URL)")
    parser.add_argument("--dry-run", action="store_true",
                        help="read and convert everything, write nothing")
    args = parser.parse_args()

    source = Path(args.sqlite)
    if not source.is_file():
        raise SystemExit(f"No such sqlite database: {source}")

    src = sqlite3.connect(f"file:{source}?mode=ro", uri=True)
    src.row_factory = sqlite3.Row
    conn = db.connect(args.dsn)

    print(f"Copying {source} -> Supabase" + ("  (dry run)" if args.dry_run else ""))
    items = copy_items(src, conn, args.dry_run)
    entries = copy_entries(src, conn, args.dry_run)
    src.close()

    print(f"\nRead {items} recipes and {entries} menu rows.")
    if args.dry_run:
        print("Dry run: nothing was written.")
    else:
        stored = conn.execute("SELECT COUNT(*) AS n FROM items").fetchone()["n"]
        rows = conn.execute("SELECT COUNT(*) AS n FROM menu_entries").fetchone()["n"]
        print(f"Supabase now holds {stored} recipes and {rows} menu rows.")
        if stored < items or rows < entries:
            print("Fewer rows than were read -- re-run to finish.")
    conn.close()


if __name__ == "__main__":
    main()
