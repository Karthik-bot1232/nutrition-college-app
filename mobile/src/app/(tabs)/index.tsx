import { router } from 'expo-router';
import { useCallback, useEffect, useState } from 'react';
import { FlatList, Pressable, RefreshControl, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { DayCard, WaterRow } from '../../components/Day';
import { MiniCard, openItem } from '../../components/items';
import { TopBar } from '../../components/TopBar';
import { Chip, Icon, Panel, SectionHead, s as ui } from '../../components/ui';
import { clearDayCache, loadDay } from '../../lib/api';
import {
  countOn, currentMeal, dayItems, fitsProfile, greeting, hallStatus, homeDate, hoursText, isGarnish,
  isToday, POPULAR, shortDay, shortHall, titleCase, type DayItem,
} from '../../lib/logic';
import { useMeta } from '../../lib/store';
import { C, R, T } from '../../lib/theme';
import type { Menu } from '../../lib/types';

/* The first screen answers, in order: what is open right now, whether anything
   you love is on, what is good for you this meal, and how your day is going. */
export default function Today() {
  const { meta, name, profile, favs, isFav, setDate, setMeal, setLocation, setFilters, reloadMeta } = useMeta();
  const date = homeDate(meta);
  const meal = currentMeal(meta, date);
  const [loaded, setLoaded] = useState<{ key: string; day: Record<string, Menu> } | null>(null);
  const dayKey = `${meta.college}|${date}`;
  const day = loaded?.key === dayKey ? loaded.day : null;
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    let live = true;
    loadDay(meta, date).then(d => { if (live) setLoaded({ key: dayKey, day: d }); });
    return () => { live = false; };
  }, [meta, date, dayKey]);

  const refresh = useCallback(() => {
    setRefreshing(true);
    clearDayCache();
    reloadMeta();
    setTimeout(() => setRefreshing(false), 800);
  }, [reloadMeta]);

  const openHall = (loc: string, m: string) => {
    setDate(date); setMeal(m); setLocation(loc);
    router.navigate('/menu');
  };
  const searchFor = (q: string) => {
    setDate(date);
    setFilters({ q });
    router.navigate('/menu');
  };

  const items = dayItems(day?.[meal]).filter(i => i.calories != null && !i.label_implausible && !i.nutrition_suspect);
  const fits = items.filter(i => fitsProfile(i, profile) && !isGarnish(i));
  const p = (i: DayItem) => i.nutrients.protein_g || 0;
  const byProtein = [...fits].sort((a, b) => p(b) - p(a)).slice(0, 10);
  const light = fits.filter(i => i.calories! >= 120 && i.calories! <= 450 && p(i) >= 8)
    .sort((a, b) => p(b) / b.calories! - p(a) / a.calories!).slice(0, 10);
  const plant = fits.filter(i => i.diets.includes('vegan') && i.calories! >= 60).sort((a, b) => p(b) - p(a)).slice(0, 10);

  // Favorites are checked against every meal of the day: "your pizza is on at
  // dinner" is worth knowing at noon.
  const favHits: (DayItem & { _meal: string })[] = [];
  Object.entries(day || {}).forEach(([m, menu]) => dayItems(menu).forEach(i => {
    if (isFav(i.recipe_id) && !favHits.some(f => f.recipe_id === i.recipe_id)) favHits.push({ ...i, _meal: m });
  }));
  const favCount = Object.keys(favs).length;
  const profileText = [...profile.diets.map(titleCase), ...profile.without.map(a => `no ${titleCase(a).toLowerCase()}`)].join(' · ');

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: C.bg }} edges={['top']}>
      <ScrollView contentContainerStyle={{ paddingBottom: 120 }}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={refresh} tintColor={C.text2} />}>
        <TopBar title={name ? `${greeting()}, ${name}` : greeting()} sub={`${shortDay(date)} · ${meta.college_name}`}
          onSub={() => router.push('/campus')} />

        <View style={{ paddingHorizontal: 16 }}>
          <Pressable style={st.search} onPress={() => router.navigate({ pathname: '/menu', params: { focus: '1' } })}
            accessibilityRole="search" accessibilityLabel="Search food">
            <Icon name="search" size={18} color={C.text3} />
            <Text style={st.searchText}>Search food, e.g. chicken</Text>
          </Pressable>

          <SectionHead icon="time-outline" title={isToday(date) ? 'Dining halls now' : `Dining halls · ${shortDay(date)}`}
            action="Compare all" onAction={() => openHall('all', meal)} />
          <View style={{ gap: 8 }}>
            {meta.locations.map(l => {
              const status = hallStatus(meta, l.id, date);
              const showMeal = status?.meal || meal;
              const n = countOn(meta, date, showMeal, l.id);
              return (
                <Pressable key={l.id} onPress={() => openHall(l.id, showMeal)}
                  style={({ pressed }) => [st.hall, pressed && { opacity: 0.8 }]} accessibilityRole="button"
                  accessibilityLabel={`${shortHall(l.name)}, ${status?.text || showMeal}, ${n} items`}>
                  <View style={[st.dot, { backgroundColor: status ? (status.open ? C.good : C.text3) : C.border }]} />
                  <View style={{ flex: 1 }}>
                    <Text style={st.hallName}>{shortHall(l.name)}</Text>
                    <Text style={st.hallStatus}>{status?.text || `${showMeal} · ${hoursText(meta, date, showMeal) || shortDay(date)}`}</Text>
                  </View>
                  <Text style={st.hallCount}>{n ? <Text style={{ color: C.text, fontWeight: '800' }}>{n}</Text> : null}{n ? ' items' : 'No menu'}</Text>
                  <Icon name="chevron-forward" size={16} color={C.text3} />
                </Pressable>
              );
            })}
          </View>

          <SectionHead icon="heart-outline" title="Favorites on today"
            action={favCount ? `All ${favCount}` : undefined} onAction={() => router.push('/favorites')} />
          {!day ? <View style={st.skeleton} /> : favHits.length ? (
            <View style={{ gap: 8 }}>
              {favHits.map(i => (
                <Pressable key={i.recipe_id} style={st.favHit} onPress={() => openItem(i.recipe_id)} accessibilityRole="button">
                  <Text style={st.hallName}>{i.name}</Text>
                  <Text style={st.hallStatus}>{i._meal} · {[...new Set(i._at.map(a => a.hall))].join(', ')}</Text>
                </Pressable>
              ))}
            </View>
          ) : (
            <Text style={ui.muted}>{favCount
              ? 'None of your favorites are on today’s menu.'
              : 'Tap the heart on anything you love. This is where you will find out it is being served.'}</Text>
          )}
        </View>

        {day ? (
          <>
            <Rail title={`Most protein at ${meal.toLowerCase()}`} sub={profileText} icon="flash-outline" items={byProtein} meal={meal} />
            <Rail title="Light but filling" sub="High protein for the calories" icon="leaf-outline" items={light} meal={meal} />
            <Rail title="Plant-based" sub="Vegan, highest protein first" icon="nutrition-outline" items={plant} meal={meal} />
          </>
        ) : <View style={{ paddingHorizontal: 16 }}><View style={[st.skeleton, { height: 132, marginTop: 24 }]} /></View>}

        <View style={{ paddingHorizontal: 16 }}>
          <SectionHead icon="flame-outline" title="Your day" action="Targets" onAction={() => router.push('/targets')} />
          <Panel flush>
            <DayCard date={date} onOpen={() => { setDate(date); router.navigate('/tracker'); }} />
            <WaterRow date={date} />
          </Panel>

          <SectionHead icon="search" title="Find something" />
          <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8 }}>
            {POPULAR.slice(0, 8).map(t => <Chip key={t} label={titleCase(t)} onPress={() => searchFor(t)} />)}
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

function Rail({ title, sub, icon, items, meal }: {
  title: string; sub?: string; icon: React.ComponentProps<typeof SectionHead>['icon']; items: DayItem[]; meal: string;
}) {
  if (!items.length) return null;
  return (
    <View>
      <View style={{ paddingHorizontal: 16 }}><SectionHead icon={icon} title={title} sub={sub || undefined} /></View>
      <FlatList horizontal data={items} keyExtractor={i => i.recipe_id} showsHorizontalScrollIndicator={false}
        contentContainerStyle={{ paddingHorizontal: 16, gap: 10 }}
        renderItem={({ item }) => <MiniCard item={item} meal={meal} />} />
    </View>
  );
}

const st = StyleSheet.create({
  search: { flexDirection: 'row', alignItems: 'center', gap: 10, height: 46, borderRadius: R.ctl, backgroundColor: C.card, paddingHorizontal: 14, borderWidth: StyleSheet.hairlineWidth, borderColor: C.border },
  searchText: { color: C.text3, fontSize: T.md },
  hall: { flexDirection: 'row', alignItems: 'center', gap: 12, backgroundColor: C.card, borderRadius: R.card, padding: 14, borderWidth: StyleSheet.hairlineWidth, borderColor: C.border },
  dot: { width: 10, height: 10, borderRadius: 5 },
  hallName: { color: C.text, fontSize: T.md, fontWeight: '700' },
  hallStatus: { color: C.text3, fontSize: T.sm, marginTop: 2 },
  hallCount: { color: C.text3, fontSize: T.sm },
  favHit: { backgroundColor: C.card, borderRadius: R.ctl, padding: 14, borderLeftWidth: 3, borderLeftColor: C.fav },
  skeleton: { height: 56, borderRadius: R.card, backgroundColor: C.card },
});
