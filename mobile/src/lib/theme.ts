/* The web app's tokens (dining/web/styles.css), so both clients look like one
   product: true black, two steps up for depth, UMD red as the accent, and one
   hue per macro used everywhere that macro appears. */

export const C = {
  bg: '#000000',
  surface: '#0E0E10',
  card: '#16161A',
  card2: '#1D1D22',
  card3: '#25252B',
  border: '#26262B',
  borderControl: '#6B6B75',

  text: '#F5F5F7',
  text2: '#A1A1AA',
  text3: '#8A8A93',

  accent: '#E21833',
  accentPress: '#C41429',
  accentText: '#F04055',
  onAccent: '#FFFFFF',
  accentWash: 'rgba(226, 24, 51, 0.14)',
  gold: '#FFD200',

  carbs: '#F5B94A',
  protein: '#B69CFF',
  fat: '#5AB0FF',
  proteinWash: 'rgba(182, 156, 255, 0.14)',

  good: '#22C55E',
  goodWash: 'rgba(34, 197, 94, 0.15)',
  warn: '#F5B94A',
  warnWash: 'rgba(245, 185, 74, 0.13)',
  danger: '#FF6B6B',
  dangerWash: 'rgba(255, 107, 107, 0.13)',
  water: '#4FC3F7',
  fav: '#FF5C8A',
} as const;

export const R = { card: 16, ctl: 12, pill: 999, sheet: 22 } as const;

export const T = { hero: 24, xl: 22, lg: 17, md: 15, sm: 13, xs: 11.5 } as const;

/** Apple's minimum tap target. */
export const TAP = 44;

export const MACRO_COLOR = { protein: C.protein, carbs: C.carbs, fat: C.fat } as const;
