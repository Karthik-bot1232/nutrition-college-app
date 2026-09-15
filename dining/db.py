import json
import sqlite3
from datetime import date, datetime
from pathlib import Path

from . import allergens as allergens_mod
from .models import NUTRIENT_FIELDS, FoodItem, MenuEntry

DEFAULT_DB = Path(__file__).resolve().parent.parent / "nutrition.db"

_NUTRIENT_COLUMNS = ",\n    ".join(f"{name} REAL" for name in NUTRIENT_FIELDS)

SCHEMA = f"""
CREATE TABLE IF NOT EXISTS items (
    college TEXT NOT NULL,
    external_id TEXT NOT NULL,
    name TEXT NOT NULL,
    serving_size TEXT,
    ingredients TEXT,
    allergens TEXT NOT NULL DEFAULT '[]',
    allergens_raw TEXT NOT NULL DEFAULT '[]',
    diets TEXT NOT NULL DEFAULT '[]',
    has_allergen_data INTEGER NOT NULL DEFAULT 0,
    source_url TEXT,
    fetched_at TEXT NOT NULL,
    {_NUTRIENT_COLUMNS},
    PRIMARY KEY (college, external_id)
);

CREATE TABLE IF NOT EXISTS menu_entries (
    college TEXT NOT NULL,
    location_id TEXT NOT NULL,
    location_name TEXT NOT NULL,
    service_date TEXT NOT NULL,
    meal TEXT NOT NULL,
    station TEXT NOT NULL DEFAULT '',
    item_external_id TEXT NOT NULL,
    portion TEXT NOT NULL DEFAULT '',
    tags TEXT NOT NULL DEFAULT '[]',
    PRIMARY KEY (college, location_id, service_date, meal, station, item_external_id, portion)
);

CREATE INDEX IF NOT EXISTS idx_entries_lookup
    ON menu_entries (college, service_date, meal, location_id);
CREATE INDEX IF NOT EXISTS idx_entries_item
    ON menu_entries (college, item_external_id);
CREATE INDEX IF NOT EXISTS idx_items_calories ON items (college, calories);
CREATE INDEX IF NOT EXISTS idx_items_protein ON items (college, protein_g);
"""


ADDED_COLUMNS = {
    "allergens_raw": "TEXT NOT NULL DEFAULT '[]'",
    "diets": "TEXT NOT NULL DEFAULT '[]'",
    "has_allergen_data": "INTEGER NOT NULL DEFAULT 0",
}


def connect(path: Path | str = DEFAULT_DB) -> sqlite3.Connection:
    conn = sqlite3.connect(path)
    conn.row_factory = sqlite3.Row
    conn.executescript(SCHEMA)

    existing = {row["name"] for row in conn.execute("PRAGMA table_info(items)")}
    for column, spec in ADDED_COLUMNS.items():
        if column not in existing:
            conn.execute(f"ALTER TABLE items ADD COLUMN {column} {spec}")
    conn.commit()
    return conn


def known_item_ids(conn: sqlite3.Connection, college: str, fresh_since: datetime) -> set[str]:
    """Recipe ids already stored and still fresh, so we can skip re-fetching them."""
    rows = conn.execute(
        "SELECT external_id FROM items WHERE college = ? AND fetched_at >= ?",
        (college, fresh_since.isoformat(timespec="seconds")),
    )
    return {row["external_id"] for row in rows}


def upsert_items(conn: sqlite3.Connection, items: list[FoodItem]) -> None:
    if not items:
        return

    columns = ["college", "external_id", "name", "serving_size", "ingredients",
               "allergens", "allergens_raw", "diets", "has_allergen_data",
               "source_url", "fetched_at", *NUTRIENT_FIELDS]
    placeholders = ", ".join("?" for _ in columns)
    updates = ", ".join(f"{c}=excluded.{c}" for c in columns if c not in ("college", "external_id"))
    now = datetime.now().isoformat(timespec="seconds")

    rows = []
    for item in items:
        row = item.as_row()
        rows.append([
            row["college"], row["external_id"], row["name"], row["serving_size"],
            row["ingredients"], json.dumps(item.allergens), json.dumps(item.allergens_raw),
            json.dumps(item.diets), int(item.has_allergen_data), row["source_url"], now,
            *[row[f] for f in NUTRIENT_FIELDS],
        ])

    conn.executemany(
        f"INSERT INTO items ({', '.join(columns)}) VALUES ({placeholders}) "
        f"ON CONFLICT (college, external_id) DO UPDATE SET {updates}",
        rows,
    )
    conn.commit()


def merge_icon_allergens(conn: sqlite3.Connection, college: str) -> int:
    """Fold menu-row legend icons into each item's allergen set.

    The label page and the menu icons are independent sources and they disagree:
    plenty of items carry a "Contains gluten" icon while their label page lists
    no allergens at all. Trusting only the label silently marks those safe.
    """
    icons: dict[str, set[str]] = {}
    diet_tags: dict[str, set[str]] = {}
    for row in conn.execute(
        "SELECT item_external_id, tags FROM menu_entries WHERE college = ?", (college,)
    ):
        tags = json.loads(row["tags"])
        if not tags:
            continue
        canonical, _ = allergens_mod.normalize_all(tags)
        if canonical:
            icons.setdefault(row["item_external_id"], set()).update(canonical)
        found_diets = allergens_mod.diets(tags)
        if found_diets:
            diet_tags.setdefault(row["item_external_id"], set()).update(found_diets)

    changed = 0
    for external_id, from_icons in icons.items():
        row = conn.execute(
            "SELECT allergens, has_allergen_data FROM items WHERE college = ? AND external_id = ?",
            (college, external_id),
        ).fetchone()
        if row is None:
            continue

        merged = sorted(set(json.loads(row["allergens"])) | from_icons)
        if merged != json.loads(row["allergens"]) or not row["has_allergen_data"]:
            conn.execute(
                "UPDATE items SET allergens = ?, has_allergen_data = 1 "
                "WHERE college = ? AND external_id = ?",
                (json.dumps(merged), college, external_id),
            )
            changed += 1

    for external_id, found in diet_tags.items():
        conn.execute(
            "UPDATE items SET diets = ? WHERE college = ? AND external_id = ?",
            (json.dumps(sorted(found)), college, external_id),
        )

    conn.commit()
    return changed


def replace_menu_entries(
    conn: sqlite3.Connection, college: str, days: list[date], entries: list[MenuEntry]
) -> None:
    """Swap in a fresh set of entries for the scraped dates, so pulled items disappear."""
    conn.executemany(
        "DELETE FROM menu_entries WHERE college = ? AND service_date = ?",
        [(college, day.isoformat()) for day in days],
    )
    conn.executemany(
        "INSERT OR REPLACE INTO menu_entries "
        "(college, location_id, location_name, service_date, meal, station, "
        " item_external_id, portion, tags) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)",
        [
            (e.college, e.location_id, e.location_name, e.service_date.isoformat(),
             e.meal, e.station or "", e.item_external_id, e.portion or "", json.dumps(e.tags))
            for e in entries
        ],
    )
    conn.commit()
