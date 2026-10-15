import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Haptics from 'expo-haptics';
import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState, type ReactNode } from 'react';

import { apiFor, clearDayCache } from './api';
import { activeGoal, currentMeal, EMPTY_GOALS, homeDate, plateRow, type Scope, type Sort } from './logic';
import type { ActiveGoal, DayPlates, Fav, Goals, Item, Meta, PlateRow, Profile } from './types';

/* Everything personal lives on the phone: the campus, the person's name,
   favorites, the diet profile, targets, plates and water. Nothing is ever
   written to the server, so there are no accounts: each install is its own
   person, and iOS includes this storage in the phone's iCloud/device backup,
   so it follows them to a new phone.

   Storage keys match the web app's localStorage keys (dining.*), so the two
   clients describe a person's data the same way. */

const K = {
  college: 'cc.college',
  name: 'cc.name',
  onboarded: 'cc.onboarded',
  /** The last campus meta seen, so a relaunch paints at once instead of
      waiting on the server (which on Render's free plan may be asleep). */
  metaCache: (college: string) => `cc.cache.meta.${college}`,
  hall: (college: string) => `cc.hall.${college}`,
  favs: (college: string) => `dining.favs.${college}`,
  profile: 'dining.profile',
  goals: 'dining.goals',
  recent: 'dining.recent',
  plate: (date: string) => `dining.plate.${date}`,
  water: (date: string) => `dining.water.${date}`,
};

function save(key: string, value: unknown) {
  AsyncStorage.setItem(key, JSON.stringify(value)).catch(() => {});
}

export interface Filters {
  q: string;
  scope: Scope;
  minProtein: string;
  maxCalories: string;
  sort: Sort;
  hideImplausible: boolean;
  favOnly: boolean;
}
export const NO_FILTERS: Filters = {
  q: '', scope: 'meal', minProtein: '', maxCalories: '', sort: 'name', hideImplausible: false, favOnly: false,
};

export interface Toast { id: number; msg: string; undo?: () => void }

interface Store {
  /** False until storage has been read; nothing should render before. */
  hydrated: boolean;
  college: string | null;
  setCollege: (slug: string) => void;
  /** First-run setup finished: campus, name, diet and targets chosen. */
  onboarded: boolean;
  completeOnboarding: () => void;
  name: string;
  setName: (n: string) => void;
  /** Forget everything stored on this phone and go back to first-run setup. */
  eraseAll: () => Promise<void>;

  meta: Meta | null;
  metaError: string | null;
  reloadMeta: () => void;

  date: string;
  meal: string;
  location: string;
  setDate: (d: string) => void;
  setMeal: (m: string) => void;
  setLocation: (l: string) => void;

  profile: Profile;
  setProfile: (p: Profile) => void;
  favs: Record<string, Fav>;
  isFav: (id: string) => boolean;
  toggleFav: (item: Pick<Item, 'recipe_id' | 'name' | 'calories' | 'nutrients'>) => void;
  goals: Goals;
  goal: ActiveGoal;
  setGoals: (g: Goals) => void;
  recent: string[];
  rememberSearch: (q: string) => void;
  clearRecent: () => void;

  filters: Filters;
  setFilters: (patch: Partial<Filters>) => void;

  platesFor: (date: string) => DayPlates;
  onPlate: (id: string, meal?: string, date?: string) => boolean;
  togglePlate: (item: Item, meal?: string, date?: string) => void;
  addToPlate: (items: Item[], meal: string, date?: string) => void;
  setQty: (date: string, meal: string, id: string, delta: number) => void;
  removeFromPlate: (date: string, meal: string, id: string) => void;
  clearMeal: (date: string, meal: string) => void;
  water: (date: string) => number;
  setWater: (date: string, n: number) => void;

  toast: Toast | null;
  showToast: (msg: string, undo?: () => void) => void;
  hideToast: () => void;
}

const Ctx = createContext<Store | null>(null);

export function useStore() {
  const s = useContext(Ctx);
  if (!s) throw new Error('useStore outside StoreProvider');
  return s;
}

/** For screens that only render once a campus's meta has loaded. */
export function useMeta() {
  const s = useStore();
  if (!s.meta) throw new Error('useMeta before meta loaded');
  return { ...s, meta: s.meta };
}

export function StoreProvider({ children }: { children: ReactNode }) {
  const [hydrated, setHydrated] = useState(false);
  const [college, setCollegeState] = useState<string | null>(null);
  const [onboarded, setOnboarded] = useState(false);
  const [name, setNameState] = useState('');
  const [meta, setMeta] = useState<Meta | null>(null);
  const [metaError, setMetaError] = useState<string | null>(null);
  const [metaNonce, setMetaNonce] = useState(0);

  const [date, setDate] = useState('');
  const [meal, setMeal] = useState('');
  const [location, setLocationState] = useState('');

  const [profile, setProfileState] = useState<Profile>({ diets: [], without: [], includeUnknown: false });
  const [favs, setFavs] = useState<Record<string, Fav>>({});
  const [goals, setGoalsState] = useState<Goals>(EMPTY_GOALS);
  const [recent, setRecent] = useState<string[]>([]);
  const [plates, setPlates] = useState<Record<string, DayPlates>>({});
  const [waterByDay, setWaterByDay] = useState<Record<string, number>>({});
  const [filters, setFiltersState] = useState<Filters>(NO_FILTERS);
  const [toast, setToast] = useState<Toast | null>(null);
  const toastTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const stored = useRef<Record<string, unknown>>({});

  /* Read everything once at launch. Plates and water are a few hundred bytes
     a day, so holding them all in memory keeps every read synchronous. */
  useEffect(() => {
    (async () => {
      try {
        // The cached day menu is large and read on demand by loadDay, not here.
        const keys = (await AsyncStorage.getAllKeys())
          .filter(k => (k.startsWith('dining.') || k.startsWith('cc.')) && !k.startsWith('cc.cache.day.'));
        const pairs = await AsyncStorage.multiGet(keys);
        const all: Record<string, unknown> = {};
        pairs.forEach(([k, v]) => { try { if (v != null) all[k] = JSON.parse(v); } catch {} });
        stored.current = all;

        const p = all[K.profile] as Partial<Profile> | undefined;
        if (p) setProfileState({ diets: p.diets || [], without: p.without || [], includeUnknown: !!p.includeUnknown });
        if (all[K.goals]) setGoalsState({ ...EMPTY_GOALS, ...(all[K.goals] as Goals) });
        if (Array.isArray(all[K.recent])) setRecent(all[K.recent] as string[]);
        const pl: Record<string, DayPlates> = {};
        const wa: Record<string, number> = {};
        Object.entries(all).forEach(([k, v]) => {
          if (k.startsWith('dining.plate.') && v && typeof v === 'object' && !Array.isArray(v)) pl[k.slice(13)] = v as DayPlates;
          if (k.startsWith('dining.water.')) wa[k.slice(13)] = Number(v) || 0;
        });
        setPlates(pl);
        setWaterByDay(wa);
        if (typeof all[K.name] === 'string') setNameState(all[K.name] as string);
        setOnboarded(all[K.onboarded] === true);
        if (typeof all[K.college] === 'string') {
          const c = all[K.college] as string;
          setCollegeState(c);
          setFavs((all[K.favs(c)] as Record<string, Fav>) || {});
          const cached = all[K.metaCache(c)] as Meta | undefined;
          if (cached?.dates?.length) land(cached);
        }
      } finally {
        setHydrated(true);
      }
    })();
  }, []);

  /* Show a campus's meta, landing on today's current meal. A refresh of the
     same campus keeps the day and meal someone has already moved to. */
  const shown = useRef<string | null>(null);
  function land(m: Meta) {
    const same = shown.current === m.college;
    shown.current = m.college;
    setMeta(m);
    setDate(d => (same && d && m.dates.includes(d) ? d : homeDate(m)));
    setMeal(ml => (same && ml ? ml : currentMeal(m, homeDate(m))));
    const saved = stored.current[K.hall(m.college)] as string | undefined;
    setLocationState(l => (same && l ? l
      : saved && (saved === 'all' || m.locations.some(x => x.id === saved)) ? saved : m.locations[0]?.id || 'all'));
  }

  /* Load the campus's dates, halls and hours. A cached copy may already be on
     screen; this replaces it with the server's. */
  useEffect(() => {
    if (!college) return;
    let live = true;
    apiFor(college).meta().then(m => {
      if (!live) return;
      land(m);
      save(K.metaCache(college), m);
      stored.current[K.metaCache(college)] = m;
    }).catch(e => { if (live) setMetaError(String(e?.message || e)); });
    return () => { live = false; };
  }, [college, metaNonce]);

  const setCollege = useCallback((slug: string) => {
    save(K.college, slug);
    const prev = stored.current[K.college];
    stored.current[K.college] = slug;
    if (prev !== slug) {
      shown.current = null;
      setMeta(null);
      setMetaError(null);
      setLocationState('');
      setFiltersState(NO_FILTERS);
      setFavs((stored.current[K.favs(slug)] as Record<string, Fav>) || {});
      const cached = stored.current[K.metaCache(slug)] as Meta | undefined;
      if (cached?.dates?.length) land(cached);
    }
    setCollegeState(slug);
  }, []);

  const completeOnboarding = useCallback(() => { setOnboarded(true); save(K.onboarded, true); }, []);
  const setName = useCallback((n: string) => {
    const t = n.trim().slice(0, 40);
    setNameState(t);
    save(K.name, t);
  }, []);

  const eraseAll = useCallback(async () => {
    const keys = (await AsyncStorage.getAllKeys()).filter(k => k.startsWith('dining.') || k.startsWith('cc.'));
    await AsyncStorage.multiRemove(keys).catch(() => {});
    stored.current = {};
    shown.current = null;
    clearDayCache();
    setOnboarded(false); setNameState(''); setCollegeState(null); setMeta(null); setMetaError(null);
    setDate(''); setMeal(''); setLocationState('');
    setProfileState({ diets: [], without: [], includeUnknown: false });
    setFavs({}); setGoalsState(EMPTY_GOALS); setRecent([]); setPlates({}); setWaterByDay({});
    setFiltersState(NO_FILTERS); setToast(null);
  }, []);

  const setLocation = useCallback((l: string) => {
    setLocationState(l);
    if (college) { save(K.hall(college), l); stored.current[K.hall(college)] = l; }
  }, [college]);

  const setProfile = useCallback((p: Profile) => { setProfileState(p); save(K.profile, p); }, []);
  const setGoals = useCallback((g: Goals) => { setGoalsState(g); save(K.goals, g); }, []);
  const setFilters = useCallback((patch: Partial<Filters>) => setFiltersState(f => ({ ...f, ...patch })), []);

  const hideToast = useCallback(() => {
    if (toastTimer.current) clearTimeout(toastTimer.current);
    setToast(null);
  }, []);
  const showToast = useCallback((msg: string, undo?: () => void) => {
    if (toastTimer.current) clearTimeout(toastTimer.current);
    setToast({ id: Date.now(), msg, undo });
    toastTimer.current = setTimeout(() => setToast(null), 4000);
  }, []);

  const toggleFav = useCallback<Store['toggleFav']>((item) => {
    if (!college) return;
    Haptics.selectionAsync().catch(() => {});
    const next = { ...favs };
    const was = next[item.recipe_id];
    if (was) {
      delete next[item.recipe_id];
      showToast(`Removed ${was.name} from favorites`, () =>
        setFavs(p => { const n = { ...p, [item.recipe_id]: was }; save(K.favs(college), n); return n; }));
    } else {
      next[item.recipe_id] = { name: item.name, calories: item.calories,
                               protein: item.nutrients?.protein_g ?? null, added: Date.now() };
      showToast(`Saved ${item.name}. Today will tell you when it is on.`);
    }
    save(K.favs(college), next);
    setFavs(next);
  }, [college, favs, showToast]);

  const rememberSearch = useCallback((q: string) => {
    const t = q.trim().toLowerCase();
    if (t.length < 2) return;
    setRecent(prev => { const n = [t, ...prev.filter(r => r !== t)].slice(0, 6); save(K.recent, n); return n; });
  }, []);
  const clearRecent = useCallback(() => { setRecent([]); save(K.recent, []); }, []);

  /* ------------------------------------------------------------ plates */

  const platesFor = useCallback((d: string): DayPlates => plates[d] || {}, [plates]);

  const editDay = useCallback((d: string, fn: (day: DayPlates) => DayPlates) => {
    setPlates(prev => {
      const next = fn({ ...(prev[d] || {}) });
      save(K.plate(d), next);
      return { ...prev, [d]: next };
    });
  }, []);

  const onPlate = useCallback((id: string, m = meal, d = date) =>
    (plates[d]?.[m] || []).some(r => r.recipe_id === id), [plates, meal, date]);

  const togglePlate = useCallback((item: Item, m = meal, d = date) => {
    const was = (plates[d]?.[m] || []).some(r => r.recipe_id === item.recipe_id);
    const flip = () => editDay(d, day => {
      const rows = day[m] || [];
      const at = rows.findIndex(r => r.recipe_id === item.recipe_id);
      day[m] = at >= 0 ? rows.filter((_, i) => i !== at) : [...rows, plateRow(item)];
      return day;
    });
    flip();
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light).catch(() => {});
    showToast(was ? `Removed ${item.name}` : `Added ${item.name} to ${m.toLowerCase()}`, flip);
  }, [plates, meal, date, editDay, showToast]);

  const addToPlate = useCallback((items: Item[], m: string, d = date) => {
    editDay(d, day => {
      const rows = day[m] || [];
      const have = new Set(rows.map(r => r.recipe_id));
      day[m] = [...rows, ...items.filter(i => !have.has(i.recipe_id)).map(plateRow)];
      return day;
    });
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success).catch(() => {});
    showToast(`Added ${items.length} items to ${m.toLowerCase()}`);
  }, [date, editDay, showToast]);

  const setQty = useCallback((d: string, m: string, id: string, delta: number) => {
    editDay(d, day => {
      day[m] = (day[m] || []).map((r: PlateRow) => r.recipe_id === id
        ? { ...r, qty: Math.min(6, Math.max(0.5, (r.qty || 1) + delta * 0.5)) } : r);
      return day;
    });
  }, [editDay]);

  const removeFromPlate = useCallback((d: string, m: string, id: string) => {
    const row = (plates[d]?.[m] || []).find(r => r.recipe_id === id);
    editDay(d, day => { day[m] = (day[m] || []).filter(r => r.recipe_id !== id); return day; });
    if (row) showToast(`Removed ${row.name}`, () => editDay(d, day => { day[m] = [...(day[m] || []), row]; return day; }));
  }, [plates, editDay, showToast]);

  const clearMeal = useCallback((d: string, m: string) => {
    const rows = plates[d]?.[m] || [];
    editDay(d, day => { day[m] = []; return day; });
    if (rows.length) showToast(`Cleared ${m.toLowerCase()}`, () => editDay(d, day => { day[m] = rows; return day; }));
  }, [plates, editDay, showToast]);

  const water = useCallback((d: string) => waterByDay[d] || 0, [waterByDay]);
  const setWater = useCallback((d: string, n: number) => {
    Haptics.selectionAsync().catch(() => {});
    setWaterByDay(prev => ({ ...prev, [d]: n }));
    save(K.water(d), n);
  }, []);

  const value = useMemo<Store>(() => ({
    hydrated, college, setCollege, onboarded, completeOnboarding, name, setName, eraseAll,
    meta, metaError, reloadMeta: () => { setMetaError(null); setMetaNonce(n => n + 1); },
    date, meal, location, setDate, setMeal, setLocation,
    profile, setProfile,
    favs, isFav: (id: string) => Object.prototype.hasOwnProperty.call(favs, id), toggleFav,
    goals, goal: activeGoal(goals), setGoals,
    recent, rememberSearch, clearRecent,
    filters, setFilters,
    platesFor, onPlate, togglePlate, addToPlate, setQty, removeFromPlate, clearMeal,
    water, setWater,
    toast, showToast, hideToast,
  }), [hydrated, college, setCollege, onboarded, completeOnboarding, name, setName, eraseAll, meta, metaError, date, meal, location, setLocation, profile, setProfile,
       favs, toggleFav, goals, setGoals, recent, rememberSearch, clearRecent, filters, setFilters,
       platesFor, onPlate, togglePlate, addToPlate, setQty, removeFromPlate, clearMeal, water, setWater,
       toast, showToast, hideToast]);

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}
