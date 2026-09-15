#!/bin/bash
# Daily refresh of every registered college, plus today's export.
#
# Daily rather than weekly: schools keep editing menus after publishing them,
# so a Monday-only pull is stale by midweek. It stays cheap because labels are
# cached 30 days by recipe id -- a normal run re-reads the menu pages and
# fetches only recipes it has never seen.
#
#   ./daily_refresh.sh          # default 7-day window
#   DAYS=14 ./daily_refresh.sh  # UMD publishes at least two weeks out

set -uo pipefail

cd "$(dirname "$0")"

mkdir -p logs exports
STAMP="$(date +%Y-%m-%d)"
LOG="logs/refresh-$STAMP.log"
DAYS="${DAYS:-7}"

# Read the adapter registry, so onboarding a college needs no edit here.
COLLEGES="$(python3 -c 'from dining.colleges import ADAPTERS; print(" ".join(sorted(ADAPTERS)))')"

status=0
for college in $COLLEGES; do
    echo "=== $college $(date) ===" >>"$LOG"

    # One school's site being down must not stop the others.
    if ! python3 -u -m dining.refresh --college "$college" --days "$DAYS" >>"$LOG" 2>&1; then
        echo "!!! $college refresh FAILED" >>"$LOG"
        status=1
        continue
    fi

    for format in json csv; do
        python3 -u -m dining.export --college "$college" --days "$DAYS" \
            --format "$format" -o "exports/$college-$STAMP.$format" >>"$LOG" 2>&1 \
            || { echo "!!! $college $format export FAILED" >>"$LOG"; status=1; }
    done
done

# Keep the last 8 weeks.
find logs -name 'refresh-*.log' -mtime +56 -delete
find exports -mtime +56 \( -name '*.json' -o -name '*.csv' \) -delete

exit $status
