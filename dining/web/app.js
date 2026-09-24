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
/* FDA Daily Values (21 CFR 101.9, the 2016 label), the same figures a printed
   label's %DV column is computed from. Trans fat and total sugars have none. */
const DAILY_VALUE = {
  total_fat_g: 78, saturated_fat_g: 20, cholesterol_mg: 300, sodium_mg: 2300,
  total_carbs_g: 275, dietary_fiber_g: 28, added_sugars_g: 50, protein_g: 50,
  calcium_mg: 1300, iron_mg: 18, potassium_mg: 4700, vitamin_a_mcg: 900, vitamin_c_mg: 90,
};
const DIETS = ['vegan', 'vegetarian', 'halal'];
const SCOPE_LABEL = { meal: 'This meal only', day: 'This whole day', all: 'Every stored day' };
const SORT_LABEL = { name: 'Name', protein: 'Protein, high to low', calories: 'Calories, low to high' };
const HIGH_PROTEIN = 20;
const POPULAR = ['chicken', 'pizza', 'salad', 'eggs', 'rice', 'tofu', 'burger', 'pasta', 'soup', 'cookie'];

const state = {
  meta: null, date: null, meal: null, location: null, weekStart: null, tab: 'home',
  goals: { calories: '', protein: '', maxCarbs: '', maxFat: '',
           dayCalories: '', dayProtein: '', water: '' },
  plans: null, planning: false,
  plates: {}, openMeals: new Set(),
  q: '', scope: 'meal', minProtein: '', maxCalories: '', sort: 'name',
  without: new Set(), diets: new Set(), includeUnknown: false, hideImplausible: false,
  favOnly: false,
  items: new Map(), collapsed: new Set(), menu: null, loadToken: 0,
  favs: {}, recent: [], day: new Map(),
};

/* ------------------------------------------------------------- meal builder

   Given what a hall is serving and a target, pick a few combinations that hit
   it. This is a small knapsack with soft constraints, and the honest way to
   solve it here is search rather than arithmetic: the pool is a few hundred
   items, plates are three to five of them, and the objective (land near a
   calorie number, clear a protein floor, stay under two ceilings) has no clean
   closed form. Randomised greedy construction with restarts, then a swap pass,
   gets good plates in a few milliseconds and stays readable.                 */

const GOAL_DEFAULTS = { calories: 700, protein: 35, dayCalories: 2000, dayProtein: 100, water: 8 };

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

/** The saved diet and allergen profile, as one test. Unknown allergen data is
    not the same as free of it, so it fails while any exclusion is set. */
function fitsProfile(i) {
  if (state.diets.size && ![...state.diets].every(d => i.diets.includes(d))) return false;
  if (state.without.size) {
    if (!i.allergen_data_published) return false;
    if ([...state.without].some(a => i.allergens.includes(a))) return false;
  }
  return true;
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
    if (!fitsProfile(i)) return;
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
const titleCase = s => s.replace(/_/g, ' ').replace(/\b\w/g, c => c.toUpperCase());
const hallName = id => state.meta.locations.find(l => l.id === id)?.name || id;
/** "South Campus Dining Hall" is three words of which one says anything. */
const shortHall = name => String(name).replace(/\s+Dining Hall$/i, '');
const plural = (n, word) => `${n} ${word}${n === 1 ? '' : 's'}`;

/* ------------------------------------------------------------------- hours

   When each meal is served, from the adapter. This is what lets the app open
   on dinner at 6pm instead of on a breakfast that ended eight hours ago, and
   say whether a hall is open without anyone having to remember the schedule.
   A college with no hours configured simply gets neither.                   */

const toMin = hhmm => { const [h, m] = hhmm.split(':').map(Number); return h * 60 + m; };

function fmtTime(hhmm) {
  let [h, m] = hhmm.split(':').map(Number);
  const ap = h >= 12 && h < 24 ? 'pm' : 'am';
  h = h % 12 || 12;
  return m ? `${h}:${String(m).padStart(2, '0')}${ap}` : `${h}${ap}`;
}

/** [start, end] for a meal on a date, or null when unknown. */
function hoursFor(date, meal) {
  const H = state.meta.hours;
  if (!H || !H.weekday) return null;
  const dow = parseDay(date).getDay();
  const set = (dow === 0 || dow === 6) ? (H.weekend || H.weekday) : H.weekday;
  return set?.[meal] || null;
}

const hoursText = (date, meal) => {
  const h = hoursFor(date, meal);
  return h ? `${fmtTime(h[0])}–${fmtTime(h[1])}` : '';
};

const nowMin = () => { const d = new Date(); return d.getHours() * 60 + d.getMinutes(); };
const isToday = date => date === iso(new Date());
const served = (date, meal, loc) =>
  loc ? countOn(date, meal, loc) > 0
      : state.meta.locations.some(l => countOn(date, meal, l.id) > 0);

/** The meal that is on now, else the next one today, else the last one. Only
    meals something is actually served at count. */
function currentMeal(date) {
  const meals = state.meta.meals.filter(m => served(date, m));
  if (!meals.length) return state.meta.meals[0];
  if (!isToday(date)) return meals[0];
  const t = nowMin();
  const now = meals.find(m => { const h = hoursFor(date, m); return h && t >= toMin(h[0]) && t < toMin(h[1]); });
  if (now) return now;
  const next = meals.find(m => { const h = hoursFor(date, m); return h && t < toMin(h[0]); });
  return next || meals[meals.length - 1];
}

/** Where one hall stands right now: open, opening later, or done for the day. */
function hallStatus(loc, date) {
  if (!isToday(date) || !state.meta.hours?.weekday) return null;
  const t = nowMin();
  for (const m of state.meta.meals) {
    if (!served(date, m, loc)) continue;
    const h = hoursFor(date, m);
    if (!h) continue;
    if (t >= toMin(h[0]) && t < toMin(h[1]))
      return { open: true, meal: m, text: `Open · ${m} until ${fmtTime(h[1])}`,
               short: `Open until ${fmtTime(h[1])}` };
  }
  for (const m of state.meta.meals) {
    if (!served(date, m, loc)) continue;
    const h = hoursFor(date, m);
    if (h && t < toMin(h[0])) return { open: false, meal: m, text: `Opens ${fmtTime(h[0])} for ${m.toLowerCase()}`,
                                      short: `Opens ${fmtTime(h[0])}` };
  }
  return { open: false, meal: null, text: 'Closed for the rest of today', short: 'Closed now' };
}

/* ---------------------------------------------------------------- filtering

   One list describes every applied filter: the chips under the search box, the
   badge on the Filters button and the decision to switch from the menu view to
   a search all read from it, so they cannot drift apart. `menuOnly` marks the
   ones the grouped menu view can honour itself without a server search, and
   `quick` the ones the quick row already shows as pressed.                    */

function activeFilters() {
  const out = [];
  const set = patch => () => { Object.assign(state, patch); applyFilters(); };

  if (state.q) out.push({ label: `“${state.q}”`, isSearch: true, clear: clearSearch });
  if (state.minProtein)
    out.push({ label: `Protein ≥ ${state.minProtein}g`, quick: +state.minProtein === HIGH_PROTEIN,
               clear: set({ minProtein: '' }) });
  if (state.maxCalories)
    out.push({ label: `Calories ≤ ${state.maxCalories}`, quick: +state.maxCalories === 400,
               clear: set({ maxCalories: '' }) });
  state.diets.forEach(d => out.push({
    label: titleCase(d), quick: true, clear: () => { state.diets.delete(d); applyFilters(); } }));
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
  if (state.favOnly)
    out.push({ label: 'Favorites', menuOnly: true, quick: true, clear: set({ favOnly: false }) });
  return out;
}

/** True when the grouped menu view cannot answer on its own. */
const filtersActive = () => activeFilters().some(f => !f.menuOnly);

/** What the menu view can drop by itself, without asking the server. */
const keepInMenu = i => (!state.hideImplausible || !i.label_implausible)
  && (!state.favOnly || isFav(i.recipe_id));

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
  const where = state.location === 'all' ? 'all halls' : shortHall(hallName(state.location));
  return `${state.meal.toLowerCase()} at ${where}`;
}

/* ---------------------------------------------------------------- storage

   Everything personal lives in this browser: favorites, the diet profile,
   targets, plates and water. Every read and write is guarded, because private
   windows and full disks throw rather than return nothing.                   */

const store = {
  get(key, fallback) {
    try { const v = localStorage.getItem(key); return v == null ? fallback : JSON.parse(v); }
    catch { return fallback; }
  },
  set(key, value) { try { localStorage.setItem(key, JSON.stringify(value)); } catch {} },
};

const PROFILE_KEY = 'dining.profile';
function loadProfile() {
  const p = store.get(PROFILE_KEY, {});
  (p.diets || []).forEach(d => state.diets.add(d));
  (p.without || []).forEach(a => state.meta.allergens.includes(a) && state.without.add(a));
  state.includeUnknown = !!p.includeUnknown;
}
/** A diet or an allergy is a fact about a person, not about one visit: it
    used to reset on every reload, which for an allergy is the unsafe default. */
function saveProfile() {
  store.set(PROFILE_KEY, { diets: [...state.diets], without: [...state.without],
                           includeUnknown: state.includeUnknown });
}

/* --------------------------------------------------------------- favorites */

const FAV_KEY = 'dining.favs';
const isFav = id => Object.prototype.hasOwnProperty.call(state.favs, id);

function toggleFav(id) {
  const item = state.items.get(id);
  if (isFav(id)) {
    const was = state.favs[id];
    delete state.favs[id];
    toast(`Removed ${was.name} from favorites`, () => { state.favs[id] = was; saveFavs(); });
  } else {
    if (!item) return;
    state.favs[id] = { name: item.name, calories: item.calories,
                       protein: item.nutrients?.protein_g ?? null, added: Date.now() };
    toast(`Saved ${item.name}. Today will tell you when it is on.`);
  }
  saveFavs();
}

function saveFavs() {
  store.set(FAV_KEY, state.favs);
  syncFavButtons();
  if (state.tab === 'home') renderHome();
  if (state.favOnly && state.tab === 'browse') render();
}

function syncFavButtons() {
  $$('[data-fav]').forEach(b => {
    const on = isFav(b.dataset.fav);
    b.setAttribute('aria-pressed', String(on));
    const name = b.dataset.name || '';
    b.setAttribute('aria-label', `${on ? 'Remove' : 'Save'} ${name} ${on ? 'from' : 'to'} favorites`);
    const label = b.querySelector('.favlabel');
    if (label) label.textContent = on ? 'Saved' : 'Save';
  });
}

/* ------------------------------------------------------------------ pieces */

/* One item.

   Name and serving on the left, calories on the right, a macro line under
   them, tags last. Each macro is a coloured dot next to its own value and
   word, so the hue is reinforcement and never the only thing saying which
   macro it is. The thin bar under the macros is the same split drawn as
   calories -- where this item's energy comes from, at a glance. */
const MACROS = [
  ['protein', 'protein', 'protein_g', 4],
  ['carbs',   'carbs',   'total_carbs_g', 4],
  ['fat',     'fat',     'total_fat_g', 9],
];

function macroRow(item) {
  return `<span class="macros">${MACROS.map(([cls, label, key]) => {
    const g = item.nutrients[key];
    return `<span class="macro macro--${cls}">
      <span class="macro__dot" aria-hidden="true"></span>
      <span class="macro__val">${g == null ? '–' : Math.round(g) + 'g'}</span>
      <span class="macro__label">${label}</span>
    </span>`;
  }).join('')}</span>`;
}

/** Protein / carbs / fat as shares of their combined calories. */
function macroSplit(item) {
  const kcal = MACROS.map(([cls, , key, per]) => [cls, (item.nutrients[key] || 0) * per]);
  const total = kcal.reduce((n, [, v]) => n + v, 0);
  if (!total) return '';
  return `<span class="split" aria-hidden="true">${kcal.map(([cls, v]) =>
    v ? `<span class="split--${cls}" style="flex:${v.toFixed(1)}"></span>` : '').join('')}</span>`;
}

function tagRow(item) {
  const out = [];
  if (item.label_implausible)
    out.push(`<span class="pill pill--warn">Check label</span>`);
  else if (item.nutrition_suspect)
    out.push(`<span class="pill pill--warn">Macros off</span>`);
  else if ((item.nutrients.protein_g || 0) >= HIGH_PROTEIN)
    out.push(`<span class="pill pill--protein">High protein</span>`);
  item.diets.forEach(d => out.push(`<span class="pill pill--diet">${esc(titleCase(d))}</span>`));
  if (!item.allergen_data_published) {
    out.push(`<span class="pill pill--unknown">No allergen data</span>`);
  } else if (item.allergens.length) {
    const shown = item.allergens.slice(0, 2).map(titleCase).join(', ');
    const more = item.allergens.length > 2 ? ` +${item.allergens.length - 2}` : '';
    out.push(`<span class="pill pill--allergen">Contains ${esc(shown)}${more}</span>`);
  }
  return out.length ? `<span class="item__tags">${out.join('')}</span>` : '';
}

function favButton(id, name, cls = 'favbtn') {
  const on = isFav(id);
  return `<button class="${cls}" data-fav="${esc(id)}" data-name="${esc(name)}" aria-pressed="${on}"
      aria-label="${on ? 'Remove' : 'Save'} ${esc(name)} ${on ? 'from' : 'to'} favorites">
      <svg class="gi" aria-hidden="true"><use href="#ic-heart"/></svg></button>`;
}

function card(item, sub) {
  state.items.set(item.recipe_id, item);
  const on = plateFor().some(p => p.recipe_id === item.recipe_id);
  const cal = item.calories == null ? '–' : Math.round(item.calories);
  return `<li><article class="card item">
    <button class="item__main" data-id="${esc(item.recipe_id)}"
            aria-label="${esc(item.name)}, ${cal} calories. Full label">
      <span class="item__row">
        <span class="item__id">
          <span class="item__name">${esc(item.name)}</span>
          <span class="item__serving">${esc(sub || item.serving_size || '')}</span>
        </span>
        <span class="item__cal"><b>${cal}</b><span>cal</span></span>
      </span>
      ${macroRow(item)}
      ${macroSplit(item)}
      ${tagRow(item)}
    </button>
    <span class="item__actions">
      <button class="addbtn" data-add="${esc(item.recipe_id)}" aria-pressed="${on}"
              aria-label="${on ? 'Remove' : 'Add'} ${esc(item.name)} ${on ? 'from' : 'to'} plate">
        <svg class="gi" aria-hidden="true"><use href="#ic-${on ? 'check' : 'plus'}"/></svg>
      </button>
      ${favButton(item.recipe_id, item.name)}
    </span>
  </article></li>`;
}

/* ------------------------------------------------------------------ chrome */

function renderDates() {
  const { dates } = state.meta;
  const today = iso(new Date());
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
  const back = state.date !== today && dates.includes(today)
    ? `<button class="todaybtn" data-today>Today</button>` : '';

  $('#weekNav').innerHTML = `
    <span class="weeknav__label">
      <b>${esc(fmt(first, true))} – ${esc(fmt(last, !sameMonth))}</b>
      <span>${rel}</span></span>
    ${back}
    <button class="weeknav__arrow" data-week="-1" ${at <= 0 ? 'disabled' : ''}
            aria-label="Previous week">
      <svg class="gi" aria-hidden="true"><use href="#ic-left"/></svg></button>
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
      aria-label="${esc(full)}${d === today ? ', today' : ''}${has ? '' : ', no menu published'}">
      <span class="day__dow" aria-hidden="true">${dt.toLocaleDateString(undefined, { weekday: 'short' })}</span>
      <span class="day__num" aria-hidden="true">${dt.getDate()}</span>
      ${d === today ? '<span class="day__today" aria-hidden="true"></span>' : ''}
    </button>`;
  }).join('');
}

const prefersReducedMotion = () =>
  window.matchMedia?.('(prefers-reduced-motion: reduce)').matches ?? false;

const countOn = (date, meal, loc) => state.meta.counts[`${date}|${meal}|${loc}`] || 0;
const count = (meal, loc) => countOn(state.date, meal, loc);

/** Meals as tabs, each with its hours under it and a dot on the one being
    served right now -- the question "is lunch still on?" answered in place. */
function renderMeals() {
  const t = nowMin();
  $('#mealTabs').innerHTML = state.meta.meals.map(mm => {
    const on = served(state.date, mm);
    const sel = mm === state.meal;
    const h = hoursFor(state.date, mm);
    const live = h && isToday(state.date) && t >= toMin(h[0]) && t < toMin(h[1]);
    return `<button role="tab" data-meal="${esc(mm)}" aria-selected="${sel}"
      tabindex="${sel ? 0 : -1}" ${on ? '' : 'disabled aria-describedby="mealNone"'}>
      <span class="seg__name">${live ? '<span class="livedot" aria-hidden="true"></span>' : ''}${esc(mm)}${
        live ? '<span class="sr">, serving now</span>' : ''}</span>
      ${h ? `<span class="seg__sub">${on ? esc(hoursText(state.date, mm)) : 'Not served'}</span>` : ''}
    </button>`;
  }).join('') + '<span class="sr" id="mealNone">Nothing served at any hall</span>';
}

/** The hall lives in the top bar as a compact button and opens a sheet.

    Four halls as pills cost a whole row on a phone and hid whichever did not
    fit; a sheet shows every option at once with its count and whether it is
    open, at full tap size. */
function renderHalls() {
  const total = state.meta.locations.reduce((n, l) => n + count(state.meal, l.id), 0);
  const shown = state.location === 'all' ? total : count(state.meal, state.location);
  const name = state.location === 'all' ? 'All halls' : shortHall(hallName(state.location));
  const st = state.location === 'all' ? null : hallStatus(state.location, state.date);
  $('#hallName').textContent = name;
  $('#hallCount').textContent = shown;
  $('#hallDot').dataset.open = st ? String(st.open) : '';
  $('#hallBtn').setAttribute('aria-label',
    `Dining hall: ${name}${st ? `, ${st.text}` : ''}, ${plural(shown, 'item')} at ${state.meal.toLowerCase()}. Change`);

  const opt = (id, label, n) => {
    const s = id === 'all' ? null : hallStatus(id, state.date);
    return `<button class="row hallrow" data-loc="${esc(id)}" aria-pressed="${id === state.location}">
      <span class="hallrow__dot" data-open="${s ? s.open : ''}" aria-hidden="true"></span>
      <span class="row__id"><b>${esc(label)}</b><span>${n ? `${n} items at ${esc(state.meal.toLowerCase())}`
        : `No ${esc(state.meal.toLowerCase())}`}${s ? ` · ${esc(s.short)}` : ''}</span></span>
      ${id === state.location
        ? '<svg class="gi" aria-hidden="true"><use href="#ic-check"/></svg>' : ''}
    </button>`;
  };
  $('#hallOptions').innerHTML =
    state.meta.locations.map(l => opt(l.id, shortHall(l.name), count(state.meal, l.id))).join('') +
    opt('all', 'All halls, side by side', total);
  $('#hallSheetSub').textContent = `${state.meal} · ${shortDay(state.date)}`;
  $('#hoursNote').hidden = !state.meta.hours?.weekday;
}

/** The one-tap filters people reach for most, where the results are. */
const QUICK = [
  { id: 'fav', label: 'Favorites', icon: 'heart', on: () => state.favOnly,
    flip: () => { state.favOnly = !state.favOnly; } },
  { id: 'protein', label: 'High protein', icon: 'bolt', on: () => +state.minProtein === HIGH_PROTEIN,
    flip: () => { state.minProtein = +state.minProtein === HIGH_PROTEIN ? '' : String(HIGH_PROTEIN); } },
  ...DIETS.map(d => ({ id: d, label: titleCase(d), icon: d === 'halal' ? null : 'leaf',
    on: () => state.diets.has(d),
    flip: () => { state.diets.has(d) ? state.diets.delete(d) : state.diets.add(d); saveProfile(); } })),
  { id: 'light', label: 'Under 400 cal', icon: 'feather', on: () => +state.maxCalories === 400,
    flip: () => { state.maxCalories = +state.maxCalories === 400 ? '' : '400'; } },
];

function renderQuick() {
  $('#quickRow').innerHTML = QUICK.map(q => `<button class="qchip" data-quick="${q.id}"
      aria-pressed="${q.on()}">${q.icon
        ? `<svg class="gi" aria-hidden="true"><use href="#ic-${q.icon}"/></svg>` : ''}${esc(q.label)}</button>`).join('');
}

function renderActiveFilters() {
  const list = activeFilters();
  const bar = $('#activeFilters');
  const badge = $('#filterCount');
  const sheetFilters = list.filter(f => !f.isSearch && f.label !== 'Favorites');
  const shown = list.filter(f => !f.quick);

  badge.hidden = !sheetFilters.length;
  badge.textContent = sheetFilters.length;

  bar.hidden = !shown.length;
  bar.innerHTML = shown.map((f, i) =>
    `<button class="chip chip--remove" data-af="${i}"
       aria-label="Remove filter: ${esc(f.label)}">${esc(f.label)}
       <svg class="gi" aria-hidden="true"><use href="#ic-close"/></svg></button>`).join('') +
    (list.length > 1
      ? `<button class="linkbtn" data-afclear>Clear all</button>` : '');
  bar._filters = shown;
  renderQuick();
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
  const shown = st.items.filter(keepInMenu);
  if (!shown.length) return '';
  const open = !state.collapsed.has(key);
  const id = `st-${cssId(key)}`;
  return `<section class="station" id="${id}" data-station="${esc(key)}">
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
  const items = halls.reduce((n, h) => n + h.count, 0);
  const label = halls.length > 1
    ? `${items} items across ${halls.length} halls`
    : `${plural(items, 'item')} · ${plural(halls[0].stations.length, 'station')}`;
  return `<p class="resultline">
    <span>${label}</span>
    <button class="linkbtn" data-collapseall="${allCollapsed ? 'open' : 'close'}"
      >${allCollapsed ? 'Expand all' : 'Collapse all'}</button>
  </p>`;
}

/* The station index. On a 23-station South Campus lunch the one you want is
   usually a long scroll away; this puts every station one tap from the top,
   and highlights the one you are in so the list never feels like a maze. */
let spy = null;
function renderStationBar(data) {
  const bar = $('#stationBar');
  spy?.disconnect(); spy = null;
  if (!data || state.tab !== 'browse') { bar.hidden = true; return; }
  const many = data.locations.length > 1;
  const links = many
    ? data.locations.map(h => [`hall-${h.location_id}`, shortHall(h.location_name)])
    : data.locations[0].stations
        .filter(st => st.items.some(keepInMenu))
        .map(st => [`st-${cssId(`${data.locations[0].location_id}|${st.station}`)}`, st.station]);
  if (links.length < 2) { bar.hidden = true; return; }
  bar.innerHTML = links.map(([id, label]) =>
    `<a class="stationlink" href="#${id}" data-jump="${id}">${esc(label)}</a>`).join('');
  bar.hidden = false;
  measureTop();

  if (!('IntersectionObserver' in window)) return;
  const top = parseInt(getComputedStyle(document.documentElement).getPropertyValue('--stick')) || 0;
  spy = new IntersectionObserver(entries => {
    const visible = entries.filter(e => e.isIntersecting)
      .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top)[0];
    if (!visible) return;
    const id = visible.target.id;
    $$('.stationlink', bar).forEach(a => {
      const on = a.dataset.jump === id;
      on ? a.setAttribute('aria-current', 'true') : a.removeAttribute('aria-current');
      if (on) a.scrollIntoView({ inline: 'center', block: 'nearest',
                                 behavior: prefersReducedMotion() ? 'auto' : 'smooth' });
    });
  }, { rootMargin: `-${top + 4}px 0px -60% 0px` });
  links.forEach(([id]) => { const el = document.getElementById(id); if (el) spy.observe(el); });
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
    renderStationBar(null);
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
    renderStationBar(null);
    const hall = state.location === 'all' ? 'No hall' : shortHall(hallName(state.location));
    const other = state.meta.meals.find(m => m !== state.meal && served(state.date, m, state.location === 'all' ? null : state.location));
    main.innerHTML = emptyState(`No ${state.meal.toLowerCase()} here`,
      `${esc(hall)} has no ${esc(state.meal.toLowerCase())} menu on this date. On weekends
       South Campus and Yahentamitsi do not serve breakfast.`,
      `<div class="empty__actions">
        ${other ? `<button class="btn btn--primary" data-gomeal="${esc(other)}">See ${esc(other.toLowerCase())}</button>` : ''}
        ${state.location !== 'all' ? `<button class="btn btn--ghost" data-goloc="all">Try all halls</button>` : ''}
      </div>`, 'clock');
    return;
  }

  const many = data.locations.length > 1;
  const body = data.locations.map(hall => {
    const inner = hall.stations
      .map(st => stationSection(st, `${hall.location_id}|${st.station}`)).join('');
    if (!inner) return '';
    return many
      ? `<section class="hall" id="hall-${hall.location_id}">
           <div class="hall__head"><h2>${esc(shortHall(hall.location_name))}</h2>
             <span>${plural(hall.count, 'item')}</span></div>
           ${inner}</section>`
      : inner;
  }).join('');

  main.innerHTML = body
    ? jumpbar(data) + body
    : state.favOnly
      ? emptyState('None of your favorites here',
          `Nothing you have saved is on ${esc(state.meal.toLowerCase())} at ${esc(scopeText().split(' at ')[1])}.
           Tap the heart on any item to save it.`,
          `<button class="btn btn--ghost" data-quick="fav">Show everything</button>`, 'heart')
      : emptyState('Everything here is filtered out',
          'Every item on this menu has a label that fails the plausibility check.');
  renderStationBar(body ? data : null);
}

async function loadSearch() {
  renderStationBar(null);
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

  const items = data.items.filter(keepInMenu);
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
  const wider = state.scope === 'meal'
    ? `<button class="linkbtn" data-widen="day">Search all of today</button>` : '';

  main.innerHTML = notice +
    `<p class="resultline">
       <span><strong>${items.length}</strong> result${items.length === 1 ? '' : 's'} in ${esc(scopeText())}${
         data.count > items.length ? ` · showing ${items.length} of ${data.count}` : ''}</span>
       ${wider}
     </p>
     <ul class="cards">${items.map(i => card(i, placeSummary(i))).join('')}</ul>`;
  announce(`${items.length} result${items.length === 1 ? '' : 's'}`);
}

function placeSummary(item) {
  const halls = [...new Set(item.served_at.map(s => shortHall(s.location_name)))];
  const meals = [...new Set(item.served_at.map(s => s.meal))];
  return [item.serving_size, meals.join('/'), halls.join(', ')].filter(Boolean).join(' · ');
}

/* -------------------------------------------------------------- goals + tabs */

const GOAL_KEY = 'dining.goals';

function loadGoals() { Object.assign(state.goals, store.get(GOAL_KEY, {})); }
function saveGoals() { store.set(GOAL_KEY, state.goals); }

/** The targets as numbers, with the defaults filled in where nothing is set. */
function activeGoal() {
  const n = v => (v === '' || v == null ? 0 : Number(v));
  return {
    calories: n(state.goals.calories) || GOAL_DEFAULTS.calories,
    protein: n(state.goals.protein) || GOAL_DEFAULTS.protein,
    maxCarbs: n(state.goals.maxCarbs),
    maxFat: n(state.goals.maxFat),
    dayCalories: n(state.goals.dayCalories) || GOAL_DEFAULTS.dayCalories,
    dayProtein: n(state.goals.dayProtein) || GOAL_DEFAULTS.dayProtein,
    water: Math.min(16, n(state.goals.water) || GOAL_DEFAULTS.water),
    isDefault: !state.goals.calories && !state.goals.protein,
  };
}

const TABS = ['home', 'browse', 'build', 'plate'];

function setTab(tab, fromHash = false) {
  if (!TABS.includes(tab)) tab = 'home';
  state.tab = tab;
  if (!fromHash) {
    history.pushState({ tab }, '', tab === 'home' ? location.pathname : `#${tab}`);
  }
  $$('.tab').forEach(b => {
    const on = b.dataset.tab === tab;
    on ? b.setAttribute('aria-current', 'page') : b.removeAttribute('aria-current');
  });
  $('#homeView').hidden = tab !== 'home';
  $('#content').hidden = tab !== 'browse';
  $('#buildView').hidden = tab !== 'build';
  $('#plateView').hidden = tab !== 'plate';
  $('#hero').hidden = tab !== 'browse';
  // Search and filters act on the browse list; on the other tabs they would
  // look live and do nothing. Home keeps the search box as a way in.
  document.body.dataset.view = tab;
  renderTitle();
  hideSuggest();
  if (tab === 'home') renderHome();
  if (tab === 'browse') { renderStationBar(filtersActive() ? null : state.menu); }
  else $('#stationBar').hidden = true;
  if (tab === 'build') {
    renderBuild();
    if (!state.plans && !state.planning) runBuild();
  }
  if (tab === 'plate') renderPlateView();
  measureTop();
  window.scrollTo(0, 0);
}

function greeting() {
  const h = new Date().getHours();
  return h < 5 ? 'Late night' : h < 12 ? 'Good morning' : h < 17 ? 'Good afternoon' : 'Good evening';
}

function renderTitle() {
  if (state.tab === 'plate') {
    $('#greeting').textContent = 'Tracker';
    $('#topSub').textContent = longDay(state.date);
  } else {
    $('#greeting').textContent = greeting();
    $('#topSub').textContent = `${longDay(homeDate())} · ${state.meta?.college_name || ''}`;
  }
}

/* -------------------------------------------------------------- home view

   The first screen answers what someone opening a dining app actually wants
   to know, in order: what is open right now, whether anything they love is
   on, what is good for them this meal, and how their day is going. Every
   block is a way into the deeper screens, not a dead end.                   */

/** Home is about today; when there is no menu for today, the nearest day. */
function homeDate() {
  const { dates } = state.meta;
  const today = iso(new Date());
  if (dates.includes(today)) return today;
  return dates.find(d => d > today) || dates[dates.length - 1];
}

/** Every hall, every meal of one day, fetched once and kept. */
async function loadDay(date) {
  if (state.day.has(date)) return state.day.get(date);
  const meals = state.meta.meals.filter(m => served(date, m));
  const pairs = await Promise.all(meals.map(m =>
    api('/api/menu', new URLSearchParams({ date, meal: m, location: 'all' }).toString())
      .then(d => [m, d]).catch(() => [m, null])));
  const day = Object.fromEntries(pairs.filter(([, d]) => d));
  if (Object.keys(day).length) state.day.set(date, day);
  return day;
}

/** Flatten one meal of a day into unique items with where they are. */
function dayItems(dayMenu) {
  const seen = new Map();
  (dayMenu?.locations || []).forEach(h => h.stations.forEach(st => st.items.forEach(i => {
    const at = { hall: shortHall(h.location_name), loc: h.location_id, station: st.station };
    const have = seen.get(i.recipe_id);
    if (have) have._at.push(at);
    else seen.set(i.recipe_id, { ...i, _at: [at] });
  })));
  return [...seen.values()];
}

function miniCard(i, meal) {
  state.items.set(i.recipe_id, i);
  const cal = i.calories == null ? '–' : Math.round(i.calories);
  const p = i.nutrients.protein_g;
  const where = [...new Set(i._at.map(a => a.hall))];
  return `<li class="mini">
    <button class="mini__main" data-id="${esc(i.recipe_id)}"
        aria-label="${esc(i.name)}, ${cal} calories, ${p == null ? 'protein not listed' : Math.round(p) + ' grams protein'}, at ${esc(where.join(', '))}">
      <span class="mini__name">${esc(i.name)}</span>
      <span class="mini__where"><svg class="gi" aria-hidden="true"><use href="#ic-pin"/></svg>${esc(where.length > 1 ? `${where[0]} +${where.length - 1}` : where[0])}</span>
      <span class="mini__nums" aria-hidden="true">
        <span><b>${cal}</b> cal</span>
        <span class="mini__p"><b>${p == null ? '–' : Math.round(p)}g</b> protein</span>
      </span>
    </button>
    <button class="mini__add" data-homeadd="${esc(i.recipe_id)}" data-meal="${esc(meal)}"
      aria-label="Add ${esc(i.name)} to ${esc(meal.toLowerCase())}">
      <svg class="gi" aria-hidden="true"><use href="#ic-plus"/></svg></button>
  </li>`;
}

function rail(title, sub, items, meal, icon) {
  if (!items.length) return '';
  return `<section class="homesec">
    <div class="homesec__head"><h2><svg class="gi" aria-hidden="true"><use href="#ic-${icon}"/></svg>${esc(title)}</h2>
      ${sub ? `<span>${esc(sub)}</span>` : ''}</div>
    <ul class="rail">${items.map(i => miniCard(i, meal)).join('')}</ul>
  </section>`;
}

/** Calories against the day's target, as a ring: the one shape that reads as
    "how much of this is used up" without a single number being read. */
function ring(value, target, size = 112) {
  const r = (size - 14) / 2, c = 2 * Math.PI * r;
  const pct = target ? Math.min(value / target, 1) : 0;
  const over = target && value > target;
  return `<svg class="ring${over ? ' ring--over' : ''}" viewBox="0 0 ${size} ${size}" width="${size}" height="${size}" aria-hidden="true">
    <circle class="ring__track" cx="${size / 2}" cy="${size / 2}" r="${r}"/>
    ${pct > 0 ? `<circle class="ring__fill" cx="${size / 2}" cy="${size / 2}" r="${r}"
      stroke-dasharray="${(pct * c).toFixed(1)} ${c.toFixed(1)}"
      transform="rotate(-90 ${size / 2} ${size / 2})"/>` : ''}
  </svg>`;
}

function dayCard(date, { compact = false } = {}) {
  const plates = readPlates(date);
  const t = totalsOf(Object.values(plates).flat());
  const goal = activeGoal();
  const left = goal.dayCalories - t.cal;
  const n = Object.values(plates).flat().length;
  return `<div class="daycard">
    <div class="daycard__ring">
      ${ring(t.cal, goal.dayCalories)}
      <span class="daycard__center"><b>${Math.round(t.cal).toLocaleString()}</b><span>of ${goal.dayCalories.toLocaleString()}</span></span>
    </div>
    <div class="daycard__side">
      <p class="daycard__left">${left >= 0
        ? `<b>${Math.round(left).toLocaleString()}</b> cal left`
        : `<b>${Math.round(-left).toLocaleString()}</b> cal over`}</p>
      ${macroBar('Protein', t.p, goal.dayProtein, 'protein')}
      ${macroBar('Carbs', t.c, 0, 'carbs')}
      ${macroBar('Fat', t.f, 0, 'fat')}
      ${compact ? `<button class="linkbtn" data-tab-go="plate">${n ? `${plural(n, 'item')} logged` : 'Open tracker'}</button>` : ''}
    </div>
    <span class="sr">${Math.round(t.cal)} of ${goal.dayCalories} calories, ${Math.round(t.p)} grams protein.</span>
  </div>`;
}

/** A thin bar per macro. Protein has a target; carbs and fat are shown as a
    share of the day's calories instead, because a ceiling nobody set is not
    something to fill up to. */
function macroBar(label, g, target, cls) {
  const pct = target ? Math.min(g / target, 1) * 100 : 0;
  return `<div class="mbar mbar--${cls}">
    <span class="mbar__top"><span>${label}</span><b>${Math.round(g)}g${target ? `<i> / ${target}g</i>` : ''}</b></span>
    ${target ? `<span class="mbar__track"><span style="width:${pct.toFixed(1)}%"></span></span>` : ''}
  </div>`;
}

function waterRow(date) {
  const n = readWater(date), goal = activeGoal().water;
  return `<div class="water" role="group" aria-label="Water, ${n} of ${goal} cups">
    <span class="water__label"><svg class="gi" aria-hidden="true"><use href="#ic-drop"/></svg>
      <b>${n}</b>&thinsp;/&thinsp;${goal} cups of water</span>
    <span class="water__cups">${Array.from({ length: goal }, (_, i) =>
      `<button class="cup" data-water="${i + 1}" data-date="${date}" aria-pressed="${i < n}"
        aria-label="${i < n && i + 1 === n ? 'Remove last cup' : `${i + 1} cup${i ? 's' : ''}`}"></button>`).join('')}</span>
  </div>`;
}

async function renderHome() {
  const date = homeDate();
  const meal = currentMeal(date);
  const view = $('#homeView');
  const halls = state.meta.locations;

  const hallCards = halls.map(l => {
    const st = hallStatus(l.id, date);
    const showMeal = st?.meal || meal;
    const n = countOn(date, showMeal, l.id);
    return `<button class="hallcard" data-openhall="${esc(l.id)}" data-meal="${esc(showMeal)}">
      <span class="hallcard__dot" data-open="${st ? st.open : ''}" aria-hidden="true"></span>
      <span class="hallcard__id">
        <b>${esc(shortHall(l.name))}</b>
        <span class="hallcard__status">${st ? esc(st.text) : esc(`${showMeal} · ${hoursText(date, showMeal) || shortDay(date)}`)}</span>
      </span>
      <span class="hallcard__count">${n ? `<b>${n}</b> items` : 'No menu'}<span class="sr"> on the ${esc(showMeal.toLowerCase())} menu</span></span>
      <svg class="gi" aria-hidden="true"><use href="#ic-right"/></svg>
    </button>`;
  }).join('');

  const head = `
    <section class="homesec homesec--first">
      <div class="homesec__head"><h2><svg class="gi" aria-hidden="true"><use href="#ic-clock"/></svg>${
        isToday(date) ? 'Dining halls now' : `Dining halls · ${esc(shortDay(date))}`}</h2>
        <button class="linkbtn" data-openhall="all" data-meal="${esc(meal)}">Compare all</button></div>
      <div class="hallcards">${hallCards}</div>
    </section>`;

  const today = `
    <section class="homesec">
      <div class="homesec__head"><h2><svg class="gi" aria-hidden="true"><use href="#ic-flame"/></svg>Your day</h2>
        <button class="linkbtn" data-goals>Targets</button></div>
      <div class="panel panel--flush">${dayCard(date, { compact: true })}${waterRow(date)}</div>
    </section>`;

  // Paint what needs no network first, then the picks once the day arrives.
  const shell = (rails) => head + rails + today + quickLinks();
  view.innerHTML = shell(`<section class="homesec"><div class="sk sk--rail"><span class="sk__line sk__line--name"></span><span class="sk__block"></span></div></section>`);

  const day = await loadDay(date);
  if (state.tab !== 'home') return;
  const items = dayItems(day[meal]).filter(i => i.calories != null && !i.label_implausible && !i.nutrition_suspect);
  const fits = items.filter(fitsProfile).filter(i => !isGarnish(i));

  // Favorites are checked against every meal of the day, not just this one:
  // "your pizza is on at dinner" is worth knowing at noon.
  const favHits = [];
  Object.entries(day).forEach(([m, menu]) => dayItems(menu).forEach(i => {
    if (isFav(i.recipe_id) && !favHits.some(f => f.recipe_id === i.recipe_id)) favHits.push({ ...i, _meal: m });
  }));

  const byProtein = [...fits].sort((a, b) => (b.nutrients.protein_g || 0) - (a.nutrients.protein_g || 0)).slice(0, 10);
  const light = fits.filter(i => i.calories >= 120 && i.calories <= 450 && (i.nutrients.protein_g || 0) >= 8)
    .sort((a, b) => (b.nutrients.protein_g || 0) / b.calories - (a.nutrients.protein_g || 0) / a.calories).slice(0, 10);
  const plant = fits.filter(i => i.diets.includes('vegan') && i.calories >= 60)
    .sort((a, b) => (b.nutrients.protein_g || 0) - (a.nutrients.protein_g || 0)).slice(0, 10);

  const profile = [...state.diets].map(titleCase).concat([...state.without].map(a => `no ${titleCase(a).toLowerCase()}`));
  const favSection = `<section class="homesec">
      <div class="homesec__head"><h2><svg class="gi" aria-hidden="true"><use href="#ic-heart"/></svg>Favorites on today</h2>
        ${Object.keys(state.favs).length ? `<button class="linkbtn" data-openfavs>All ${Object.keys(state.favs).length}</button>` : ''}</div>
      ${favHits.length
        ? `<ul class="favhits">${favHits.map(i => `<li><button class="favhit" data-id="${esc(i.recipe_id)}">
            <b>${esc(i.name)}</b>
            <span>${esc(i._meal)} · ${esc([...new Set(i._at.map(a => a.hall))].join(', '))}</span></button></li>`).join('')}</ul>`
        : `<p class="homesec__empty">${Object.keys(state.favs).length
            ? 'None of your favorites are on today’s menu.'
            : 'Tap the <svg class="gi gi--inline" aria-hidden="true"><use href="#ic-heart"/></svg> on anything you love. This is where you will find out it is being served.'}</p>`}
    </section>`;

  const rails = favSection
    + rail(`Most protein at ${meal.toLowerCase()}`, profile.length ? profile.join(' · ') : '', byProtein, meal, 'bolt')
    + rail('Light but filling', 'High protein for the calories', light, meal, 'feather')
    + rail('Plant-based', 'Vegan, highest protein first', plant, meal, 'leaf');
  view.innerHTML = shell(rails);
}

function quickLinks() {
  return `<section class="homesec">
    <div class="homesec__head"><h2><svg class="gi" aria-hidden="true"><use href="#ic-search"/></svg>Find something</h2></div>
    <div class="quickgrid">
      ${POPULAR.slice(0, 8).map(t => `<button class="qchip" data-searchfor="${esc(t)}">${esc(titleCase(t))}</button>`).join('')}
    </div>
  </section>`;
}

/* -------------------------------------------------------------- build view */

/** A labelled bar showing where a total lands against its target. */
function goalBar(label, value, target, unit, cls, ceiling = false) {
  const pct = target ? Math.min(value / target, 1.35) : 0;
  const state_ = !target ? 'none' : ceiling ? (value > target ? 'over' : 'ok')
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
        <span>${esc([i.serving_size || i.portion, many ? `${shortHall(i._hall)} · ${i._stationName}` : i._stationName]
          .filter(Boolean).join(' · '))}</span>
      </span>
      <span class="row__cal">${Math.round(i.calories)}<small> cal</small></span>
    </button></li>`).join('');

  return `<article class="panel plan">
    <div class="panel__row">
      <h3><span class="plan__num">${index + 1}</span>Option ${index + 1}</h3>
      <span class="panel__meta">${Math.round(t.cal)} cal · ${Math.round(t.p)}g protein</span>
    </div>
    <ul class="rows">${rows}</ul>
    <div class="bars">
      ${goalBar('Calories', t.cal, goal.calories, '', 'cal')}
      ${goalBar('Protein', t.p, goal.protein, 'g', 'protein')}
      ${goal.maxCarbs ? goalBar('Carbs', t.c, goal.maxCarbs, 'g', 'carb', true) : ''}
      ${goal.maxFat ? goalBar('Fat', t.f, goal.maxFat, 'g', 'fat', true) : ''}
    </div>
    <button class="btn btn--primary btn--block" data-useplan="${index}">Put this on my ${esc(state.meal.toLowerCase())} plate</button>
  </article>`;
}

function renderBuild() {
  const goal = activeGoal();
  const constraints = [
    ...[...state.diets].map(titleCase),
    ...[...state.without].map(a => `No ${titleCase(a)}`),
  ];

  const head = `
    <div class="panel panel--hero">
      <div class="panel__row">
        <div>
          <h2>Build a meal</h2>
          <p>${esc(state.meal)} · ${esc(state.location === 'all' ? 'All halls' : shortHall(hallName(state.location)))} · ${esc(shortDay(state.date))}</p>
        </div>
        <button class="btn btn--ghost btn--sm" data-goals>
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
        <svg class="gi" aria-hidden="true"><use href="#ic-build"/></svg>
        <span>${state.plans ? 'Shuffle new options' : 'Build my meal'}</span></button>
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
       respect your saved diet and allergen filters.`, '', 'build');
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
const shortDay = date => parseDay(date).toLocaleDateString(undefined,
  { weekday: 'short', month: 'short', day: 'numeric' });
const longDay = date => parseDay(date).toLocaleDateString(undefined,
  { weekday: 'long', month: 'long', day: 'numeric' });

function focusMeal(meal) {
  const m = CSS.escape(meal);
  $(`#plateView [data-meal-toggle="${m}"], #plateView [data-meal-browse="${m}"]`)?.focus();
}

const fmtQty = q => q === 0.5 ? '½' : Number.isInteger(q) ? String(q) : `${Math.floor(q)}½`;

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
    const on = served(state.date, meal);
    return `<section class="meal meal--empty">
      <button class="meal__head" data-meal-browse="${esc(meal)}" ${on ? '' : 'disabled'}>
        <span class="meal__name">${esc(meal)}</span>
        <span class="meal__sum">${on ? 'Add from the menu' : 'Not served this day'}</span>
        ${on ? '<svg class="gi" aria-hidden="true"><use href="#ic-plus"/></svg>' : ''}
      </button>
    </section>`;
  }

  const n = rows.reduce((s, i) => s + (i.qty || 1), 0);
  const summary = `${Math.round(t.cal).toLocaleString()} cal · ${Math.round(t.p)}g protein`;

  return `<section class="meal">
    <button class="meal__head" data-meal-toggle="${esc(meal)}" aria-expanded="${open}">
      <span class="meal__name">${esc(meal)}</span>
      <span class="meal__sum">${summary}</span>
      <span class="meal__count" aria-label="${plural(rows.length, 'item')}">${rows.length}</span>
      <svg class="gi" aria-hidden="true"><use href="#ic-chevron"/></svg>
    </button>

    ${open ? `<div class="meal__body">
      <ul class="rows">${rows.map(i => {
        const q = i.qty || 1;
        return `<li class="row platerow">
          <div class="row__id"><b>${esc(i.name)}</b><span>${esc(i.serving || '')}${q !== 1 ? ` × ${fmtQty(q)}` : ''}</span></div>
          <span class="stepper" role="group" aria-label="Servings of ${esc(i.name)}">
            <button data-qty="-1" data-rid="${esc(i.recipe_id)}" data-from="${esc(meal)}" ${q <= 0.5 ? 'disabled' : ''}
              aria-label="Fewer servings"><svg class="gi" aria-hidden="true"><use href="#ic-minus"/></svg></button>
            <span class="stepper__n" aria-live="polite">${fmtQty(q)}</span>
            <button data-qty="1" data-rid="${esc(i.recipe_id)}" data-from="${esc(meal)}" ${q >= 6 ? 'disabled' : ''}
              aria-label="More servings"><svg class="gi" aria-hidden="true"><use href="#ic-plus"/></svg></button>
          </span>
          <span class="row__cal">${Math.round(i.calories * q)}<small> cal</small></span>
          <button class="remove" data-remove="${esc(i.recipe_id)}" data-from="${esc(meal)}"
                  aria-label="Remove ${esc(i.name)}"><svg class="gi" aria-hidden="true"><use href="#ic-close"/></svg></button>
        </li>`;
      }).join('')}</ul>

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
        <span class="meal__servings">${fmtQty(n)} serving${n === 1 ? '' : 's'}</span>
        <button class="linkbtn linkbtn--quiet" data-clear-meal="${esc(meal)}">Clear ${esc(meal.toLowerCase())}</button>
      </div>
    </div>` : ''}
  </section>`;
}

/** Seven bars, Monday to Sunday: the week as a shape rather than a number,
    with the daily target drawn across it. Each bar opens that day. */
function weekChart() {
  const goal = activeGoal().dayCalories;
  const days = Array.from({ length: 7 }, (_, i) => addDays(state.weekStart || mondayOf(state.date), i));
  const cals = days.map(d => totalsOf(Object.values(readPlates(d)).flat()).cal);
  const top = Math.max(goal * 1.25, ...cals);
  const logged = cals.filter(c => c > 0);
  const avg = logged.length ? logged.reduce((a, b) => a + b, 0) / logged.length : 0;
  return `<section class="panel">
    <div class="panel__row"><div><h2 class="h2--sm">This week</h2>
      <p>${logged.length ? `${plural(logged.length, 'day')} logged · ${Math.round(avg).toLocaleString()} cal average` : 'Nothing logged this week yet'}</p></div></div>
    <div class="week" role="list">
      <span class="week__goal" style="bottom:${(goal / top * 100).toFixed(1)}%" aria-hidden="true"><i>${goal.toLocaleString()}</i></span>
      ${days.map((d, i) => {
        const dt = parseDay(d);
        const has = state.meta.dates.includes(d);
        return `<button class="week__col" role="listitem" data-date="${d}" ${has ? '' : 'disabled'}
            aria-current="${d === state.date}" aria-label="${esc(longDay(d))}: ${Math.round(cals[i])} calories">
          <span class="week__bar${cals[i] > goal ? ' is-over' : ''}" style="height:${(cals[i] / top * 100).toFixed(1)}%"></span>
          <span class="week__dow" aria-hidden="true">${dt.toLocaleDateString(undefined, { weekday: 'narrow' })}</span>
        </button>`;
      }).join('')}
    </div>
  </section>`;
}

function renderPlateView() {
  const n = allPlated().length;
  $('#plateView').innerHTML = `
    <div class="panel panel--flush">
      <div class="panel__row panel__row--pad">
        <div><h2 class="h2--sm">${esc(shortDay(state.date))}</h2>
          <p>${n ? plural(n, 'item') + ' logged' : 'Nothing logged yet'}</p></div>
        <button class="btn btn--ghost btn--sm" data-goals>
          <svg class="gi" aria-hidden="true"><use href="#ic-target"/></svg><span>Targets</span></button>
      </div>
      ${dayCard(state.date)}
      ${waterRow(state.date)}
    </div>
    ${n ? '' : `<p class="hint hint--center">Tap + on anything in the menu, or let Build put a meal together.
      Each meal is tracked on its own.</p>`}
    <div class="meals">${state.meta.meals.map(mealSection).join('')}</div>
    ${weekChart()}`;
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
  $('#gDayCalories').value = state.goals.dayCalories;
  $('#gDayProtein').value = state.goals.dayProtein;
  $('#gWater').value = state.goals.water;
}

/* --------------------------------------------------------- selection */

function selectDate(date) {
  if (date === state.date) return;
  state.date = date;
  state.weekStart = mondayOf(date);
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
  renderMeals(); renderHalls(); renderHero(); render();
  rebuildIfShowing();
}

function selectLocation(loc) {
  state.location = loc;
  state.collapsed.clear();
  renderHalls(); render();
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

// Through openSheet, so closing it puts focus back on the button that opened it.
const openGoals = () => { syncGoalInputs(); openSheet($('#goalSheet')); };

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

/* ------------------------------------------------------ search suggestions */

const RECENT_KEY = 'dining.recent';

function rememberSearch(q) {
  q = q.trim().toLowerCase();
  if (q.length < 2) return;
  state.recent = [q, ...state.recent.filter(r => r !== q)].slice(0, 6);
  store.set(RECENT_KEY, state.recent);
}

function showSuggest() {
  if (state.q) { hideSuggest(); return; }
  const recent = state.recent;
  const popular = POPULAR.filter(p => !recent.includes(p));
  $('#suggest').innerHTML = `
    ${recent.length ? `<div class="suggest__group"><span class="suggest__label">Recent</span>
      <div class="chiprow">${recent.map(r => `<button class="qchip" data-searchfor="${esc(r)}">
        <svg class="gi" aria-hidden="true"><use href="#ic-history"/></svg>${esc(r)}</button>`).join('')}
        <button class="linkbtn linkbtn--quiet" data-clearrecent>Clear</button></div></div>` : ''}
    <div class="suggest__group"><span class="suggest__label">Popular</span>
      <div class="chiprow">${popular.slice(0, 8).map(r =>
        `<button class="qchip" data-searchfor="${esc(r)}">${esc(r)}</button>`).join('')}</div></div>`;
  $('#suggest').hidden = false;
}

function hideSuggest() { $('#suggest').hidden = true; }

/** Search from anywhere lands on the menu, where results are shown. */
function searchFor(term) {
  state.q = term;
  rememberSearch(term);
  hideSuggest();
  if (state.tab !== 'browse') setTab('browse');
  applyFilters();
  $('#search').blur();
}

/* ------------------------------------------------------------------- plate */

const plateKey = (date = state.date) => `dining.plate.${date}`;

/** A day's plates, one bucket per meal: { Breakfast: [...], Lunch: [...] }.

    A single flat list per day could not answer "what did I have at lunch",
    which is the question the tracker exists for, and it made a day of eating
    render as one undifferentiated run of items. */
const emptyDay = () => Object.fromEntries(state.meta.meals.map(m => [m, []]));

/** Any day's plates, read straight from storage -- for Home and the week
    chart, which look at days other than the one being browsed. */
function readPlates(date, fallbackMeal = state.meal) {
  const stored = store.get(plateKey(date), null);
  const out = emptyDay();
  if (Array.isArray(stored)) {
    // Days saved before plates were split by meal. They were built while
    // looking at some meal's menu, and the one on screen now is the best guess
    // available -- better than dropping someone's day on the floor.
    out[fallbackMeal] = stored;
  } else if (stored && typeof stored === 'object') {
    state.meta.meals.forEach(m => { if (Array.isArray(stored[m])) out[m] = stored[m]; });
  }
  return out;
}

function loadPlate() {
  state.plates = readPlates(state.date);
  // Open the meal being browsed, so the tracker lands on the one you are
  // most likely to be editing rather than three closed rows.
  state.openMeals = new Set([state.meal]);
  renderPlate();
}

function savePlate() {
  store.set(plateKey(), state.plates);
  renderPlate();
}

/** The plate for one meal, or for the meal being browsed. */
const plateFor = (meal = state.meal) => (state.plates[meal] ||= []);

/** Every item across the day, in meal order. */
const allPlated = () => state.meta.meals.flatMap(m => plateFor(m));

/** Totals over plate rows, each scaled by how many servings it was. */
function totalsOf(rows) {
  return rows.reduce((t, i) => {
    const q = i.qty || 1;
    return { cal: t.cal + (i.calories || 0) * q, p: t.p + (i.protein || 0) * q,
             c: t.c + (i.carbs || 0) * q, f: t.f + (i.fat || 0) * q };
  }, { cal: 0, p: 0, c: 0, f: 0 });
}

/** Totals for one meal, or for the whole day when passed nothing. */
const totals = meal => totalsOf(meal === undefined ? allPlated() : plateFor(meal));

/* ------------------------------------------------------------------- water */

const waterKey = date => `dining.water.${date}`;
const readWater = date => Math.max(0, Number(store.get(waterKey(date), 0)) || 0);

function setWater(date, n) {
  store.set(waterKey(date), n);
  $$(`.water`).forEach(w => w.outerHTML = waterRow(w.querySelector('[data-date]')?.dataset.date || date));
  announce(`${n} of ${activeGoal().water} cups of water`);
}

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
        <span class="mealstrip__meal">Your ${esc(state.meal.toLowerCase())} · ${plural(n, 'item')}</span>
        <span class="mealstrip__cal"><b>${Math.round(t.cal).toLocaleString()}</b>
          / ${goal.calories.toLocaleString()} cal · <b>${Math.round(t.p)}g</b> protein</span>
        <svg class="gi" aria-hidden="true"><use href="#ic-right"/></svg>
      </span>
      <span class="mealstrip__track" aria-hidden="true">
        <span class="mealstrip__fill" style="width:${(pct * 100).toFixed(1)}%"></span></span>
      <span class="sr">Open tracker.</span>
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

/** Toggle from the browse list, with a confirmation and a way back. */
function addOrRemove(recipeId, meal = state.meal) {
  const item = state.items.get(recipeId);
  const was = plateFor(meal).some(p => p.recipe_id === recipeId);
  togglePlate(recipeId, meal);
  const name = item?.name || 'Item';
  // Undo only touches the plate; renderPlate already re-syncs every + button,
  // so there is no need to refetch the menu and lose the scroll position.
  const undo = () => togglePlate(recipeId, meal);
  toast(was ? `Removed ${name}` : `Added ${name} to ${meal.toLowerCase()}`, undo);
}

function togglePlate(recipeId, meal = state.meal) {
  const plate = plateFor(meal);
  const at = plate.findIndex(p => p.recipe_id === recipeId);
  if (at >= 0) { plate.splice(at, 1); savePlate(); return; }
  const item = state.items.get(recipeId);
  if (!item) return;
  plate.push({
    recipe_id: recipeId, name: item.name, serving: item.serving_size, qty: 1,
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
      ${state.meta.demo ? `<div class="notice"><svg class="gi" aria-hidden="true"><use href="#ic-info"/></svg>
        <span>Demo mode: this is sample data from real UMD menus, spread over two weeks. Run
        <code>python3 -m dining.serve</code> for the live database.</span></div>` : ''}
      <p class="muted">Menus and nutrition labels are copied from the university's published
        dining site${updated ? `, most recently on ${esc(updated)}` : ''}. They refresh every
        morning. What the hall actually serves can differ from what it posted.</p>

      <div class="targets">
        <div class="target"><b>${d.days}</b><span>days of menus</span></div>
        <div class="target"><b>${d.recipes.toLocaleString()}</b><span>recipes</span></div>
      </div>
      <p class="hint">${esc(shortDay(d.first_date))} to ${esc(shortDay(d.last_date))}</p>

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
          <th scope="row">${esc(shortHall(hall))}</th>
          ${meals.map(mm => `<td>${per[mm] ? per[mm].toLocaleString() : '<span class="none">—</span>'}</td>`).join('')}
        </tr>`).join('')}</tbody>
      </table>
    </div>`);
}

/* --------------------------------------------------------------- favorites sheet */

async function openFavs() {
  const ids = Object.keys(state.favs)
    .sort((a, b) => state.favs[a].name.localeCompare(state.favs[b].name));
  if (!ids.length) {
    showSheet(sheetHead('Favorites') + `<div class="sheet__content">
      ${emptyState('Nothing saved yet', `Tap the heart on any item and it lands here. Today
        tells you whenever a favorite is on the menu.`, '', 'heart')}</div>`);
    return;
  }
  const date = homeDate();
  showSheet(sheetHead('Favorites', `${plural(ids.length, 'item')} saved`) +
    `<div class="sheet__content" aria-busy="true"><span class="sk__block"></span></div>`);
  const day = await loadDay(date);
  const on = new Map();
  Object.entries(day).forEach(([m, menu]) => dayItems(menu).forEach(i => {
    if (!isFav(i.recipe_id)) return;
    const was = on.get(i.recipe_id) || [];
    was.push(`${m} · ${[...new Set(i._at.map(a => a.hall))].join(', ')}`);
    on.set(i.recipe_id, was);
  }));
  const sorted = [...ids].sort((a, b) => (on.has(b) - on.has(a)));
  showSheet(sheetHead('Favorites', `${plural(ids.length, 'item')} saved · ${on.size} on ${isToday(date) ? 'today' : shortDay(date)}`) +
    `<div class="sheet__content"><ul class="rows">${sorted.map(id => {
      const f = state.favs[id];
      const where = on.get(id);
      return `<li class="row favrow">
        <button class="row__id" data-favopen="${esc(id)}">
          <b>${esc(f.name)}</b>
          <span class="${where ? 'is-on' : ''}">${where ? esc(where.join(' / ')) : 'Not on today’s menu'}</span>
        </button>
        ${f.calories != null ? `<span class="row__cal">${Math.round(f.calories)}<small> cal</small></span>` : ''}
        ${favButton(id, f.name, 'favbtn favbtn--row')}
      </li>`;
    }).join('')}</ul>
    <p class="hint">Saved on this phone. Tap one for its label and every place it is served.</p></div>`);
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

/** Where the calories come from, as three labelled shares. */
function energySplit(item) {
  const parts = MACROS.map(([cls, label, key, per]) => [cls, label, (item.nutrients[key] || 0) * per]);
  const total = parts.reduce((n, p) => n + p[2], 0);
  if (!total) return '';
  return `<div class="energy">
    <div class="energy__bar" aria-hidden="true">${parts.map(([cls, , v]) =>
      v ? `<span class="split--${cls}" style="flex:${v.toFixed(1)}"></span>` : '').join('')}</div>
    <div class="energy__legend">${parts.map(([cls, label, v]) =>
      `<span class="macro macro--${cls}"><span class="macro__dot" aria-hidden="true"></span>
        <span class="macro__val">${Math.round(v / total * 100)}%</span><span class="macro__label">${label}</span></span>`).join('')}</div>
  </div>`;
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
    allergens = item.allergens.map(a => `<span class="pill pill--allergen${
      state.without.has(a) ? ' pill--hit' : ''}">${esc(titleCase(a))}</span>`).join('');
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
    const dv = DAILY_VALUE[key] && n[key] != null ? Math.round(n[key] / DAILY_VALUE[key] * 100) : null;
    return `<tr class="depth-${depth}${LABEL_BOLD.has(key) ? ' is-bold' : ''}">
      <th scope="row">${label}</th>
      <td>${v == null ? '<span class="none">Not listed</span>' : v}</td>
      <td class="dv">${dv == null ? '' : `${dv}%`}</td></tr>`;
  }).join('');

  const today = iso(new Date());
  const upcoming = item.served_at.filter(s => s.date >= today);
  const list = (upcoming.length ? upcoming : item.served_at);
  const served = list.slice(0, 8).map(s => `<li>
      <b>${esc(s.date === today ? 'Today' : shortDay(s.date))}</b>
      <span>${esc(s.meal)} · ${esc(shortHall(s.location_name))}${s.station ? ` · ${esc(s.station)}` : ''}</span>
    </li>`).join('');
  const moreServed = list.length > 8
    ? `<p class="hint">and ${list.length - 8} more times.</p>` : '';

  const on = plateFor().some(p => p.recipe_id === item.recipe_id);
  const fav = isFav(item.recipe_id);

  showSheet(`
    ${sheetHead(item.name, item.serving_size || 'Serving size not listed')}
    <div class="sheet__content">
      ${warn}
      <div class="detail__lead">
        <p class="detail__cal"><b>${cal}</b><span>calories</span></p>
        ${macroRow(item)}
        ${energySplit(item)}
      </div>

      <h3 class="sheet__h3">Allergens &amp; diet</h3>
      <div class="chiprow chiprow--tight">${allergens}${diets}</div>
      ${sources ? `<ul class="sources">${sources}</ul>` : ''}
      ${!item.allergen_data_published ? `<p class="hint">Nothing published is not the same
        as nothing in it. Ask at the station if you have an allergy.</p>` : ''}

      ${served ? `<h3 class="sheet__h3">${upcoming.length ? 'Coming up' : 'Served'}</h3>
        <ul class="served">${served}</ul>${moreServed}` : ''}

      <h3 class="sheet__h3">Nutrition facts</h3>
      <table class="nutrients nutrients--label">
        <caption class="sr">Nutrition facts per ${esc(item.serving_size || 'serving')}</caption>
        <thead><tr><th scope="col"><span class="sr">Nutrient</span></th><th scope="col"><span class="sr">Amount</span></th>
          <th scope="col" class="dv">% DV</th></tr></thead>
        <tbody>
          <tr class="depth-0 is-bold is-cal"><th scope="row">Calories</th><td>${cal}</td><td></td></tr>
          ${rows}
        </tbody>
      </table>
      <p class="hint">% Daily Value is against the 2,000-calorie reference printed on every label.</p>

      ${item.ingredients ? `<h3 class="sheet__h3">Ingredients</h3>
        <p class="ingredients">${esc(item.ingredients)}</p>` : ''}

      <p class="detail__source">
        ${item.source_url ? `<a class="linkbtn" href="${esc(item.source_url)}" target="_blank"
            rel="noopener">View the official label<span class="sr"> (opens in a new tab)</span></a>` : ''}
        ${item.fetched_at ? `<span>Checked ${esc(new Date(item.fetched_at).toLocaleDateString(
            undefined, { month: 'short', day: 'numeric' }))}</span>` : ''}
      </p>
    </div>
    <div class="sheet__foot">
      <button class="btn btn--ghost btn--fav" data-fav="${esc(item.recipe_id)}" data-name="${esc(item.name)}"
        aria-pressed="${fav}" aria-label="${fav ? 'Remove' : 'Save'} ${esc(item.name)} ${fav ? 'from' : 'to'} favorites">
        <svg class="gi" aria-hidden="true"><use href="#ic-heart"/></svg><span class="favlabel">${fav ? 'Saved' : 'Save'}</span></button>
      ${addButton(item.recipe_id, item.name, on)}</div>`);
}

/* ------------------------------------------------------------------ wiring */

/** The sticky header's height, so station headings stick below it instead of
    sliding underneath, and a jump lands on the heading rather than behind it. */
function measureTop() {
  const h = $('#topbar').getBoundingClientRect().height;
  document.documentElement.style.setProperty('--stick', `${Math.round(h)}px`);
}

function bind() {
  $('.tabbar').addEventListener('click', e => {
    const b = e.target.closest('[data-tab]');
    if (b) setTab(b.dataset.tab);
  });

  addEventListener('popstate', () => setTab(location.hash.replace('#', '') || 'home', true));

  // Anything that says "go to the tracker" or "open targets", wherever it is.
  document.addEventListener('click', e => {
    if (e.target.closest('[data-goals]')) return openGoals();
    const go = e.target.closest('[data-tab-go]');
    if (go) { state.openMeals.add(state.meal); setTab(go.dataset.tabGo); return; }
    const fav = e.target.closest('[data-fav]');
    if (fav) { state.items.has(fav.dataset.fav) || state.items.set(fav.dataset.fav, { name: fav.dataset.name, nutrients: {} });
               toggleFav(fav.dataset.fav); return; }
    const sf = e.target.closest('[data-searchfor]');
    if (sf) { searchFor(sf.dataset.searchfor); return; }
    const water = e.target.closest('[data-water]');
    if (water) {
      const n = Number(water.dataset.water), date = water.dataset.date;
      setWater(date, readWater(date) === n ? n - 1 : n);
      return;
    }
    if (!e.target.closest('.searchrow, .suggest')) hideSuggest();
  });

  $('#homeView').addEventListener('click', e => {
    const hall = e.target.closest('[data-openhall]');
    if (hall) {
      const date = homeDate();
      if (date !== state.date) selectDate(date);
      state.location = hall.dataset.openhall;
      state.meal = hall.dataset.meal;
      state.collapsed.clear();
      renderMeals(); renderHalls(); renderHero(); render();
      state.plans = null;
      setTab('browse');
      return;
    }
    if (e.target.closest('[data-openfavs]')) return openFavs();
    const add = e.target.closest('[data-homeadd]');
    if (add) {
      const date = homeDate();
      if (date !== state.date) selectDate(date);
      addOrRemove(add.dataset.homeadd, add.dataset.meal);
      add.querySelector('use').setAttribute('href',
        plateFor(add.dataset.meal).some(p => p.recipe_id === add.dataset.homeadd) ? '#ic-check' : '#ic-plus');
      renderHome();
      return;
    }
    const open = e.target.closest('[data-id]');
    if (open) openDetail(open.dataset.id);
  });

  $('#buildView').addEventListener('click', e => {
    if (e.target.closest('#runBuild, #retryBuild')) return runBuild();
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
    const head = e.target.closest('[data-meal-toggle]');
    if (head) {
      const meal = head.dataset.mealToggle;
      state.openMeals.has(meal) ? state.openMeals.delete(meal) : state.openMeals.add(meal);
      renderPlateView();
      return;
    }

    const day = e.target.closest('.week__col[data-date]');
    if (day) { selectDate(day.dataset.date); renderTitle(); return; }

    const go = e.target.closest('[data-meal-browse]');
    if (go) {
      selectMeal(go.dataset.mealBrowse);
      setTab('browse');
      return;
    }

    const qty = e.target.closest('[data-qty]');
    if (qty) {
      const row = plateFor(qty.dataset.from).find(p => p.recipe_id === qty.dataset.rid);
      if (!row) return;
      row.qty = Math.min(6, Math.max(0.5, (row.qty || 1) + Number(qty.dataset.qty) * 0.5));
      savePlate();
      $(`#plateView [data-qty="${qty.dataset.qty}"][data-rid="${CSS.escape(qty.dataset.rid)}"]`)?.focus();
      return;
    }

    const clear = e.target.closest('[data-clear-meal]');
    if (clear) {
      const meal = clear.dataset.clearMeal;
      const before = plateFor(meal).slice();
      state.plates[meal] = [];
      savePlate();
      focusMeal(meal);
      toast(`Cleared ${meal.toLowerCase()}`, () => { state.plates[meal] = before; savePlate(); });
      return;
    }

    const rm = e.target.closest('[data-remove]');
    if (rm) {
      const meal = rm.dataset.from;
      const at = plateFor(meal).findIndex(p => p.recipe_id === rm.dataset.remove);
      const gone = plateFor(meal)[at];
      if (!gone) return;
      plateFor(meal).splice(at, 1);
      savePlate();
      // The button that had focus is gone; land on the next one, or the meal.
      const next = $$(`#plateView [data-remove][data-from="${CSS.escape(meal)}"]`)[at]
        || $$(`#plateView [data-remove][data-from="${CSS.escape(meal)}"]`)[at - 1];
      next ? next.focus() : focusMeal(meal);
      toast(`Removed ${gone.name}`, () => { plateFor(meal).splice(at, 0, gone); savePlate(); });
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
  goalField('#gDayCalories', 'dayCalories');
  goalField('#gDayProtein', 'dayProtein');
  goalField('#gWater', 'water');
  $('#goalReset').addEventListener('click', () => {
    state.goals = { calories: '', protein: '', maxCarbs: '', maxFat: '',
                    dayCalories: '', dayProtein: '', water: '' };
    saveGoals(); syncGoalInputs();
  });
  $('#goalSheet').addEventListener('close', () => {
    // Targets changed, so anything built against the old ones is stale.
    state.plans = null;
    if (state.tab === 'build') renderBuild();
    if (state.tab === 'plate') renderPlateView();
    if (state.tab === 'home') renderHome();
    renderHero();
  });

  $('#weekNav').addEventListener('click', e => {
    if (e.target.closest('[data-today]')) { selectDate(iso(new Date())); return; }
    const b = e.target.closest('[data-week]');
    if (!b || b.disabled) return;
    const weeks = weeksAvailable();
    const next = weeks[weeks.indexOf(state.weekStart) + Number(b.dataset.week)];
    if (!next) return;
    // Land on the first stored day of the week you paged into, so the menu
    // below always matches the week the header now claims to be showing.
    const day = Array.from({ length: 7 }, (_, i) => addDays(next, i))
      .find(d => state.meta.dates.includes(d));
    if (day) selectDate(day);
    else { state.weekStart = next; renderDates(); }
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
    state.q ? hideSuggest() : showSuggest();
    if (state.q && state.tab !== 'browse') setTab('browse');
    clearTimeout(timer);
    timer = setTimeout(() => { renderActiveFilters(); render(); }, 180);
  });
  $('#search').addEventListener('focus', showSuggest);
  $('#search').addEventListener('change', e => rememberSearch(e.target.value));
  $('#search').addEventListener('keydown', e => {
    if (e.key === 'Enter') { rememberSearch(state.q); e.target.blur(); hideSuggest(); }
    if (e.key === 'Escape') hideSuggest();
  });
  $('#searchClear').addEventListener('click', () => { clearSearch(); $('#search').focus(); });
  $('#suggest').addEventListener('click', e => {
    if (e.target.closest('[data-clearrecent]')) {
      state.recent = []; store.set(RECENT_KEY, []); showSuggest();
    }
  });

  $('#filterToggle').addEventListener('click', () => openSheet($('#filterSheet')));
  $('#favToggle').addEventListener('click', openFavs);

  $('#activeFilters').addEventListener('click', e => {
    if (e.target.closest('[data-afclear]')) return resetFilters();
    const chip = e.target.closest('[data-af]');
    if (chip) $('#activeFilters')._filters[+chip.dataset.af].clear();
  });

  const flipQuick = id => { QUICK.find(q => q.id === id)?.flip(); applyFilters(); };
  $('#quickRow').addEventListener('click', e => {
    const q = e.target.closest('[data-quick]');
    if (q) flipQuick(q.dataset.quick);
  });

  $('#stationBar').addEventListener('click', e => {
    const a = e.target.closest('[data-jump]');
    if (!a) return;
    e.preventDefault();
    const el = document.getElementById(a.dataset.jump);
    if (!el) return;
    // A collapsed station jumped to should open, or the jump shows nothing.
    const head = el.querySelector('[data-collapse]');
    if (head?.getAttribute('aria-expanded') === 'false') head.click();
    el.scrollIntoView({ behavior: prefersReducedMotion() ? 'auto' : 'smooth', block: 'start' });
    (head || el.querySelector('h2'))?.focus({ preventScroll: true });
  });

  $('#content').addEventListener('click', e => {
    const add = e.target.closest('[data-add]');
    if (add) { addOrRemove(add.dataset.add); return; }

    const open = e.target.closest('[data-id]');
    if (open) { openDetail(open.dataset.id); return; }

    const quick = e.target.closest('[data-quick]');
    if (quick) { flipQuick(quick.dataset.quick); return; }
    const gm = e.target.closest('[data-gomeal]');
    if (gm) { selectMeal(gm.dataset.gomeal); return; }
    const gl = e.target.closest('[data-goloc]');
    if (gl) { selectLocation(gl.dataset.goloc); return; }

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
    closeSheet($('#hallSheet'));
    selectLocation(b.dataset.loc);
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
      activate(tabs[next]);
      // Rendering replaces the buttons, so focus the new copy, not the old one.
      $('[aria-selected="true"]', container)?.focus();
    });
  };
  arrowNav($('#dateStrip'), '[data-date]', b => selectDate(b.dataset.date));
  arrowNav($('#mealTabs'), '[data-meal]', b => selectMeal(b.dataset.meal));

  $('#sheet').addEventListener('click', e => {
    const open = e.target.closest('[data-favopen]');
    if (open) { openDetail(open.dataset.favopen); return; }
    const add = e.target.closest('[data-add]');
    if (!add) return;
    const id = add.dataset.add;
    addOrRemove(id);
    const on = plateFor().some(p => p.recipe_id === id);
    add.outerHTML = addButton(id, state.items.get(id)?.name || '', on);
  });

  const bindField = (sel, key, prop = 'value') => $(sel).addEventListener('input', e => {
    state[key] = prop === 'checked' ? e.target.checked : e.target.value;
    if (key === 'includeUnknown') saveProfile();
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
    e.preventDefault();
    const v = chip.dataset.value;
    set.has(v) ? set.delete(v) : set.add(v);
    saveProfile();
    state.plans = null;
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

  if ('ResizeObserver' in window) new ResizeObserver(measureTop).observe($('#topbar'));
  // Open/closed and "serving now" go stale while the app sits open on a tray.
  setInterval(() => {
    renderMeals(); renderHalls(); renderTitle();
    if (state.tab === 'home' && !document.querySelector('dialog[open]')) renderHome();
  }, 60_000);
}

function resetFilters() {
  Object.assign(state, { q: '', minProtein: '', maxCalories: '', sort: 'name', scope: 'meal',
                         includeUnknown: false, hideImplausible: false, favOnly: false });
  state.without.clear(); state.diets.clear();
  saveProfile();
  applyFilters();
}

async function init() {
  // An earlier build had a light/dark toggle that remembered its setting. The
  // app is dark only now, so drop anything a browser kept from that.
  document.documentElement.dataset.theme = 'dark';
  try { localStorage.removeItem('dining.theme'); } catch {}
  // The first load is the one that had no loading state at all: everything on
  // this page is drawn from /api/meta, so until it lands there was nothing to
  // look at but an empty shell and a search box. Put the skeleton up before
  // asking for anything.
  document.body.dataset.booting = '1';
  $('#homeView').innerHTML = skeleton(3);

  let meta;
  try {
    meta = await api('/api/meta');
  } catch (err) {
    document.body.dataset.booting = '0';
    $('#homeView').innerHTML = emptyState('Cannot reach the menu server',
      `The page loaded but <code>/api/meta</code> did not answer. If you are running
       this locally, check that <code>python3 -m dining.serve</code> is still up.`);
    return;
  }
  document.body.dataset.booting = '0';
  state.meta = meta;
  document.title = `${state.meta.college_name} Dining`;

  const { locations } = state.meta;
  state.date = homeDate();
  state.weekStart = mondayOf(state.date);
  // Land on the meal being served now rather than an empty Breakfast at 7pm.
  state.meal = currentMeal(state.date);
  state.location = locations[0].id;

  state.favs = store.get(FAV_KEY, {}) || {};
  state.recent = store.get(RECENT_KEY, []) || [];
  loadProfile();

  $('#allergenChips').innerHTML = state.meta.allergens.map(a =>
    `<button type="button" class="chip" data-value="${a}" aria-pressed="false"><svg class="gi chip__tick" aria-hidden="true"><use href="#ic-check"/></svg>${
      esc(titleCase(a))}</button>`).join('');
  $('#dietChips').innerHTML = DIETS.map(d =>
    `<button type="button" class="chip" data-value="${d}" aria-pressed="false"><svg class="gi chip__tick" aria-hidden="true"><use href="#ic-check"/></svg>${
      titleCase(d)}</button>`).join('');

  loadGoals(); syncGoalInputs(); syncInputs();
  renderDates(); renderMeals(); renderHalls(); bind(); loadPlate();
  renderActiveFilters(); render();
  setTab(location.hash.replace('#', '') || 'home', true);
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
