import { Pressable, StyleSheet, Text, View } from 'react-native';

import { dayRows, totalsOf } from '../lib/logic';
import { useMeta } from '../lib/store';
import { C, MACRO_COLOR, T } from '../lib/theme';
import { Icon, LinkBtn, Ring } from './ui';

/** A thin bar per macro. Protein has a target; carbs and fat are shown as
    totals only, because a ceiling nobody set is not something to fill up to. */
function MacroBar({ label, g, target, color }: { label: string; g: number; target: number; color: string }) {
  const pct = target ? Math.min(g / target, 1) * 100 : 0;
  return (
    <View style={{ gap: 4 }}>
      <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
        <Text style={st.mLabel}>{label}</Text>
        <Text style={st.mVal}>{Math.round(g)}g{target ? <Text style={{ color: C.text3, fontWeight: '500' }}> / {target}g</Text> : null}</Text>
      </View>
      {target ? (
        <View style={st.track}><View style={[st.fill, { width: `${pct}%`, backgroundColor: color }]} /></View>
      ) : null}
    </View>
  );
}

/** Calories against the day's target as a ring, with the macros beside it. */
export function DayCard({ date, onOpen }: { date: string; onOpen?: () => void }) {
  const { meta, platesFor, goal } = useMeta();
  const rows = dayRows(meta, platesFor(date));
  const t = totalsOf(rows);
  const left = goal.dayCalories - t.cal;
  return (
    <View style={st.day} accessible accessibilityLabel={`${Math.round(t.cal)} of ${goal.dayCalories} calories, ${Math.round(t.p)} grams protein`}>
      <Ring value={t.cal} target={goal.dayCalories}>
        <Text style={st.ringNum}>{Math.round(t.cal).toLocaleString()}</Text>
        <Text style={st.ringSub}>of {goal.dayCalories.toLocaleString()}</Text>
      </Ring>
      <View style={{ flex: 1, gap: 10 }}>
        <Text style={st.left}>
          <Text style={{ color: left >= 0 ? C.text : C.danger, fontWeight: '800' }}>{Math.round(Math.abs(left)).toLocaleString()}</Text>
          {left >= 0 ? ' cal left' : ' cal over'}
        </Text>
        <MacroBar label="Protein" g={t.p} target={goal.dayProtein} color={MACRO_COLOR.protein} />
        <MacroBar label="Carbs" g={t.c} target={0} color={MACRO_COLOR.carbs} />
        <MacroBar label="Fat" g={t.f} target={0} color={MACRO_COLOR.fat} />
        {onOpen && <LinkBtn label={rows.length ? `${rows.length} item${rows.length === 1 ? '' : 's'} logged` : 'Open tracker'} onPress={onOpen} />}
      </View>
    </View>
  );
}

export function WaterRow({ date }: { date: string }) {
  const { water, setWater, goal } = useMeta();
  const n = water(date);
  return (
    <View style={st.water} accessibilityLabel={`Water, ${n} of ${goal.water} cups`}>
      <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
        <Icon name="water" size={16} color={C.water} />
        <Text style={st.waterText}><Text style={{ color: C.text, fontWeight: '800' }}>{n}</Text> / {goal.water} cups of water</Text>
      </View>
      <View style={st.cups}>
        {Array.from({ length: goal.water }, (_, i) => {
          const on = i < n;
          return (
            <Pressable key={i} hitSlop={4}
              // Tapping the last filled cup empties it, so one tap undoes one tap.
              onPress={() => setWater(date, on && i + 1 === n ? i : i + 1)}
              accessibilityRole="button" accessibilityState={{ selected: on }}
              accessibilityLabel={on && i + 1 === n ? 'Remove last cup' : `${i + 1} cup${i ? 's' : ''}`}
              style={[st.cup, on && st.cupOn]} />
          );
        })}
      </View>
    </View>
  );
}

const st = StyleSheet.create({
  day: { flexDirection: 'row', gap: 18, alignItems: 'center', padding: 16 },
  ringNum: { color: C.text, fontSize: T.xl, fontWeight: '800', letterSpacing: -0.5 },
  ringSub: { color: C.text3, fontSize: T.xs },
  left: { color: C.text2, fontSize: T.md },
  mLabel: { color: C.text2, fontSize: T.sm },
  mVal: { color: C.text, fontSize: T.sm, fontWeight: '700' },
  track: { height: 6, borderRadius: 3, backgroundColor: C.card3, overflow: 'hidden' },
  fill: { height: 6, borderRadius: 3 },
  water: { borderTopWidth: StyleSheet.hairlineWidth, borderTopColor: C.border, padding: 16, gap: 12 },
  waterText: { color: C.text2, fontSize: T.sm },
  cups: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  cup: { width: 28, height: 34, borderRadius: 6, borderBottomLeftRadius: 10, borderBottomRightRadius: 10, borderWidth: 1.5, borderColor: C.borderControl },
  cupOn: { backgroundColor: C.water, borderColor: C.water },
});
