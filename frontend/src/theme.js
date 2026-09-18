/* One definition of each macro, imported everywhere it is drawn.

   The spec asks for macros colour-coded consistently, and the reliable way to
   get that is to make it impossible to do otherwise: no screen names a macro
   colour itself, they all read this list. `key` matches the API field, `var` is
   the CSS custom property holding the colour. */
export const MACROS = [
  { key: 'calories', label: 'Calories', short: 'Cal', unit: '', var: '--cal' },
  { key: 'protein',  label: 'Protein',  short: 'P',   unit: 'g', var: '--protein' },
  { key: 'carbs',    label: 'Carbs',    short: 'C',   unit: 'g', var: '--carbs' },
  { key: 'fat',      label: 'Fat',      short: 'F',   unit: 'g', var: '--fat' },
];

export const MACRO_BY_KEY = Object.fromEntries(MACROS.map(m => [m.key, m]));

/** The nutrients shown on the detail sheet, in label order. */
export const FULL_NUTRIENTS = [
  { key: 'calories', label: 'Calories', unit: '' },
  { key: 'protein', label: 'Protein', unit: 'g' },
  { key: 'carbs', label: 'Carbohydrate', unit: 'g' },
  { key: 'fiber', label: 'Dietary fiber', unit: 'g', indent: true },
  { key: 'sugar', label: 'Total sugars', unit: 'g', indent: true },
  { key: 'fat', label: 'Fat', unit: 'g' },
  { key: 'sodium', label: 'Sodium', unit: 'mg' },
];

export const titleCase = s =>
  String(s ?? '').replace(/_/g, ' ').replace(/\b\w/g, c => c.toUpperCase());

/** Nutrient values can be null: the hall published no figure. That is not zero,
    and every screen has to render it as unknown rather than quietly as 0. */
export const fmt = (v, unit = '') => (v == null ? '—' : `${Math.round(v)}${unit}`);
