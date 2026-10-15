import { router, useLocalSearchParams } from 'expo-router';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import {
  Pressable, ScrollView, SectionList, StyleSheet, Text, TextInput, View, type ViewToken,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { ItemCard } from '../../components/items';
import { Btn, Chip, Empty, Icon, IconBtn, LinkBtn, Loading, Notice, Segmented } from '../../components/ui';
import { apiFor } from '../../lib/api';
import {
  addDays, countOn, DIETS, hallName, hallStatus, HIGH_PROTEIN, hoursText, isLive, isToday, mondayOf, parseDay,
  plural, POPULAR, SCOPE_LABEL, served, shortHall, SORT_LABEL, titleCase, todayIso, weeksAvailable,
} from '../../lib/logic';
import { NO_FILTERS, useMeta } from '../../lib/store';
import { C, R, T } from '../../lib/theme';
import type { Item, Menu, SearchResult } from '../../lib/types';

interface ActiveFilter { label: string; clear: () => void; menuOnly?: boolean; quick?: boolean; isSearch?: boolean }

export default function MenuScreen() {
  const store = useMeta();
  const { meta, college, date, meal, location, setMeal, setLocation, filters, setFilters,
          profile, setProfile, isFav, recent, rememberSearch, clearRecent } = store;
  const api = useMemo(() => apiFor(college!), [college]);
  const params = useLocalSearchParams<{ focus?: string }>();
  const input = useRef<TextInput>(null);
  const [text, setText] = useState(filters.q);
  const [focused, setFocused] = useState(false);

  // The box follows the applied search when it changes from elsewhere
  // (Today's quick searches, a recent search, Clear all).
  const [syncedQ, setSyncedQ] = useState(filters.q);
  if (syncedQ !== filters.q) { setSyncedQ(filters.q); setText(filters.q); }
  useEffect(() => { if (params.focus) setTimeout(() => input.current?.focus(), 300); }, [params.focus]);

  /* ---------------------------------------------------- active filters

     One list describes every applied filter, so the chips, the badge on the
     Filters button and the decision to search instead of browse agree. */
  const active: ActiveFilter[] = [];
  if (filters.q) active.push({ label: `“${filters.q}”`, isSearch: true, clear: () => setFilters({ q: '' }) });
  if (filters.minProtein) active.push({ label: `Protein ≥ ${filters.minProtein}g`, quick: +filters.minProtein === HIGH_PROTEIN, clear: () => setFilters({ minProtein: '' }) });
  if (filters.maxCalories) active.push({ label: `Calories ≤ ${filters.maxCalories}`, quick: +filters.maxCalories === 400, clear: () => setFilters({ maxCalories: '' }) });
  profile.diets.forEach(d => active.push({ label: titleCase(d), quick: true, clear: () => setProfile({ ...profile, diets: profile.diets.filter(x => x !== d) }) }));
  profile.without.forEach(a => active.push({ label: `No ${titleCase(a)}`, clear: () => setProfile({ ...profile, without: profile.without.filter(x => x !== a) }) }));
  if (profile.without.length && profile.includeUnknown) active.push({ label: 'Incl. unknown allergens', clear: () => setProfile({ ...profile, includeUnknown: false }) });
  if (filters.sort !== 'name') active.push({ label: SORT_LABEL[filters.sort], clear: () => setFilters({ sort: 'name' }) });
  if (filters.scope !== 'meal') active.push({ label: SCOPE_LABEL[filters.scope], clear: () => setFilters({ scope: 'meal' }) });
  if (filters.hideImplausible) active.push({ label: 'Hiding odd labels', menuOnly: true, clear: () => setFilters({ hideImplausible: false }) });
  if (filters.favOnly) active.push({ label: 'Favorites', menuOnly: true, quick: true, clear: () => setFilters({ favOnly: false }) });
  const searching = active.some(f => !f.menuOnly);
  const sheetCount = active.filter(f => !f.isSearch && f.label !== 'Favorites').length;
  const shownChips = active.filter(f => !f.quick);

  const keep = (i: Item) => (!filters.hideImplausible || !i.label_implausible) && (!filters.favOnly || isFav(i.recipe_id));

  /* ---------------------------------------------------- data */

  const searchKey = JSON.stringify({ college, filters, profile, date, meal, location, searching });
  // Each answer carries the request it answers, so a stale one is never shown
  // and "loading" is simply "no answer for this request yet".
  const [answer, setAnswer] = useState<{ key: string; menu?: Menu; results?: SearchResult; error?: boolean } | null>(null);
  const fresh = answer?.key === searchKey ? answer : null;
  const loading = !fresh;
  const error = !!fresh?.error;
  const menu = fresh?.menu ?? null;
  const results = fresh?.results ?? null;

  useEffect(() => {
    if (!date || !meal) return;
    let live = true;
    const req = searching
      ? api.search({
          q: filters.q || undefined,
          scope: filters.scope === 'all' ? 'all' : 'day',
          date: filters.scope === 'all' ? undefined : date,
          meal: filters.scope === 'meal' ? meal : undefined,
          location: filters.scope === 'meal' && location !== 'all' ? location : undefined,
          min_protein: filters.minProtein || undefined,
          max_calories: filters.maxCalories || undefined,
          sort: filters.sort !== 'name' ? filters.sort : undefined,
          without: profile.without, diet: profile.diets,
          include_unknown: profile.includeUnknown ? '1' : undefined,
        }).then(r => { if (live) setAnswer({ key: searchKey, results: r }); })
      : api.menu(date, meal, location).then(m => { if (live) setAnswer({ key: searchKey, menu: m }); });
    req.catch(() => { if (live) setAnswer({ key: searchKey, error: true }); });
    return () => { live = false; };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchKey, api]);

  const scopeText = filters.scope === 'all' ? 'every stored day' : filters.scope === 'day' ? 'this whole day, all halls'
    : `${meal.toLowerCase()} at ${location === 'all' ? 'all halls' : shortHall(hallName(meta, location))}`;

  const submit = () => {
    const q = text.trim();
    setFilters({ q });
    if (q) rememberSearch(q);
    input.current?.blur();
  };

  /* ---------------------------------------------------- menu sections */

  const [collapsed, setCollapsed] = useState<Set<string>>(new Set());
  const many = (menu?.locations.length || 0) > 1;
  const sections = useMemo(() => (menu?.locations || []).flatMap(h => h.stations.map(stn => {
    const key = `${h.location_id}|${stn.station}`;
    const items = stn.items.filter(keep);
    return { key, title: stn.station, hall: many ? shortHall(h.location_name) : null, count: items.length,
             data: collapsed.has(key) ? [] : items };
  })).filter(sct => sct.count > 0),
  // eslint-disable-next-line react-hooks/exhaustive-deps
  [menu, collapsed, filters.hideImplausible, filters.favOnly, store.favs]);

  const list = useRef<SectionList<Item>>(null);
  const bar = useRef<ScrollView>(null);
  const [current, setCurrent] = useState<string | null>(null);
  const onViewable = useCallback(({ viewableItems }: { viewableItems: ViewToken[] }) => {
    const first = viewableItems.find(v => v.section);
    if (first) setCurrent((first.section as { key: string }).key);
  }, []);
  const jump = (i: number) => {
    // itemIndex 0 is the section header in a SectionList.
    list.current?.scrollToLocation({ sectionIndex: i, itemIndex: 0, viewOffset: 8, viewPosition: 0 });
  };

  /* ---------------------------------------------------- chrome */

  const status = location === 'all' ? null : hallStatus(meta, location, date);
  const total = meta.locations.reduce((n, l) => n + countOn(meta, date, meal, l.id), 0);
  const shownCount = location === 'all' ? total : countOn(meta, date, meal, location);

  const controls = (
    <View>
      <View style={{ paddingHorizontal: 16 }}>
        <Segmented value={meal} onChange={setMeal} options={meta.meals.map(m => ({
          value: m, label: m, live: isLive(meta, date, m),
          sub: meta.hours?.weekday ? (served(meta, date, m) ? hoursText(meta, date, m) : 'Not served') : undefined,
          disabled: !served(meta, date, m),
        }))} />
      </View>

      <WeekStrip />

      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={st.quick}>
        <Chip icon="heart" label="Favorites" on={filters.favOnly} onPress={() => setFilters({ favOnly: !filters.favOnly })} />
        <Chip icon="flash" label="High protein" on={+filters.minProtein === HIGH_PROTEIN}
          onPress={() => setFilters({ minProtein: +filters.minProtein === HIGH_PROTEIN ? '' : String(HIGH_PROTEIN) })} />
        {DIETS.map(d => (
          <Chip key={d} icon={d === 'halal' ? undefined : 'leaf'} label={titleCase(d)} on={profile.diets.includes(d)}
            onPress={() => setProfile({ ...profile, diets: profile.diets.includes(d) ? profile.diets.filter(x => x !== d) : [...profile.diets, d] })} />
        ))}
        <Chip icon="flame-outline" label="Under 400 cal" on={+filters.maxCalories === 400}
          onPress={() => setFilters({ maxCalories: +filters.maxCalories === 400 ? '' : '400' })} />
      </ScrollView>

      {shownChips.length > 0 && (
        <View style={[st.wrap, { paddingHorizontal: 16, paddingBottom: 8 }]}>
          {shownChips.map(f => <Chip key={f.label} label={f.label} on removable onPress={f.clear} />)}
          {active.length > 1 && <LinkBtn label="Clear all" onPress={() => {
            setFilters(NO_FILTERS); setProfile({ ...profile, diets: [], without: [], includeUnknown: false });
          }} />}
        </View>
      )}

    </View>
  );

  const header = (
    <View style={{ backgroundColor: C.bg }}>
      <View style={st.top}>
        <Pressable onPress={() => router.push('/hall')} style={st.hallBtn} accessibilityRole="button"
          accessibilityLabel={`Dining hall: ${location === 'all' ? 'All halls' : hallName(meta, location)}${status ? `, ${status.text}` : ''}. Change`}>
          <View style={[st.dot, { backgroundColor: status ? (status.open ? C.good : C.text3) : C.border }]} />
          <Text style={st.hallName} numberOfLines={1}>{location === 'all' ? 'All halls' : shortHall(hallName(meta, location))}</Text>
          <Text style={st.hallCount}>{shownCount}</Text>
          <Icon name="chevron-down" size={16} color={C.text2} />
        </Pressable>
        <View style={{ flex: 1 }} />
        <IconBtn name="heart-outline" label="Favorites" onPress={() => router.push('/favorites')} />
        <IconBtn name="person-circle-outline" label="You and settings" onPress={() => router.push('/settings')} />
      </View>

      <View style={st.searchRow}>
        <View style={st.search}>
          <Icon name="search" size={18} color={C.text3} />
          <TextInput ref={input} value={text} onChangeText={setText} onSubmitEditing={submit}
            onFocus={() => setFocused(true)} onBlur={() => setFocused(false)}
            placeholder="Search food, e.g. chicken" placeholderTextColor={C.text3}
            returnKeyType="search" autoCorrect={false} autoCapitalize="none" style={st.input}
            accessibilityLabel="Search food" />
          {text ? <IconBtn name="close-circle" label="Clear search" color={C.text3}
            onPress={() => { setText(''); setFilters({ q: '' }); }} /> : null}
        </View>
        <Pressable onPress={() => router.push('/filters')} style={st.filterBtn} accessibilityRole="button"
          accessibilityLabel={`Filters${sheetCount ? `, ${sheetCount} on` : ''}`}>
          <Icon name="options-outline" size={20} color={C.text} />
          {sheetCount ? <View style={st.badge}><Text style={st.badgeText}>{sheetCount}</Text></View> : null}
        </Pressable>
      </View>

      {focused && !text && (
        <View style={st.suggest}>
          {recent.length > 0 && (
            <View style={{ gap: 8 }}>
              <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                <Text style={st.suggestLabel}>Recent</Text><LinkBtn quiet label="Clear" onPress={clearRecent} />
              </View>
              <View style={st.wrap}>{recent.map(r => <Chip key={r} icon="time-outline" label={r}
                onPress={() => { setFilters({ q: r }); rememberSearch(r); input.current?.blur(); }} />)}</View>
            </View>
          )}
          <Text style={st.suggestLabel}>Popular</Text>
          <View style={st.wrap}>{POPULAR.filter(p => !recent.includes(p)).slice(0, 8).map(r => <Chip key={r} label={r}
            onPress={() => { setFilters({ q: r }); rememberSearch(r); input.current?.blur(); }} />)}</View>
        </View>
      )}

      {!searching && !loading && sections.length > 1 && (
        <ScrollView ref={bar} horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={st.stationBar}>
          {sections.map((sct, i) => (
            <Pressable key={sct.key} onPress={() => jump(i)} style={[st.stationLink, current === sct.key && st.stationLinkOn]}>
              <Text style={[st.stationLinkText, current === sct.key && { color: C.text }]} numberOfLines={1}>
                {sct.hall ? `${sct.hall} · ` : ''}{sct.title}</Text>
            </Pressable>
          ))}
        </ScrollView>
      )}
    </View>
  );

  /* ---------------------------------------------------- body */

  let body: React.ReactNode = null;
  if (loading) body = <Loading />;
  else if (error) {
    body = <Empty icon="cloud-offline-outline" title={searching ? 'Search needs a connection' : 'Can’t load this menu'}
      body="Check your connection and try again." />;
  } else if (searching && results) {
    if (results.error) body = <Empty title="Bad filter" body={results.error} />;
    else {
      const items = results.items.filter(keep);
      body = items.length ? (
        <View style={{ paddingHorizontal: 16 }}>
          {results.hidden_unknown_allergens && <Notice>Items whose allergen data was never published are hidden,
            because “nothing published” is not the same as “free of it”. Turn on “Also show items with no allergen data” in Filters to see them.</Notice>}
          <View style={st.resultLine}>
            <Text style={st.resultText}><Text style={{ color: C.text, fontWeight: '800' }}>{items.length}</Text> result{items.length === 1 ? '' : 's'} in {scopeText}</Text>
            {filters.scope === 'meal' && <LinkBtn label="Search all of today" onPress={() => setFilters({ scope: 'day' })} />}
          </View>
          {items.map(i => <ItemCard key={i.recipe_id} item={i} sub={placeSummary(i)} />)}
        </View>
      ) : (
        <Empty title="Nothing matches" body={`Nothing in ${scopeText} matches ${filters.q ? `“${filters.q}”` : 'these filters'}.`}>
          {filters.scope !== 'all' && <Btn label={filters.scope === 'meal' ? 'Search all of today' : 'Search every day'}
            onPress={() => setFilters({ scope: filters.scope === 'meal' ? 'day' : 'all' })} />}
          <Btn kind="ghost" label="Clear search and filters" onPress={() => {
            setFilters(NO_FILTERS); setProfile({ ...profile, diets: [], without: [], includeUnknown: false });
          }} />
        </Empty>
      );
    }
  } else if (menu && !menu.count) {
    const other = meta.meals.find(m => m !== meal && served(meta, date, m, location === 'all' ? null : location));
    body = (
      <Empty icon="time-outline" title={`No ${meal.toLowerCase()} here`}
        body={`${location === 'all' ? 'No hall' : shortHall(hallName(meta, location))} has no ${meal.toLowerCase()} menu on this date.`}>
        {other && <Btn label={`See ${other.toLowerCase()}`} onPress={() => setMeal(other)} />}
        {location !== 'all' && <Btn kind="ghost" label="Try all halls" onPress={() => setLocation('all')} />}
      </Empty>
    );
  } else if (menu && !sections.length) {
    body = filters.favOnly
      ? <Empty icon="heart-outline" title="None of your favorites here" body={`Nothing you have saved is on ${scopeText}.`}>
          <Btn kind="ghost" label="Show everything" onPress={() => setFilters({ favOnly: false })} />
        </Empty>
      : <Empty title="Everything here is filtered out" body="Every item on this menu has a label that fails the plausibility check." />;
  }

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: C.bg }} edges={['top']}>
      {header}
      {body ? <ScrollView contentContainerStyle={{ paddingBottom: 120 }} keyboardShouldPersistTaps="handled">{controls}{body}</ScrollView> : (
        <SectionList ref={list} sections={sections} keyExtractor={i => i.recipe_id}
          stickySectionHeadersEnabled={false} contentContainerStyle={{ paddingHorizontal: 16, paddingBottom: 120 }}
          onViewableItemsChanged={onViewable} viewabilityConfig={{ itemVisiblePercentThreshold: 10 }}
          onScrollToIndexFailed={({ index }) => setTimeout(() => list.current?.scrollToLocation({ sectionIndex: 0, itemIndex: index }), 200)}
          ListHeaderComponent={<View style={{ marginHorizontal: -16 }}>{controls}<View style={[st.resultLine, { paddingHorizontal: 16 }]}>
              <Text style={st.resultText}>{many
                ? `${menu!.count} items across ${menu!.locations.length} halls`
                : `${plural(menu!.count, 'item')} · ${plural(sections.length, 'station')}`}</Text>
              <LinkBtn label={collapsed.size ? 'Expand all' : 'Collapse all'} onPress={() =>
                setCollapsed(collapsed.size ? new Set() : new Set(sections.map(x => x.key)))} />
            </View></View>
          }
          renderSectionHeader={({ section: { key: k = '', hall, title, count } }) => (
            <Pressable style={st.station} accessibilityRole="button" accessibilityState={{ expanded: !collapsed.has(k) }}
              onPress={() => setCollapsed(prev => {
                const n = new Set(prev); if (n.has(k)) n.delete(k); else n.add(k); return n;
              })}>
              <Text style={st.stationName}>{hall ? <Text style={{ color: C.text3 }}>{hall} · </Text> : null}{title}</Text>
              <Text style={st.stationCount}>{count}</Text>
              <Icon name={collapsed.has(k) ? 'chevron-down' : 'chevron-up'} size={16} color={C.text3} />
            </Pressable>
          )}
          renderItem={({ item }) => <ItemCard item={item} sub={item.portion || item.serving_size} />}
        />
      )}
    </SafeAreaView>
  );
}

function placeSummary(item: Item) {
  const at = item.served_at || [];
  const halls = [...new Set(at.map(s => shortHall(s.location_name)))];
  const meals = [...new Set(at.map(s => s.meal))];
  return [halls.length > 2 ? `${halls.length} halls` : halls.join(', '), meals.join(', ')].filter(Boolean).join(' · ');
}

/** Monday-to-Sunday, a week at a time, so a weekday keeps its place week to week. */
function WeekStrip() {
  const { meta, date, setDate } = useMeta();
  const weeks = weeksAvailable(meta);
  const [week, setWeek] = useState(mondayOf(date));
  // Picking a day elsewhere (Today, Scan) brings its week into view.
  const [weekFor, setWeekFor] = useState(date);
  if (weekFor !== date) { setWeekFor(date); setWeek(mondayOf(date)); }
  const at = weeks.indexOf(week);
  const today = todayIso();
  const thisWeek = mondayOf(today);
  const first = parseDay(week), last = parseDay(addDays(week, 6));
  const fmt = (d: Date, month: boolean) => d.toLocaleDateString(undefined, month ? { month: 'short', day: 'numeric' } : { day: 'numeric' });
  const rel = week === thisWeek ? 'This week' : week === addDays(thisWeek, 7) ? 'Next week'
    : week === addDays(thisWeek, -7) ? 'Last week' : week < thisWeek ? 'Past' : 'Upcoming';

  return (
    <View style={{ paddingHorizontal: 16, paddingTop: 12 }}>
      <View style={st.weekNav}>
        <Text style={st.weekLabel}>{fmt(first, true)} – {fmt(last, first.getMonth() !== last.getMonth())}
          <Text style={{ color: C.text3, fontWeight: '500' }}>  {rel}</Text></Text>
        {date !== today && meta.dates.includes(today) && <LinkBtn label="Today" onPress={() => setDate(today)} />}
        <IconBtn name="chevron-back" label="Previous week" color={at <= 0 ? C.border : C.text}
          onPress={() => at > 0 && setWeek(weeks[at - 1])} />
        <IconBtn name="chevron-forward" label="Next week" color={at >= weeks.length - 1 ? C.border : C.text}
          onPress={() => at < weeks.length - 1 && setWeek(weeks[at + 1])} />
      </View>
      <View style={st.days}>
        {Array.from({ length: 7 }, (_, i) => {
          const d = addDays(week, i);
          const has = meta.dates.includes(d);
          const sel = d === date;
          const dt = parseDay(d);
          return (
            <Pressable key={d} disabled={!has} onPress={() => setDate(d)} style={[st.day, sel && st.daySel, !has && { opacity: 0.3 }]}
              accessibilityRole="tab" accessibilityState={{ selected: sel, disabled: !has }}
              accessibilityLabel={`${dt.toLocaleDateString(undefined, { weekday: 'long', month: 'long', day: 'numeric' })}${isToday(d) ? ', today' : ''}`}>
              <Text style={[st.dow, sel && { color: C.onAccent }]}>{dt.toLocaleDateString(undefined, { weekday: 'short' })}</Text>
              <Text style={[st.dnum, sel && { color: C.onAccent }]}>{dt.getDate()}</Text>
              {isToday(d) && <View style={st.todayDot} />}
            </Pressable>
          );
        })}
      </View>
    </View>
  );
}

const st = StyleSheet.create({
  top: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 16, paddingTop: 8, gap: 4 },
  hallBtn: { flexDirection: 'row', alignItems: 'center', gap: 8, height: 40, paddingHorizontal: 12, borderRadius: R.pill, backgroundColor: C.card, maxWidth: 240 },
  dot: { width: 8, height: 8, borderRadius: 4 },
  hallName: { color: C.text, fontSize: T.md, fontWeight: '700', flexShrink: 1 },
  hallCount: { color: C.text3, fontSize: T.sm, fontWeight: '700' },
  searchRow: { flexDirection: 'row', gap: 8, paddingHorizontal: 16, paddingVertical: 12 },
  search: { flex: 1, flexDirection: 'row', alignItems: 'center', gap: 8, height: 46, borderRadius: R.ctl, backgroundColor: C.card, paddingLeft: 14, borderWidth: StyleSheet.hairlineWidth, borderColor: C.border },
  input: { flex: 1, color: C.text, fontSize: T.md, height: 46 },
  filterBtn: { width: 46, height: 46, borderRadius: R.ctl, backgroundColor: C.card, alignItems: 'center', justifyContent: 'center', borderWidth: StyleSheet.hairlineWidth, borderColor: C.border },
  badge: { position: 'absolute', top: 6, right: 6, minWidth: 16, height: 16, borderRadius: 8, backgroundColor: C.accent, alignItems: 'center', justifyContent: 'center', paddingHorizontal: 4 },
  badgeText: { color: C.onAccent, fontSize: 10, fontWeight: '800' },
  suggest: { paddingHorizontal: 16, paddingBottom: 12, gap: 8 },
  suggestLabel: { color: C.text3, fontSize: T.xs, fontWeight: '700', textTransform: 'uppercase', letterSpacing: 0.6 },
  wrap: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, alignItems: 'center' },
  weekNav: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  weekLabel: { flex: 1, color: C.text, fontSize: T.md, fontWeight: '700' },
  days: { flexDirection: 'row', gap: 6, marginTop: 4 },
  day: { flex: 1, alignItems: 'center', paddingVertical: 8, borderRadius: R.ctl, backgroundColor: C.card, gap: 2 },
  daySel: { backgroundColor: C.accent },
  dow: { color: C.text3, fontSize: T.xs, fontWeight: '600' },
  dnum: { color: C.text, fontSize: T.lg, fontWeight: '800' },
  todayDot: { position: 'absolute', bottom: 4, width: 4, height: 4, borderRadius: 2, backgroundColor: C.gold },
  quick: { gap: 8, paddingHorizontal: 16, paddingVertical: 12 },
  stationBar: { gap: 6, paddingHorizontal: 16, paddingBottom: 10 },
  stationLink: { paddingHorizontal: 12, height: 32, justifyContent: 'center', borderRadius: R.pill, backgroundColor: C.surface, maxWidth: 220 },
  stationLinkOn: { backgroundColor: C.card3 },
  stationLinkText: { color: C.text2, fontSize: T.sm, fontWeight: '600' },
  resultLine: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingVertical: 8, gap: 8 },
  resultText: { color: C.text2, fontSize: T.sm, flex: 1 },
  station: { flexDirection: 'row', alignItems: 'center', gap: 8, paddingTop: 16, paddingBottom: 10 },
  stationName: { color: C.text, fontSize: T.lg, fontWeight: '800', flex: 1 },
  stationCount: { color: C.text3, fontSize: T.sm, fontWeight: '700' },
});
