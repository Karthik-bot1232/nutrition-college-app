/* Pure logic ported from dining/web/app.js: dates and hours, the diet profile,
   the plate builder and the name-card matcher. Nothing here touches React or
   storage, so both clients can be checked against each other line by line. */

import type { ActiveGoal, DayPlates, Goals, Item, Menu, Meta, PlateRow, Portion, Profile, Unit } from './types';

export const NUTRIENTS: [string, string, string][] = [
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

/** FDA Daily Values (21 CFR 101.9, the 2016 label). Trans fat and total sugars have none. */
export const DAILY_VALUE: Record<string, number> = {
  total_fat_g: 78, saturated_fat_g: 20, cholesterol_mg: 300, sodium_mg: 2300,
  total_carbs_g: 275, dietary_fiber_g: 28, added_sugars_g: 50, protein_g: 50,
  calcium_mg: 1300, iron_mg: 18, potassium_mg: 4700, vitamin_a_mcg: 900, vitamin_c_mg: 90,
};

/** Rows nested under another on a printed label. */
export const LABEL_DEPTH: Record<string, number> = {
  saturated_fat_g: 1, trans_fat_g: 1,
  dietary_fiber_g: 1, soluble_fiber_g: 2, insoluble_fiber_g: 2,
  total_sugars_g: 1, added_sugars_g: 2,
};
export const LABEL_BOLD = new Set(['total_fat_g', 'cholesterol_mg', 'sodium_mg', 'total_carbs_g', 'protein_g']);

export const DIETS = ['vegan', 'vegetarian', 'halal'];
export const SCOPE_LABEL = { meal: 'This meal only', day: 'This whole day', all: 'Every stored day' } as const;
export const SORT_LABEL = { name: 'Name', protein: 'Protein, high to low', calories: 'Calories, low to high' } as const;
export type Scope = keyof typeof SCOPE_LABEL;
export type Sort = keyof typeof SORT_LABEL;
export const HIGH_PROTEIN = 20;
export const POPULAR = ['chicken', 'pizza', 'salad', 'eggs', 'rice', 'tofu', 'burger', 'pasta', 'soup', 'cookie'];

export const MACROS = [
  { key: 'protein', label: 'protein', field: 'protein_g', kcal: 4 },
  { key: 'carbs', label: 'carbs', field: 'total_carbs_g', kcal: 4 },
  { key: 'fat', label: 'fat', field: 'total_fat_g', kcal: 9 },
] as const;

/* ---------------------------------------------------------------- text */

export const titleCase = (s: string) => s.replace(/_/g, ' ').replace(/\b\w/g, c => c.toUpperCase());
/** "South Campus Dining Hall" is three words of which one says anything. */
export const shortHall = (name: string) => String(name).replace(/\s+Dining Hall$/i, '');
export const plural = (n: number, word: string) => `${n} ${word}${n === 1 ? '' : 's'}`;
export const hallName = (meta: Meta, id: string) => meta.locations.find(l => l.id === id)?.name || id;
/** Servings as a person says them: "½", "1½", "0.75". */
export function fmtQty(q: number) {
  if (Number.isInteger(q)) return String(q);
  if (Number.isInteger(q * 2)) return q < 1 ? '½' : `${Math.floor(q)}½`;
  return String(Math.round(q * 100) / 100);
}

/** A label figure: whole milligrams, grams to one place, and "0g" not "0.0g". */
export function labelValue(v: number | null | undefined, unit: string): string | null {
  if (v == null) return null;
  if (unit !== 'g') return `${Math.round(v).toLocaleString()}${unit}`;
  const r = Math.round(v * 10) / 10;
  return `${Number.isInteger(r) ? r : r.toFixed(1)}${unit}`;
}

/* ---------------------------------------------------------------- dates */

export const iso = (d: Date) =>
  `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
export const parseDay = (s: string) => new Date(`${s}T12:00:00`);
export const todayIso = () => iso(new Date());

export function mondayOf(dateStr: string) {
  const d = parseDay(dateStr);
  d.setDate(d.getDate() - ((d.getDay() + 6) % 7));
  return iso(d);
}

export function addDays(dateStr: string, n: number) {
  const d = parseDay(dateStr);
  d.setDate(d.getDate() + n);
  return iso(d);
}

export function weeksAvailable(meta: Meta) {
  return [...new Set(meta.dates.map(mondayOf))].sort();
}

export const shortDay = (date: string) =>
  parseDay(date).toLocaleDateString(undefined, { weekday: 'short', month: 'short', day: 'numeric' });
export const longDay = (date: string) =>
  parseDay(date).toLocaleDateString(undefined, { weekday: 'long', month: 'long', day: 'numeric' });

export function greeting() {
  const h = new Date().getHours();
  return h < 5 ? 'Late night' : h < 12 ? 'Good morning' : h < 17 ? 'Good afternoon' : 'Good evening';
}

/** Home is about today; when there is no menu for today, the nearest day. */
export function homeDate(meta: Meta) {
  const today = todayIso();
  if (meta.dates.includes(today)) return today;
  return meta.dates.find(d => d > today) || meta.dates[meta.dates.length - 1];
}

/* ---------------------------------------------------------------- hours */

const toMin = (hhmm: string) => { const [h, m] = hhmm.split(':').map(Number); return h * 60 + m; };
const nowMin = () => { const d = new Date(); return d.getHours() * 60 + d.getMinutes(); };
export const isToday = (date: string) => date === todayIso();

export function fmtTime(hhmm: string) {
  let [h, m] = hhmm.split(':').map(Number);
  const ap = h >= 12 && h < 24 ? 'pm' : 'am';
  h = h % 12 || 12;
  return m ? `${h}:${String(m).padStart(2, '0')}${ap}` : `${h}${ap}`;
}

export function hoursFor(meta: Meta, date: string, meal: string): [string, string] | null {
  const H = meta.hours;
  if (!H || !H.weekday) return null;
  const dow = parseDay(date).getDay();
  const set = dow === 0 || dow === 6 ? H.weekend || H.weekday : H.weekday;
  return set?.[meal] || null;
}

export const hoursText = (meta: Meta, date: string, meal: string) => {
  const h = hoursFor(meta, date, meal);
  return h ? `${fmtTime(h[0])}–${fmtTime(h[1])}` : '';
};

export const countOn = (meta: Meta, date: string, meal: string, loc: string) =>
  meta.counts[`${date}|${meal}|${loc}`] || 0;

export const served = (meta: Meta, date: string, meal: string, loc?: string | null) =>
  loc ? countOn(meta, date, meal, loc) > 0
      : meta.locations.some(l => countOn(meta, date, meal, l.id) > 0);

export function isLive(meta: Meta, date: string, meal: string) {
  const h = hoursFor(meta, date, meal);
  const t = nowMin();
  return !!h && isToday(date) && t >= toMin(h[0]) && t < toMin(h[1]);
}

/** The meal that is on now, else the next one today, else the last one. */
export function currentMeal(meta: Meta, date: string) {
  const meals = meta.meals.filter(m => served(meta, date, m));
  if (!meals.length) return meta.meals[0];
  if (!isToday(date)) return meals[0];
  const t = nowMin();
  const now = meals.find(m => { const h = hoursFor(meta, date, m); return h && t >= toMin(h[0]) && t < toMin(h[1]); });
  if (now) return now;
  const next = meals.find(m => { const h = hoursFor(meta, date, m); return h && t < toMin(h[0]); });
  return next || meals[meals.length - 1];
}

export interface HallStatus { open: boolean; meal: string | null; text: string; short: string }

/** Where one hall stands right now: open, opening later, or done for the day. */
export function hallStatus(meta: Meta, loc: string, date: string): HallStatus | null {
  if (!isToday(date) || !meta.hours?.weekday) return null;
  const t = nowMin();
  for (const m of meta.meals) {
    if (!served(meta, date, m, loc)) continue;
    const h = hoursFor(meta, date, m);
    if (h && t >= toMin(h[0]) && t < toMin(h[1]))
      return { open: true, meal: m, text: `Open · ${m} until ${fmtTime(h[1])}`, short: `Open until ${fmtTime(h[1])}` };
  }
  for (const m of meta.meals) {
    if (!served(meta, date, m, loc)) continue;
    const h = hoursFor(meta, date, m);
    if (h && t < toMin(h[0]))
      return { open: false, meal: m, text: `Opens ${fmtTime(h[0])} for ${m.toLowerCase()}`, short: `Opens ${fmtTime(h[0])}` };
  }
  return { open: false, meal: null, text: 'Closed for the rest of today', short: 'Closed now' };
}

/* -------------------------------------------------------------- profile */

/** Unknown allergen data is not the same as free of it, so it fails while any exclusion is set. */
export function fitsProfile(i: Item, p: Profile) {
  if (p.diets.length && !p.diets.every(d => i.diets.includes(d))) return false;
  if (p.without.length) {
    if (!i.allergen_data_published) return false;
    if (p.without.some(a => i.allergens.includes(a))) return false;
  }
  return true;
}

/* ---------------------------------------------------------------- goals */

export const GOAL_DEFAULTS = { calories: 700, protein: 35, dayCalories: 2000, dayProtein: 100, water: 8 };
export const EMPTY_GOALS: Goals = { calories: '', protein: '', maxCarbs: '', maxFat: '', dayCalories: '', dayProtein: '', water: '' };

export function activeGoal(g: Goals): ActiveGoal {
  const n = (v: string) => (v === '' || v == null ? 0 : Number(v) || 0);
  return {
    calories: n(g.calories) || GOAL_DEFAULTS.calories,
    protein: n(g.protein) || GOAL_DEFAULTS.protein,
    maxCarbs: n(g.maxCarbs),
    maxFat: n(g.maxFat),
    dayCalories: n(g.dayCalories) || GOAL_DEFAULTS.dayCalories,
    dayProtein: n(g.dayProtein) || GOAL_DEFAULTS.dayProtein,
    water: Math.min(16, n(g.water) || GOAL_DEFAULTS.water),
    isDefault: !g.calories && !g.protein,
  };
}

/* --------------------------------------------------------------- plates */

export interface Totals { cal: number; p: number; c: number; f: number }

/** Totals over plate rows, each scaled by how many servings it was. */
export function totalsOf(rows: PlateRow[]): Totals {
  return rows.reduce((t, i) => {
    const q = i.qty || 1;
    return { cal: t.cal + (i.calories || 0) * q, p: t.p + (i.protein || 0) * q,
             c: t.c + (i.carbs || 0) * q, f: t.f + (i.fat || 0) * q };
  }, { cal: 0, p: 0, c: 0, f: 0 });
}

export const dayRows = (meta: Meta, plates: DayPlates | undefined) =>
  meta.meals.flatMap(m => plates?.[m] || []);

export function plateRow(item: Item, portion: Portion = { unit: 'serving', amount: 1 }): PlateRow {
  return withPortion({
    recipe_id: item.recipe_id, name: item.name, serving: item.serving_size, qty: 1,
    calories: item.calories || 0, protein: item.nutrients.protein_g || 0,
    carbs: item.nutrients.total_carbs_g || 0, fat: item.nutrients.total_fat_g || 0,
    implausible: item.label_implausible,
  }, portion);
}

/* ------------------------------------------------------------- portions

   Totals always multiply by servings (qty). A weight is turned into servings
   through the label's own serving size, which only works when that size is a
   weight: "4 oz" can be weighed, "1 each" cannot. */

export const G_PER_OZ = 28.3495;

/** Ounces in one serving: "4 oz", "3 OZ", "4 1/2 oz", "1/2 oz". Null for "1 each". */
export function servingOz(serving: string | null | undefined): number | null {
  const m = /^\s*(?:(\d+(?:\.\d+)?)\s+)?(\d+(?:\.\d+)?)(?:\/(\d+))?\s*`?\s*(?:oz|ounces?)\b/i.exec(serving || '');
  if (!m) return null;
  const frac = m[3] ? Number(m[2]) / Number(m[3]) : Number(m[2]);
  const oz = (m[1] ? Number(m[1]) : 0) + frac;
  return oz > 0 ? oz : null;
}

export const UNIT_LABEL: Record<Unit, string> = { serving: 'Servings', oz: 'Ounces', g: 'Grams' };
/** How far one tap of − or + moves, and the most a single row can be. */
export const UNIT_STEP: Record<Unit, number> = { serving: 0.5, oz: 1, g: 25 };
export const UNIT_MAX: Record<Unit, number> = { serving: 20, oz: 64, g: 2000 };

export function toServings(p: Portion, oz: number | null): number {
  if (p.unit === 'serving' || !oz) return p.amount;
  return (p.unit === 'oz' ? p.amount : p.amount / G_PER_OZ) / oz;
}

/** The same amount in another unit, rounded to what a person would type. */
export function convertPortion(p: Portion, to: Unit, oz: number | null): Portion {
  if (to === p.unit) return p;
  const servings = toServings(p, oz);
  if (to === 'serving' || !oz) return { unit: 'serving', amount: Math.max(0.25, Math.round(servings * 4) / 4) };
  if (to === 'oz') return { unit: 'oz', amount: Math.max(0.5, Math.round(servings * oz * 2) / 2) };
  return { unit: 'g', amount: Math.max(1, Math.round(servings * oz * G_PER_OZ)) };
}

export const rowPortion = (r: PlateRow): Portion =>
  ({ unit: r.unit || 'serving', amount: r.amount ?? (r.qty || 1) });

export function withPortion(r: PlateRow, p: Portion): PlateRow {
  return { ...r, unit: p.unit, amount: p.amount, qty: toServings(p, servingOz(r.serving)) };
}

/** "6 oz", "150 g", "1½ servings". */
export function fmtPortion(p: Portion) {
  if (p.unit === 'g') return `${Math.round(p.amount)} g`;
  if (p.unit === 'oz') return `${Math.round(p.amount * 10) / 10} oz`;
  return `${fmtQty(p.amount)} serving${p.amount === 1 ? '' : 's'}`;
}

/* -------------------------------------------------------------- builder

   Given what a hall is serving and a target, pick a few combinations that hit
   it: randomised greedy construction with restarts, then a swap pass. */

const OZ = /^\s*([\d.]+)\s*(?:oz|ounce)/i;
const DISCRETE = /\b(each|ea|slice|slices|piece|pieces|sandwich|wrap|burger|cup|bowl|bar)\b/i;

/** Is this something you eat, or something you put on something you eat? */
export function isGarnish(item: Item) {
  const size = item.serving_size || item.portion || '';
  if (DISCRETE.test(size)) return false;
  const m = OZ.exec(size);
  if (!m) return false;
  return parseFloat(m[1]) <= 1 && (item.calories || 0) < 150 && (item.nutrients.protein_g || 0) < 12;
}

export interface PoolItem extends Item { _station: string; _stationName: string; _hall: string; _garnish: boolean }
export interface Plan { items: PoolItem[]; score: number; totals: Totals }

function sumItems(items: Item[]): Totals {
  return items.reduce((t, i) => ({
    cal: t.cal + (i.calories || 0),
    p: t.p + (i.nutrients.protein_g || 0),
    c: t.c + (i.nutrients.total_carbs_g || 0),
    f: t.f + (i.nutrients.total_fat_g || 0),
  }), { cal: 0, p: 0, c: 0, f: 0 });
}

function scorePlate(items: PoolItem[], goal: ActiveGoal) {
  const t = sumItems(items);
  let s = 0;
  const overshoot = Math.max(0, t.cal - goal.calories) / goal.calories;
  const shortfall = Math.max(0, goal.calories - t.cal) / goal.calories;
  // Going over is worse than coming up short.
  s -= overshoot * 140 + shortfall * 85;
  if (goal.protein > 0) {
    const miss = Math.max(0, goal.protein - t.p) / goal.protein;
    s -= miss * 110;
    if (miss === 0) s += 8;
  }
  if (goal.maxCarbs > 0) s -= Math.max(0, t.c - goal.maxCarbs) / goal.maxCarbs * 70;
  if (goal.maxFat > 0) s -= Math.max(0, t.f - goal.maxFat) / goal.maxFat * 70;
  if (items.length < 2) s -= 18;
  if (items.length > 5) s -= (items.length - 5) * 12;
  s += Math.min(new Set(items.map(i => i._station)).size, 3) * 4;
  const garnishes = items.filter(i => i._garnish).length;
  if (items.length - garnishes < 2) s -= 45;
  if (garnishes > 1) s -= (garnishes - 1) * 35;
  return s;
}

export function buildPool(menu: Menu | null, profile: Profile): PoolItem[] {
  const out: PoolItem[] = [];
  (menu?.locations || []).forEach(hall => hall.stations.forEach(st => st.items.forEach(i => {
    if (i.calories == null || i.calories < 15) return;
    if (i.label_implausible || i.nutrition_suspect) return;
    if (!fitsProfile(i, profile)) return;
    out.push({ ...i, _station: `${hall.location_name} · ${st.station}`, _stationName: st.station,
               _hall: hall.location_name, _garnish: isGarnish(i) });
  })));
  return out;
}

export function buildPlans(pool: PoolItem[], goal: ActiveGoal, want = 3): Plan[] {
  if (pool.length < 2) return [];
  const plans: Plan[] = [];
  const seen = new Set<string>();
  const pick = () => pool[(Math.random() * pool.length) | 0];

  for (let restart = 0; restart < 90; restart++) {
    const plate: PoolItem[] = [];
    const used = new Set<string>();
    for (let step = 0; step < 6; step++) {
      let best: PoolItem | null = null;
      let bestScore = plate.length ? scorePlate(plate, goal) : -1e9;
      for (let k = 0; k < 45; k++) {
        const cand = pick();
        if (used.has(cand.recipe_id)) continue;
        const sc = scorePlate([...plate, cand], goal);
        if (sc > bestScore) { bestScore = sc; best = cand; }
      }
      if (!best) break;
      plate.push(best); used.add(best.recipe_id);
    }
    if (plate.length < 2) continue;

    for (let pass = 0; pass < 2; pass++) {
      for (let i = 0; i < plate.length; i++) {
        let bestScore = scorePlate(plate, goal);
        let swap: PoolItem | null = null;
        for (let k = 0; k < 40; k++) {
          const cand = pick();
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

/* -------------------------------------------------------------- day items */

export interface At { hall: string; loc: string; station: string }
export interface DayItem extends Item { _at: At[] }

/** Flatten one meal of a day into unique items with where they are. */
export function dayItems(dayMenu: Menu | undefined): DayItem[] {
  const seen = new Map<string, DayItem>();
  (dayMenu?.locations || []).forEach(h => h.stations.forEach(st => st.items.forEach(i => {
    const at = { hall: shortHall(h.location_name), loc: h.location_id, station: st.station };
    const have = seen.get(i.recipe_id);
    if (have) have._at.push(at);
    else seen.set(i.recipe_id, { ...i, _at: [at] });
  })));
  return [...seen.values()];
}

/* ------------------------------------------------------------------ scan

   OCR text from a photographed name card, fuzzy-matched against what is
   served that day. Same scorer as the web app's Scan tab. */

const SCAN_STOP = new Set(['w', 'with', 'and', 'the', 'of', 'an']);
export const SCAN_SURE = 0.72;
const SCAN_MARGIN = 0.08;
const OCR_DIGIT: Record<string, string> = { 0: 'o', 1: 'l', 5: 's', 8: 'b' };

export function scanWords(s: string) {
  return String(s).normalize('NFKD').replace(/[̀-ͯ]/g, '').toLowerCase()
    .replace(/[|!]/g, 'l').replace(/[^a-z0-9]+/g, ' ').trim().split(' ')
    .map(t => (/[a-z]/.test(t) && /\d/.test(t) ? t.replace(/[0158]/g, d => OCR_DIGIT[d]) : t))
    .filter(t => t.length > 1 && !SCAN_STOP.has(t));
}

function editDistance(a: string, b: string) {
  const d: number[][] = Array.from({ length: a.length + 1 }, (_, i) => [i]);
  for (let j = 1; j <= b.length; j++) d[0][j] = j;
  for (let i = 1; i <= a.length; i++) {
    for (let j = 1; j <= b.length; j++) {
      d[i][j] = Math.min(d[i - 1][j] + 1, d[i][j - 1] + 1, d[i - 1][j - 1] + (a[i - 1] !== b[j - 1] ? 1 : 0));
      if (i > 1 && j > 1 && a[i - 1] === b[j - 2] && a[i - 2] === b[j - 1]) {
        d[i][j] = Math.min(d[i][j], d[i - 2][j - 2] + 1);
      }
    }
  }
  return d[a.length][b.length];
}

function wordSim(a: string, b: string) {
  if (a === b) return 1;
  if (a.length < 4 || b.length < 4) return 0;
  const s = 1 - editDistance(a, b) / Math.max(a.length, b.length);
  return s >= 0.7 ? s : 0;
}

function nameScore(name: string[], text: string[]) {
  const used = new Set<number>();
  let hitName = 0, hitText = 0;
  for (const w of name) {
    let best = 0, at = -1;
    text.forEach((t, i) => {
      if (used.has(i)) return;
      const s = wordSim(w, t);
      if (s > best) { best = s; at = i; }
    });
    if (at < 0) continue;
    used.add(at);
    hitName += best * w.length;
    hitText += best * text[at].length;
  }
  const recall = hitName / name.reduce((n, w) => n + w.length, 0);
  const precision = hitText / text.reduce((n, w) => n + w.length, 0);
  return recall + precision ? (2 * recall * precision) / (recall + precision) : 0;
}

export interface ScanCandidate { item: DayItem; meal: string; rank: number; words: string[] }
export interface ScanMatch extends ScanCandidate { fit: number; score: number }

export function scanCandidates(day: Record<string, Menu>, meal: string, location: string): ScanCandidate[] {
  const byName = new Map<string, ScanCandidate>();
  Object.entries(day).forEach(([m, menu]) => dayItems(menu).forEach(i => {
    const words = scanWords(i.name);
    if (!words.length) return;
    const now = m === meal;
    const here = location === 'all' || i._at.some(a => a.loc === location);
    const rank = (now ? 2 : 0) + (now && here ? 1 : 0);
    const key = words.join(' ');
    const have = byName.get(key);
    if (!have || rank > have.rank) byName.set(key, { item: i, meal: m, rank, words });
  }));
  return [...byName.values()];
}

export function matchScan(text: string, candidates: ScanCandidate[]): ScanMatch[] {
  const lines = String(text).split(/\n+/).map(scanWords).filter(l => l.length);
  const windows: string[][] = [];
  for (let i = 0; i < lines.length; i++) {
    for (let k = 1; k <= 3 && i + k <= lines.length; k++) windows.push(lines.slice(i, i + k).flat());
  }
  if (!windows.length) return [];
  return candidates.map(c => {
    const fit = Math.max(...windows.map(w => nameScore(c.words, w)));
    return { ...c, fit, score: fit + 0.04 * c.rank };
  }).filter(c => c.fit >= 0.3).sort((a, b) => b.score - a.score).slice(0, 5);
}

/** The card's text as editable lines: only the ones that looked like a name. */
export function readableScanText(lines: string[]) {
  return lines.join('\n').split(/\n+/)
    .map(l => l.replace(/[^\p{L}\p{N}&'’ -]+/gu, ' ').replace(/\s+/g, ' ').trim())
    .filter(l => (l.match(/\p{L}/gu) || []).length >= 3)
    .join('\n');
}

/** Open the label without asking only when nothing else is a real contender. */
export function scanIsSure(matches: ScanMatch[]) {
  const [top, next] = matches;
  if (!top || top.fit < SCAN_SURE) return false;
  if (next && top.score - next.score < SCAN_MARGIN) return false;
  return !matches.slice(1).some(c => c.fit >= 0.55 && c.words.length > top.words.length
                                   && top.words.every(w => c.words.includes(w)));
}
