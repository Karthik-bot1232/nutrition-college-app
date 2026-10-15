import AsyncStorage from '@react-native-async-storage/async-storage';
import Constants from 'expo-constants';

import type { College, DetailItem, Menu, Meta, SearchResult, Stats } from './types';

/* Where dining.serve lives.

   A release build is pointed at the deployed server with EXPO_PUBLIC_API_URL
   (inlined at build time). In development nothing needs setting: the phone is
   already talking to the Mac's Metro server, so the API is assumed to be on
   that same machine at :8000 -- run it with HOST=0.0.0.0 so the phone can
   reach it. */
function devBase(): string {
  const host = Constants.expoConfig?.hostUri?.split(':')[0];
  return `http://${host || '127.0.0.1'}:8000`;
}

export const API_BASE = (process.env.EXPO_PUBLIC_API_URL || devBase()).replace(/\/+$/, '');

/** Served by dining.serve from dining/web, so they live wherever the API does. */
export const PRIVACY_URL = `${API_BASE}/privacy.html`;
export const SUPPORT_URL = `${API_BASE}/support.html`;

/** A free Render instance takes ~30s to wake, so the timeout is generous. */
const TIMEOUT_MS = 45_000;

export class ApiError extends Error {}

type Params = Record<string, string | string[] | undefined>;

async function get<T>(path: string, params?: Params): Promise<T> {
  const qs = new URLSearchParams();
  Object.entries(params || {}).forEach(([k, v]) => {
    if (v == null || v === '') return;
    (Array.isArray(v) ? v : [v]).forEach(x => qs.append(k, x));
  });
  const url = `${API_BASE}${path}${qs.toString() ? `?${qs}` : ''}`;
  const ctl = new AbortController();
  const timer = setTimeout(() => ctl.abort(), TIMEOUT_MS);
  let r: Response;
  try {
    r = await fetch(url, { signal: ctl.signal });
  } catch {
    throw new ApiError(`Could not reach ${API_BASE}`);
  } finally {
    clearTimeout(timer);
  }
  const body = await r.json().catch(() => null);
  if (!r.ok) throw new ApiError(body?.error || `HTTP ${r.status}`);
  return body as T;
}

/** Every call but the campus list is about one college. */
export function apiFor(college: string) {
  return {
    meta: () => get<Meta>('/api/meta', { college }),
    stats: () => get<Stats>('/api/stats', { college }),
    item: (id: string) => get<DetailItem & { error?: string }>('/api/item', { college, id }),
    menu: (date: string, meal: string, location: string) =>
      get<Menu>('/api/menu', { college, date, meal, location }),
    search: (params: Params) => get<SearchResult>('/api/search', { ...params, college }),
  };
}

export const listColleges = () =>
  get<{ colleges: College[] }>('/api/colleges').then(r => r.colleges);

/* Every hall, every meal of one day, fetched once and kept. Today, Scan and
   Favorites all look at the same day; one fetch serves all three.

   The most recent day is also kept on the phone. A day's menu does not change
   once published, so a relaunch can show it straight away -- and still has it
   with no signal in a dining hall basement. */
const days = new Map<string, Record<string, Menu>>();
const dayKey = (college: string) => `cc.cache.day.${college}`;

export async function loadDay(meta: Meta, date: string): Promise<Record<string, Menu>> {
  const key = `${meta.college}|${date}`;
  const hit = days.get(key);
  if (hit) return hit;

  try {
    const saved = JSON.parse((await AsyncStorage.getItem(dayKey(meta.college))) || 'null');
    if (saved?.date === date && saved.day && Object.keys(saved.day).length) {
      days.set(key, saved.day);
      return saved.day;
    }
  } catch {}

  const api = apiFor(meta.college);
  const meals = meta.meals.filter(m =>
    meta.locations.some(l => (meta.counts[`${date}|${m}|${l.id}`] || 0) > 0));
  const pairs = await Promise.all(meals.map(m =>
    api.menu(date, m, 'all').then(d => [m, d] as const).catch(() => null)));
  const day = Object.fromEntries(pairs.filter((p): p is readonly [string, Menu] => !!p));
  // Only a complete day is worth keeping: a half-failed fetch would otherwise
  // be served from the phone forever.
  if (Object.keys(day).length && pairs.every(Boolean)) {
    days.set(key, day);
    AsyncStorage.setItem(dayKey(meta.college), JSON.stringify({ date, day })).catch(() => {});
  }
  return day;
}

/** Forget cached days, e.g. after pull-to-refresh. */
export const clearDayCache = () => days.clear();
