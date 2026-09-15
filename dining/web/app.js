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

/* The source publishes no photographs, and a page of identical grey rows is the
   result. One glyph per item is the cheapest thing that gives a menu a shape you
   can scan. Ordered: the first pattern that matches wins, so "chicken noodle
   soup" reads as soup, not chicken. */
const ICONS = [
  // Word boundaries throughout: "chip" without one matches chipotle, and "tea"
  // matches steak. Dishes before ingredients, so a chicken soup reads as soup.
  [/\b(pizza)\b/, '🍕'], [/\b(tacos?)\b/, '🌮'], [/\b(burritos?|quesadillas?|enchiladas?|wraps?)\b/, '🌯'],
  [/\b(sushi|sashimi|poke)\b/, '🍣'], [/\b(dumplings?|potstickers?|gyoza|wontons?)\b/, '🥟'],
  [/\b(soup|broth|chowder|bisque|stew|chili|ramen|pho)\b/, '🍲'],
  [/\b(burgers?|cheeseburgers?|hamburgers?)\b/, '🍔'],
  [/\b(sandwich(es)?|panini|hoagie|blt|sub)\b/, '🥪'],
  [/\b(salad|slaw|greens|lettuce)\b/, '🥗'],
  [/\b(pasta|spaghetti|penne|noodles?|linguine|ziti|macaroni|lasagna|alfredo|marinara|ravioli)\b/, '🍝'],
  [/\b(curry|tikka|masala|biryani)\b/, '🍛'],
  [/\b(rice|pilaf|risotto|quinoa|couscous|cous cous|arroz)\b/, '🍚'],
  [/\b(pancakes?|waffles?|crepes?)\b|french toast/, '🥞'],
  [/\b(oatmeal|granola|cereal|porridge|grits|oats)\b/, '🥣'],
  [/\b(ice cream|gelato|sorbet|sundae|frozen yogurt)\b/, '🍨'],
  [/\b(cake|brownie|cupcake|pastry|danish|muffin|cheesecake|pudding|scone|custard|mousse)\b/, '🍰'],
  [/\b(cookies?|biscotti)\b/, '🍪'], [/\b(doughnuts?|donuts?)\b/, '🍩'],
  [/\b(pies?|cobbler|crisp|tarts?)\b/, '🥧'],
  [/\b(bagels?|toast|bread|biscuits?|baguette|croissant|buns?|rolls?|cornbread)\b/, '🍞'],
  [/\b(pita|tortillas?|naan|flatbread|hummus|falafel)\b/, '🫓'],
  [/\b(pretzels?|crackers?|chips?)\b/, '🥨'],
  [/\b(eggs?|omelets?|omelettes?|frittata|scrambled)\b/, '🍳'],
  [/\b(bacon|sausages?|pork|ham|chorizo|pepperoni)\b/, '🥓'], [/\b(turkey)\b/, '🦃'],
  [/\b(chicken|wings?|poultry|nuggets?)\b/, '🍗'],
  [/\b(beef|steak|brisket|roast|lamb|veal|meatloaf)\b/, '🥩'],
  [/\b(meatballs?|kofta)\b/, '🧆'],
  [/\b(shrimp|crab|lobster|scallops?|clams?|mussels?|calamari)\b/, '🦐'],
  [/\b(fish|salmon|tilapia|cod|tuna|pollock|catfish|haddock)\b/, '🐟'],
  [/\b(tofu|tempeh|seitan|plant.based|vegan)\b/, '🌱'],
  [/\b(beans?|lentils?|chickpeas?|edamame|hummus)\b/, '🫘'],
  [/\b(potato(es)?|fries|tots|hash browns?|yuca|cassava)\b/, '🥔'],
  [/\b(broccoli|spinach|kale|asparagus|zucchini|squash|peas?|green beans?|vegetables?|veggie|brussels?|cabbage|cauliflower|beets|celery|artichokes?|bok choy|coleslaw|sprouts)\b/, '🥦'],
  [/\b(carrots?)\b/, '🥕'], [/\b(corn)\b/, '🌽'], [/\b(mushrooms?)\b/, '🍄'],
  [/\b(tomatoes?|tomato|salsa)\b/, '🍅'], [/\b(onions?)\b/, '🧅'],
  [/\b(peppers?|jalape\S*)\b/, '🫑'], [/\b(avocado|guacamole)\b/, '🥑'],
  [/\b(cucumbers?|pickles?)\b/, '🥒'], [/\b(eggplant)\b/, '🍆'],
  [/\b(cheese|mozzarella|cheddar|parmesan|feta|provolone)\b/, '🧀'],
  [/\b(yogurt|milk|cream)\b/, '🥛'], [/\b(butter|margarine|oil|ghee)\b/, '🧈'],
  [/\b(syrup|honey|jam|jelly|preserves?)\b/, '🍯'],
  [/\b(apples?)\b/, '🍎'], [/\b(bananas?)\b/, '🍌'],
  [/\S*berr(y|ies)\b/, '🍓'],
  [/\b(oranges?|citrus|clementine|tangerine)\b/, '🍊'], [/\b(grapes?)\b/, '🍇'],
  [/\b(melon|watermelon|cantaloupe)\b/, '🍉'], [/\b(pineapple)\b/, '🍍'],
  [/\b(peach(es)?|nectarine|mango)\b/, '🍑'], [/\b(coconut)\b/, '🥥'], [/\b(fruit)\b/, '🍎'],
  [/\b(coffee|espresso|latte|tea)\b/, '☕'], [/\b(juice|lemonade|smoothie|punch)\b/, '🧃'],
  [/\b(sauce|gravy|dressing|aioli|vinaigrette|vinagrette|dip|ketchup|mustard|mayo|mayonnaise|vinegar|glaze|pesto|chimichurri|relish)\b/, '🥫'],
  [/\b(nuts?|almonds?|peanuts?|cashews?|pecans?|walnuts?|seeds?)\b/, '🥜'],
  [/\b(chocolate|cocoa|fudge)\b/, '🍫'], [/\b(cherry|cherries)\b/, '🍒'],
  [/\b(basil|cilantro|parsley|garlic|ginger|herbs?|scallions?|chives)\b/, '🌿'],
  [/\b(lemon|lime)\b/, '🍋'],
];

function iconFor(name) {
  const n = name.toLowerCase();
  for (const [re, glyph] of ICONS) if (re.test(n)) return glyph;
  return '🍽️';
}

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
  meta: null, date: null, meal: null, location: null,
  q: '', scope: 'meal', minProtein: '', maxCalories: '', sort: 'name',
  without: new Set(), diets: new Set(), includeUnknown: false, hideImplausible: false,
  items: new Map(), plate: [], collapsed: new Set(), menu: null,
};

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

/* Grams against a coloured dot. The old three-column grid repeated the words
   PROTEIN / CARBS / FAT on every card and drew two empty tracks for anything
   that was mostly one macro, which was most of the menu. */
function macroChips(item) {
  const n = item.nutrients;
  const [p, c, f] = [n.protein_g, n.total_carbs_g, n.total_fat_g];
  if (p == null && c == null && f == null) return '';
  const chip = (cls, g) => `<span class="m m--${cls}"><i></i>${g == null ? '–' : Math.round(g) + 'g'}</span>`;
  return `<div class="card__macros">${chip('p', p)}${chip('c', c)}${chip('f', f)}</div>`;
}

function tags(item, max = 3) {
  const out = [];
  if (item.label_implausible)
    out.push(`<span class="badge badge--warn" title="This label fails a plausibility check — it reads as a batch rather than one serving. Verify against the posted card.">check label</span>`);
  else if (item.nutrition_suspect)
    out.push(`<span class="badge badge--warn" title="The macros on this label do not add up to its calorie count.">macros off</span>`);
  item.diets.forEach(d => out.push(`<span class="badge badge--diet">${esc(titleCase(d))}</span>`));

  // Allergens as quiet text rather than a row of red pills: on a menu where most
  // items contain something, the pills were louder than the food.
  let note = '';
  if (!item.allergen_data_published) {
    note = `<span class="card__note card__note--unknown" title="Nothing was published. This is not a claim that the item is free of anything.">no allergen data</span>`;
  } else if (item.allergens.length) {
    const shown = item.allergens.slice(0, max).map(titleCase).join(' · ');
    const more = item.allergens.length > max ? ` +${item.allergens.length - max}` : '';
    note = `<span class="card__note">${esc(shown)}${more}</span>`;
  }
  if (!out.length && !note) return '';
  return `<div class="card__meta">${out.join('')}${note}</div>`;
}

function card(item, sub) {
  state.items.set(item.recipe_id, item);
  const inPlate = state.plate.some(p => p.recipe_id === item.recipe_id) ? '1' : '0';
  return `<article class="card" tabindex="0" role="button" data-id="${esc(item.recipe_id)}"
      aria-label="${esc(item.name)}, details">
    <span class="card__icon" aria-hidden="true">${iconFor(item.name)}</span>
    <div class="card__body">
      <h3 class="card__name">${esc(item.name)}</h3>
      <p class="card__sub">${esc(sub || item.serving_size || '')}</p>
      ${macroChips(item)}
      ${tags(item)}
    </div>
    <div class="card__end">
      <div class="card__cal">
        <b>${item.calories == null ? '–' : Math.round(item.calories)}</b><span>cal</span>
      </div>
      <button class="add" data-add="${esc(item.recipe_id)}" data-in="${inPlate}"
              aria-label="${inPlate === '1' ? 'Remove from' : 'Add to'} plate"
              >${inPlate === '1' ? '✓' : '+'}</button>
    </div>
  </article>`;
}

/* ------------------------------------------------------------------ chrome */

function renderDates() {
  const { dates, today } = state.meta;
  $('#dateStrip').innerHTML = dates.map(d => {
    const dt = new Date(d + 'T12:00:00');
    return `<button class="day" data-date="${d}" data-today="${d === today ? 1 : 0}"
      aria-selected="${d === state.date}">
      <span>${dt.toLocaleDateString(undefined, { weekday: 'short' })}</span>
      <strong>${dt.getDate()}</strong></button>`;
  }).join('');
  $(`.day[data-date="${state.date}"]`)?.scrollIntoView(
    { inline: 'center', block: 'nearest', behavior: 'smooth' });

  const dt = new Date(state.date + 'T12:00:00');
  $('#dayLabel').textContent = dt.toLocaleDateString(undefined,
    { weekday: 'long', month: 'long', day: 'numeric' }) +
    (state.date === state.meta.today ? ' · today' : '');
}

const count = (meal, loc) => state.meta.counts[`${state.date}|${meal}|${loc}`] || 0;

function renderMeals() {
  $('#mealTabs').innerHTML = state.meta.meals.map(m => {
    const served = state.meta.locations.some(l => count(m, l.id) > 0);
    return `<button role="tab" data-meal="${m}" aria-selected="${m === state.meal}"
      ${served ? '' : 'disabled title="Nothing served at any hall"'}>${m}</button>`;
  }).join('');
}

function renderHalls() {
  const total = state.meta.locations.reduce((n, l) => n + count(state.meal, l.id), 0);
  const pills = state.meta.locations.map(l => {
    const n = count(state.meal, l.id);
    return `<button class="pill" role="tab" data-loc="${l.id}"
      aria-selected="${l.id === state.location}">${esc(l.name)}<small>${n}</small></button>`;
  });
  pills.push(`<button class="pill" role="tab" data-loc="all"
    aria-selected="${state.location === 'all'}">All halls<small>${total}</small></button>`);
  $('#hallPills').innerHTML = pills.join('');
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
    `<button class="afchip" data-af="${i}">${esc(f.label)}</button>`).join('') +
    (list.length > 1 ? `<button class="afclear" data-afclear>Clear all</button>` : '');
  bar._filters = list;
}

/* ------------------------------------------------------------------- views */

const emptyState = (title, body) =>
  `<div class="empty"><h2>${esc(title)}</h2><p>${body}</p></div>`;

const cssId = key => key.replace(/[^a-z0-9]+/gi, '-').toLowerCase();

function stationSection(st, key) {
  const shown = state.hideImplausible ? st.items.filter(i => !i.label_implausible) : st.items;
  if (!shown.length) return '';
  const open = !state.collapsed.has(key);
  return `<section class="station" id="st-${cssId(key)}">
    <button class="station__head" data-collapse="${esc(key)}" aria-expanded="${open}">
      <h2>${esc(st.station)}</h2>
      <span>${shown.length}<svg class="chev" viewBox="0 0 24 24" aria-hidden="true"><path d="M6 9l6 6 6-6"/></svg></span>
    </button>
    <div class="cards" ${open ? '' : 'hidden'}
      >${shown.map(i => card(i, i.portion || i.serving_size)).join('')}</div>
  </section>`;
}

function stationKeys(data) {
  return data.locations.flatMap(h => h.stations.map(st => `${h.location_id}|${st.station}`));
}

function jumpbar(data) {
  const halls = data.locations;
  const allCollapsed = stationKeys(data).every(k => state.collapsed.has(k));
  const toggle = `<button class="jump" data-collapseall="${allCollapsed ? 'open' : 'close'}"
    >${allCollapsed ? 'Expand all' : 'Collapse all'}</button>`;

  // Across halls, 57 same-looking station chips help nobody; jump by hall instead.
  const chips = halls.length > 1
    ? halls.map(h => `<button class="jump" data-jump="hall-${h.location_id}">${
        esc(h.location_name)}<small>${h.count}</small></button>`)
    : halls[0].stations.map(st => `<button class="jump" data-jump="st-${
        cssId(`${halls[0].location_id}|${st.station}`)}">${esc(st.station)}<small>${
        st.items.length}</small></button>`);

  if (halls.length === 1 && chips.length < 4) return `<div class="jumpbar">${toggle}</div>`;
  return `<div class="jumpbar" aria-label="Jump to section">
    <span class="jumpbar__label">${halls.length > 1 ? 'Halls' : `${chips.length} stations`}</span>
    ${chips.join('')}${toggle}</div>`;
}

async function loadMenu() {
  const p = new URLSearchParams({ date: state.date, meal: state.meal, location: state.location });
  const data = await api('/api/menu', p.toString());
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
  const data = await api('/api/search', searchParams());
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
    ? `<div class="notice"><span>⚠</span><span>Items whose allergen data was never
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

const render = () => (filtersActive() ? loadSearch() : loadMenu());

function applyFilters() {
  syncInputs();
  renderActiveFilters();
  render();
}

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

function scrollToSection(id) {
  const el = document.getElementById(id);
  if (!el) return;
  const top = el.getBoundingClientRect().top + window.scrollY
            - $('.appbar').getBoundingClientRect().height - 10;
  window.scrollTo({ top, behavior: 'smooth' });
}

/* ------------------------------------------------------------------- plate */

const plateKey = () => `dining.plate.${state.date}`;

function loadPlate() {
  try { state.plate = JSON.parse(localStorage.getItem(plateKey()) || '[]'); }
  catch { state.plate = []; }
  renderPlate();
}

function savePlate() {
  try { localStorage.setItem(plateKey(), JSON.stringify(state.plate)); } catch {}
  renderPlate();
}

function totals() {
  return state.plate.reduce((t, i) => ({
    cal: t.cal + (i.calories || 0), p: t.p + (i.protein || 0),
    c: t.c + (i.carbs || 0), f: t.f + (i.fat || 0),
  }), { cal: 0, p: 0, c: 0, f: 0 });
}

/* The FDA's own reference intake, the one every printed label is built on.
   It is a yardstick, not a goal we invented for the user. */
const CAL_REFERENCE = 2000;

function renderHero() {
  const t = totals(), n = state.plate.length;
  const kcal = t.p * 4 + t.c * 4 + t.f * 9;
  const share = grams_kcal => (kcal ? grams_kcal / kcal : 0);

  const tile = (cls, label, grams, pct) => `
    <div class="htile">
      ${ring(pct, cls, 42)}
      <div class="htile__text"><b>${Math.round(grams)}g</b><span>${label}</span></div>
    </div>`;

  $('#hero').innerHTML = `
    <div class="hero__card">
      <div class="hero__ring">
        ${ring(t.cal / CAL_REFERENCE, 'cal', 118)}
        <div class="hero__center">
          <b>${Math.round(t.cal).toLocaleString()}</b><span>cal</span>
        </div>
      </div>
      <div class="hero__text">
        <h2>${n ? 'Your plate' : 'Your plate is empty'}</h2>
        <p>${n
          ? `${n} item${n === 1 ? '' : 's'} · ${Math.round(t.cal / CAL_REFERENCE * 100)}% of the
             2,000 cal label reference`
          : 'Tap + on any item to add it. Totals land here, and stay per day.'}</p>
        ${n ? `<button class="linkbtn" id="plateClear">Clear plate</button>` : ''}
      </div>
    </div>
    <div class="hero__macros">
      ${tile('p', 'Protein', t.p, share(t.p * 4))}
      ${tile('c', 'Carbs', t.c, share(t.c * 4))}
      ${tile('f', 'Fat', t.f, share(t.f * 9))}
    </div>`;
}

function renderPlate() {
  const t = totals(), n = state.plate.length;
  $('#plateBar').hidden = !n;
  $('#plateCount').hidden = !n;
  $('#plateCount').textContent = n;
  if (n) {
    $('#plateCal').textContent = Math.round(t.cal).toLocaleString();
    $('#plateN').textContent = `${n} item${n === 1 ? '' : 's'}`;
  }
  renderHero();

  $$('#content [data-add]').forEach(btn => {
    const on = state.plate.some(p => p.recipe_id === btn.dataset.add);
    btn.dataset.in = on ? '1' : '0';
    btn.textContent = on ? '✓' : '+';
    btn.setAttribute('aria-label', `${on ? 'Remove from' : 'Add to'} plate`);
  });
}

function togglePlate(recipeId) {
  const at = state.plate.findIndex(p => p.recipe_id === recipeId);
  if (at >= 0) { state.plate.splice(at, 1); savePlate(); return; }
  const item = state.items.get(recipeId);
  if (!item) return;
  state.plate.push({
    recipe_id: recipeId, name: item.name, serving: item.serving_size,
    calories: item.calories || 0, protein: item.nutrients.protein_g || 0,
    carbs: item.nutrients.total_carbs_g || 0, fat: item.nutrients.total_fat_g || 0,
    implausible: item.label_implausible,
  });
  savePlate();
}

function openPlate() {
  const t = totals();
  const flagged = state.plate.filter(i => i.implausible).length;
  showSheet(`
    <div class="sheet__head">
      <div><h2>Your plate</h2><p>${esc($('#dayLabel').textContent)}</p></div>
      <button class="sheet__close" data-close>&times;</button>
    </div>
    <div class="bignums">
      <div class="bignum"><b>${Math.round(t.cal).toLocaleString()}</b><span>calories</span></div>
      <div class="bignum bignum--p"><b>${t.p.toFixed(0)}g</b><span>protein</span></div>
      <div class="bignum bignum--c"><b>${t.c.toFixed(0)}g</b><span>carbs</span></div>
      <div class="bignum bignum--f"><b>${t.f.toFixed(0)}g</b><span>fat</span></div>
    </div>
    ${flagged ? `<div class="notice"><span>⚠</span><span>${flagged} item${flagged === 1 ? '' : 's'}
      on this plate ${flagged === 1 ? 'has a label that fails' : 'have labels that fail'} the
      plausibility check, so these totals are probably too high.</span></div>` : ''}
    <h3>${state.plate.length} item${state.plate.length === 1 ? '' : 's'}</h3>
    ${state.plate.map(i => `<div class="plateitem">
      <div class="plateitem__meta"><strong>${esc(i.name)}</strong>
        <p>${esc(i.serving || '')} · ${Math.round(i.calories)} cal · ${i.protein.toFixed(1)}g protein</p>
      </div>
      <button class="remove" data-remove="${esc(i.recipe_id)}" aria-label="Remove">&times;</button>
    </div>`).join('')}`);
}

/* ------------------------------------------------------------------- stats */

async function openStats() {
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
      <button class="sheet__close" data-close>&times;</button>
    </div>
    <div class="bignums">
      <div class="bignum"><b>${d.days}</b><span>days</span></div>
      <div class="bignum"><b>${d.recipes.toLocaleString()}</b><span>recipes</span></div>
      <div class="bignum"><b>${d.menu_rows.toLocaleString()}</b><span>menu rows</span></div>
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
  if (!sheet.open) sheet.showModal();
}

async function openDetail(recipeId) {
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
    ? `<div class="notice"><span>⚠</span><span>This label does not describe one serving.
       ${item.serving_size ? `It reports ${Math.round(item.calories)} cal for ${esc(item.serving_size)}` : ''} —
       more than real food of that weight can hold, so it is almost certainly batch-level.
       Check the card posted at the station.</span></div>`
    : item.nutrition_suspect
    ? `<div class="notice"><span>⚠</span><span>The macros on this label do not add up to its
       calorie count, so at least one of the two is wrong.</span></div>` : '';

  const inPlate = state.plate.some(p => p.recipe_id === item.recipe_id);

  showSheet(`
    <div class="sheet__head">
      <div><h2>${esc(item.name)}</h2><p>${esc(item.serving_size || 'serving size not published')}</p></div>
      <button class="sheet__close" data-close>&times;</button>
    </div>
    ${warn}
    <div class="bignums">
      <div class="bignum"><b>${item.calories == null ? '–' : Math.round(item.calories)}</b><span>calories</span></div>
      <div class="bignum bignum--p"><b>${num(item.nutrients.protein_g, 1)}g</b><span>protein</span></div>
      <div class="bignum bignum--c"><b>${num(item.nutrients.total_carbs_g, 1)}g</b><span>carbs</span></div>
      <div class="bignum bignum--f"><b>${num(item.nutrients.total_fat_g, 1)}g</b><span>fat</span></div>
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
  $('#dateStrip').addEventListener('click', e => {
    const b = e.target.closest('[data-date]');
    if (!b) return;
    state.date = b.dataset.date;
    state.collapsed.clear();
    renderDates(); renderMeals(); renderHalls(); loadPlate(); render();
  });

  $('#mealTabs').addEventListener('click', e => {
    const b = e.target.closest('[data-meal]');
    if (!b || b.disabled) return;
    state.meal = b.dataset.meal;
    state.collapsed.clear();
    renderMeals(); renderHalls(); render();
  });

  $('#hallPills').addEventListener('click', e => {
    const b = e.target.closest('[data-loc]');
    if (!b) return;
    state.location = b.dataset.loc;
    state.collapsed.clear();
    renderHalls(); render();
  });

  let timer;
  $('#search').addEventListener('input', e => {
    state.q = e.target.value.trim();
    $('#searchClear').hidden = !state.q;
    clearTimeout(timer);
    timer = setTimeout(() => { renderActiveFilters(); render(); }, 180);
  });
  $('#searchClear').addEventListener('click', clearSearch);

  $('#filterToggle').addEventListener('click', () => $('#filterSheet').showModal());

  $('#activeFilters').addEventListener('click', e => {
    if (e.target.closest('[data-afclear]')) return resetFilters();
    const chip = e.target.closest('[data-af]');
    if (chip) $('#activeFilters')._filters[+chip.dataset.af].clear();
  });

  $('#content').addEventListener('click', e => {
    const all = e.target.closest('[data-collapseall]');
    if (all) {
      const keys = stationKeys(state.menu || { locations: [] });
      state.collapsed = all.dataset.collapseall === 'close' ? new Set(keys) : new Set();
      render();
      return;
    }
    const jump = e.target.closest('[data-jump]');
    if (jump) { scrollToSection(jump.dataset.jump); return; }

    // Toggling in place rather than re-rendering keeps the scroll position,
    // which matters on a 300-item All halls page.
    const collapse = e.target.closest('[data-collapse]');
    if (collapse) {
      const key = collapse.dataset.collapse;
      const open = state.collapsed.has(key);
      open ? state.collapsed.delete(key) : state.collapsed.add(key);
      collapse.setAttribute('aria-expanded', String(open));
      collapse.parentElement.querySelector('.cards').hidden = !open;
      return;
    }
    const add = e.target.closest('[data-add]');
    if (add) { e.stopPropagation(); togglePlate(add.dataset.add); return; }
    const c = e.target.closest('.card');
    if (c) openDetail(c.dataset.id);
  });

  $('#content').addEventListener('keydown', e => {
    const c = e.target.closest('.card');
    if (c && (e.key === 'Enter' || e.key === ' ')) { e.preventDefault(); openDetail(c.dataset.id); }
  });

  $('#statsToggle').addEventListener('click', openStats);

  $('#sheet').addEventListener('click', e => {
    if (e.target.closest('[data-close]') || e.target === $('#sheet')) { $('#sheet').close(); return; }
    const add = e.target.closest('[data-add]');
    if (add) {
      const added = !state.plate.some(p => p.recipe_id === add.dataset.add);
      togglePlate(add.dataset.add);
      add.dataset.in = added ? '1' : '0';
      add.className = added ? 'ghostbtn' : 'primarybtn';
      add.textContent = added ? 'Remove from plate' : 'Add to plate';
      return;
    }
    const rm = e.target.closest('[data-remove]');
    if (rm) { togglePlate(rm.dataset.remove); state.plate.length ? openPlate() : $('#sheet').close(); }
  });

  $('#plateToggle').addEventListener('click', () => state.plate.length && openPlate());
  $('#plateOpen').addEventListener('click', openPlate);
  $('#hero').addEventListener('click', e => {
    if (e.target.closest('#plateClear')) { state.plate = []; savePlate(); render(); }
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
  state.meta = await api('/api/meta');
  document.title = state.meta.college_name;
  $('#collegeName').textContent = state.meta.college_name;

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

  renderDates(); renderMeals(); renderHalls(); bind(); loadPlate();
  renderActiveFilters(); render();
}

init();
