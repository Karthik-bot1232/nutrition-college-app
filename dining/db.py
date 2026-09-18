"""Storage for every college's menus and labels, on Supabase (Postgres).

The connection string comes from ``DATABASE_URL``, read from the environment or
from a ``.env`` file at the project root. There is no local database any more:
``refresh`` writes here, ``serve``, ``query`` and ``export`` read from here, so
every machine and every deploy sees the same rows.

SQL in this project keeps sqlite's ``?`` placeholders and :func:`_pg` rewrites
them to psycopg's ``%s`` on the way out. Two rules keep that rewrite safe, and
both are worth knowing before adding a query:

* No literal ``%`` in a SQL string. ``LIKE``/``ILIKE`` patterns are passed as
  parameters, which is where they belong anyway.
* No bare ``?`` jsonb operators. Use ``@>`` for containment, never ``?`` for
  key-exists, or the rewrite will mangle it.
"""

import os
from datetime import date, datetime, timezone
from pathlib import Path

import psycopg
from psycopg.rows import dict_row
from psycopg.types.json import Jsonb
from psycopg_pool import ConnectionPool

from . import allergens as allergens_mod
from .models import NUTRIENT_FIELDS, FoodItem, MenuEntry

PROJECT_ROOT = Path(__file__).resolve().parent.parent
ENV_FILE = PROJECT_ROOT / ".env"

NO_DSN = """No database connection string.

Put your Supabase connection string in a .env file at the project root:

    DATABASE_URL=postgresql://postgres.<ref>:<password>@aws-0-<region>.pooler.supabase.com:6543/postgres

Supabase dashboard -> Project Settings -> Database -> Connection string ->
"Transaction pooler". Replace [YOUR-PASSWORD] with the database password you
set when the project was created. See README.md ("Setting up Supabase").
"""

_NUTRIENT_COLUMNS = ",\n    ".join(f"{name} double precision" for name in NUTRIENT_FIELDS)

SCHEMA = f"""
CREATE TABLE IF NOT EXISTS items (
    college text NOT NULL,
    external_id text NOT NULL,
    name text NOT NULL,
    serving_size text,
    ingredients text,
    allergens jsonb NOT NULL DEFAULT '[]'::jsonb,
    allergens_raw jsonb NOT NULL DEFAULT '[]'::jsonb,
    diets jsonb NOT NULL DEFAULT '[]'::jsonb,
    has_allergen_data boolean NOT NULL DEFAULT false,
    source_url text,
    fetched_at timestamptz NOT NULL,
    {_NUTRIENT_COLUMNS},
    PRIMARY KEY (college, external_id)
);

CREATE TABLE IF NOT EXISTS menu_entries (
    college text NOT NULL,
    location_id text NOT NULL,
    location_name text NOT NULL,
    service_date date NOT NULL,
    meal text NOT NULL,
    station text NOT NULL DEFAULT '',
    item_external_id text NOT NULL,
    portion text NOT NULL DEFAULT '',
    tags jsonb NOT NULL DEFAULT '[]'::jsonb,
    PRIMARY KEY (college, location_id, service_date, meal, station, item_external_id, portion)
);

CREATE INDEX IF NOT EXISTS idx_entries_lookup
    ON menu_entries (college, service_date, meal, location_id);
CREATE INDEX IF NOT EXISTS idx_entries_item
    ON menu_entries (college, item_external_id);
CREATE INDEX IF NOT EXISTS idx_items_calories ON items (college, calories);
CREATE INDEX IF NOT EXISTS idx_items_protein ON items (college, protein_g);

-- The allergen and diet filters are jsonb containment (@>), which needs GIN.
CREATE INDEX IF NOT EXISTS idx_items_allergens ON items USING gin (allergens);
CREATE INDEX IF NOT EXISTS idx_items_diets ON items USING gin (diets);
"""


def _load_env() -> None:
    """Read .env into the environment, so a scheduled job needs no shell setup."""
    if not ENV_FILE.is_file():
        return
    for line in ENV_FILE.read_text(encoding="utf-8").splitlines():
        line = line.strip()
        if not line or line.startswith("#") or "=" not in line:
            continue
        key, value = line.split("=", 1)
        os.environ.setdefault(key.strip(), value.strip().strip('"').strip("'"))


def resolve_dsn(dsn: str | None = None) -> str:
    if dsn:
        return dsn
    _load_env()
    found = os.environ.get("DATABASE_URL")
    if not found:
        raise SystemExit(NO_DSN)
    return found


def _pg(sql: str) -> str:
    return sql.replace("?", "%s")


class Database:
    """A psycopg connection that speaks `?` placeholders and returns dict rows.

    Thin on purpose: the point is that the queries in query/serve/export read
    the same as they always did, so a reviewer compares SQL against SQL.
    """

    def __init__(self, conn: psycopg.Connection, dsn: str | None = None):
        self._conn = conn
        #: Set for a standalone connection, which has to heal itself. Left None
        #: for one borrowed from a pool, because the pool owns its lifecycle and
        #: swapping the connection under it would strand the real one.
        self._dsn = dsn

    def ensure_live(self) -> None:
        """Reconnect if the link died while we were off doing something else.

        Only call this between transactions. `refresh` fetches labels for
        minutes at a time with nothing in flight, and neither the pooler nor a
        NAT keeps an idle connection forever -- keepalives make that rarer, not
        impossible. What it costs is one round trip before a write batch; what
        it saves is a run that scrapes for ten minutes and then throws all of it
        away on an SSL timeout that names nothing useful.
        """
        if self._dsn is None:
            return
        try:
            self._conn.execute("SELECT 1")
            return
        except psycopg.Error:
            pass
        try:
            self._conn.close()
        except psycopg.Error:
            pass
        self._conn = _connect_raw(self._dsn)

    def execute(self, sql: str, params=()):
        return self._conn.execute(_pg(sql), params)

    def executemany(self, sql: str, rows) -> None:
        with self._conn.cursor() as cur:
            cur.executemany(_pg(sql), rows)

    def commit(self) -> None:
        self._conn.commit()

    def close(self) -> None:
        self._conn.close()


def ensure_schema(conn: psycopg.Connection) -> None:
    conn.execute(SCHEMA)
    conn.commit()


CONNECT_FAILED = """Could not reach the database.

  {error}
Worth checking, in the order these actually go wrong:

  * A free Supabase project pauses itself after about a week with no queries.
    Open the dashboard and resume it -- the connection is refused until you do.
  * The password in DATABASE_URL. If it contains @ : / or ?, percent-encode it
    (@ becomes %40), or the URL parses into the wrong pieces.
  * The host. Use the "Transaction pooler" string (port 6543): the direct
    db.<ref>.supabase.co host resolves over IPv6 only, which many home and
    cafe networks do not carry.
"""


#: psycopg prepares a statement server-side once it has run `prepare_threshold`
#: times (5 by default). Supabase's transaction pooler hands out a different
#: backend per transaction, so the second preparation of the same name lands on
#: a backend that already has it and the query dies with
#: DuplicatePreparedStatement -- on the *sixth* identical request, never the
#: first, so it looks like a UI that breaks only once someone uses it. None
#: turns preparation off; the planning it saves is noise next to the round trip.
PREPARE_THRESHOLD = None


#: TCP keepalives. A refresh spends minutes fetching pages with no query in
#: flight, and an idle socket through a pooler and a home router is not assumed
#: to still be there by either end. These probe often enough to keep it open.
KEEPALIVE = {
    "keepalives": 1,
    "keepalives_idle": 30,
    "keepalives_interval": 10,
    "keepalives_count": 5,
}


def _connect_raw(dsn: str) -> psycopg.Connection:
    try:
        return psycopg.connect(dsn, row_factory=dict_row,
                               prepare_threshold=PREPARE_THRESHOLD, **KEEPALIVE)
    except psycopg.OperationalError as exc:
        raise SystemExit(CONNECT_FAILED.format(error=exc)) from None


def connect(dsn: str | None = None) -> Database:
    """One connection, for the CLI entry points."""
    resolved = resolve_dsn(dsn)
    conn = _connect_raw(resolved)
    ensure_schema(conn)
    return Database(conn, resolved)


def pool(dsn: str | None = None, max_size: int = 8) -> ConnectionPool:
    """A bounded pool, for the threaded web server.

    ThreadingHTTPServer starts a thread per request, so a connection per thread
    would open (and strand) one Postgres connection per browser request. Supabase
    caps connections well below what that reaches under a reload-happy user.
    """
    resolved = resolve_dsn(dsn)
    _connect_raw(resolved).close()   # fail with the readable message, not a pool timeout
    connections = ConnectionPool(
        resolved, min_size=1, max_size=max_size,
        kwargs={"row_factory": dict_row, "prepare_threshold": PREPARE_THRESHOLD},
        open=True,
        # A pool hands out whatever it is holding unless told to look first, and
        # Supabase closes connections that have been idle a while. A server left
        # running overnight would otherwise wake up and serve 500s off dead
        # sockets until every pooled connection had failed once. `check` pings
        # before handing over and quietly replaces anything broken; `max_idle`
        # recycles connections before the pooler gets round to dropping them.
        check=ConnectionPool.check_connection,
        max_idle=120.0,
    )
    with connections.connection() as conn:
        ensure_schema(conn)
    return connections


def known_item_ids(conn: Database, college: str, fresh_since: datetime | None = None) -> set[str]:
    """Recipe ids already stored, so a refresh can skip re-fetching their labels.

    ``fresh_since`` of None means "never re-fetch a label we already have",
    which is the default: not scraping what the database already holds is the
    whole reason the labels are stored.
    """
    conn.ensure_live()
    if fresh_since is None:
        rows = conn.execute("SELECT external_id FROM items WHERE college = ?", (college,))
    else:
        rows = conn.execute(
            "SELECT external_id FROM items WHERE college = ? AND fetched_at >= ?",
            (college, fresh_since),
        )
    return {row["external_id"] for row in rows}


def stored_menu_slots(conn: Database, college: str) -> set[tuple[date, str, str]]:
    """(service_date, location_id, meal) slots that already hold menu rows.

    Slot granularity rather than whole dates, because "this date has some rows"
    is not the same as "this date is done": on weekends two halls serve no
    breakfast, and a date the college has not published yet also comes back
    empty. Both should be retried next run, while everything already collected
    is left alone.
    """
    return {
        (row["service_date"], row["location_id"], row["meal"])
        for row in conn.execute(
            "SELECT DISTINCT service_date, location_id, meal "
            "FROM menu_entries WHERE college = ?", (college,)
        )
    }


def upsert_items(conn: Database, items: list[FoodItem]) -> None:
    if not items:
        return
    conn.ensure_live()

    columns = ["college", "external_id", "name", "serving_size", "ingredients",
               "allergens", "allergens_raw", "diets", "has_allergen_data",
               "source_url", "fetched_at", *NUTRIENT_FIELDS]
    placeholders = ", ".join("?" for _ in columns)
    updates = ", ".join(f"{c} = excluded.{c}" for c in columns
                        if c not in ("college", "external_id"))
    now = datetime.now(timezone.utc)

    rows = []
    for item in items:
        row = item.as_row()
        rows.append([
            row["college"], row["external_id"], row["name"], row["serving_size"],
            row["ingredients"], Jsonb(item.allergens), Jsonb(item.allergens_raw),
            Jsonb(item.diets), bool(item.has_allergen_data), row["source_url"], now,
            *[row[f] for f in NUTRIENT_FIELDS],
        ])

    conn.executemany(
        f"INSERT INTO items ({', '.join(columns)}) VALUES ({placeholders}) "
        f"ON CONFLICT (college, external_id) DO UPDATE SET {updates}",
        rows,
    )
    conn.commit()


def merge_icon_allergens(conn: Database, college: str) -> int:
    """Fold menu-row legend icons into each item's allergen set.

    The label page and the menu icons are independent sources and they disagree:
    plenty of items carry a "Contains gluten" icon while their label page lists
    no allergens at all. Trusting only the label silently marks those safe.

    Read everything, decide in Python, write in two batches. The per-item
    round trip this replaced cost nothing against a local file and would cost
    minutes against a database across the network.
    """
    conn.ensure_live()
    icons: dict[str, set[str]] = {}
    diet_tags: dict[str, set[str]] = {}
    for row in conn.execute(
        "SELECT item_external_id, tags FROM menu_entries WHERE college = ?", (college,)
    ):
        tags = row["tags"] or []
        if not tags:
            continue
        canonical, _ = allergens_mod.normalize_all(tags)
        if canonical:
            icons.setdefault(row["item_external_id"], set()).update(canonical)
        found_diets = allergens_mod.diets(tags)
        if found_diets:
            diet_tags.setdefault(row["item_external_id"], set()).update(found_diets)

    stored = {
        row["external_id"]: row
        for row in conn.execute(
            "SELECT external_id, allergens, has_allergen_data FROM items WHERE college = ?",
            (college,),
        )
    }

    allergen_updates = []
    for external_id, from_icons in icons.items():
        row = stored.get(external_id)
        if row is None:
            continue
        published = row["allergens"] or []
        merged = sorted(set(published) | from_icons)
        if merged != published or not row["has_allergen_data"]:
            allergen_updates.append((Jsonb(merged), college, external_id))

    if allergen_updates:
        conn.executemany(
            "UPDATE items SET allergens = ?, has_allergen_data = true "
            "WHERE college = ? AND external_id = ?",
            allergen_updates,
        )

    diet_updates = [(Jsonb(sorted(found)), college, external_id)
                    for external_id, found in diet_tags.items() if external_id in stored]
    if diet_updates:
        conn.executemany(
            "UPDATE items SET diets = ? WHERE college = ? AND external_id = ?",
            diet_updates,
        )

    conn.commit()
    return len(allergen_updates)


def replace_menu_entries(
    conn: Database, college: str, slots: list[tuple[date, str, str]], entries: list[MenuEntry]
) -> None:
    """Swap in fresh rows for the slots this run actually scraped.

    Scoped to slots, not whole dates: a run that skipped a slot because the
    database already held it must not delete what is there.
    """
    conn.ensure_live()
    if slots:
        conn.executemany(
            "DELETE FROM menu_entries WHERE college = ? AND service_date = ? "
            "AND location_id = ? AND meal = ?",
            [(college, day, location_id, meal) for day, location_id, meal in slots],
        )
    if entries:
        conn.executemany(
            "INSERT INTO menu_entries "
            "(college, location_id, location_name, service_date, meal, station, "
            " item_external_id, portion, tags) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?) "
            "ON CONFLICT (college, location_id, service_date, meal, station, "
            "             item_external_id, portion) "
            "DO UPDATE SET location_name = excluded.location_name, tags = excluded.tags",
            [
                (e.college, e.location_id, e.location_name, e.service_date,
                 e.meal, e.station or "", e.item_external_id, e.portion or "", Jsonb(e.tags))
                for e in entries
            ],
        )
    conn.commit()


def orphan_entries(conn: Database, college: str) -> list[tuple[str, str, date]]:
    """Recipes on a stored menu that still have no label row.

    Menus are only scraped once now, so a label whose fetch failed would stay
    missing forever without this: its menu slot is stored, so nothing would ever
    ask for it again. Past dates are left out because the college's label URLs
    are dated and a finished day's page is usually gone.
    """
    conn.ensure_live()
    rows = conn.execute(
        "SELECT DISTINCT ON (e.item_external_id) "
        "       e.item_external_id, e.location_id, e.service_date "
        "FROM menu_entries e "
        "LEFT JOIN items i ON i.college = e.college AND i.external_id = e.item_external_id "
        "WHERE e.college = ? AND i.external_id IS NULL AND e.service_date >= CURRENT_DATE "
        "ORDER BY e.item_external_id, e.service_date DESC",
        (college,),
    )
    return [(r["item_external_id"], r["location_id"], r["service_date"]) for r in rows]
