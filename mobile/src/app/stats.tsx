import { useEffect, useMemo, useState } from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';

import { SheetHead } from '../components/Sheet';
import { Empty, Hint, Loading, Notice } from '../components/ui';
import { apiFor } from '../lib/api';
import { shortDay, shortHall } from '../lib/logic';
import { useMeta } from '../lib/store';
import { C, R, T } from '../lib/theme';
import type { Stats } from '../lib/types';

/** `query stats` for the app: coverage, and how many labels fail each check. */
export default function StatsSheet() {
  const { meta, college } = useMeta();
  const api = useMemo(() => apiFor(college!), [college]);
  const [d, setD] = useState<Stats | null>(null);
  const [failed, setFailed] = useState(false);
  useEffect(() => { api.stats().then(setD).catch(() => setFailed(true)); }, [api]);

  if (failed) return <View style={{ flex: 1 }}><SheetHead title="About this data" /><Empty icon="cloud-offline-outline" title="This needs a connection" /></View>;
  if (!d) return <View style={{ flex: 1 }}><SheetHead title="About this data" /><Loading /></View>;

  const pct = (x: number) => { const v = (x / d.recipes) * 100; return v > 0 && v < 1 ? '<1%' : `${v.toFixed(0)}%`; };
  const updated = d.last_fetched ? new Date(d.last_fetched).toLocaleDateString(undefined, { weekday: 'short', month: 'short', day: 'numeric' }) : null;
  const byHall: Record<string, Record<string, number>> = {};
  d.per_meal.forEach(r => { (byHall[r.location_name] ||= {})[r.meal] = r.n; });

  return (
    <View style={{ flex: 1 }}>
      <SheetHead title="About this data" sub="Where these numbers come from" />
      <ScrollView contentContainerStyle={{ padding: 16, paddingTop: 4 }}>
        {meta.demo && <Notice tone="info">Demo mode: sample data from real UMD menus, spread over two weeks.</Notice>}
        <Text style={st.p}>Menus and nutrition labels are copied from {meta.college_name}’s published dining site{updated ? `, most recently on ${updated}` : ''}. They refresh every morning. What the hall actually serves can differ from what it posted.</Text>

        <View style={st.tiles}>
          <View style={st.tile}><Text style={st.tileN}>{d.days}</Text><Text style={st.tileL}>days of menus</Text></View>
          <View style={st.tile}><Text style={st.tileN}>{d.recipes.toLocaleString()}</Text><Text style={st.tileL}>recipes</Text></View>
        </View>
        <Hint>{shortDay(d.first_date)} to {shortDay(d.last_date)}</Hint>

        <Text style={st.h3}>What the halls did not publish</Text>
        <View style={st.table}>
          <Row k="No allergen information" v={d.without_allergen_data.toLocaleString()} note={pct(d.without_allergen_data)} />
          <Row k="No nutrition label" v={d.without_nutrition.toLocaleString()} note={pct(d.without_nutrition)} />
        </View>
        <Hint>When a hall publishes no allergen information, the app says so rather than showing the item as allergen-free.</Hint>

        <Text style={st.h3}>Labels that look wrong</Text>
        <View style={st.table}>
          <Row k="Whole batch listed as one serving" v={d.label_implausible} note={pct(d.label_implausible)} />
          <Row k="Macros do not match calories" v={d.nutrition_suspect} note={pct(d.nutrition_suspect)} />
        </View>
        <Hint>These items carry a Check label tag and sort last by protein. Their numbers are shown exactly as published.</Hint>

        <Text style={st.h3}>Items per hall</Text>
        <View style={st.table}>
          <View style={st.row}><Text style={[st.k, st.th]}>Hall</Text>{meta.meals.map(m => <Text key={m} style={[st.cell, st.th]}>{m}</Text>)}</View>
          {Object.entries(byHall).map(([hall, per]) => (
            <View key={hall} style={st.row}>
              <Text style={st.k}>{shortHall(hall)}</Text>
              {meta.meals.map(m => <Text key={m} style={st.cell}>{per[m] ? per[m].toLocaleString() : '—'}</Text>)}
            </View>
          ))}
        </View>
      </ScrollView>
    </View>
  );
}

function Row({ k, v, note }: { k: string; v: string | number; note?: string }) {
  return (
    <View style={st.row}><Text style={st.k}>{k}</Text><Text style={st.v}>{v}{note ? <Text style={st.note}>  {note}</Text> : null}</Text></View>
  );
}

const st = StyleSheet.create({
  p: { color: C.text2, fontSize: T.md, lineHeight: 22, marginTop: 4 },
  tiles: { flexDirection: 'row', gap: 10, marginTop: 16 },
  tile: { flex: 1, backgroundColor: C.card, borderRadius: R.ctl, padding: 14 },
  tileN: { color: C.text, fontSize: T.xl, fontWeight: '800' },
  tileL: { color: C.text3, fontSize: T.sm },
  h3: { color: C.text, fontSize: T.md, fontWeight: '800', marginTop: 22, marginBottom: 10 },
  table: { backgroundColor: C.card, borderRadius: R.ctl, paddingHorizontal: 14 },
  row: { flexDirection: 'row', alignItems: 'center', paddingVertical: 10, borderBottomWidth: StyleSheet.hairlineWidth, borderBottomColor: C.border, gap: 8 },
  k: { color: C.text2, fontSize: T.sm, flex: 1 },
  v: { color: C.text, fontSize: T.sm, fontWeight: '700' },
  note: { color: C.text3, fontWeight: '500' },
  th: { color: C.text3, fontWeight: '700' },
  cell: { color: C.text, fontSize: T.sm, width: 68, textAlign: 'right' },
});
