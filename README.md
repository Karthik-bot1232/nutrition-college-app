# College Nutrition Scraper

Pulls dining-hall menus and full nutrition labels from a college's nutrition
site into a **Supabase (Postgres)** database, and exports them in a stable
format. Currently onboarded: **University of Maryland** (`umd`).

The database is the source of truth, not a cache. Scraping only fills its gaps:
a menu slot (date / hall / meal) already stored is never fetched again, and a
recipe's label is fetched once and then read from the database forever after.
A daily run therefore costs only the days the college has newly published,
and most days that is nothing at all.

## Setup

```bash
python3 -m venv .venv
./.venv/bin/python -m pip install -r requirements.txt
cp .env.example .env        # then paste your connection string into it
```

See [Setting up Supabase](#setting-up-supabase) for where that string comes
from. Every command below reads `DATABASE_URL` from `.env`, or takes an
explicit `--dsn`.

## Usage

```bash
# 1. Fill in whatever the database is missing (network; only the new days)
python3 -m dining.refresh --college umd --days 14
python3 -m dining.refresh --college umd --days 14 --force   # re-scrape anyway

# 2. Export a window
python3 -m dining.export --college umd --days 7 --format json -o week.json
python3 -m dining.export --college umd --days 7 --format csv  -o week.csv

# Browse without exporting
python3 -m dining.query menu --hall 16 --meal Lunch
python3 -m dining.query find --min-protein 25 --max-calories 500 --without gluten
python3 -m dining.query stats

# 3. Or browse it in a browser
python3 -m dining.serve --open          # http://127.0.0.1:8000
```

`refresh` writes, `export` and `serve` only read. `daily_refresh.sh` runs the
first two and drops the window's files in `exports/`.

## Setting up Supabase

1. Create a project at [supabase.com](https://supabase.com) (the free tier is
   far more than this needs -- a full year of UMD menus is a few hundred MB).
   Save the database password it asks you to set; you need it in step 3.
2. Dashboard -> **Project Settings** -> **Database** -> **Connection string** ->
   **Transaction pooler**. That is the pooled port (6543), which is what
   Supabase recommends for short-lived connections, and all this app makes are
   short-lived connections.
3. Copy it into `.env` as `DATABASE_URL`, replacing `[YOUR-PASSWORD]` with the
   password from step 1.
4. Create the tables and pull the first window:

   ```bash
   python3 -m dining.refresh --college umd --days 14
   ```

   The schema is created on first connect, so there is no separate migration
   step and no SQL to paste into the dashboard.

`.env` is gitignored, and the password in it is full write access to your data:
it does not belong in a commit, a screenshot, or a pasted log.

### Coming from the old local `nutrition.db`

```bash
python3 -m dining.migrate              # copies ./nutrition.db into Supabase
python3 -m dining.migrate --dry-run    # convert everything, write nothing
```

It only reads the sqlite file, and every row is an upsert, so running it twice
changes nothing and a re-run after a failure just finishes the job. Keep
`nutrition.db` around until you are satisfied, then delete it -- nothing reads
it any more.

## Running it daily

`daily_refresh.sh` tops up every registered college and writes the window's
exports. `com.nutrition.dailyrefresh.plist` runs it at 05:00 via launchd, which
(unlike cron) runs a job it missed once the Mac wakes up.

```bash
cp com.nutrition.dailyrefresh.plist ~/Library/LaunchAgents/
launchctl load ~/Library/LaunchAgents/com.nutrition.dailyrefresh.plist
launchctl start com.nutrition.dailyrefresh     # run it once now
```

Most runs do nothing and finish in about nine seconds, because nothing already
stored is re-fetched. Daily is worth it for the exceptions: a newly published
day is picked up within 24 hours rather than up to a week, and a run that fails
because the site is down is retried tomorrow. `--days 14` is the window each
run *examines*, not what it fetches -- it settles into collecting roughly seven
new days a week and staying about two weeks ahead.

A slot that comes back empty is never recorded as stored, so weekend breakfasts
and days the college has not published yet are retried on every run until they
fill in. What no cadence fixes is a menu edited after publication: it keeps what
it said when first scraped, unless you re-pull with `FORCE=1 ./daily_refresh.sh`.

The script runs `./.venv/bin/python`, not `python3`. That is not a style
preference: launchd runs with a bare `PATH`, `python3` there resolves to
`/usr/bin/python3`, and that interpreter has none of this project's
dependencies. Check `logs/launchd.err.log` if a scheduled run goes missing.

## Export format

**JSON** is normalized. A recipe served at three halls across seven days is one
entry under `items`; the `days` tree references it by `recipe_id`. Inlining it
would multiply the file several times over.

```
college, college_name, generated_at
week      { start, end, days }
coverage  { days_with_menus, dates_without_menus, menu_rows, unique_recipes,
            recipes_without_nutrition, recipes_without_allergen_data,
            recipes_with_suspect_nutrition }
items     { "<recipe_id>": { name, serving_size, calories, nutrients{...},
              allergens[], allergens_as_published[], allergen_data_published,
              diets[], ingredients, source_url, has_nutrition,
              nutrition_suspect } }
days      [ { date, weekday, published,
              meals: [ { meal, locations: [ { location_id, location_name,
                stations: [ { station, items: [ { recipe_id, name, portion,
                                                  menu_tags[] } ] } ] } ] } ] } ]
```

`nutrients` carries the 17 non-calorie fields in `models.NUTRIENT_FIELDS`
(fat, saturated fat, trans fat, cholesterol, sodium, carbs, fiber, sugars,
added sugars, protein, calcium, iron, potassium, vitamin A, vitamin C).
A `null` means the label did not publish that nutrient.

**CSV** is the flat counterpart: one row per appearance, 35 columns, every
nutrient its own column. Use it for spreadsheets and quick analysis.

## The web UI

`dining.serve` puts the stored week behind a small read-only JSON API and a
single-page front end, built as a phone app: four tabs, sheets that slide up,
and a true-black theme.

- **Today** is the home screen. It shows which halls are open right now and
  until when, whether any of your favorites are on today's menu, and three
  rails of picks for the current meal: most protein, light but filling, and
  plant-based. Picks respect your saved diet and allergen profile. Below that
  are your day's calories and macros, a water tracker and one-tap searches.
- **Menu** opens on the meal being served now (from the adapter's `hours`),
  grouped by station. A sticky station index jumps anywhere in a 23-station
  menu and highlights where you are. Quick chips cover Favorites, High protein,
  Vegan, Vegetarian, Halal and Under 400 cal. The full filter sheet adds
  allergens, protein/calorie bounds, sort and scope. Diet and allergen choices
  are remembered on the phone, because an allergy is not a per-visit setting.
- **Search** suggests recent and popular searches, and collapses a recipe
  served at three halls into one card listing where to find it.
- **Item detail** shows the full label with % Daily Value, where the calories
  come from, both allergen sources side by side, when and where it is served
  next, and a Save (favorite) button.
- **Build** picks plates from what is actually being served to hit a
  per-meal calorie and protein target.
- **Tracker** logs each meal with a servings stepper (half-serving steps),
  shows the day against a daily calorie and protein target as a ring, tracks
  water, and charts the week. Everything personal is kept in the browser's
  localStorage and nothing is written back to the database.
- **About this data** (the ⓘ button) is `query stats` in the UI: coverage, what
  the source never published, and how many labels fail each check.

Endpoints are `/api/meta`, `/api/menu`, `/api/search`, `/api/item` and
`/api/stats`; every one is a GET returning JSON, so the front end is replaceable.

### Working on the UI without a database

```bash
python3 -m dining.demo --open          # http://127.0.0.1:8000
```

`dining.demo` serves the same `dining/web` files, but answers the API from the
sample in `frontend/src/mockData.js` (577 items from real UMD menus) spread over
two weeks. It needs only the standard library, with no `.env` and no psycopg.

### Hours

Each adapter can declare `hours`: a serving window per meal, for weekdays and
for weekends. The UI uses it to open on the current meal and to show open or
closed. UMD's are the typical semester schedule, and the UI labels them as the
usual hours. Update `UMDAdapter.hours` if the posted times change. An adapter
without `hours` simply shows no open/closed status.

No framework and no build step -- `http.server` plus `psycopg`, and the front
end has no dependencies at all. It serves what `refresh` already stored, so a
stale database shows a stale menu.

The server takes a connection from a small pool for each request rather than
holding one per thread. `ThreadingHTTPServer` starts a thread per request, so
a connection per thread means a Postgres connection per browser request, and
Supabase caps those well below what a few reloads would reach.

```bash
python3 -m dining.serve --port 8080 --college umd --open
```

## Two ways a published label can be wrong

`nutrition_suspect` (above) catches labels that contradict themselves. It cannot
catch the other failure, because those labels are internally consistent: every
macro is scaled up together, a whole pan published as one portion. UMD serves a
tilapia at 283g protein / 2051 kcal / 28,384mg sodium for "1 ea" -- the macros
reconcile to the calories perfectly.

`serve._label_implausible` is the UI-side check for those. The sharp test is
calorie density, which needs a weighed portion: pure fat is ~255 kcal/oz, and
the densest thing UMD publishes (olive oil) measures 250.6, so anything above
260 kcal/oz cannot be food. For "1 each" portions there is no weight to divide
by, so it falls back to absolute bounds -- over 1000 kcal, 80g protein or
5000mg sodium. Together they flag 2.2% of UMD recipes.

The absolute bounds do catch a few genuinely enormous composite sandwiches,
which is the right way to be wrong here. Cards get a `check label` badge, the
protein sort drops flagged items to the bottom, and published numbers are still
shown unchanged -- these are the items that would otherwise own the top of every
high-protein search.

## Reading the allergen fields

`allergen_data_published: false` means the source published nothing — it is not
a claim that the item is free of anything. Roughly a third of UMD recipes land
here. `query find --without X` hides those by default rather than implying they
are safe; `--include-unknown` shows them.

`allergens` is normalized to the canonical vocabulary in `allergens.py`
(`dairy`, `eggs`, `fish`, `shellfish`, `tree_nuts`, `peanuts`, `gluten`, `soy`,
`sesame`, `coconut`, `alcohol`, `pork`, `pea_protein`) so a filter means the
same thing at every college. `allergens_as_published` keeps the original words.
Two sources are merged: the label page and the menu-row legend icons, which
disagree often enough that trusting only the label marks items falsely safe.

## `nutrition_suspect`

Set when a label's own macros cannot produce its calorie count -- more than a
50% overshoot that is also 80+ kcal (rounding, fiber and sugar alcohols move
the estimate a little, so the bar is deliberately loose). UMD publishes a
broccoli cheddar soup at 66g protein in 374 kcal, which is impossible; the
likely cause is batch-level protein against a per-portion calorie count.

Only ~0.25% of recipes trip it, but they distort exactly the query a nutrition
app runs -- that soup ranks as the highest-protein item of the week. Published
values are still copied through unchanged; this only marks them, because
deciding whether to hide, warn or ignore belongs to the app, not the scraper.
Note that `query find` does **not** filter on it yet.

## Adding another college

Subclass `CollegeAdapter` in `dining/colleges/`, then register it in
`colleges/__init__.py`. Caching, rate limiting, storage and both exports are
shared — an adapter only supplies URLs and parsing:

```python
class ExampleAdapter(CollegeAdapter):
    slug = "example"
    name = "Example University"
    locations = {"1": "North Dining"}      # site's own location ids
    meals = ("Breakfast", "Lunch", "Dinner")

    def menu_url(self, location_id, day, meal): ...
    def label_url(self, location_id, day, external_id): ...
    def parse_menu(self, html, location_id, day, meal) -> list[MenuEntry]: ...
    def parse_label(self, html, external_id, source_url) -> FoodItem: ...
```

Map the school's allergen wording into `allergens.SYNONYMS`; unmapped terms are
printed to stderr during a refresh so they are easy to spot.

## Notes on UMD

Server-rendered CBORD FoodPro pages at `nutrition.umd.edu`, read as plain HTML
over GET — no browser automation, no vision model. Three halls (South Campus,
Yahentamitsi, 251 North), three meals. The site publishes at least two weeks
ahead, so `--days` can exceed 7. On weekends South Campus and Yahentamitsi
serve no breakfast — a `Breakfast` pull returns 0 items, which is correct and
not a parse failure. The site has no `Brunch` or `Late Night` meal name, so
those three meals are the complete set. Requests are spaced 0.5s apart. Labels are
cached by recipe id for 30 days (`--label-ttl-days`) because the same recipe
reappears constantly; menus are re-read every run.
