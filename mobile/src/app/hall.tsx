import { router } from 'expo-router';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';

import { SheetHead } from '../components/Sheet';
import { Hint, Icon } from '../components/ui';
import { countOn, hallStatus, shortDay, shortHall } from '../lib/logic';
import { useMeta } from '../lib/store';
import { C, R, T } from '../lib/theme';

/** Every hall at once with its count and whether it is open, at full tap size. */
export default function HallSheet() {
  const { meta, date, meal, location, setLocation } = useMeta();
  const total = meta.locations.reduce((n, l) => n + countOn(meta, date, meal, l.id), 0);
  const options = [
    ...meta.locations.map(l => ({ id: l.id, label: shortHall(l.name), n: countOn(meta, date, meal, l.id) })),
    { id: 'all', label: 'All halls, side by side', n: total },
  ];
  return (
    <View style={{ flex: 1 }}>
      <SheetHead title="Dining hall" sub={`${meal} · ${shortDay(date)}`} />
      <ScrollView contentContainerStyle={{ padding: 16, paddingTop: 4, gap: 8 }}>
        {options.map(o => {
          const s = o.id === 'all' ? null : hallStatus(meta, o.id, date);
          const on = o.id === location;
          return (
            <Pressable key={o.id} onPress={() => { setLocation(o.id); router.back(); }}
              style={({ pressed }) => [st.row, on && st.rowOn, pressed && { opacity: 0.8 }]}
              accessibilityRole="button" accessibilityState={{ selected: on }}>
              <View style={[st.dot, { backgroundColor: s ? (s.open ? C.good : C.text3) : 'transparent' }]} />
              <View style={{ flex: 1 }}>
                <Text style={st.name}>{o.label}</Text>
                <Text style={st.sub}>{o.n ? `${o.n} items at ${meal.toLowerCase()}` : `No ${meal.toLowerCase()}`}{s ? ` · ${s.short}` : ''}</Text>
              </View>
              {on && <Icon name="checkmark" size={20} color={C.accentText} />}
            </Pressable>
          );
        })}
        {meta.hours?.weekday ? <Hint>Open and closed use the usual semester hours. Holidays and breaks can differ.</Hint> : null}
      </ScrollView>
    </View>
  );
}

const st = StyleSheet.create({
  row: { flexDirection: 'row', alignItems: 'center', gap: 12, backgroundColor: C.card, borderRadius: R.card, padding: 16, borderWidth: 1, borderColor: 'transparent' },
  rowOn: { borderColor: C.accent },
  dot: { width: 10, height: 10, borderRadius: 5 },
  name: { color: C.text, fontSize: T.md, fontWeight: '700' },
  sub: { color: C.text3, fontSize: T.sm, marginTop: 2 },
});
