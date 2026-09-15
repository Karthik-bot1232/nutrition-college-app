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
```

`refresh` writes, `export` only reads. `weekly_refresh.sh` runs both and drops
the week's files in `exports/`.

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
