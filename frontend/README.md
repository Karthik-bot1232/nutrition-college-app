# Dining — frontend

Mobile-first React app for browsing a college dining hall's menu, building a
plate, and tracking the day against macro targets.

```bash
cd frontend
npm install
npm run dev      # http://127.0.0.1:5173
```

## State of it

| Screen | Status |
| --- | --- |
| Menu browse | built |
| Plate builder | next |
| Daily tracker | to do |
| Macro targets | to do |
| Meal suggestions | to do |
| Favorites | to do |
| Weekly view | to do |

## Data

`src/mockData.js` holds the fixture: 577 items across 3 halls, 3 meal periods
and 53 stations, shaped to the API schema. It is sampled from real published
University of Maryland menus rather than invented, so the screens meet the
things real menus do — nutrients the hall never published, items with no
allergen data at all, and stations that are almost entirely condiments.

Nothing calls a network. Swapping the fixture for the API means replacing the
import in `App.jsx`; no component fetches anything itself.

## Conventions worth keeping

**Macro colours live in `src/theme.js`, not in screens.** Every view reads the
same `MACROS` list, so protein cannot drift between a card and a chart.

**Red is reserved for allergens.** Protein is violet for that reason. An
allergen you have excluded has to be the loudest thing on screen, and it cannot
be if every card already carries that colour on a number.

**A null nutrient is not a zero.** The hall published nothing; `fmt()` renders
it as `—`. Treating it as 0 silently invents a fact about someone's food.

**"No allergen data" is not "no allergens".** Roughly a third of real items have
nothing published. While an exclusion filter is on, those items are hidden
rather than shown as safe.
