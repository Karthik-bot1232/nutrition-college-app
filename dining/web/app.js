/* Browser client for dining.serve. Vanilla, no build step. */

const $ = (sel, root = document) => root.querySelector(sel);
const $$ = (sel, root = document) => [...root.querySelectorAll(sel)];
const api = (path, params) =>
  fetch(path + (params ? '?' + params : '')).then(r => {
    // Two signals, because neither is sufficient alone: the worker stamps
    // anything it served from its cache, and a request that never reached the
    // network at all is the other way to find out.
    if (r.headers.get('X-From-Cache') === '1') markOffline(true);
    else if (navigator.onLine) markOffline(false);
    return r.json();
  }).catch(err => {
    markOffline(true);
    throw err;
  });

const NUTRIENTS = [
  ['total_fat_g', 'Total fat', 'g'], ['saturated_fat_g', 'Saturated fat', 'g'],
  ['trans_fat_g', 'Trans fat', 'g'], ['cholesterol_mg', 'Cholesterol', 'mg'],
  ['sodium_mg', 'Sodium', 'mg'], ['total_carbs_g', 'Total carbohydrate', 'g'],
  ['dietary_fiber_g', 'Dietary fiber', 'g'], ['soluble_fiber_g', 'Soluble fiber', 'g'],
  ['insoluble_fiber_g', 'Insoluble fiber', 'g'], ['total_sugars_g', 'Total sugars', 'g'],
  ['added_sugars_g', 'Added sugars', 'g'], ['protein_g', 'Protein', 'g'],
  ['calcium_mg', 'Calcium', 'mg'], ['iron_mg', 'Iron', 'mg'],
  ['potassium_mg', 'Potassium', 'mg'], ['vitamin_a_mcg', 'Vitamin A', 'mcg'],
  ['vitamin_c_mg', 'Vitamin C', 'mg'],
];
const DIETS = ['vegan', 'vegetarian', 'halal'];
const SCOPE_LABEL = { meal: 'This meal only', day: 'This whole day', all: 'Every stored day' };
const SORT_LABEL = { name: 'Name', protein: 'Protein, high to low', calories: 'Calories, low to high' };


const state = {
  meta: null, date: null, meal: null, location: null, weekStart: null, tab: 'browse',
  goals: { calories: '', protein: '', maxCarbs: '', maxFat: '' }, plans: null, planning: false,
  plates: {}, openMeals: new Set(),
  q: '', scope: 'meal', minProtein: '', maxCalories: '', sort: 'name',
  without: new Set(), diets: new Set(), includeUnknown: false, hideImplausible: false,
  items: new Map(), collapsed: new Set(), menu: null, loadToken: 0,
};

/* ------------------------------------------------------------- meal builder

   Given what a hall is serving and a target, pick a few combinations that hit
   it. This is a small knapsack with soft constraints, and the honest way to
   solve it here is search rather than arithmetic: the pool is a few hundred
   items, plates are three to five of them, and the objective (land near a
   calorie number, clear a protein floor, stay under two ceilings) has no clean
   closed form. Randomised greedy construction with restarts, then a swap pass,
   gets good plates in a few milliseconds and stays readable.                 */

const GOAL_DEFAULTS = { calories: 700, protein: 35 };

const OZ = /^\s*([\d.]+)\s*(?:oz|ounce)/i;
const DISCRETE = /\b(each|ea|slice|slices|piece|pieces|sandwich|wrap|burger|cup|bowl|bar)\b/i;

/** Is this something you eat, or something you put on something you eat?

    There is no field for it, but the portion says it: 146 of the 333 items on a
    UMD lunch are "1 oz", and those are the salad-bar toppings, the dressings
    and the sauces. Left unmarked, the builder happily hits a calorie target
    with mustard and guacamole, because arithmetic has no opinion about whether
    that is a meal. Anything served by weight at an ounce or less, with neither
    real calories nor real protein behind it, is treated as a garnish. */
function isGarnish(item) {
  const size = item.serving_size || item.portion || '';
  if (DISCRETE.test(size)) return false;
  const m = OZ.exec(size);
  if (!m) return false;
  return parseFloat(m[1]) <= 1
    && (item.calories || 0) < 150
    && (item.nutrients.protein_g || 0) < 12;
}

/** A plate's totals. Missing values count as zero, never as unknown. */
function sumItems(items) {
  return items.reduce((t, i) => ({
    cal: t.cal + (i.calories || 0),
    p: t.p + (i.nutrients.protein_g || 0),
    c: t.c + (i.nutrients.total_carbs_g || 0),
    f: t.f + (i.nutrients.total_fat_g || 0),
  }), { cal: 0, p: 0, c: 0, f: 0 });
}

/** Higher is better. Everything is scaled against its own target so no term
    drowns the others just by being measured in a bigger unit. */
function scorePlate(items, goal) {
  const t = sumItems(items);
  let s = 0;

  const overshoot = Math.max(0, t.cal - goal.calories) / goal.calories;
  const shortfall = Math.max(0, goal.calories - t.cal) / goal.calories;
  // Going over is worse than coming up short: an extra 200 calories is a
  // decision the eater cannot undo at the counter, a missing 200 is a side.
  s -= overshoot * 140 + shortfall * 85;

  if (goal.protein > 0) {
    const miss = Math.max(0, goal.protein - t.p) / goal.protein;
    s -= miss * 110;
    if (miss === 0) s += 8;
  }
  if (goal.maxCarbs > 0) s -= Math.max(0, t.c - goal.maxCarbs) / goal.maxCarbs * 70;
  if (goal.maxFat > 0) s -= Math.max(0, t.f - goal.maxFat) / goal.maxFat * 70;

  // A plate is a meal, not a tasting menu or a single entree.
  if (items.length < 2) s -= 18;
  if (items.length > 5) s -= (items.length - 5) * 12;

  // Two items from one station is a plate; four is the same thing four times.
  const stations = new Set(items.map(i => i._station));
  s += Math.min(stations.size, 3) * 4;

  // A meal is made of food with a condiment on it, not of condiments.
  const garnishes = items.filter(i => i._garnish).length;
  const components = items.length - garnishes;
  if (components < 2) s -= 45;
  if (garnishes > 1) s -= (garnishes - 1) * 35;
  return s;
}

/** Items worth putting on a plate at all. */
function buildPool(menu) {
  const out = [];
  (menu?.locations || []).forEach(hall => hall.stations.forEach(st => st.items.forEach(i => {
    // No calories means it cannot be reasoned about; a label that fails the
    // plausibility check would let a whole pan masquerade as a portion and
    // swallow the entire calorie budget in one row.
    if (i.calories == null || i.calories < 15) return;
    if (i.label_implausible || i.nutrition_suspect) return;
    if (state.diets.size && ![...state.diets].every(d => i.diets.includes(d))) return;
    if (state.without.size) {
      if (!i.allergen_data_published) return;   // unknown is not the same as free of it
      if ([...state.without].some(a => i.allergens.includes(a))) return;
    }
    out.push({ ...i, _station: `${hall.location_name} · ${st.station}`, _stationName: st.station,
               _hall: hall.location_name, _garnish: isGarnish(i) });
  })));
  return out;
}

function buildPlans(pool, goal, want = 3) {
  if (pool.length < 2) return [];
  const plans = [];
  const seen = new Set();

  for (let restart = 0; restart < 90; restart++) {
    const plate = [];
    const used = new Set();

    for (let step = 0; step < 6; step++) {
      // Score a random slice rather than the whole pool: it keeps each restart
      // cheap and is what makes restarts return different plates at all.
      let best = null, bestScore = plate.length ? scorePlate(plate, goal) : -1e9;
      for (let k = 0; k < 45; k++) {
        const cand = pool[(Math.random() * pool.length) | 0];
        if (used.has(cand.recipe_id)) continue;
        const sc = scorePlate([...plate, cand], goal);
        if (sc > bestScore) { bestScore = sc; best = cand; }
      }
      if (!best) break;
      plate.push(best); used.add(best.recipe_id);
    }
    if (plate.length < 2) continue;

    // Swap pass: try replacing each item with something better.
    for (let pass = 0; pass < 2; pass++) {
      for (let i = 0; i < plate.length; i++) {
        let bestScore = scorePlate(plate, goal), swap = null;
        for (let k = 0; k < 40; k++) {
          const cand = pool[(Math.random() * pool.length) | 0];
          if (used.has(cand.recipe_id)) continue;
          const trial = plate.slice(); trial[i] = cand;
          const sc = scorePlate(trial, goal);
          if (sc > bestScore) { bestScore = sc; swap = cand; }
        }
        if (swap) { used.delete(plate[i].recipe_id); plate[i] = swap; used.add(swap.recipe_id); }
      }
    }

    const key = plate.map(i => i.recipe_id).sort().join('|');
    if (seen.has(key)) continue;
    seen.add(key);
    plans.push({ items: plate, score: scorePlate(plate, goal), totals: sumItems(plate) });
  }

  plans.sort((a, b) => b.score - a.score);
  return plans.slice(0, want);
}

/* ------------------------------------------------------------------- weeks

   Dates are paged a Monday-to-Sunday week at a time rather than shown as one
   long run of every stored day. A flat strip of twenty days gives no sense of
   which week you are in and puts next Tuesday and last Tuesday side by side
   looking identical.                                                        */

const iso = d => `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
const parseDay = s => new Date(s + 'T12:00:00');

/** The Monday on or before `dateStr`. Sunday closes a week here, not opens one. */
function mondayOf(dateStr) {
  const d = parseDay(dateStr);
  d.setDate(d.getDate() - ((d.getDay() + 6) % 7));
  return iso(d);
}

function addDays(dateStr, n) {
  const d = parseDay(dateStr);
  d.setDate(d.getDate() + n);
  return iso(d);
}

/** Every Monday that has at least one stored day, oldest first. */
function weeksAvailable() {
  const seen = [];
  state.meta.dates.forEach(d => {
    const m = mondayOf(d);
    if (!seen.includes(m)) seen.push(m);
  });
  return seen.sort();
}

const esc = s => String(s ?? '').replace(/[&<>"']/g,
  c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
const num = (v, d = 0) => v == null ? '–' : v.toFixed(d);
const titleCase = s => s.replace(/_/g, ' ').replace(/\b\w/g, c => c.toUpperCase());
const hallName = id => state.meta.locations.find(l => l.id === id)?.name || id;

/* ---------------------------------------------------------------- filtering

   One list describes every applied filter: the chips under the search box, the
   badge on the Filters button and the decision to switch from the menu view to
   a search all read from it, so they cannot drift apart. `menuOnly` marks the
   ones the grouped menu view can honour itself without a server search.        */

function activeFilters() {
  const out = [];
  const set = patch => () => { Object.assign(state, patch); applyFilters(); };

  if (state.q) out.push({ label: `“${state.q}”`, isSearch: true, clear: clearSearch });
  if (state.minProtein)
    out.push({ label: `Protein ≥ ${state.minProtein}g`, clear: set({ minProtein: '' }) });
  if (state.maxCalories)
    out.push({ label: `Calories ≤ ${state.maxCalories}`, clear: set({ maxCalories: '' }) });
  state.diets.forEach(d => out.push({
    label: titleCase(d), clear: () => { state.diets.delete(d); applyFilters(); } }));
  state.without.forEach(a => out.push({
    label: `No ${titleCase(a)}`, clear: () => { state.without.delete(a); applyFilters(); } }));
  if (state.without.size && state.includeUnknown)
    out.push({ label: 'Incl. unknown allergens', clear: set({ includeUnknown: false }) });
  if (state.sort !== 'name')
    out.push({ label: SORT_LABEL[state.sort], clear: set({ sort: 'name' }) });
  if (state.scope !== 'meal')
    out.push({ label: SCOPE_LABEL[state.scope], clear: set({ scope: 'meal' }) });
  if (state.hideImplausible)
    out.push({ label: 'Hiding odd labels', menuOnly: true, clear: set({ hideImplausible: false }) });
  return out;
}

/** True when the grouped menu view cannot answer on its own. */
const filtersActive = () => activeFilters().some(f => !f.menuOnly);

function searchParams() {
  const p = new URLSearchParams();
  if (state.q) p.set('q', state.q);
  if (state.scope === 'all') {
    p.set('scope', 'all');
  } else {
    p.set('scope', 'day');
    p.set('date', state.date);
    if (state.scope === 'meal') {
      p.set('meal', state.meal);
      // "All halls" is a UI value, not a hall: sending it asks the server for a
      // location literally named "all" and every search comes back empty.
      if (state.location !== 'all') p.set('location', state.location);
    }
  }
  if (state.minProtein) p.set('min_protein', state.minProtein);
  if (state.maxCalories) p.set('max_calories', state.maxCalories);
  if (state.sort !== 'name') p.set('sort', state.sort);
  state.without.forEach(a => p.append('without', a));
  state.diets.forEach(d => p.append('diet', d));
  if (state.includeUnknown) p.set('include_unknown', '1');
  return p.toString();
}

function scopeText() {
  if (state.scope === 'all') return 'every stored day';
  if (state.scope === 'day') return 'this whole day, all halls';
  const where = state.location === 'all' ? 'all halls' : hallName(state.location);
  return `${state.meal.toLowerCase()} at ${where}`;
}

/* ------------------------------------------------------------------ pieces */

/* Four stat tiles: an icon, the number, and the word spelled out.
   Two earlier versions of this failed for the same underlying reason. Three
   coloured dots against three numbers -- "16g 13g 10g" -- put the whole meaning
   in the hue, so it read only if you had learned that red was protein, and for
   a colourblind reader it did not read at all. Abbreviating to P / C / F fixed
   the colour dependency but still asked the reader to expand a letter. The word
   costs a little width and removes the last thing standing between looking at a
   row and knowing what it says. */
const STATS = [
  ['cal', 'ic-cal', 'Calories', null],
  ['carb', 'ic-carb', 'Carbs', 'total_carbs_g'],
  ['protein', 'ic-protein', 'Protein', 'protein_g'],
  ['fat', 'ic-fat', 'Fat', 'total_fat_g'],
];

/* One item.

   Name and serving on the left, calories on the right as the hero number, a
   macro row under them, tags last. Each macro is a coloured dot next to its own
   value and word, so the hue is reinforcement and never the only thing saying
   which macro it is. */
const MACROS = [
  ['protein', 'Protein', 'protein_g'],
  ['carbs',   'Carbs',   'total_carbs_g'],
  ['fat',     'Fat',     'total_fat_g'],
];

function macroRow(item) {
  return `<div class="macros">${MACROS.map(([cls, label, key]) => {
    const g = item.nutrients[key];
    return `<span class="macro macro--${cls}">
      <span class="macro__dot" aria-hidden="true"></span>
      <span class="macro__val">${g == null ? '–' : Math.round(g) + 'g'}</span>
      <span class="macro__label">${label}</span>
    </span>`;
  }).join('')}</div>`;
}

function tagRow(item) {
  const out = [];
  if (item.label_implausible)
    out.push(`<span class="pill pill--warn">Check label</span>`);
  else if (item.nutrition_suspect)
    out.push(`<span class="pill pill--warn">Macros off</span>`);
  item.diets.forEach(d => out.push(`<span class="pill pill--diet">${esc(titleCase(d))}</span>`));
  if (!item.allergen_data_published) {
    out.push(`<span class="pill pill--unknown">No allergen data</span>`);
  } else if (item.allergens.length) {
    const shown = item.allergens.slice(0, 2).map(titleCase).join(', ');
    const more = item.allergens.length > 2 ? ` +${item.allergens.length - 2}` : '';
    out.push(`<span class="pill pill--allergen">Contains ${esc(shown)}${more}</span>`);
  }
  return out.length ? `<div class="item__tags">${out.join('')}</div>` : '';
}

function card(item, sub) {
  state.items.set(item.recipe_id, item);
  const on = plateFor().some(p => p.recipe_id === item.recipe_id);
  const cal = item.calories == null ? '–' : Math.round(item.calories);
  return `<li><article class="card item">
    <button class="item__main" data-id="${esc(item.recipe_id)}"
            aria-label="${esc(item.name)}, ${cal} calories. Full label">
      <span class="item__row">
        <span>
          <span class="item__name">${esc(item.name)}</span>
          <span class="item__serving">${esc(sub || item.serving_size || '')}</span>
        </span>
        <span class="item__cal"><b>${cal}</b><span>cal</span></span>
      </span>
      ${macroRow(item)}
      ${tagRow(item)}
    </button>
    <button class="addbtn" data-add="${esc(item.recipe_id)}" aria-pressed="${on}"
            aria-label="${on ? 'Remove' : 'Add'} ${esc(item.name)} ${on ? 'from' : 'to'} plate">
      <svg class="gi" aria-hidden="true"><use href="#ic-${on ? 'check' : 'plus'}"/></svg>
    </button>
  </article></li>`;
}

/* ------------------------------------------------------------------ chrome */

function renderDates() {
  const { dates, today } = state.meta;
  const weeks = weeksAvailable();
  if (!state.weekStart || !weeks.includes(state.weekStart)) state.weekStart = mondayOf(state.date);
  const at = weeks.indexOf(state.weekStart);
  const thisWeek = mondayOf(today);

  const first = parseDay(state.weekStart);
  const last = parseDay(addDays(state.weekStart, 6));
  const sameMonth = first.getMonth() === last.getMonth();
  const fmt = (d, withMonth) => d.toLocaleDateString(undefined,
    withMonth ? { month: 'short', day: 'numeric' } : { day: 'numeric' });
  const rel = state.weekStart === thisWeek ? 'This week'
    : state.weekStart === addDays(thisWeek, 7) ? 'Next week'
    : state.weekStart === addDays(thisWeek, -7) ? 'Last week'
    : state.weekStart < thisWeek ? 'Past' : 'Upcoming';

  $('#weekNav').innerHTML = `
    <button class="weeknav__arrow" data-week="-1" ${at <= 0 ? 'disabled' : ''}
            aria-label="Previous week">
      <svg class="gi" aria-hidden="true"><use href="#ic-left"/></svg></button>
    <span class="weeknav__label">
      <b>${esc(fmt(first, true))} – ${esc(fmt(last, !sameMonth))}</b>
      <span>${rel}</span></span>
    <button class="weeknav__arrow" data-week="1" ${at >= weeks.length - 1 ? 'disabled' : ''}
            aria-label="Next week">
      <svg class="gi" aria-hidden="true"><use href="#ic-right"/></svg></button>`;

  // Seven fixed columns, Monday first, so a weekday keeps its place week to
  // week. A day the hall never published stays in position and is disabled
  // rather than dropped, which would reflow the row under a thumb.
  $('#dateStrip').innerHTML = Array.from({ length: 7 }, (_, i) => {
    const d = addDays(state.weekStart, i);
    const dt = parseDay(d);
    const has = dates.includes(d);
    const sel = d === state.date;
    const full = dt.toLocaleDateString(undefined,
      { weekday: 'long', month: 'long', day: 'numeric' });
    return `<button class="day" role="tab" data-date="${d}"
      aria-selected="${sel}" tabindex="${sel ? 0 : -1}"
      ${has ? '' : 'disabled'}
      aria-label="${esc(full)}${has ? '' : ', no menu published'}">
      <span class="day__dow" aria-hidden="true">${dt.toLocaleDateString(undefined, { weekday: 'narrow' })}</span>
      <span class="day__num" aria-hidden="true">${dt.getDate()}</span>
      ${d === today ? '<span class="day__today" aria-hidden="true"></span>' : ''}
    </button>`;
  }).join('');

  // Bring the selected day into view without yanking the page.
  const sel = $(`.day[data-date="${state.date}"]`);
  sel?.scrollIntoView({ inline: 'center', block: 'nearest',
                        behavior: prefersReducedMotion() ? 'auto' : 'smooth' });
}

const prefersReducedMotion = () =>
  window.matchMedia?.('(prefers-reduced-motion: reduce)').matches ?? false;

const count = (meal, loc) => state.meta.counts[`${state.date}|${meal}|${loc}`] || 0;

function renderMeals() {
  $('#mealTabs').innerHTML = state.meta.meals.map(mm => {
    const served = state.meta.locations.some(l => count(mm, l.id) > 0);
    const sel = mm === state.meal;
    return `<button role="tab" data-meal="${esc(mm)}" aria-selected="${sel}"
      tabindex="${sel ? 0 : -1}"
      ${served ? '' : 'disabled aria-describedby="mealNone"'}>${esc(mm)}</button>`;
  }).join('') + '<span class="sr" id="mealNone">Nothing served at any hall</span>';
}

/* One picker, not a row of pills you have to scroll sideways through.

   Four halls in a horizontal scroller cost a full row of the screen and hid
   whichever ones did not fit. The native control is one tap, shows every option
   at once, and is the thing a phone is already good at. */
/** The hall lives in the top bar as a compact button and opens a sheet.

    Four halls as pills cost a whole row on a phone and hid whichever did not
    fit; a sheet shows every option at once with its count, at full tap size. */
function renderHalls() {
  const total = state.meta.locations.reduce((n, l) => n + count(state.meal, l.id), 0);
  const shown = state.location === 'all' ? total : count(state.meal, state.location);
  $('#hallName').textContent = state.location === 'all' ? 'All halls' : hallName(state.location);
  $('#hallCount').textContent = shown;
  $('#hallBtn').setAttribute('aria-label',
    `Dining hall: ${state.location === 'all' ? 'All halls' : hallName(state.location)}, ` +
    `${shown} item${shown === 1 ? '' : 's'}. Change`);

  const opt = (id, label, n) => `<button class="row" data-loc="${esc(id)}"
      aria-pressed="${id === state.location}">
      <span class="row__id"><b>${esc(label)}</b><span>${n ? `${n} at ${esc(state.meal.toLowerCase())}`
        : `No ${esc(state.meal.toLowerCase())}`}</span></span>
      ${id === state.location
        ? '<svg class="gi" aria-hidden="true"><use href="#ic-check"/></svg>' : ''}
    </button>`;
  $('#hallOptions').innerHTML =
    state.meta.locations.map(l => opt(l.id, l.name, count(state.meal, l.id))).join('') +
    opt('all', 'All halls', total);
}

function renderActiveFilters() {
  const list = activeFilters();
  const bar = $('#activeFilters');
  const badge = $('#filterCount');
  const sheetFilters = list.filter(f => !f.isSearch);

  badge.hidden = !sheetFilters.length;
  badge.textContent = sheetFilters.length;

  bar.hidden = !list.length;
  bar.innerHTML = list.map((f, i) =>
    `<button class="chip chip--remove" data-af="${i}"
       aria-label="Remove filter: ${esc(f.label)}">${esc(f.label)}
       <svg class="gi" aria-hidden="true"><use href="#ic-close"/></svg></button>`).join('') +
    (list.length > 1
      ? `<button class="linkbtn" data-afclear>Clear all</button>` : '');
  bar._filters = list;
}

/* ------------------------------------------------------------------- views */

const emptyState = (title, body, action = '', icon = 'search') => `
  <div class="empty">
    <span class="empty__icon"><svg class="gi" aria-hidden="true"><use href="#ic-${icon}"/></svg></span>
    <h2>${esc(title)}</h2>
    <p>${body}</p>
    ${action}
  </div>`;

const cssId = key => key.replace(/[^a-z0-9]+/gi, '-').toLowerCase();

function stationSection(st, key) {
  const shown = state.hideImplausible ? st.items.filter(i => !i.label_implausible) : st.items;
  if (!shown.length) return '';
  const open = !state.collapsed.has(key);
  const id = `st-${cssId(key)}`;
  return `<section class="station">
    <h2>
      <button class="station__head" data-collapse="${esc(key)}"
              aria-expanded="${open}" aria-controls="${id}-list">
        <span class="station__name">${esc(st.station)}</span>
        <span class="station__count">${shown.length}</span>
        <svg class="gi" aria-hidden="true"><use href="#ic-chevron"/></svg>
      </button>
    </h2>
    <ul class="cards" id="${id}-list" ${open ? '' : 'hidden'}
      >${shown.map(i => card(i, i.portion || i.serving_size)).join('')}</ul>
  </section>`;
}

function stationKeys(data) {
  return data.locations.flatMap(h => h.stations.map(st => `${h.location_id}|${st.station}`));
}

/** Count on the left, the one control that saves time on the right. */
function jumpbar(data) {
  const keys = stationKeys(data);
  const allCollapsed = keys.every(k => state.collapsed.has(k));
  const halls = data.locations;
  const label = halls.length > 1
    ? `${halls.length} halls`
    : `${halls[0].stations.length} station${halls[0].stations.length === 1 ? '' : 's'}`;
  return `<p class="resultline">
    <span>${label}</span>
    <button class="linkbtn" data-collapseall="${allCollapsed ? 'open' : 'close'}"
      >${allCollapsed ? 'Expand all' : 'Collapse all'}</button>
  </p>`;
}

/* Card-shaped placeholders in the same boxes the real cards occupy, so the
   swap does not shift the page under a thumb already reaching for something. */
function skeleton(rows = 6) {
  const card = `<li class="sk">
    <span class="sk__line sk__line--name"></span>
    <span class="sk__line sk__line--sub"></span>
    <span class="sk__block"></span>
  </li>`;
  return `<section class="station">
    <p class="resultline"><span class="sk__line sk__line--head"></span></p>
    <ul class="cards">${card.repeat(rows)}</ul>
  </section>`;
}

/** Stamp a loading view, but only if the request is slow enough to notice.
    Against a local cache the data is back in 20ms, and a skeleton that flashes
    for one frame is worse than no skeleton at all. */
function whileLoading(render) {
  const token = ++state.loadToken;
  const timer = setTimeout(() => {
    if (state.loadToken === token) render();
  }, 180);
  return () => { clearTimeout(timer); return state.loadToken === token; };
}

async function loadMenu() {
  const done = whileLoading(() => {
    $('#content').innerHTML = skeleton();
    $('#content').setAttribute('aria-busy', 'true');
  });
  const p = new URLSearchParams({ date: state.date, meal: state.meal, location: state.location });
  let data;
  try {
    data = await api('/api/menu', p.toString());
  } catch {
    // Offline and this particular day/meal/hall was never visited, so there is
    // nothing saved to fall back to. Say that, rather than leaving a skeleton
    // running forever or throwing into the console.
    if (!done()) return;
    $('#content').removeAttribute('aria-busy');
    $('#content').innerHTML = emptyState('Not saved for offline',
      `You have not opened this ${esc(state.meal.toLowerCase())} menu while connected, so there
       is no copy on the phone. Menus you have viewed before stay available offline.`);
    return;
  }
  // A slower earlier request must not paint over a newer one.
  if (!done()) return;
  $('#content').removeAttribute('aria-busy');
  state.menu = data;
  const main = $('#content');

  if (!data.count) {
    const hall = state.location === 'all' ? 'No hall' : hallName(state.location);
    main.innerHTML = emptyState(`No ${state.meal.toLowerCase()} published`,
      `${esc(hall)} has no ${esc(state.meal.toLowerCase())} menu on this date. On weekends
       South Campus and Yahentamitsi do not serve breakfast, which the site publishes as an
       empty menu rather than an error.`);
    return;
  }

  const many = data.locations.length > 1;
  const body = data.locations.map(hall => {
    const inner = hall.stations
      .map(st => stationSection(st, `${hall.location_id}|${st.station}`)).join('');
    if (!inner) return '';
    return many
      ? `<section class="hall" id="hall-${hall.location_id}">
           <div class="hall__head"><h2>${esc(hall.location_name)}</h2>
             <span>${hall.count} item${hall.count === 1 ? '' : 's'}</span></div>
           ${inner}</section>`
      : inner;
  }).join('');

  main.innerHTML = body
    ? jumpbar(data) + body
    : emptyState('Everything here is filtered out',
        'Every item on this menu has a label that fails the plausibility check.');
}

async function loadSearch() {
  const done = whileLoading(() => {
    $('#content').innerHTML = skeleton(4);
    $('#content').setAttribute('aria-busy', 'true');
  });
  let data;
  try {
    data = await api('/api/search', searchParams());
  } catch {
    if (!done()) return;
    $('#content').removeAttribute('aria-busy');
    $('#content').innerHTML = emptyState('Search needs a connection',
      'Searching asks the server each time, so it cannot run offline. Browsing menus you have '
      + 'already opened still works.');
    return;
  }
  if (!done()) return;
  $('#content').removeAttribute('aria-busy');
  const main = $('#content');
  if (data.error) { main.innerHTML = emptyState('Bad filter', esc(data.error)); return; }

  let items = data.items;
  if (state.hideImplausible) items = items.filter(i => !i.label_implausible);
  if (!items.length) {
    const wider = { meal: ['day', 'Search all of today'], day: ['all', 'Search every day'] }[state.scope];
    main.innerHTML = emptyState('Nothing matches',
      `Nothing in ${esc(scopeText())} matches ${state.q ? `“${esc(state.q)}”` : 'these filters'}.`,
      `<div class="empty__actions">
        ${wider ? `<button class="btn btn--primary" data-widen="${wider[0]}">${wider[1]}</button>` : ''}
        <button class="btn btn--ghost" data-reset>${activeFilters().some(f => !f.isSearch)
          ? 'Clear search and filters' : 'Clear search'}</button>
      </div>`);
    return;
  }

  const notice = data.hidden_unknown_allergens
    ? `<div class="notice"><svg class="gi" aria-hidden="true"><use href="#ic-warn"/></svg><span>Items whose allergen data was never
       published are hidden, because "nothing published" is not the same as "free of it".
       Turn on <em>Also show items with no allergen data</em> to see them.</span></div>` : '';

  main.innerHTML = notice +
    `<p class="resultline">
       <span><strong>${items.length}</strong> result${items.length === 1 ? '' : 's'} in ${esc(scopeText())}</span>
       ${data.count > items.length ? `<span>showing ${items.length} of ${data.count}</span>` : ''}
     </p>
     <ul class="cards">${items.map(i => card(i, placeSummary(i))).join('')}</ul>`;
  announce(`${items.length} result${items.length === 1 ? '' : 's'}`);
}

function placeSummary(item) {
  const halls = [...new Set(item.served_at.map(s => s.location_name))];
  const meals = [...new Set(item.served_at.map(s => s.meal))];
  return [item.serving_size, meals.join('/'), halls.join(', ')].filter(Boolean).join(' · ');
}

/* -------------------------------------------------------------- goals + tabs */

const GOAL_KEY = 'dining.goals';

function loadGoals() {
  try { Object.assign(state.goals, JSON.parse(localStorage.getItem(GOAL_KEY) || '{}')); }
  catch {}
}
function saveGoals() {
  try { localStorage.setItem(GOAL_KEY, JSON.stringify(state.goals)); } catch {}
}

/** The targets as numbers, with the defaults filled in where nothing is set. */
function activeGoal() {
  const n = v => (v === '' || v == null ? 0 : Number(v));
  return {
    calories: n(state.goals.calories) || GOAL_DEFAULTS.calories,
    protein: n(state.goals.protein) || GOAL_DEFAULTS.protein,
    maxCarbs: n(state.goals.maxCarbs),
    maxFat: n(state.goals.maxFat),
    isDefault: !state.goals.calories && !state.goals.protein,
  };
}

const TABS = ['browse', 'build', 'plate'];

function setTab(tab, fromHash = false) {
  if (!TABS.includes(tab)) tab = 'browse';
  state.tab = tab;
  if (!fromHash) {
    history.pushState({ tab }, '', tab === 'browse' ? location.pathname : `#${tab}`);
  }
  $$('.tab').forEach(b => {
    const on = b.dataset.tab === tab;
    on ? b.setAttribute('aria-current', 'page') : b.removeAttribute('aria-current');
  });
  $('#content').hidden = tab !== 'browse';
  $('#buildView').hidden = tab !== 'build';
  $('#plateView').hidden = tab !== 'plate';
  // Search and filters act on the browse list; on the other tabs they would
  // look live and do nothing.
  document.body.dataset.view = tab;
  $('#dateNav').hidden = false;
  $('#hero').hidden = tab !== 'browse';
  if (tab === 'build') {
    renderBuild();
    if (!state.plans && !state.planning) runBuild();
  }
  if (tab === 'plate') renderPlateView();
}

/* -------------------------------------------------------------- build view */

/** A labelled bar showing where a total lands against its target. */
function goalBar(label, value, target, unit, cls, ceiling = false) {
  const pct = target ? Math.min(value / target, 1.35) : 0;
  const over = target && value > target;
  const state_ = !target ? 'none' : ceiling ? (over ? 'over' : 'ok')
    : (pct >= .95 ? 'ok' : pct >= .7 ? 'near' : 'under');
  // Where the target sits on the track. Once the bar is full it stops being
  // able to say whether you landed on the number or sailed past it, and for a
  // ceiling that is the only thing worth knowing. The notch keeps the target
  // visible at its own position no matter how far the fill has gone.
  const notch = target && value > target * .08
    ? `<span class="gbar__notch" style="left:${(1 / Math.max(pct, 1)) * 100}%"></span>`
    : '';

  return `<div class="gbar gbar--${cls}" data-state="${state_}">
    <div class="gbar__top"><span>${label}</span>
      <b>${Math.round(value)}${unit}${target ? ` <i>/ ${Math.round(target)}${unit}</i>` : ''}</b></div>
    <div class="gbar__track">
      <div class="gbar__fill" style="width:${Math.min(pct, 1) * 100}%"></div>${notch}
    </div>
  </div>`;
}

function planCard(plan, index, goal) {
  const t = plan.totals;
  const many = state.location === 'all';
  const rows = plan.items.map(i => `
    <li><button class="row" data-detail="${esc(i.recipe_id)}">
      <span class="row__id">
        <b>${esc(i.name)}</b>
        <span>${esc([i.serving_size || i.portion, many ? i._station : i._stationName]
          .filter(Boolean).join(' · '))}</span>
      </span>
      <span class="row__cal">${Math.round(i.calories)}<small> cal</small></span>
    </button></li>`).join('');

  return `<article class="panel">
    <div class="panel__row">
      <h3>Option ${index + 1}</h3>
      <span class="panel__meta">${Math.round(t.cal)} cal · ${Math.round(t.p)}g protein</span>
    </div>
    <ul class="rows">${rows}</ul>
    <div class="bars">
      ${goalBar('Calories', t.cal, goal.calories, '', 'cal')}
      ${goalBar('Protein', t.p, goal.protein, 'g', 'protein')}
      ${goal.maxCarbs ? goalBar('Carbs', t.c, goal.maxCarbs, 'g', 'carb', true) : ''}
      ${goal.maxFat ? goalBar('Fat', t.f, goal.maxFat, 'g', 'fat', true) : ''}
    </div>
    <button class="btn btn--primary btn--block" data-useplan="${index}">Put this on my plate</button>
  </article>`;
}

function renderBuild() {
  const goal = activeGoal();
  const constraints = [
    ...[...state.diets].map(titleCase),
    ...[...state.without].map(a => `No ${titleCase(a)}`),
  ];

  const head = `
    <div class="panel">
      <div class="panel__row">
        <div>
          <h2>Build a meal</h2>
          <p>${esc(state.meal)} · ${esc(shortDay(state.date))}</p>
        </div>
        <button class="btn btn--ghost btn--sm" id="editGoals">
          <svg class="gi" aria-hidden="true"><use href="#ic-target"/></svg>
          <span>${goal.isDefault ? 'Set targets' : 'Targets'}</span></button>
      </div>
      <div class="targets">
        <div class="target"><b>${goal.calories}</b><span>calories</span></div>
        <div class="target"><b>${goal.protein}g</b><span>protein min</span></div>
        ${goal.maxCarbs ? `<div class="target"><b>${goal.maxCarbs}g</b><span>carbs max</span></div>` : ''}
        ${goal.maxFat ? `<div class="target"><b>${goal.maxFat}g</b><span>fat max</span></div>` : ''}
      </div>
      ${constraints.length
        ? `<p class="hint">Only using: ${esc(constraints.join(' · '))}</p>` : ''}
      ${goal.isDefault
        ? `<p class="hint">These are defaults. Tap <b>Set targets</b> to use your own.</p>` : ''}
      <button class="btn btn--primary btn--block" id="runBuild">
        ${state.plans ? 'Build again' : 'Build my meal'}</button>
    </div>`;

  let body = '';
  if (state.planning) {
    body = `<div class="empty" aria-busy="true"><h2>Working…</h2><p>Trying combinations against your targets.</p></div>`;
  } else if (state.planError) {
    body = emptyState('Needs a connection',
      `Building fetches ${esc(state.meal.toLowerCase())} for this day, and there is no saved copy
       of it on the phone.`, `<button class="btn btn--ghost" id="retryBuild">Try again</button>`, 'warn');
  } else if (state.plans && !state.plans.length) {
    body = emptyState('No combination fits',
      `Nothing on this menu can be combined into ${goal.calories} cal with ${goal.protein}g of
       protein under the filters you have set. Try raising the calorie target, lowering the
       protein floor, or switching to <em>All halls</em>.`, '', 'target');
  } else if (state.plans) {
    body = `<div class="plans">${state.plans.map((p, i) => planCard(p, i, goal)).join('')}</div>`;
  } else {
    body = emptyState('Ready when you are',
      `Suggestions come from what is actually on ${esc(state.meal.toLowerCase())} this day, and
       respect the diet and allergen filters you set under Browse.`, '', 'build');
  }
  $('#buildView').innerHTML = head + body;
}

async function runBuild() {
  state.planning = true; renderBuild();
  // Menu for the current day/meal/hall, fetched fresh so Build does not depend
  // on whether Browse happens to be showing a search right now.
  state.planError = false;
  const p = new URLSearchParams({ date: state.date, meal: state.meal, location: state.location });
  let menu;
  try { menu = await api('/api/menu', p.toString()); }
  catch { state.planning = false; state.plans = null; state.planError = true; renderBuild(); return; }
  const pool = buildPool(menu);
  state.plans = buildPlans(pool, activeGoal());
  state.plans.forEach(pl => pl.items.forEach(i => state.items.set(i.recipe_id, i)));
  state.planning = false;
  renderBuild();
}

/* -------------------------------------------------------------- plate view */

/** "Thu, Sep 24" -- short enough to sit on one line under a heading. */
const shortDay = date => new Date(date + 'T12:00:00').toLocaleDateString(undefined,
  { weekday: 'short', month: 'short', day: 'numeric' });

function focusMeal(meal) {
  const m = CSS.escape(meal);
  $(`#plateView [data-meal-toggle="${m}"], #plateView [data-meal-browse="${m}"]`)?.focus();
}

/** One meal as a collapsible row: the summary is always visible, the items
    only when you open it.

    A day used to render as one flat run of every item eaten, which answered
    "how many calories" and nothing else -- you could not see that four of them
    were breakfast. Meals are the unit people think in, so they are the unit on
    screen, and an unopened meal costs one line instead of six. */
function mealSection(meal) {
  const rows = plateFor(meal);
  const t = totals(meal);
  const goal = activeGoal();
  const open = state.openMeals.has(meal);
  const flagged = rows.filter(i => i.implausible).length;

  if (!rows.length) {
    // An empty meal is a way in, not a dead row: it takes you to that menu.
    const served = state.meta.locations.some(l => count(meal, l.id) > 0);
    return `<section class="meal meal--empty">
      <button class="meal__head" data-meal-browse="${esc(meal)}" ${served ? '' : 'disabled'}>
        <span class="meal__name">${esc(meal)}</span>
        <span class="meal__sum">${served ? 'Add from the menu' : 'Not served this day'}</span>
        ${served ? '<svg class="gi" aria-hidden="true"><use href="#ic-plus"/></svg>' : ''}
      </button>
    </section>`;
  }

  const summary = `${Math.round(t.cal).toLocaleString()} cal · ${Math.round(t.p)}g protein`;

  return `<section class="meal">
    <button class="meal__head" data-meal-toggle="${esc(meal)}" aria-expanded="${open}">
      <span class="meal__name">${esc(meal)}</span>
      <span class="meal__sum">${summary}</span>
      <span class="meal__count" aria-label="${rows.length} item${rows.length === 1 ? '' : 's'}">${rows.length}</span>
      <svg class="gi" aria-hidden="true"><use href="#ic-chevron"/></svg>
    </button>

    ${open ? `<div class="meal__body">
      <ul class="rows">${rows.map(i => `
        <li class="row">
          <div class="row__id"><b>${esc(i.name)}</b><span>${esc(i.serving || '')}</span></div>
          <span class="row__cal">${Math.round(i.calories)}<small> cal</small></span>
          <button class="remove" data-remove="${esc(i.recipe_id)}" data-from="${esc(meal)}"
                  aria-label="Remove ${esc(i.name)}"><svg class="gi" aria-hidden="true"><use href="#ic-close"/></svg></button>
        </li>`).join('')}</ul>

      <div class="bars">
        ${goalBar('Calories', t.cal, goal.calories, '', 'cal')}
        ${goalBar('Protein', t.p, goal.protein, 'g', 'protein')}
        ${goal.maxCarbs ? goalBar('Carbs', t.c, goal.maxCarbs, 'g', 'carb', true) : ''}
        ${goal.maxFat ? goalBar('Fat', t.f, goal.maxFat, 'g', 'fat', true) : ''}
      </div>

      ${flagged ? `<div class="notice"><svg class="gi" aria-hidden="true"><use href="#ic-warn"/></svg><span>${flagged} item${
        flagged === 1 ? ' has a label that fails' : 's have labels that fail'} the plausibility
        check, so this meal's total is probably too high.</span></div>` : ''}

      <div class="meal__foot">
        <button class="linkbtn" data-meal-browse="${esc(meal)}">Add more</button>
        <button class="linkbtn linkbtn--quiet" data-clear-meal="${esc(meal)}">Clear ${esc(meal.toLowerCase())}</button>
      </div>
    </div>` : ''}
  </section>`;
}

function renderPlateView() {
  const day = totals();
  const n = allPlated().length;
  const dayLabel = shortDay(state.date);

  if (!n) {
    $('#plateView').innerHTML = `
      <div class="panel">
        <div class="panel__row">
          <div><h2>Nothing logged</h2><p>${esc(dayLabel)}</p></div>
          <button class="btn btn--ghost btn--sm" id="editGoals2">
            <svg class="gi" aria-hidden="true"><use href="#ic-target"/></svg><span>Targets</span></button>
        </div>
        <p class="hint">Tap + on anything in Browse, or let Build put a meal together.
          Each meal is tracked on its own.</p>
      </div>
      <div class="meals">${state.meta.meals.map(mealSection).join('')}</div>`;
    return;
  }

  // The day is the sum of its meals, so it is reported as a number rather than
  // as a bar: the targets are per meal, and three of them is not a day's goal.
  $('#plateView').innerHTML = `
    <div class="panel">
      <div class="panel__row">
        <div><h2>${Math.round(day.cal).toLocaleString()} cal</h2>
          <p>${n} item${n === 1 ? '' : 's'} · ${esc(dayLabel)}</p></div>
        <button class="btn btn--ghost btn--sm" id="editGoals2">
          <svg class="gi" aria-hidden="true"><use href="#ic-target"/></svg><span>Targets</span></button>
      </div>
      <div class="daymacros">
        <div class="daymacro macro--protein"><span class="macro__dot" aria-hidden="true"></span>
          <b>${Math.round(day.p)}g</b><span>Protein</span></div>
        <div class="daymacro macro--carbs"><span class="macro__dot" aria-hidden="true"></span>
          <b>${Math.round(day.c)}g</b><span>Carbs</span></div>
        <div class="daymacro macro--fat"><span class="macro__dot" aria-hidden="true"></span>
          <b>${Math.round(day.f)}g</b><span>Fat</span></div>
      </div>
    </div>
    <div class="meals">${state.meta.meals.map(mealSection).join('')}</div>`;
}

const render = () => (filtersActive() ? loadSearch() : loadMenu());

function applyFilters() {
  syncInputs();
  renderActiveFilters();
  render();
}

function syncGoalInputs() {
  $('#gCalories').value = state.goals.calories;
  $('#gProtein').value = state.goals.protein;
  $('#gCarbs').value = state.goals.maxCarbs;
  $('#gFat').value = state.goals.maxFat;
}

/* --------------------------------------------------------- selection */

function selectDate(date) {
  if (date === state.date) return;
  state.date = date;
  state.collapsed.clear();
  renderDates(); renderMeals(); renderHalls(); loadPlate(); render();
  rebuildIfShowing();
}

/** Plans were built for one day and meal; a different one needs new plans. */
function rebuildIfShowing() {
  state.plans = null;
  if (state.tab === 'build') runBuild();
}

function selectMeal(meal) {
  if (meal === state.meal) return;
  state.meal = meal;
  state.collapsed.clear();
  renderMeals(); renderHalls(); render();
  rebuildIfShowing();
}

/* ------------------------------------------------------------- sheets */

let sheetOpener = null;

/** <dialog> already gives modality, the top layer, Escape and a focus trap.
    What it does not do is put focus back where it came from. */
function openSheet(el) {
  sheetOpener = document.activeElement;
  el.showModal();
}

function closeSheet(el) {
  el.close();
  if (sheetOpener?.isConnected) sheetOpener.focus();
  sheetOpener = null;
}

function bindSheet(el) {
  el.addEventListener('click', e => {
    // The backdrop is the dialog element itself; a click on it should dismiss.
    if (e.target === el || e.target.closest('[data-close]')) closeSheet(el);
  });
  el.addEventListener('cancel', e => { e.preventDefault(); closeSheet(el); });
}

/* ---------------------------------------------------- announce + toast */

/** Screen-reader announcement. Re-setting identical text does not re-announce,
    so a space is appended when the message repeats. */
function announce(msg) {
  const el = $('#live');
  el.textContent = el.textContent === msg ? msg + ' ' : msg;
}

let toastTimer = null;
let toastUndo = null;

/** A short confirmation with a way back. Adding to a plate is one tap and
    easy to do by accident on a phone, so it is undoable rather than silent. */
function toast(msg, undo) {
  const el = $('#toast');
  $('#toastMsg').textContent = msg;
  toastUndo = undo || null;
  $('#toastUndo').hidden = !undo;
  el.hidden = false;
  announce(msg);
  clearTimeout(toastTimer);
  toastTimer = setTimeout(hideToast, 4200);
}

function hideToast() {
  $('#toast').hidden = true;
  toastUndo = null;
}

const openGoals = () => { syncGoalInputs(); $('#goalSheet').showModal(); };


function syncInputs() {
  $('#fMinProtein').value = state.minProtein;
  $('#fMaxCalories').value = state.maxCalories;
  $('#fSort').value = state.sort;
  $('#fScope').value = state.scope;
  $('#fIncludeUnknown').checked = state.includeUnknown;
  $('#fHideImplausible').checked = state.hideImplausible;
  $('#search').value = state.q;
  $('#searchClear').hidden = !state.q;
  $$('#allergenChips [data-value]').forEach(c =>
    c.setAttribute('aria-pressed', String(state.without.has(c.dataset.value))));
  $$('#dietChips [data-value]').forEach(c =>
    c.setAttribute('aria-pressed', String(state.diets.has(c.dataset.value))));
}

function clearSearch() {
  state.q = '';
  applyFilters();
}


/* ------------------------------------------------------------------- plate */

const plateKey = () => `dining.plate.${state.date}`;

/** A day's plates, one bucket per meal: { Breakfast: [...], Lunch: [...] }.

    A single flat list per day could not answer "what did I have at lunch",
    which is the question the tracker exists for, and it made a day of eating
    render as one undifferentiated run of items. */
const emptyDay = () => Object.fromEntries(state.meta.meals.map(m => [m, []]));

function loadPlate() {
  let stored = null;
  try { stored = JSON.parse(localStorage.getItem(plateKey()) || 'null'); } catch {}

  state.plates = emptyDay();
  if (Array.isArray(stored)) {
    // Days saved before plates were split by meal. They were built while
    // looking at some meal's menu, and the one on screen now is the best guess
    // available -- better than dropping someone's day on the floor.
    state.plates[state.meal] = stored;
  } else if (stored && typeof stored === 'object') {
    state.meta.meals.forEach(m => {
      if (Array.isArray(stored[m])) state.plates[m] = stored[m];
    });
  }
  // Open the meal being browsed, so the tracker lands on the one you are
  // most likely to be editing rather than three closed rows.
  state.openMeals = new Set([state.meal]);
  renderPlate();
}

function savePlate() {
  try { localStorage.setItem(plateKey(), JSON.stringify(state.plates)); } catch {}
  renderPlate();
}

/** The plate for one meal, or for the meal being browsed. */
const plateFor = (meal = state.meal) => (state.plates[meal] ||= []);

/** Every item across the day, in meal order. */
const allPlated = () => state.meta.meals.flatMap(m => plateFor(m));

/** Totals for one meal, or for the whole day when passed nothing. */
function totals(meal) {
  const rows = meal === undefined ? allPlated() : plateFor(meal);
  return rows.reduce((t, i) => ({
    cal: t.cal + (i.calories || 0), p: t.p + (i.protein || 0),
    c: t.c + (i.carbs || 0), f: t.f + (i.fat || 0),
  }), { cal: 0, p: 0, c: 0, f: 0 });
}

/* The FDA's own reference intake, the one every printed label is built on.
   It is a yardstick, not a goal we invented for the user. */
const CAL_REFERENCE = 2000;

/* The meal you are building, above the menu you are building it from.

   The tab bar already carries the day's total, so this is the other number: how
   far into this meal's target you are, which is the one that changes what you
   pick next. One line and a bar; tapping it opens the plate. Nothing at all
   when the meal is empty. */
function renderHero() {
  const n = plateFor().length;
  if (!n) { $('#hero').innerHTML = ''; return; }
  const t = totals(state.meal), goal = activeGoal();
  const pct = Math.min(t.cal / goal.calories, 1);
  const over = t.cal > goal.calories;
  $('#hero').innerHTML = `
    <button class="mealstrip" data-tab-go="plate" data-state="${over ? 'over' : 'ok'}">
      <span class="mealstrip__row">
        <span class="mealstrip__meal">${esc(state.meal)} plate</span>
        <span class="mealstrip__cal"><b>${Math.round(t.cal).toLocaleString()}</b>
          of ${goal.calories.toLocaleString()} cal</span>
        <svg class="gi" aria-hidden="true"><use href="#ic-right"/></svg>
      </span>
      <span class="mealstrip__track" aria-hidden="true">
        <span class="mealstrip__fill" style="width:${(pct * 100).toFixed(1)}%"></span></span>
      <span class="sr">${n} item${n === 1 ? '' : 's'}, ${Math.round(t.p)} grams protein. Open plate.</span>
    </button>`;
}

function renderPlate() {
  const n = allPlated().length;
  const cal = Math.round(totals().cal);
  const badge = $('#plateBadge');
  badge.hidden = !n;
  badge.textContent = n;
  // The tab carries the running total, so the number you care about is visible
  // without opening the tab that holds it.
  $('#plateCal').textContent = n ? `${cal.toLocaleString()} cal` : '';
  renderHero();
  if (state.tab === 'plate') renderPlateView();

  $$('#content [data-add]').forEach(btn => {
    const on = plateFor().some(p => p.recipe_id === btn.dataset.add);
    btn.setAttribute('aria-pressed', String(on));
    btn.querySelector('use').setAttribute('href', on ? '#ic-check' : '#ic-plus');
    const name = btn.getAttribute('aria-label').replace(/^(Add|Remove) /, '')
      .replace(/ (to|from) plate$/, '');
    btn.setAttribute('aria-label', `${on ? 'Remove' : 'Add'} ${name} ${on ? 'from' : 'to'} plate`);
  });
}

/** Add to, or remove from, the meal currently being browsed. */
/** Toggle from the browse list, with a confirmation and a way back. */
function addOrRemove(recipeId, meal = state.meal) {
  const item = state.items.get(recipeId);
  const was = plateFor(meal).some(p => p.recipe_id === recipeId);
  togglePlate(recipeId, meal);
  const name = item?.name || 'Item';
  if (was) {
    toast(`Removed ${name}`, () => { togglePlate(recipeId, meal); render(); });
  } else {
    toast(`Added ${name} to ${meal}`, () => { togglePlate(recipeId, meal); render(); });
  }
}

function togglePlate(recipeId, meal = state.meal) {
  const plate = plateFor(meal);
  const at = plate.findIndex(p => p.recipe_id === recipeId);
  if (at >= 0) { plate.splice(at, 1); savePlate(); return; }
  const item = state.items.get(recipeId);
  if (!item) return;
  plate.push({
    recipe_id: recipeId, name: item.name, serving: item.serving_size,
    calories: item.calories || 0, protein: item.nutrients.protein_g || 0,
    carbs: item.nutrients.total_carbs_g || 0, fat: item.nutrients.total_fat_g || 0,
    implausible: item.label_implausible,
  });
  savePlate();
}


/* ------------------------------------------------------------------- stats */

async function openStats() {
  showSheetLoading('About this data');
  let d;
  try { d = await api('/api/stats'); }
  catch {
    showSheet(sheetHead('About this data') + `<div class="sheet__content">
      <p class="muted">This needs a connection.</p></div>`);
    return;
  }
  const pct = x => {
    const v = x / d.recipes * 100;
    return v > 0 && v < 1 ? '<1%' : `${v.toFixed(0)}%`;
  };
  const updated = d.last_fetched
    ? new Date(d.last_fetched).toLocaleDateString(undefined,
        { weekday: 'short', month: 'short', day: 'numeric' })
    : null;

  const row = (label, value, note) => `<tr><th scope="row">${label}</th>
    <td>${value}${note ? ` <span class="none">${note}</span>` : ''}</td></tr>`;

  const byHall = {};
  d.per_meal.forEach(r => (byHall[r.location_name] ||= {})[r.meal] = r.n);
  const meals = state.meta.meals;

  showSheet(`
    ${sheetHead('About this data', 'Where these numbers come from')}
    <div class="sheet__content">
      <p class="muted">Menus and nutrition labels are copied from the university's published
        dining site${updated ? `, most recently on ${esc(updated)}` : ''}. They refresh every
        morning. What the hall actually serves can differ from what it posted.</p>

      <div class="targets">
        <div class="target"><b>${d.days}</b><span>days of menus</span></div>
        <div class="target"><b>${d.recipes.toLocaleString()}</b><span>recipes</span></div>
      </div>
      <p class="hint">${esc(shortDate(d.first_date))} to ${esc(shortDate(d.last_date))}</p>

      <h3 class="sheet__h3">What the halls did not publish</h3>
      <table class="nutrients"><tbody>
        ${row('No allergen information', d.without_allergen_data.toLocaleString(), pct(d.without_allergen_data))}
        ${row('No nutrition label', d.without_nutrition.toLocaleString(), pct(d.without_nutrition))}
      </tbody></table>
      <p class="hint">When a hall publishes no allergen information, the app says so rather than
        showing the item as allergen-free.</p>

      <h3 class="sheet__h3">Labels that look wrong</h3>
      <table class="nutrients"><tbody>
        ${row('Whole batch listed as one serving', d.label_implausible, pct(d.label_implausible))}
        ${row('Macros do not match calories', d.nutrition_suspect, pct(d.nutrition_suspect))}
      </tbody></table>
      <p class="hint">These items carry a <b>Check label</b> tag and sort last by protein. Their
        numbers are shown exactly as published.</p>

      <h3 class="sheet__h3">Items per hall</h3>
      <table class="nutrients nutrients--grid">
        <thead><tr><th scope="col">Hall</th>${meals.map(mm =>
          `<th scope="col">${esc(mm)}</th>`).join('')}</tr></thead>
        <tbody>${Object.entries(byHall).map(([hall, per]) => `<tr>
          <th scope="row">${esc(hall)}</th>
          ${meals.map(mm => `<td>${per[mm] ? per[mm].toLocaleString() : '<span class="none">—</span>'}</td>`).join('')}
        </tr>`).join('')}</tbody>
      </table>
    </div>`);
}

/* ------------------------------------------------------------------- sheet */

function showSheet(html) {
  const sheet = $('#sheet');
  sheet.innerHTML = `<div class="sheet__body">${html}</div>`;
  // Through openSheet, so this one also returns focus to whatever opened it.
  if (!sheet.open) openSheet(sheet);
}

/** Put the sheet up immediately with a placeholder, then fill it.

    Both of these fetch before they can render, and on a remote database that
    is a few hundred milliseconds of the button appearing to do nothing. */
function showSheetLoading(title) {
  showSheet(`${sheetHead(title)}
    <div class="sheet__content" aria-busy="true">
      <span class="sk__line sk__line--name"></span>
      <span class="sk__line sk__line--sub"></span>
      <span class="sk__block"></span>
      <span class="sk__block"></span>
    </div>`);
}

/* ------------------------------------------------------------ detail sheet */

/** Rows nested under another on a printed label. Indenting them is what makes
    "Saturated fat 3.6g" read as part of the fat, not a fifth macro. */
const LABEL_DEPTH = {
  saturated_fat_g: 1, trans_fat_g: 1,
  dietary_fiber_g: 1, soluble_fiber_g: 2, insoluble_fiber_g: 2,
  total_sugars_g: 1, added_sugars_g: 2,
};
/** The rows a printed label sets in bold. */
const LABEL_BOLD = new Set(['total_fat_g', 'cholesterol_mg', 'sodium_mg',
                            'total_carbs_g', 'protein_g']);

/** A label figure: whole milligrams, grams to one place, and "0g" rather than
    "0.0g" -- a trailing zero is precision the source never had. */
function labelValue(v, unit) {
  if (v == null) return null;
  if (unit !== 'g') return `${Math.round(v).toLocaleString()}${unit}`;
  const r = Math.round(v * 10) / 10;
  return `${Number.isInteger(r) ? r : r.toFixed(1)}${unit}`;
}

const shortDate = iso => parseDay(iso).toLocaleDateString(undefined,
  { weekday: 'short', month: 'short', day: 'numeric' });

function sheetHead(title, subtitle) {
  return `
    <div class="sheet__grip" aria-hidden="true"></div>
    <div class="sheet__head">
      <div class="sheet__titles"><h2 id="sheetTitle">${esc(title)}</h2>
        ${subtitle ? `<p>${esc(subtitle)}</p>` : ''}</div>
      <button class="iconbtn" data-close aria-label="Close">
        <svg class="gi" aria-hidden="true"><use href="#ic-close"/></svg></button>
    </div>`;
}

function addButton(recipeId, name, on) {
  const meal = esc(state.meal.toLowerCase());
  return `<button class="btn btn--block ${on ? 'btn--ghost' : 'btn--primary'}"
      data-add="${esc(recipeId)}">
      <svg class="gi" aria-hidden="true"><use href="#ic-${on ? 'close' : 'plus'}"/></svg>
      <span>${on ? `Remove from ${meal}` : `Add to ${meal}`}</span>
    </button>`;
}

async function openDetail(recipeId) {
  showSheetLoading(state.items.get(recipeId)?.name || 'Item');
  let item;
  try {
    item = await api('/api/item', new URLSearchParams({ id: recipeId }).toString());
  } catch {
    showSheet(sheetHead('Not available offline') + `<div class="sheet__content">
      <p class="muted">The full label is fetched when you open it, and this one has not been
      opened while connected.</p></div>`);
    return;
  }
  if (item.error) {
    showSheet(sheetHead('Item not found') + `<div class="sheet__content">
      <p class="muted">This recipe is no longer on any stored menu.</p></div>`);
    return;
  }
  state.items.set(item.recipe_id, { ...state.items.get(item.recipe_id), ...item });

  const n = item.nutrients;
  const cal = item.calories == null ? '–' : Math.round(item.calories);

  const warn = item.label_implausible
    ? `<div class="notice"><svg class="gi" aria-hidden="true"><use href="#ic-warn"/></svg>
        <span>This label reads as a whole batch, not one serving${item.serving_size
          ? ` — ${Math.round(item.calories)} cal for ${esc(item.serving_size)}` : ''}.
        Check the card posted at the station.</span></div>`
    : item.nutrition_suspect
    ? `<div class="notice"><svg class="gi" aria-hidden="true"><use href="#ic-warn"/></svg>
        <span>The macros on this label do not add up to its calories, so one of them is
        wrong.</span></div>` : '';

  // Allergens: the union of two sources, then what each source actually said.
  let allergens;
  if (!item.allergen_data_published) {
    allergens = `<span class="pill pill--unknown">No allergen data published</span>`;
  } else if (item.allergens.length) {
    allergens = item.allergens.map(a =>
      `<span class="pill pill--allergen">${esc(titleCase(a))}</span>`).join('');
  } else {
    allergens = `<span class="pill pill--allergen">None listed</span>`;
  }
  const diets = item.diets.map(d => `<span class="pill pill--diet">${esc(titleCase(d))}</span>`).join('');
  // The menu's icons carry diets too, which are already shown as pills; only
  // the allergen ones are a second opinion on the label.
  const icons = [...new Set(item.served_at.flatMap(s => s.menu_tags || [])
    .filter(t => /^contains /i.test(t))
    .map(t => titleCase(t.replace(/^contains /i, '').replace(/_/g, ' '))))].sort();
  const sources = [
    item.allergens_as_published?.length
      ? `<li><span>Label</span>${esc(item.allergens_as_published.join(', '))}</li>` : '',
    icons.length ? `<li><span>Menu icons</span>${esc(icons.join(', '))}</li>` : '',
  ].join('');

  const rows = NUTRIENTS.map(([key, label, unit]) => {
    const v = labelValue(n[key], unit);
    const depth = LABEL_DEPTH[key] || 0;
    return `<tr class="depth-${depth}${LABEL_BOLD.has(key) ? ' is-bold' : ''}">
      <th scope="row">${label}</th>
      <td>${v == null ? '<span class="none">Not listed</span>' : v}</td></tr>`;
  }).join('');

  const served = item.served_at.slice(0, 8).map(s => `<li>
      <b>${esc(shortDate(s.date))}</b>
      <span>${esc(s.meal)} · ${esc(s.location_name)}${s.station ? ` · ${esc(s.station)}` : ''}</span>
    </li>`).join('');
  const moreServed = item.served_at.length > 8
    ? `<p class="hint">and ${item.served_at.length - 8} more times this week.</p>` : '';

  const on = plateFor().some(p => p.recipe_id === item.recipe_id);

  showSheet(`
    ${sheetHead(item.name, item.serving_size || 'Serving size not listed')}
    <div class="sheet__content">
      ${warn}
      <div class="detail__lead">
        <p class="detail__cal"><b>${cal}</b><span>calories</span></p>
        ${macroRow(item)}
      </div>

      <h3 class="sheet__h3">Allergens &amp; diet</h3>
      <div class="chiprow">${allergens}${diets}</div>
      ${sources ? `<ul class="sources">${sources}</ul>` : ''}
      ${!item.allergen_data_published ? `<p class="hint">Nothing published is not the same
        as nothing in it. Ask at the station if you have an allergy.</p>` : ''}

      <h3 class="sheet__h3">Nutrition facts</h3>
      <table class="nutrients">
        <caption class="sr">Nutrition facts per ${esc(item.serving_size || 'serving')}</caption>
        <tbody>
          <tr class="depth-0 is-bold is-cal"><th scope="row">Calories</th><td>${cal}</td></tr>
          ${rows}
        </tbody>
      </table>

      ${served ? `<h3 class="sheet__h3">Served this week</h3>
        <ul class="served">${served}</ul>${moreServed}` : ''}

      ${item.ingredients ? `<h3 class="sheet__h3">Ingredients</h3>
        <p class="ingredients">${esc(item.ingredients)}</p>` : ''}

      <p class="detail__source">
        ${item.source_url ? `<a class="linkbtn" href="${esc(item.source_url)}" target="_blank"
            rel="noopener">View the official label<span class="sr"> (opens in a new tab)</span></a>` : ''}
        ${item.fetched_at ? `<span>Checked ${esc(new Date(item.fetched_at).toLocaleDateString(
            undefined, { month: 'short', day: 'numeric' }))}</span>` : ''}
      </p>
    </div>
    <div class="sheet__foot">${addButton(item.recipe_id, item.name, on)}</div>`);
}

/* ------------------------------------------------------------------ wiring */

function bind() {
  $('.tabbar').addEventListener('click', e => {
    const b = e.target.closest('[data-tab]');
    if (b) setTab(b.dataset.tab);
  });

  addEventListener('popstate', () => setTab(location.hash.replace('#', '') || 'browse', true));

  $('#buildView').addEventListener('click', e => {
    if (e.target.closest('#runBuild, #retryBuild')) return runBuild();
    if (e.target.closest('#editGoals')) return openGoals();
    const use = e.target.closest('[data-useplan]');
    if (use) {
      const plan = state.plans[Number(use.dataset.useplan)];
      if (!plan) return;
      // Replace rather than append: "put this on my plate" means this meal, not
      // this meal added to whatever was already there.
      state.plates[state.meal] = [];
      plan.items.forEach(i => togglePlate(i.recipe_id, state.meal));
      state.openMeals.add(state.meal);   // land with the meal you just built open
      setTab('plate');
      return;
    }
    const row = e.target.closest('[data-detail]');
    if (row) openDetail(row.dataset.detail);
  });

  $('#plateView').addEventListener('click', e => {
    if (e.target.closest('#editGoals2')) return openGoals();

    const head = e.target.closest('[data-meal-toggle]');
    if (head) {
      const meal = head.dataset.mealToggle;
      state.openMeals.has(meal) ? state.openMeals.delete(meal) : state.openMeals.add(meal);
      renderPlateView();
      return;
    }

    const go = e.target.closest('[data-meal-browse]');
    if (go) {
      selectMeal(go.dataset.mealBrowse);
      setTab('browse');
      window.scrollTo(0, 0);
      return;
    }

    const clear = e.target.closest('[data-clear-meal]');
    if (clear) {
      const meal = clear.dataset.clearMeal;
      const before = plateFor(meal).slice();
      state.plates[meal] = [];
      savePlate(); renderPlate();
      focusMeal(meal);
      toast(`Cleared ${meal.toLowerCase()}`, () => {
        state.plates[meal] = before; savePlate(); renderPlate(); render();
      });
      return;
    }

    const rm = e.target.closest('[data-remove]');
    if (rm) {
      const meal = rm.dataset.from;
      const at = plateFor(meal).findIndex(p => p.recipe_id === rm.dataset.remove);
      const gone = plateFor(meal)[at];
      if (!gone) return;
      plateFor(meal).splice(at, 1);
      savePlate(); renderPlate();
      // The button that had focus is gone; land on the next one, or the meal.
      const next = $$(`#plateView [data-remove][data-from="${CSS.escape(meal)}"]`)[at]
        || $$(`#plateView [data-remove][data-from="${CSS.escape(meal)}"]`)[at - 1];
      next ? next.focus() : focusMeal(meal);
      toast(`Removed ${gone.name}`, () => {
        plateFor(meal).splice(at, 0, gone); savePlate(); renderPlate(); render();
      });
    }
  });

  const goalField = (sel, key) => $(sel).addEventListener('input', e => {
    state.goals[key] = e.target.value;
    saveGoals();
  });
  goalField('#gCalories', 'calories');
  goalField('#gProtein', 'protein');
  goalField('#gCarbs', 'maxCarbs');
  goalField('#gFat', 'maxFat');
  $('#goalReset').addEventListener('click', () => {
    state.goals = { calories: '', protein: '', maxCarbs: '', maxFat: '' };
    saveGoals(); syncGoalInputs();
  });
  $('#goalSheet').addEventListener('close', () => {
    // Targets changed, so anything built against the old ones is stale.
    state.plans = null;
    if (state.tab === 'build') renderBuild();
    if (state.tab === 'plate') renderPlateView();
  });

  $('#weekNav').addEventListener('click', e => {
    const b = e.target.closest('[data-week]');
    if (!b || b.disabled) return;
    const weeks = weeksAvailable();
    const next = weeks[weeks.indexOf(state.weekStart) + Number(b.dataset.week)];
    if (!next) return;
    state.weekStart = next;
    // Land on the first stored day of the week you paged into, so the menu
    // below always matches the week the header now claims to be showing.
    const day = Array.from({ length: 7 }, (_, i) => addDays(next, i))
      .find(d => state.meta.dates.includes(d));
    if (day) {
      state.date = day;
      state.collapsed.clear();
      renderDates(); renderMeals(); renderHalls(); loadPlate(); render();
    } else {
      renderDates();
    }
  });

  $('#dateStrip').addEventListener('click', e => {
    const b = e.target.closest('[data-date]');
    if (b && !b.disabled) selectDate(b.dataset.date);
  });

  $('#mealTabs').addEventListener('click', e => {
    const b = e.target.closest('[data-meal]');
    if (b && !b.disabled) selectMeal(b.dataset.meal);
  });

  let timer;
  $('#search').addEventListener('input', e => {
    state.q = e.target.value.trim();
    $('#searchClear').hidden = !state.q;
    clearTimeout(timer);
    timer = setTimeout(() => { renderActiveFilters(); render(); }, 180);
  });
  $('#searchClear').addEventListener('click', clearSearch);

  $('#filterToggle').addEventListener('click', () => openSheet($('#filterSheet')));

  $('#activeFilters').addEventListener('click', e => {
    if (e.target.closest('[data-afclear]')) return resetFilters();
    const chip = e.target.closest('[data-af]');
    if (chip) $('#activeFilters')._filters[+chip.dataset.af].clear();
  });

  $('#content').addEventListener('click', e => {
    const add = e.target.closest('[data-add]');
    if (add) { addOrRemove(add.dataset.add); return; }

    const open = e.target.closest('[data-id]');
    if (open) { openDetail(open.dataset.id); return; }

    const widen = e.target.closest('[data-widen]');
    if (widen) { state.scope = widen.dataset.widen; applyFilters(); return; }
    if (e.target.closest('[data-reset]')) { resetFilters(); return; }

    const all = e.target.closest('[data-collapseall]');
    if (all) {
      const keys = stationKeys(state.menu || { locations: [] });
      state.collapsed = all.dataset.collapseall === 'close' ? new Set(keys) : new Set();
      render();
      return;
    }

    // Toggling in place rather than re-rendering keeps the scroll position,
    // which matters on a 300-item All halls page.
    const collapse = e.target.closest('[data-collapse]');
    if (collapse) {
      const key = collapse.dataset.collapse;
      const wasOpen = !state.collapsed.has(key);
      wasOpen ? state.collapsed.add(key) : state.collapsed.delete(key);
      collapse.setAttribute('aria-expanded', String(!wasOpen));
      const list = document.getElementById(collapse.getAttribute('aria-controls'));
      if (list) list.hidden = wasOpen;
    }
  });


  $('#statsToggle').addEventListener('click', openStats);

  [$('#hallSheet'), $('#filterSheet'), $('#goalSheet'), $('#sheet')].forEach(bindSheet);

  $('#hallBtn').addEventListener('click', () => openSheet($('#hallSheet')));
  $('#hallOptions').addEventListener('click', e => {
    const b = e.target.closest('[data-loc]');
    if (!b) return;
    state.location = b.dataset.loc;
    state.collapsed.clear();
    closeSheet($('#hallSheet'));
    renderHalls(); render();
  });

  $('#toastUndo').addEventListener('click', () => {
    const fn = toastUndo;
    hideToast();
    fn?.();
  });

  /* Arrow-key navigation for the two tablists, per the WAI-ARIA pattern:
     arrows move and activate, Home/End jump to the ends, and only the selected
     tab is in the tab order so the strip is one stop, not seven. */
  const arrowNav = (container, selector, activate) => {
    container.addEventListener('keydown', e => {
      if (!['ArrowLeft', 'ArrowRight', 'Home', 'End'].includes(e.key)) return;
      const tabs = $$(selector, container).filter(b => !b.disabled);
      if (!tabs.length) return;
      const i = tabs.indexOf(document.activeElement);
      let next;
      if (e.key === 'Home') next = 0;
      else if (e.key === 'End') next = tabs.length - 1;
      else if (i < 0) next = 0;
      else next = (i + (e.key === 'ArrowRight' ? 1 : -1) + tabs.length) % tabs.length;
      e.preventDefault();
      tabs[next].focus();
      activate(tabs[next]);
    });
  };
  arrowNav($('#dateStrip'), '[data-date]', b => selectDate(b.dataset.date));
  arrowNav($('#mealTabs'), '[data-meal]', b => selectMeal(b.dataset.meal));

  $('#sheet').addEventListener('click', e => {
    const add = e.target.closest('[data-add]');
    if (!add) return;
    const id = add.dataset.add;
    addOrRemove(id);
    const on = plateFor().some(p => p.recipe_id === id);
    add.outerHTML = addButton(id, state.items.get(id)?.name || '', on);
  });

  $('#hero').addEventListener('click', e => {
    if (e.target.closest('[data-tab-go="plate"]')) {
      state.openMeals.add(state.meal);
      setTab('plate');
    }
  });

  const bindField = (sel, key, prop = 'value') => $(sel).addEventListener('input', e => {
    state[key] = prop === 'checked' ? e.target.checked : e.target.value;
    renderActiveFilters(); render();
  });
  bindField('#fMinProtein', 'minProtein');
  bindField('#fMaxCalories', 'maxCalories');
  bindField('#fSort', 'sort');
  bindField('#fScope', 'scope');
  bindField('#fIncludeUnknown', 'includeUnknown', 'checked');
  bindField('#fHideImplausible', 'hideImplausible', 'checked');

  const toggleChip = (row, set) => $(row).addEventListener('click', e => {
    const chip = e.target.closest('[data-value]');
    if (!chip) return;
    e.preventDefault();  // chips live inside the <form method="dialog">
    const v = chip.dataset.value;
    set.has(v) ? set.delete(v) : set.add(v);
    applyFilters();
  });
  toggleChip('#allergenChips', state.without);
  toggleChip('#dietChips', state.diets);

  $('#filterReset').addEventListener('click', resetFilters);

  document.addEventListener('keydown', e => {
    if (e.key === '/' && !/^(INPUT|SELECT|TEXTAREA)$/.test(document.activeElement.tagName)) {
      e.preventDefault(); $('#search').focus();
    }
  });
}

function resetFilters() {
  Object.assign(state, { q: '', minProtein: '', maxCalories: '', sort: 'name', scope: 'meal',
                         includeUnknown: false, hideImplausible: false });
  state.without.clear(); state.diets.clear();
  applyFilters();
}

async function init() {
  // The first load is the one that had no loading state at all: everything on
  // this page is drawn from /api/meta, so until it lands there was nothing to
  // look at but an empty shell and a search box. Put the skeleton up before
  // asking for anything.
  document.body.dataset.booting = '1';
  $('#content').innerHTML = skeleton();

  let meta;
  try {
    meta = await api('/api/meta');
  } catch (err) {
    document.body.dataset.booting = '0';
    $('#content').innerHTML = emptyState('Cannot reach the menu server',
      `The page loaded but <code>/api/meta</code> did not answer. If you are running
       this locally, check that <code>python3 -m dining.serve</code> is still up.`);
    return;
  }
  document.body.dataset.booting = '0';
  state.meta = meta;
  document.title = state.meta.college_name;


  const { dates, today, meals, locations } = state.meta;
  state.date = dates.includes(today) ? today : dates[0];
  state.meal = meals[0];
  state.location = locations[0].id;

  // Land on a meal that is actually being served rather than an empty Breakfast.
  const served = meals.find(m => locations.some(l => count(m, l.id) > 0));
  if (served) state.meal = served;

  $('#allergenChips').innerHTML = state.meta.allergens.map(a =>
    `<button type="button" class="chip" data-value="${a}" aria-pressed="false"><svg class="gi chip__tick" aria-hidden="true"><use href="#ic-check"/></svg>${
      esc(titleCase(a))}</button>`).join('');
  $('#dietChips').innerHTML = DIETS.map(d =>
    `<button type="button" class="chip" data-value="${d}" aria-pressed="false"><svg class="gi chip__tick" aria-hidden="true"><use href="#ic-check"/></svg>${
      titleCase(d)}</button>`).join('');

  loadGoals(); syncGoalInputs();
  renderDates(); renderMeals(); renderHalls(); bind(); loadPlate();
  renderActiveFilters(); render();
  setTab(location.hash.replace('#', '') || 'browse', true);
}

/* -------------------------------------------------------------- offline */

if ('serviceWorker' in navigator) {
  // After load, so registering never competes with the first paint.
  addEventListener('load', () => {
    navigator.serviceWorker.register('/sw.js').catch(() => {
      // No worker means no offline support, which is a degraded app, not a
      // broken one. Nothing to tell the user about.
    });
  });
}

/** True once any response this session came out of the cache rather than the
    network -- i.e. the menu on screen may be from a previous visit. */
let servingStale = false;

// The browser's own events are the fastest signal, and the only one available
// before any request has been made.
addEventListener('online', () => markOffline(false));
addEventListener('offline', () => markOffline(true));
// Events only fire on a change, so a page opened while already offline needs
// asking directly.
addEventListener('DOMContentLoaded', () => { if (!navigator.onLine) markOffline(true); });

function markOffline(on) {
  if (servingStale === on) return;
  servingStale = on;
  const bar = $('#offline');
  bar.hidden = !on;
  if (on) announce('Offline. Showing the menu from your last visit.');
}

init();
