#!/bin/bash
# Weekly top-up of every registered college, plus an export of the new window.
#
# The database (Supabase) is the source of truth and scraping only fills its
# gaps: a menu slot already stored is not fetched again, and a recipe's label is
# fetched once and then never again. So a run costs only the days the college
# has newly published -- a few minutes, not the ~15 the first full pull took.
#
# Weekly rather than daily because of that: with nothing re-fetched, a daily run
# would spend six days a week discovering it has nothing to do. The trade is
# that a menu the college edits after publishing keeps whatever it said when it
# was first scraped. Re-pull a window deliberately when that matters:
#
#   ./weekly_refresh.sh              # default 14-day window
#   DAYS=21 ./weekly_refresh.sh      # UMD publishes at least two weeks out
#   FORCE=1 ./weekly_refresh.sh      # re-scrape the window even if stored

set -uo pipefail

cd "$(dirname "$0")"

# The project venv, not whatever `python3` resolves to. launchd runs with a bare
# PATH and finds /usr/bin/python3, which has none of this project's dependencies
# -- that silently broke every scheduled run before this line existed.
PY="./.venv/bin/python"
if [ ! -x "$PY" ]; then
    echo "Missing $PY. Create it with:" >&2
    echo "  python3 -m venv .venv && ./.venv/bin/python -m pip install -r requirements.txt" >&2
    exit 1
fi

mkdir -p logs exports
STAMP="$(date +%Y-%m-%d)"
LOG="logs/refresh-$STAMP.log"
DAYS="${DAYS:-14}"
FORCE_FLAG=""
[ -n "${FORCE:-}" ] && FORCE_FLAG="--force"

# Read the adapter registry, so onboarding a college needs no edit here.
# An empty result means the import failed (a missing dependency, most likely).
# Without this check the loop below just runs zero times and the job "succeeds".
if ! COLLEGES="$($PY -c 'from dining.colleges import ADAPTERS; print(" ".join(sorted(ADAPTERS)))')" \
   || [ -z "$COLLEGES" ]; then
    echo "Could not load the college registry -- refreshed nothing." >&2
    exit 1
fi

status=0
for college in $COLLEGES; do
    echo "=== $college $(date) ===" >>"$LOG"

    # One school's site being down must not stop the others.
    if ! $PY -u -m dining.refresh --college "$college" --days "$DAYS" $FORCE_FLAG >>"$LOG" 2>&1; then
        echo "!!! $college refresh FAILED" >>"$LOG"
        status=1
        continue
    fi

    for format in json csv; do
        $PY -u -m dining.export --college "$college" --days "$DAYS" \
            --format "$format" -o "exports/$college-$STAMP.$format" >>"$LOG" 2>&1 \
            || { echo "!!! $college $format export FAILED" >>"$LOG"; status=1; }
    done
done

# Keep the last 8 weeks.
find logs -name 'refresh-*.log' -mtime +56 -delete
find exports -mtime +56 \( -name '*.json' -o -name '*.csv' \) -delete

exit $status
