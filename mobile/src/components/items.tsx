import { router } from 'expo-router';
import { memo } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { HIGH_PROTEIN, MACROS, titleCase, type DayItem } from '../lib/logic';
import { useStore } from '../lib/store';
import { C, MACRO_COLOR, R, T, TAP } from '../lib/theme';
import type { Item } from '../lib/types';
import { Icon, Pill } from './ui';

export const openItem = (id: string) => router.push({ pathname: '/item/[id]', params: { id } });

/** Each macro is a coloured dot next to its own value and word, so the hue is
    reinforcement and never the only thing saying which macro it is. */
export function MacroRow({ item }: { item: Item }) {
  return (
    <View style={st.macros}>
      {MACROS.map(m => {
        const g = item.nutrients[m.field];
        return (
          <View key={m.key} style={st.macro}>
            <View style={[st.dot, { backgroundColor: MACRO_COLOR[m.key] }]} />
            <Text style={st.macroVal}>{g == null ? '–' : `${Math.round(g)}g`}</Text>
            <Text style={st.macroLabel}>{m.label}</Text>
          </View>
        );
      })}
    </View>
  );
}

/** Protein / carbs / fat as shares of their combined calories. */
export function Split({ item, height = 4 }: { item: Item; height?: number }) {
  const parts = MACROS.map(m => [m.key, (item.nutrients[m.field] || 0) * m.kcal] as const);
  const total = parts.reduce((n, [, v]) => n + v, 0);
  if (!total) return null;
  return (
    <View style={[st.split, { height }]}>
      {parts.map(([k, v]) => v ? <View key={k} style={{ flex: v, backgroundColor: MACRO_COLOR[k] }} /> : null)}
    </View>
  );
}

export function Tags({ item }: { item: Item }) {
  const out: React.ReactNode[] = [];
  if (item.label_implausible) out.push(<Pill key="w" tone="warn" label="Check label" />);
  else if (item.nutrition_suspect) out.push(<Pill key="w" tone="warn" label="Macros off" />);
  else if ((item.nutrients.protein_g || 0) >= HIGH_PROTEIN) out.push(<Pill key="p" tone="protein" label="High protein" />);
  item.diets.forEach(d => out.push(<Pill key={d} tone="diet" label={titleCase(d)} />));
  if (!item.allergen_data_published) out.push(<Pill key="u" tone="unknown" label="No allergen data" />);
  else if (item.allergens.length) {
    const shown = item.allergens.slice(0, 2).map(titleCase).join(', ');
    const more = item.allergens.length > 2 ? ` +${item.allergens.length - 2}` : '';
    out.push(<Pill key="a" tone="allergen" label={`Contains ${shown}${more}`} />);
  }
  return out.length ? <View style={st.tags}>{out}</View> : null;
}

/** One item: name and serving on the left, calories on the right, macros under. */
export const ItemCard = memo(function ItemCard({ item, sub, meal }: { item: Item; sub?: string | null; meal?: string }) {
  const { onPlate, togglePlate, isFav, toggleFav } = useStore();
  const on = onPlate(item.recipe_id, meal);
  const fav = isFav(item.recipe_id);
  const cal = item.calories == null ? '–' : Math.round(item.calories);
  return (
    <View style={st.card}>
      <Pressable style={({ pressed }) => [st.cardMain, pressed && { opacity: 0.7 }]}
        onPress={() => openItem(item.recipe_id)}
        accessibilityRole="button" accessibilityLabel={`${item.name}, ${cal} calories. Full label`}>
        <View style={st.row}>
          <View style={{ flex: 1 }}>
            <Text style={st.name}>{item.name}</Text>
            {sub || item.serving_size ? <Text style={st.serving} numberOfLines={2}>{sub || item.serving_size}</Text> : null}
          </View>
          <View style={st.cal}>
            <Text style={st.calNum}>{cal}</Text>
            <Text style={st.calUnit}>cal</Text>
          </View>
        </View>
        <MacroRow item={item} />
        <Split item={item} />
        <Tags item={item} />
      </Pressable>
      <View style={st.actions}>
        <Pressable onPress={() => togglePlate(item, meal)} style={[st.action, on && st.actionOn]}
          accessibilityRole="button" accessibilityLabel={`${on ? 'Remove' : 'Add'} ${item.name} ${on ? 'from' : 'to'} plate`}>
          <Icon name={on ? 'checkmark' : 'add'} size={22} color={on ? C.onAccent : C.text} />
        </Pressable>
        <Pressable onPress={() => toggleFav(item)} style={st.action}
          accessibilityRole="button" accessibilityLabel={`${fav ? 'Remove' : 'Save'} ${item.name} ${fav ? 'from' : 'to'} favorites`}>
          <Icon name={fav ? 'heart' : 'heart-outline'} size={20} color={fav ? C.fav : C.text2} />
        </Pressable>
      </View>
    </View>
  );
});

/** A compact card for Today's rails. */
export function MiniCard({ item, meal }: { item: DayItem; meal: string }) {
  const { togglePlate } = useStore();
  const cal = item.calories == null ? '–' : Math.round(item.calories);
  const p = item.nutrients.protein_g;
  const where = [...new Set(item._at.map(a => a.hall))];
  return (
    <Pressable style={({ pressed }) => [st.mini, pressed && { opacity: 0.8 }]} onPress={() => openItem(item.recipe_id)}
      accessibilityLabel={`${item.name}, ${cal} calories, ${p == null ? 'protein not listed' : `${Math.round(p)} grams protein`}, at ${where.join(', ')}`}>
      <View style={{ flexDirection: 'row', gap: 8, alignItems: 'flex-start' }}>
        <Text style={[st.miniName, { flex: 1 }]} numberOfLines={2}>{item.name}</Text>
        <Pressable onPress={() => togglePlate(item, meal)} style={st.miniAdd} hitSlop={6}
          accessibilityRole="button" accessibilityLabel={`Add ${item.name} to ${meal.toLowerCase()}`}>
          <Icon name="add" size={20} color={C.text} />
        </Pressable>
      </View>
      <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4 }}>
        <Icon name="location-outline" size={12} color={C.text3} />
        <Text style={st.miniWhere} numberOfLines={1}>{where.length > 1 ? `${where[0]} +${where.length - 1}` : where[0]}</Text>
      </View>
      <View style={st.miniNums}>
        <Text style={st.miniNum} numberOfLines={1}><Text style={{ fontWeight: '800', color: C.text }}>{cal}</Text> cal</Text>
        <Text style={st.miniNum} numberOfLines={1}><Text style={{ fontWeight: '800', color: C.protein }}>{p == null ? '–' : Math.round(p)}g</Text> protein</Text>
      </View>
    </Pressable>
  );
}

const st = StyleSheet.create({
  card: { flexDirection: 'row', backgroundColor: C.card, borderRadius: R.card, borderWidth: StyleSheet.hairlineWidth, borderColor: C.border, marginBottom: 10, overflow: 'hidden' },
  cardMain: { flex: 1, padding: 14, gap: 8 },
  row: { flexDirection: 'row', gap: 12 },
  name: { color: C.text, fontSize: T.md, fontWeight: '700', lineHeight: 20 },
  serving: { color: C.text3, fontSize: T.sm, marginTop: 2 },
  cal: { alignItems: 'flex-end' },
  calNum: { color: C.text, fontSize: T.hero, fontWeight: '800', letterSpacing: -0.5, lineHeight: 28 },
  calUnit: { color: C.text3, fontSize: T.xs, fontWeight: '600' },
  macros: { flexDirection: 'row', gap: 14, flexWrap: 'wrap' },
  macro: { flexDirection: 'row', alignItems: 'center', gap: 5 },
  dot: { width: 7, height: 7, borderRadius: 4 },
  macroVal: { color: C.text, fontSize: T.sm, fontWeight: '700' },
  macroLabel: { color: C.text3, fontSize: T.sm },
  split: { flexDirection: 'row', borderRadius: 2, overflow: 'hidden', gap: 2 },
  tags: { flexDirection: 'row', flexWrap: 'wrap', gap: 6 },
  actions: { width: 52, borderLeftWidth: StyleSheet.hairlineWidth, borderLeftColor: C.border, alignItems: 'center', justifyContent: 'center', gap: 8, paddingVertical: 8 },
  action: { width: TAP - 4, height: TAP - 4, borderRadius: 20, alignItems: 'center', justifyContent: 'center', backgroundColor: C.card2 },
  actionOn: { backgroundColor: C.accent },
  mini: { width: 200, minHeight: 132, backgroundColor: C.card, borderRadius: R.card, padding: 14, borderWidth: StyleSheet.hairlineWidth, borderColor: C.border, gap: 6 },
  miniNums: { flexDirection: 'row', gap: 10, marginTop: 'auto' },
  miniName: { color: C.text, fontSize: T.md, fontWeight: '700', lineHeight: 20 },
  miniWhere: { color: C.text3, fontSize: T.xs, flex: 1 },
  miniNum: { color: C.text3, fontSize: T.sm, flexShrink: 0 },
  miniAdd: { width: 34, height: 34, borderRadius: 17, backgroundColor: C.card2, alignItems: 'center', justifyContent: 'center', marginTop: -4, marginRight: -4 },
});
