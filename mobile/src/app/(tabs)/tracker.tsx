import { router } from 'expo-router';
import { useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { DayCard, WaterRow } from '../../components/Day';
import { TopBar } from '../../components/TopBar';
import { Btn, GoalBar, Hint, Icon, LinkBtn, Notice, Panel } from '../../components/ui';
import {
  addDays, dayRows, fmtQty, longDay, mondayOf, parseDay, plural, served, shortDay, totalsOf,
} from '../../lib/logic';
import { useMeta } from '../../lib/store';
import { C, MACRO_COLOR, R, T } from '../../lib/theme';

/** Each meal logged on its own, against the day's targets, and the week as bars. */
export default function Tracker() {
  const { meta, date, meal, setDate, setMeal, platesFor, goal } = useMeta();
  const [open, setOpen] = useState<Set<string>>(new Set([meal]));
  const n = dayRows(meta, platesFor(date)).length;

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: C.bg }} edges={['top']}>
      <ScrollView contentContainerStyle={{ paddingBottom: 120 }}>
        <TopBar title="Tracker" sub={longDay(date)} />
        <View style={{ paddingHorizontal: 16, gap: 12 }}>
          <Panel flush>
            <View style={st.head}>
              <View style={{ flex: 1 }}>
                <Text style={st.h3}>{shortDay(date)}</Text>
                <Text style={st.sub}>{n ? `${plural(n, 'item')} logged` : 'Nothing logged yet'}</Text>
              </View>
              <Btn kind="ghost" small icon="locate-outline" label="Targets" onPress={() => router.push('/targets')} />
            </View>
            <DayCard date={date} />
            <WaterRow date={date} />
          </Panel>
          {!n && <Hint center>Tap + on anything in the menu, or let Build put a meal together. Each meal is tracked on its own.</Hint>}

          {meta.meals.map(m => (
            <MealSection key={m} meal={m} open={open.has(m)} onToggle={() => setOpen(prev => {
              const s = new Set(prev); if (s.has(m)) s.delete(m); else s.add(m); return s;
            })} onBrowse={() => { setMeal(m); router.navigate('/menu'); }} />
          ))}

          <Week goal={goal.dayCalories} onPick={setDate} />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

function MealSection({ meal, open, onToggle, onBrowse }: { meal: string; open: boolean; onToggle: () => void; onBrowse: () => void }) {
  const { meta, date, platesFor, setQty, removeFromPlate, clearMeal, goal } = useMeta();
  const rows = platesFor(date)[meal] || [];
  const t = totalsOf(rows);

  if (!rows.length) {
    const on = served(meta, date, meal);
    return (
      <Pressable disabled={!on} onPress={onBrowse} style={[st.meal, st.mealHead, !on && { opacity: 0.5 }]} accessibilityRole="button">
        <Text style={st.mealName}>{meal}</Text>
        <Text style={st.mealSum}>{on ? 'Add from the menu' : 'Not served this day'}</Text>
        {on && <Icon name="add" size={18} color={C.text2} />}
      </Pressable>
    );
  }

  const servings = rows.reduce((s, i) => s + (i.qty || 1), 0);
  const flagged = rows.filter(i => i.implausible).length;
  return (
    <View style={st.meal}>
      <Pressable onPress={onToggle} style={st.mealHead} accessibilityRole="button" accessibilityState={{ expanded: open }}>
        <Text style={st.mealName}>{meal}</Text>
        <Text style={st.mealSum}>{Math.round(t.cal).toLocaleString()} cal · {Math.round(t.p)}g protein</Text>
        <View style={st.count}><Text style={st.countText}>{rows.length}</Text></View>
        <Icon name={open ? 'chevron-up' : 'chevron-down'} size={16} color={C.text3} />
      </Pressable>
      {open && (
        <View style={{ paddingHorizontal: 14, paddingBottom: 14, gap: 12 }}>
          {rows.map(i => {
            const q = i.qty || 1;
            return (
              <View key={i.recipe_id} style={st.row}>
                <View style={{ flex: 1 }}>
                  <Text style={st.rowName}>{i.name}</Text>
                  <Text style={st.rowSub}>{i.serving || ''}{q !== 1 ? ` × ${fmtQty(q)}` : ''}</Text>
                </View>
                <View style={st.stepper}>
                  <Pressable disabled={q <= 0.5} onPress={() => setQty(date, meal, i.recipe_id, -1)} style={st.step} accessibilityLabel="Fewer servings">
                    <Icon name="remove" size={16} color={q <= 0.5 ? C.border : C.text} /></Pressable>
                  <Text style={st.stepN}>{fmtQty(q)}</Text>
                  <Pressable disabled={q >= 6} onPress={() => setQty(date, meal, i.recipe_id, 1)} style={st.step} accessibilityLabel="More servings">
                    <Icon name="add" size={16} color={q >= 6 ? C.border : C.text} /></Pressable>
                </View>
                <Text style={st.rowCal}>{Math.round(i.calories * q)}</Text>
                <Pressable onPress={() => removeFromPlate(date, meal, i.recipe_id)} hitSlop={8} accessibilityLabel={`Remove ${i.name}`}>
                  <Icon name="close" size={18} color={C.text3} /></Pressable>
              </View>
            );
          })}
          <GoalBar label="Calories" value={t.cal} target={goal.calories} unit="" color={C.accent} />
          <GoalBar label="Protein" value={t.p} target={goal.protein} unit="g" color={MACRO_COLOR.protein} />
          {goal.maxCarbs ? <GoalBar label="Carbs" value={t.c} target={goal.maxCarbs} unit="g" color={MACRO_COLOR.carbs} ceiling /> : null}
          {goal.maxFat ? <GoalBar label="Fat" value={t.f} target={goal.maxFat} unit="g" color={MACRO_COLOR.fat} ceiling /> : null}
          {flagged ? <Notice>{flagged} item{flagged === 1 ? ' has a label that fails' : 's have labels that fail'} the plausibility check, so this meal’s total is probably too high.</Notice> : null}
          <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
            <LinkBtn label="Add more" onPress={onBrowse} />
            <Text style={st.rowSub}>{fmtQty(servings)} serving{servings === 1 ? '' : 's'}</Text>
            <LinkBtn quiet label={`Clear ${meal.toLowerCase()}`} onPress={() => clearMeal(date, meal)} />
          </View>
        </View>
      )}
    </View>
  );
}

/** Seven bars, Monday to Sunday, with the daily target drawn across. */
function Week({ goal, onPick }: { goal: number; onPick: (d: string) => void }) {
  const { meta, date, platesFor } = useMeta();
  const days = Array.from({ length: 7 }, (_, i) => addDays(mondayOf(date), i));
  const cals = days.map(d => totalsOf(dayRows(meta, platesFor(d))).cal);
  const top = Math.max(goal * 1.25, ...cals);
  const logged = cals.filter(c => c > 0);
  const avg = logged.length ? logged.reduce((a, b) => a + b, 0) / logged.length : 0;
  const H = 120;
  return (
    <Panel style={{ gap: 12 }}>
      <View>
        <Text style={st.h3}>This week</Text>
        <Text style={st.sub}>{logged.length ? `${plural(logged.length, 'day')} logged · ${Math.round(avg).toLocaleString()} cal average` : 'Nothing logged this week yet'}</Text>
      </View>
      <View style={{ height: H + 22 }}>
        <View style={[st.goalLine, { bottom: 22 + (goal / top) * H }]}>
          <Text style={st.goalText}>{goal.toLocaleString()}</Text>
        </View>
        <View style={{ flexDirection: 'row', gap: 8, alignItems: 'flex-end', height: H + 22 }}>
          {days.map((d, i) => (
            <Pressable key={d} disabled={!meta.dates.includes(d)} onPress={() => onPick(d)} style={{ flex: 1, alignItems: 'center', gap: 6 }}
              accessibilityLabel={`${longDay(d)}: ${Math.round(cals[i])} calories`}>
              <View style={{ height: H, width: '100%', justifyContent: 'flex-end' }}>
                <View style={[st.bar, { height: Math.max(2, (cals[i] / top) * H), backgroundColor: cals[i] > goal ? C.danger : d === date ? C.accent : C.card3 }]} />
              </View>
              <Text style={[st.dow, d === date && { color: C.text }]}>{parseDay(d).toLocaleDateString(undefined, { weekday: 'narrow' })}</Text>
            </Pressable>
          ))}
        </View>
      </View>
    </Panel>
  );
}

const st = StyleSheet.create({
  head: { flexDirection: 'row', alignItems: 'center', padding: 16, paddingBottom: 0 },
  h3: { color: C.text, fontSize: T.lg, fontWeight: '800' },
  sub: { color: C.text3, fontSize: T.sm, marginTop: 2 },
  meal: { backgroundColor: C.card, borderRadius: R.card, borderWidth: StyleSheet.hairlineWidth, borderColor: C.border },
  mealHead: { flexDirection: 'row', alignItems: 'center', gap: 10, padding: 14, minHeight: 56 },
  mealName: { color: C.text, fontSize: T.md, fontWeight: '800', width: 84 },
  mealSum: { color: C.text2, fontSize: T.sm, flex: 1 },
  count: { minWidth: 22, height: 22, borderRadius: 11, backgroundColor: C.card3, alignItems: 'center', justifyContent: 'center', paddingHorizontal: 6 },
  countText: { color: C.text, fontSize: T.xs, fontWeight: '800' },
  row: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  rowName: { color: C.text, fontSize: T.md, fontWeight: '600' },
  rowSub: { color: C.text3, fontSize: T.sm, marginTop: 2 },
  rowCal: { color: C.text, fontSize: T.md, fontWeight: '800', minWidth: 36, textAlign: 'right' },
  stepper: { flexDirection: 'row', alignItems: 'center', backgroundColor: C.card2, borderRadius: R.pill },
  step: { width: 32, height: 32, alignItems: 'center', justifyContent: 'center' },
  stepN: { color: C.text, fontSize: T.sm, fontWeight: '800', minWidth: 18, textAlign: 'center' },
  goalLine: { position: 'absolute', left: 0, right: 0, borderTopWidth: 1, borderStyle: 'dashed', borderColor: C.text3, zIndex: 1 },
  goalText: { position: 'absolute', right: 0, top: -16, color: C.text3, fontSize: T.xs },
  bar: { width: '100%', borderRadius: 6 },
  dow: { color: C.text3, fontSize: T.xs, fontWeight: '700' },
});
