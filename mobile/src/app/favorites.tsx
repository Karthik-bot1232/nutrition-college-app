import { useEffect, useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';

import { openItem } from '../components/items';
import { SheetHead } from '../components/Sheet';
import { Empty, Hint, Icon, Loading } from '../components/ui';
import { loadDay } from '../lib/api';
import { dayItems, homeDate, isToday, plural, shortDay } from '../lib/logic';
import { useMeta } from '../lib/store';
import { C, R, T } from '../lib/theme';
import type { Menu } from '../lib/types';

export default function Favorites() {
  const { meta, favs, isFav, toggleFav } = useMeta();
  const date = homeDate(meta);
  const [day, setDay] = useState<Record<string, Menu> | null>(null);
  useEffect(() => { loadDay(meta, date).then(setDay).catch(() => setDay({})); }, [meta, date]);

  const ids = Object.keys(favs).sort((a, b) => favs[a].name.localeCompare(favs[b].name));
  if (!ids.length) {
    return <View style={{ flex: 1 }}><SheetHead title="Favorites" />
      <Empty icon="heart-outline" title="Nothing saved yet" body="Tap the heart on any item and it lands here. Today tells you whenever a favorite is on the menu." /></View>;
  }

  const on = new Map<string, string[]>();
  Object.entries(day || {}).forEach(([m, menu]) => dayItems(menu).forEach(i => {
    if (!isFav(i.recipe_id)) return;
    on.set(i.recipe_id, [...(on.get(i.recipe_id) || []), `${m} · ${[...new Set(i._at.map(a => a.hall))].join(', ')}`]);
  }));
  const sorted = [...ids].sort((a, b) => Number(on.has(b)) - Number(on.has(a)));

  return (
    <View style={{ flex: 1 }}>
      <SheetHead title="Favorites" sub={`${plural(ids.length, 'item')} saved${day ? ` · ${on.size} on ${isToday(date) ? 'today' : shortDay(date)}` : ''}`} />
      {!day ? <Loading /> : (
        <ScrollView contentContainerStyle={{ padding: 16, paddingTop: 4, gap: 8 }}>
          {sorted.map(id => {
            const f = favs[id];
            const where = on.get(id);
            return (
              <View key={id} style={st.row}>
                <Pressable style={{ flex: 1 }} onPress={() => openItem(id)} accessibilityRole="button">
                  <Text style={st.name}>{f.name}</Text>
                  <Text style={[st.sub, where && { color: C.good }]}>{where ? where.join(' / ') : 'Not on today’s menu'}</Text>
                </Pressable>
                {f.calories != null && <Text style={st.cal}>{Math.round(f.calories)}<Text style={st.unit}> cal</Text></Text>}
                <Pressable hitSlop={8} onPress={() => toggleFav({ recipe_id: id, name: f.name, calories: f.calories, nutrients: { protein_g: f.protein } })}
                  accessibilityLabel={`Remove ${f.name} from favorites`}>
                  <Icon name="heart" size={22} color={C.fav} />
                </Pressable>
              </View>
            );
          })}
          <Hint>Saved on this phone. Tap one for its label and every place it is served.</Hint>
        </ScrollView>
      )}
    </View>
  );
}

const st = StyleSheet.create({
  row: { flexDirection: 'row', alignItems: 'center', gap: 12, backgroundColor: C.card, borderRadius: R.card, padding: 14 },
  name: { color: C.text, fontSize: T.md, fontWeight: '700' },
  sub: { color: C.text3, fontSize: T.sm, marginTop: 2 },
  cal: { color: C.text, fontSize: T.md, fontWeight: '800' },
  unit: { color: C.text3, fontSize: T.xs, fontWeight: '500' },
});
