# College Nutrition Scraper

Pulls a week of dining-hall menus and full nutrition labels from a college's
nutrition site and exports them in a stable format. Currently onboarded:
**University of Maryland** (`umd`).

## Usage

```bash
# 1. Pull the published week into the database (network; ~15 min for a full week)
python3 -m dining.refresh --college umd --days 7

# 2. Export that week
python3 -m dining.export --college umd --days 7 --format json -o week.json
python3 -m dining.export --college umd --days 7 --format csv  -o week.csv

# Browse without exporting
python3 -m dining.query menu --hall 16 --meal Lunch
python3 -m dining.query find --min-protein 25 --max-calories 500 --without gluten
python3 -m dining.query stats

# 3. Or browse it in a browser
python3 -m dining.serve --open          # http://127.0.0.1:8000
```

`refresh` writes, `export` and `serve` only read. `weekly_refresh.sh` runs the
first two and drops the week's files in `exports/`.

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
single-page front end.

- **Browse** a date, meal and hall, grouped by station. `All halls` puts the
  three halls side by side for one meal. Stations collapse, and a jump bar
  indexes them -- lunch at South Campus runs to 23 stations and 300+ rows.
- **Search and filter** on name, protein, calories, diet and allergens, scoped
  to one meal, a whole day, or every stored day. A recipe served at three halls
  collapses to one card listing where to find it.
- **Item detail** shows the full label -- all 17 nutrients, ingredients, both
  allergen sources side by side (the label page and the menu-row icons, which
  disagree), every place it is served that week, when it was scraped, and a link
  to the source page.
- **About this data** (the ⓘ button) is `query stats` in the UI: coverage, what
  the source never published, and how many labels fail each check.
- **Plate**: add items for a running per-day calorie and macro total, kept in
  the browser's localStorage. Nothing is written back to the database.

Endpoints are `/api/meta`, `/api/menu`, `/api/search`, `/api/item` and
`/api/stats`; every one is a GET returning JSON, so the front end is replaceable.

Stdlib only -- `http.server` and `sqlite3`, no framework, no build step, and the
front end has no dependencies. It serves what `refresh` already stored, so a
stale database shows a stale menu.

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
