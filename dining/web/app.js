/* Browser client for dining.serve. Vanilla, no build step. */

const $ = (sel, root = document) => root.querySelector(sel);
const $$ = (sel, root = document) => [...root.querySelectorAll(sel)];
const api = (path, params) =>
  fetch(path + (params ? '?' + params : '')).then(r => r.json());

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

/** An SVG progress ring. `pct` is 0-1; the arc starts at twelve o'clock. */
function ring(pct, cls, size, label) {
  const r = 46, c = 2 * Math.PI * r;
  const off = c * (1 - Math.max(0, Math.min(1, pct)));
  return `<svg class="ring ring--${cls}" viewBox="0 0 110 110" style="width:${size}px;height:${size}px" aria-hidden="true">
    <circle class="ring__bg" cx="55" cy="55" r="${r}"/>
    <circle class="ring__fg" cx="55" cy="55" r="${r}"
      stroke-dasharray="${c.toFixed(1)}" stroke-dashoffset="${off.toFixed(1)}"/>
  </svg>${label || ''}`;
}

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
    out.push({ ...i, _station: `${hall.location_name} · ${st.station}`,
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
  ['carbs',   'Carbs',   'total_carbs_g'],
  ['protein', 'Protein', 'protein_g'],
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
      <span class="row__id"><b>${esc(label)}</b><span>${n} item${n === 1 ? '' : 's'}</span></span>
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

const emptyState = (title, body, action = '') => `
  <div class="empty">
    <span class="empty__icon"><svg class="gi" aria-hidden="true"><use href="#ic-search"/></svg></span>
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
  const data = await api('/api/menu', p.toString());
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
      ? `<section class="hall" id="hall-${hall.location_id}"><div class="hall__head">
           <h2>${esc(hall.location_name)}</h2><span>${hall.count} items</span>
         </div>${inner}</section>`
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
  const data = await api('/api/search', searchParams());
  if (!done()) return;
  $('#content').removeAttribute('aria-busy');
  const main = $('#content');
  if (data.error) { main.innerHTML = emptyState('Bad filter', esc(data.error)); return; }

  let items = data.items;
  if (state.hideImplausible) items = items.filter(i => !i.label_implausible);
  if (!items.length) {
    main.innerHTML = emptyState('Nothing matches',
      `Nothing in ${esc(scopeText())} matches these filters. Try widening
       <em>Look across</em>, or removing a chip above.`);
    return;
  }

  const notice = data.hidden_unknown_allergens
    ? `<div class="notice"><svg class="gi" aria-hidden="true"><use href="#ic-warn"/></svg><span>Items whose allergen data was never
       published are hidden, because "nothing published" is not the same as "free of it".
       Turn on <em>Also show items with no allergen data</em> to see them.</span></div>` : '';

  main.innerHTML = notice +
    `<p class="resulthead">
       <span><strong>${items.length}</strong> item${items.length === 1 ? '' : 's'} in ${esc(scopeText())}</span>
       ${data.count > items.length ? `<span>first ${items.length} of ${data.count}</span>` : ''}
     </p>
     <div class="cards">${items.map(i => card(i, placeSummary(i))).join('')}</div>`;
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
  $('.controls').hidden = tab !== 'browse';
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
  const rows = plan.items.map(i => `
    <li class="row" data-id="${esc(i.recipe_id)}">
      <div class="row__id">
        <b>${esc(i.name)}</b>
        <span>${esc(i.serving_size || i.portion || '')} · ${esc(i._station)}</span>
      </div>
      <span class="row__cal">${Math.round(i.calories)}</span>
    </li>`).join('');

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
  const where = state.location === 'all' ? 'every hall' : hallName(state.location);
  const constraints = [
    ...[...state.diets].map(titleCase),
    ...[...state.without].map(a => `No ${titleCase(a)}`),
  ];

  const head = `
    <div class="panel">
      <div class="panel__row">
        <div>
          <h2>Build a meal</h2>
          <p>${esc(state.meal)} at ${esc(where)} · ${esc(
            new Date(state.date + 'T12:00:00').toLocaleDateString(undefined,
              { weekday: 'long', month: 'short', day: 'numeric' }))}</p>
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
        ? `<p class="hint">Using a default 700 cal / 35g protein. Tap <b>Targets</b> to change it.</p>` : ''}
      <button class="btn btn--primary btn--block" id="runBuild">
        ${state.plans ? 'Build again' : 'Build my meal'}</button>
    </div>`;

  let body = '';
  if (state.planning) {
    body = `<div class="empty"><h2>Working…</h2><p>Trying combinations against your targets.</p></div>`;
  } else if (state.plans && !state.plans.length) {
    body = emptyState('No combination fits',
      `Nothing on this menu can be combined into ${goal.calories} cal with ${goal.protein}g of
       protein under the filters you have set. Try raising the calorie target, lowering the
       protein floor, or switching to <em>All halls</em>.`);
  } else if (state.plans) {
    body = `<div class="plans">${state.plans.map((p, i) => planCard(p, i, goal)).join('')}</div>`;
  } else {
    body = `<div class="empty"><h2>Ready when you are</h2>
      <p>Pick your targets, then build. Suggestions come from what is actually on
         ${esc(state.meal.toLowerCase())} today, and respect the diet and allergen
         filters you set under Browse.</p></div>`;
  }
  $('#buildView').innerHTML = head + body;
}

async function runBuild() {
  state.planning = true; renderBuild();
  // Menu for the current day/meal/hall, fetched fresh so Build does not depend
  // on whether Browse happens to be showing a search right now.
  const p = new URLSearchParams({ date: state.date, meal: state.meal, location: state.location });
  const menu = await api('/api/menu', p.toString());
  const pool = buildPool(menu);
  state.plans = buildPlans(pool, activeGoal());
  state.plans.forEach(pl => pl.items.forEach(i => state.items.set(i.recipe_id, i)));
  state.planning = false;
  renderBuild();
}

/* -------------------------------------------------------------- plate view */

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

  const summary = rows.length
    ? `${Math.round(t.cal).toLocaleString()} cal · ${Math.round(t.p)}g protein`
    : 'Nothing added';

  return `<section class="meal ${rows.length ? '' : 'meal--empty'}">
    <button class="meal__head" data-meal-toggle="${esc(meal)}" aria-expanded="${open}"
            ${rows.length ? '' : 'disabled'}>
      <span class="meal__name">${esc(meal)}</span>
      <span class="meal__sum">${summary}</span>
      ${rows.length ? `<span class="meal__count">${rows.length}</span>
        <svg class="gi" aria-hidden="true"><use href="#ic-chevron"/></svg>` : ''}
    </button>

    ${open && rows.length ? `<div class="meal__body">
      <ul class="rows">${rows.map(i => `
        <li class="row">
          <div class="row__id"><b>${esc(i.name)}</b><span>${esc(i.serving || '')}</span></div>
          <span class="row__cal">${Math.round(i.calories)}</span>
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

      <button class="btn btn--ghost btn--block" data-clear-meal="${esc(meal)}">Clear ${esc(meal.toLowerCase())}</button>
    </div>` : ''}
  </section>`;
}

function renderPlateView() {
  const day = totals();
  const n = allPlated().length;
  const dayLabel = new Date(state.date + 'T12:00:00').toLocaleDateString(undefined,
    { weekday: 'long', month: 'short', day: 'numeric' });

  if (!n) {
    $('#plateView').innerHTML = `
      <div class="panel">
        <div class="panel__row">
          <div><h2>Nothing logged</h2><p>${esc(dayLabel)}</p></div>
          <button class="btn btn--ghost btn--sm" id="editGoals2">
            <svg class="gi" aria-hidden="true"><use href="#ic-target"/></svg><span>Targets</span></button>
        </div>
      </div>
      ${emptyState('Your day is empty',
        `Pick a meal under Browse and tap + on what you ate, or let Build put one
         together. Each meal is tracked separately.`)}
      <div class="meals">${state.meta.meals.map(mealSection).join('')}</div>`;
    return;
  }

  // The day is the sum of its meals, so it is reported as a number rather than
  // as a bar: the targets are per meal, and three of them is not a day's goal.
  $('#plateView').innerHTML = `
    <div class="panel">
      <div class="panel__row">
        <div><h2>${Math.round(day.cal).toLocaleString()} cal</h2>
          <p>${n} item${n === 1 ? '' : 's'} across the day · ${esc(dayLabel)}</p></div>
        <button class="btn btn--ghost btn--sm" id="editGoals2">
          <svg class="gi" aria-hidden="true"><use href="#ic-target"/></svg><span>Targets</span></button>
      </div>
      <div class="daymacros">
        <div class="daymacro daymacro--p"><b>${Math.round(day.p)}g</b><span>Protein</span></div>
        <div class="daymacro daymacro--c"><b>${Math.round(day.c)}g</b><span>Carbs</span></div>
        <div class="daymacro daymacro--f"><b>${Math.round(day.f)}g</b><span>Fat</span></div>
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
}

function selectMeal(meal) {
  if (meal === state.meal) return;
  state.meal = meal;
  state.collapsed.clear();
  renderMeals(); renderHalls(); render();
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

function renderHero() {
  // Scoped to the meal on screen: you are looking at breakfast, so this is
  // what breakfast currently adds up to.
  const t = totals(state.meal), n = plateFor().length;

  // An empty plate used to occupy a ring, a headline, a paragraph and three
  // empty macro tiles -- most of a phone screen of nothing, in front of the
  // food, every time the page loaded. Empty is now one line.
  // Nothing at all when the plate is empty. There is a Plate tab carrying a
  // count and a + on every card; a banner explaining both, above the food, on
  // every single load, was the app talking about itself.
  if (!n) { $('#hero').innerHTML = ''; return; }

  const macro = (cls, label, grams) =>
    `<div class="pmacro pmacro--${cls}"><b>${Math.round(grams)}g</b><span>${label}</span></div>`;

  $('#hero').innerHTML = `
    <div class="plateline">
      <div class="plateline__ring">
        ${ring(t.cal / CAL_REFERENCE, 'cal', 54)}
        <div class="plateline__center"><b>${Math.round(t.cal).toLocaleString()}</b></div>
      </div>
      <div class="plateline__text">
        <h2>${Math.round(t.cal).toLocaleString()} cal</h2>
        <p>${n} item${n === 1 ? '' : 's'} · ${Math.round(t.cal / CAL_REFERENCE * 100)}% of 2,000</p>
      </div>
      <div class="plateline__macros">
        ${macro('p', 'Protein', t.p)}${macro('c', 'Carbs', t.c)}${macro('f', 'Fat', t.f)}
      </div>
      <button class="linkbtn" id="plateClear">Clear</button>
    </div>`;
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
  const d = await api('/api/stats');
  const pct = n => `${(n / d.recipes * 100).toFixed(1)}%`;
  const fetched = d.last_fetched
    ? new Date(d.last_fetched).toLocaleString(undefined,
        { month: 'short', day: 'numeric', hour: 'numeric', minute: '2-digit' })
    : 'unknown';

  const byHall = {};
  d.per_meal.forEach(r => (byHall[r.location_name] ||= []).push(r));

  showSheet(`
    <div class="sheet__head">
      <div><h2>About this data</h2><p>Scraped from the published menus, not live</p></div>
      <button class="sheet__close" data-close><svg class="gi" aria-hidden="true"><use href="#ic-close"/></svg></button>
    </div>
    <div class="targets">
      <div class="target"><b>${d.days}</b><span>days</span></div>
      <div class="target"><b>${d.recipes.toLocaleString()}</b><span>recipes</span></div>
      <div class="target"><b>${d.menu_rows.toLocaleString()}</b><span>menu rows</span></div>
    </div>
    <p class="hint">Covering ${d.first_date} to ${d.last_date}. Labels last fetched ${esc(fetched)} —
      run <code>python3 -m dining.refresh</code> to update.</p>

    <h3>What the source did not publish</h3>
    <table class="nutrients"><tbody>
      <tr><td>No allergen data</td><td>${d.without_allergen_data} <span class="none">(${pct(d.without_allergen_data)})</span></td></tr>
      <tr><td>No nutrition at all</td><td>${d.without_nutrition} <span class="none">(${pct(d.without_nutrition)})</span></td></tr>
    </tbody></table>
    <p class="hint">An item with no allergen data is not a claim that it is free of anything.</p>

    <h3>Labels that fail a check</h3>
    <table class="nutrients"><tbody>
      <tr><td>Reads as a batch, not a serving</td><td>${d.label_implausible} <span class="none">(${pct(d.label_implausible)})</span></td></tr>
      <tr><td>Macros do not match calories</td><td>${d.nutrition_suspect} <span class="none">(${pct(d.nutrition_suspect)})</span></td></tr>
    </tbody></table>
    <p class="hint">Flagged items carry a <em>check label</em> badge and are pushed to the
      bottom of a protein sort. Their published numbers are still shown unchanged.</p>

    <h3>Menu rows per hall</h3>
    <table class="nutrients"><tbody>
      ${Object.entries(byHall).map(([hall, rows]) => `<tr><td>${esc(hall)}</td>
        <td>${rows.map(r => `${r.meal.slice(0, 1)} ${r.n}`).join(' · ')}</td></tr>`).join('')}
    </tbody></table>`);
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
  showSheet(`
    <div class="sheet__grip" aria-hidden="true"></div>
    <div class="sheet__head">
      <div><h2>${esc(title)}</h2></div>
      <button class="iconbtn" data-close aria-label="Close">
        <svg class="gi" aria-hidden="true"><use href="#ic-close"/></svg></button>
    </div>
    <div class="sheet__content" aria-busy="true">
      <span class="sk__line sk__line--name"></span>
      <span class="sk__line sk__line--sub"></span>
      <span class="sk__block"></span>
    </div>`);
}

async function openDetail(recipeId) {
  showSheetLoading(state.items.get(recipeId)?.name || 'Item');
  const item = await api('/api/item', new URLSearchParams({ id: recipeId }).toString());
  if (item.error) return;

  const rows = NUTRIENTS.map(([key, label, unit]) => {
    const v = item.nutrients[key];
    return `<tr><td>${label}</td><td${v == null ? ' class="none"' : ''}>${
      v == null ? 'not published' : num(v, 1) + unit}</td></tr>`;
  }).join('');

  // The menu-row legend is a second, independent allergen source; show what it said.
  const icons = [...new Set(item.served_at.flatMap(s => s.menu_tags || []))].sort();

  const served = item.served_at.slice(0, 12).map(s =>
    `<div><b>${s.date}</b><span>${esc(s.meal)} · ${esc(s.location_name)} · ${esc(s.station || '')}</span></div>`
  ).join('') + (item.served_at.length > 12
    ? `<div><b></b><span>+ ${item.served_at.length - 12} more this week</span></div>` : '');

  const warn = item.label_implausible
    ? `<div class="notice"><svg class="gi" aria-hidden="true"><use href="#ic-warn"/></svg><span>This label does not describe one serving.
       ${item.serving_size ? `It reports ${Math.round(item.calories)} cal for ${esc(item.serving_size)}` : ''} —
       more than real food of that weight can hold, so it is almost certainly batch-level.
       Check the card posted at the station.</span></div>`
    : item.nutrition_suspect
    ? `<div class="notice"><svg class="gi" aria-hidden="true"><use href="#ic-warn"/></svg><span>The macros on this label do not add up to its
       calorie count, so at least one of the two is wrong.</span></div>` : '';

  const inPlate = plateFor().some(p => p.recipe_id === item.recipe_id);

  showSheet(`
    <div class="sheet__head">
      <div><h2>${esc(item.name)}</h2><p>${esc(item.serving_size || 'serving size not published')}</p></div>
      <button class="sheet__close" data-close><svg class="gi" aria-hidden="true"><use href="#ic-close"/></svg></button>
    </div>
    ${warn}
    <div class="targets">
      <div class="target"><b>${item.calories == null ? '–' : Math.round(item.calories)}</b><span>calories</span></div>
      <div class="target"><b>${num(item.nutrients.protein_g, 1)}g</b><span>protein</span></div>
      <div class="target"><b>${num(item.nutrients.total_carbs_g, 1)}g</b><span>carbs</span></div>
      <div class="target"><b>${num(item.nutrients.total_fat_g, 1)}g</b><span>fat</span></div>
    </div>
    <button class="${inPlate ? 'ghostbtn' : 'primarybtn'}" data-add="${esc(item.recipe_id)}"
      data-in="${inPlate ? '1' : '0'}">${inPlate ? 'Remove from plate' : 'Add to plate'}</button>
    <h3>Allergens &amp; diet</h3>
    <div class="chipset__row">${
      item.allergen_data_published
        ? (item.allergens.length
            ? item.allergens.map(a => `<span class="tag tag--allergen">${esc(titleCase(a))}</span>`).join('')
            : '<span class="tag">none listed</span>')
        : '<span class="tag tag--unknown">nothing published — not a claim that it is free of anything</span>'
    }${item.diets.map(d => `<span class="tag tag--diet">${esc(titleCase(d))}</span>`).join('')}</div>
    ${item.allergens_as_published?.length
      ? `<p class="hint">Label page said: ${esc(item.allergens_as_published.join(', '))}</p>` : ''}
    ${icons.length
      ? `<p class="hint">Menu row icons said: ${esc(icons.join(', '))}. The label page and the
         menu icons are separate sources and they disagree often enough that both are kept —
         the chips above are the union.</p>` : ''}
    <h3>Full label</h3>
    <table class="nutrients"><tbody>${rows}</tbody></table>
    <h3>Served</h3>
    <div class="served">${served}</div>
    ${item.ingredients ? `<h3>Ingredients</h3><p class="ingredients">${esc(item.ingredients)}</p>` : ''}
    ${item.source_url ? `<h3>Source</h3><a href="${esc(item.source_url)}" target="_blank"
       rel="noopener">Published label ↗</a>` : ''}
    ${item.fetched_at ? `<p class="hint">Scraped ${esc(new Date(item.fetched_at)
       .toLocaleString(undefined, { month: 'short', day: 'numeric', hour: 'numeric',
       minute: '2-digit' }))} — the hall may have changed the recipe since.</p>` : ''}`);
}

/* ------------------------------------------------------------------ wiring */

function bind() {
  $('.tabbar').addEventListener('click', e => {
    const b = e.target.closest('[data-tab]');
    if (b) setTab(b.dataset.tab);
  });

  addEventListener('popstate', () => setTab(location.hash.replace('#', '') || 'browse', true));

  $('#buildView').addEventListener('click', e => {
    if (e.target.closest('#runBuild')) return runBuild();
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
    const row = e.target.closest('.planitem[data-id]');
    if (row) openDetail(row.dataset.id);
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

    const clear = e.target.closest('[data-clear-meal]');
    if (clear) {
      state.plates[clear.dataset.clearMeal] = [];
      savePlate(); renderPlateView();
      return;
    }

    const rm = e.target.closest('[data-remove]');
    if (rm) { togglePlate(rm.dataset.remove, rm.dataset.from); renderPlateView(); }
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
    if (e.target.closest('[data-close]') || e.target === $('#sheet')) { $('#sheet').close(); return; }
    const add = e.target.closest('[data-add]');
    if (add) {
      const added = !plateFor().some(p => p.recipe_id === add.dataset.add);
      togglePlate(add.dataset.add);
      add.dataset.in = added ? '1' : '0';
      add.className = added ? 'ghostbtn' : 'primarybtn';
      add.textContent = added ? 'Remove from plate' : 'Add to plate';
      return;
    }
    const rm = e.target.closest('[data-remove]');
    if (rm) { togglePlate(rm.dataset.remove); $('#sheet').close(); }
  });

  $('#hero').addEventListener('click', e => {
    if (e.target.closest('#plateClear')) { state.plates[state.meal] = []; savePlate(); render(); }
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
    `<button type="button" class="chip" data-value="${a}" aria-pressed="false">${
      esc(titleCase(a))}</button>`).join('');
  $('#dietChips').innerHTML = DIETS.map(d =>
    `<button type="button" class="chip chip--diet" data-value="${d}" aria-pressed="false">${
      titleCase(d)}</button>`).join('');

  loadGoals(); syncGoalInputs();
  renderDates(); renderMeals(); renderHalls(); bind(); loadPlate();
  renderActiveFilters(); render();
  setTab(location.hash.replace('#', '') || 'browse', true);
}

init();
