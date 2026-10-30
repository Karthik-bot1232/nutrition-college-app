import { useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { IconBtn, LinkBtn } from './ui';
import { addDays, isToday, mondayOf, parseDay, todayIso, weeksAvailable } from '../lib/logic';
import { useMeta } from '../lib/store';
import { C, R, T } from '../lib/theme';

/** Monday-to-Sunday, a week at a time, so a weekday keeps its place week to week.
    Menu, Build and Tracker share it, and the day it picks, so planning a later
    day works from any of them. */
export function WeekStrip() {
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
  weekNav: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  weekLabel: { flex: 1, color: C.text, fontSize: T.md, fontWeight: '700' },
  days: { flexDirection: 'row', gap: 6, marginTop: 4 },
  day: { flex: 1, alignItems: 'center', paddingVertical: 8, borderRadius: R.ctl, backgroundColor: C.card, gap: 2 },
  daySel: { backgroundColor: C.accent },
  dow: { color: C.text3, fontSize: T.xs, fontWeight: '600' },
  dnum: { color: C.text, fontSize: T.lg, fontWeight: '800' },
  todayDot: { position: 'absolute', bottom: 4, width: 4, height: 4, borderRadius: 2, backgroundColor: C.gold },
});
