import { useLocalSearchParams } from 'expo-router';
import { useEffect, useMemo, useState } from 'react';
import { Linking, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { MacroRow } from '../../components/items';
import { SheetHead } from '../../components/Sheet';
import { Btn, Empty, Hint, LinkBtn, Loading, Notice, Pill } from '../../components/ui';
import { apiFor } from '../../lib/api';
import {
  DAILY_VALUE, LABEL_BOLD, LABEL_DEPTH, labelValue, MACROS, NUTRIENTS, shortDay, shortHall, titleCase, todayIso,
} from '../../lib/logic';
import { useStore } from '../../lib/store';
import { C, MACRO_COLOR, R, T } from '../../lib/theme';
import type { DetailItem } from '../../lib/types';

export default function ItemDetail() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { college, meal, profile, onPlate, togglePlate, isFav, toggleFav } = useStore();
  const api = useMemo(() => apiFor(college!), [college]);
  const insets = useSafeAreaInsets();
  const [item, setItem] = useState<DetailItem | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let live = true;
    api.item(id).then(r => {
      if (!live) return;
      if (r.error) setError('This recipe is no longer on any stored menu.');
      else setItem(r);
    }).catch(() => live && setError('The full label needs a connection.'));
    return () => { live = false; };
  }, [api, id]);

  if (error) return <View style={{ flex: 1 }}><SheetHead title="Not available" /><Empty icon="alert-circle-outline" title="Can’t open this item" body={error} /></View>;
  if (!item) return <View style={{ flex: 1 }}><SheetHead title="Loading…" /><Loading /></View>;

  const n = item.nutrients;
  const cal = item.calories == null ? '–' : Math.round(item.calories);
  const on = onPlate(item.recipe_id, meal);
  const fav = isFav(item.recipe_id);

  const icons = [...new Set(item.served_at.flatMap(s => s.menu_tags || [])
    .filter(t => /^contains /i.test(t))
    .map(t => titleCase(t.replace(/^contains /i, '').replace(/_/g, ' '))))].sort();

  const today = todayIso();
  const upcoming = item.served_at.filter(s => s.date >= today);
  const list = upcoming.length ? upcoming : item.served_at;

  const parts = MACROS.map(m => ({ ...m, kcal: (n[m.field] || 0) * m.kcal }));
  const energy = parts.reduce((a, p) => a + p.kcal, 0);

  return (
    <View style={{ flex: 1 }}>
      <SheetHead title={item.name} sub={item.serving_size || 'Serving size not listed'} />
      <ScrollView contentContainerStyle={{ padding: 16, paddingTop: 4, gap: 4 }}>
        {item.label_implausible ? (
          <Notice>This label reads as a whole batch, not one serving{item.serving_size ? ` — ${Math.round(item.calories || 0)} cal for ${item.serving_size}` : ''}. Check the card posted at the station.</Notice>
        ) : item.nutrition_suspect ? (
          <Notice>The macros on this label do not add up to its calories, so one of them is wrong.</Notice>
        ) : null}

        <View style={st.lead}>
          <Text style={st.cal}>{cal}<Text style={st.calUnit}>  calories</Text></Text>
          <MacroRow item={item} />
          {energy > 0 && (
            <View style={{ gap: 8, marginTop: 6 }}>
              <View style={st.energyBar}>
                {parts.map(p => p.kcal ? <View key={p.key} style={{ flex: p.kcal, backgroundColor: MACRO_COLOR[p.key] }} /> : null)}
              </View>
              <Text style={st.hintText}>{parts.map(p => `${Math.round(p.kcal / energy * 100)}% ${p.label}`).join(' · ')} of calories</Text>
            </View>
          )}
        </View>

        <Text style={st.h3}>Allergens & diet</Text>
        <View style={st.pills}>
          {!item.allergen_data_published ? <Pill tone="unknown" label="No allergen data published" />
            : item.allergens.length ? item.allergens.map(a => <Pill key={a} tone={profile.without.includes(a) ? 'hit' : 'allergen'} label={titleCase(a)} />)
            : <Pill tone="allergen" label="None listed" />}
          {item.diets.map(d => <Pill key={d} tone="diet" label={titleCase(d)} />)}
        </View>
        {item.allergens_as_published?.length ? <Text style={st.source}><Text style={st.sourceK}>Label  </Text>{item.allergens_as_published.join(', ')}</Text> : null}
        {icons.length ? <Text style={st.source}><Text style={st.sourceK}>Menu icons  </Text>{icons.join(', ')}</Text> : null}
        {!item.allergen_data_published && <Hint>Nothing published is not the same as nothing in it. Ask at the station if you have an allergy.</Hint>}

        {list.length > 0 && (
          <>
            <Text style={st.h3}>{upcoming.length ? 'Coming up' : 'Served'}</Text>
            {list.slice(0, 8).map((s, i) => (
              <View key={i} style={st.served}>
                <Text style={st.servedDay}>{s.date === today ? 'Today' : shortDay(s.date)}</Text>
                <Text style={st.servedWhere}>{s.meal} · {shortHall(s.location_name)}{s.station ? ` · ${s.station}` : ''}</Text>
              </View>
            ))}
            {list.length > 8 && <Hint>and {list.length - 8} more times.</Hint>}
          </>
        )}

        <Text style={st.h3}>Nutrition facts</Text>
        <View style={st.label}>
          <View style={[st.lrow, st.lrowCal]}>
            <Text style={[st.lk, st.bold, { fontSize: T.lg }]}>Calories</Text>
            <Text style={[st.lv, st.bold, { fontSize: T.lg }]}>{cal}</Text>
            <Text style={st.dv}>% DV</Text>
          </View>
          {NUTRIENTS.map(([key, label, unit]) => {
            const v = labelValue(n[key], unit);
            const dv = DAILY_VALUE[key] && n[key] != null ? Math.round((n[key]! / DAILY_VALUE[key]) * 100) : null;
            const bold = LABEL_BOLD.has(key);
            return (
              <View key={key} style={st.lrow}>
                <Text style={[st.lk, bold && st.bold, { paddingLeft: (LABEL_DEPTH[key] || 0) * 14 }]}>{label}</Text>
                <Text style={[st.lv, bold && st.bold, v == null && { color: C.text3, fontWeight: '400' }]}>{v ?? 'Not listed'}</Text>
                <Text style={st.dv}>{dv == null ? '' : `${dv}%`}</Text>
              </View>
            );
          })}
        </View>
        <Hint>% Daily Value is against the 2,000-calorie reference printed on every label.</Hint>

        {item.ingredients ? (<><Text style={st.h3}>Ingredients</Text><Text style={st.ingredients}>{item.ingredients}</Text></>) : null}

        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 16 }}>
          {item.source_url ? <LinkBtn label="View the official label" onPress={() => Linking.openURL(item.source_url!)} /> : <View />}
          {item.fetched_at ? <Text style={st.hintText}>Checked {new Date(item.fetched_at).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}</Text> : null}
        </View>
      </ScrollView>
      <View style={[st.foot, { paddingBottom: Math.max(insets.bottom, 12) }]}>
        <Btn kind="ghost" icon={fav ? 'heart' : 'heart-outline'} label={fav ? 'Saved' : 'Save'} onPress={() => toggleFav(item)} />
        <Btn style={{ flex: 1 }} kind={on ? 'ghost' : 'primary'} icon={on ? 'close' : 'add'}
          label={on ? `Remove from ${meal.toLowerCase()}` : `Add to ${meal.toLowerCase()}`} onPress={() => togglePlate(item, meal)} />
      </View>
    </View>
  );
}

const st = StyleSheet.create({
  lead: { backgroundColor: C.card, borderRadius: R.card, padding: 16, gap: 10, marginTop: 8 },
  cal: { color: C.text, fontSize: 40, fontWeight: '800', letterSpacing: -1 },
  calUnit: { color: C.text3, fontSize: T.md, fontWeight: '600', letterSpacing: 0 },
  energyBar: { height: 8, flexDirection: 'row', gap: 2, borderRadius: 4, overflow: 'hidden' },
  hintText: { color: C.text3, fontSize: T.sm },
  h3: { color: C.text, fontSize: T.lg, fontWeight: '800', marginTop: 22, marginBottom: 10 },
  pills: { flexDirection: 'row', flexWrap: 'wrap', gap: 6 },
  source: { color: C.text2, fontSize: T.sm, marginTop: 8 },
  sourceK: { color: C.text3, fontWeight: '700' },
  served: { flexDirection: 'row', gap: 12, paddingVertical: 8, borderBottomWidth: StyleSheet.hairlineWidth, borderBottomColor: C.border },
  servedDay: { color: C.text, fontSize: T.sm, fontWeight: '700', width: 92 },
  servedWhere: { color: C.text2, fontSize: T.sm, flex: 1 },
  label: { backgroundColor: C.card, borderRadius: R.card, paddingHorizontal: 14, paddingVertical: 4 },
  lrow: { flexDirection: 'row', alignItems: 'center', paddingVertical: 8, borderBottomWidth: StyleSheet.hairlineWidth, borderBottomColor: C.border, gap: 8 },
  lrowCal: { borderBottomWidth: 3, borderBottomColor: C.text2 },
  lk: { color: C.text2, fontSize: T.sm, flex: 1 },
  lv: { color: C.text, fontSize: T.sm, minWidth: 64, textAlign: 'right' },
  dv: { color: C.text3, fontSize: T.sm, fontWeight: '700', width: 46, textAlign: 'right' },
  bold: { color: C.text, fontWeight: '800' },
  ingredients: { color: C.text2, fontSize: T.sm, lineHeight: 20 },
  foot: { flexDirection: 'row', gap: 10, paddingHorizontal: 16, paddingTop: 12, borderTopWidth: StyleSheet.hairlineWidth, borderTopColor: C.border, backgroundColor: C.surface },
});
