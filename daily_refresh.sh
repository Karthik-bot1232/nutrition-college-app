#!/bin/bash
# Daily top-up of every registered college, plus an export of the new window.
#
# The database (Supabase) is the source of truth and scraping only fills its
# gaps: a menu slot already stored is not fetched again, and a recipe's label is
# fetched once and then never again. So a run costs only the days the college
# has newly published, and a day with nothing new takes about nine seconds.
#
# Daily rather than weekly precisely because it is that cheap. Most runs do
# nothing, and the ones that matter are the exceptions: a day the college
# publishes gets picked up within 24 hours instead of up to seven, and a run
# that fails because the site is down is retried tomorrow rather than next week.
# Slots that come back empty -- a weekend breakfast, a day not yet published --
# are never marked stored, so they are retried every run until they fill in.
#
# What no cadence fixes: a menu the college edits after publishing keeps what it
# said when first scraped. Re-pull deliberately when that matters.
#
#   ./daily_refresh.sh              # default 14-day window
#   DAYS=21 ./daily_refresh.sh      # UMD publishes at least two weeks out
#   FORCE=1 ./daily_refresh.sh      # re-scrape the window even if stored

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
