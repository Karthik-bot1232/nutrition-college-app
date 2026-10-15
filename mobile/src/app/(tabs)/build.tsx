import { router } from 'expo-router';
import { useMemo, useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { openItem } from '../../components/items';
import { TopBar } from '../../components/TopBar';
import { Btn, Empty, GoalBar, Hint, Loading, Panel, Segmented } from '../../components/ui';
import { apiFor } from '../../lib/api';
import { buildPlans, buildPool, hallName, isLive, served, shortDay, shortHall, titleCase, type Plan } from '../../lib/logic';
import { useMeta } from '../../lib/store';
import { C, MACRO_COLOR, R, T } from '../../lib/theme';

/** Picks plates from what is actually being served to hit a per-meal target. */
export default function Build() {
  const { meta, college, date, meal, location, setMeal, profile, goal, addToPlate } = useMeta();
  const api = useMemo(() => apiFor(college!), [college]);
  // A plan is for one day, meal, hall, profile and target; change any and it is stale.
  const key = JSON.stringify([college, date, meal, location, profile, goal]);
  const [result, setResult] = useState<{ key: string; plans: Plan[] | null; failed: boolean } | null>(null);
  const [planning, setPlanning] = useState(false);
  const current = result?.key === key ? result : null;
  const plans = current?.plans ?? null;
  const failed = !!current?.failed;

  async function run() {
    setPlanning(true);
    try {
      const menu = await api.menu(date, meal, location);
      setResult({ key, plans: buildPlans(buildPool(menu, profile), goal), failed: false });
    } catch {
      setResult({ key, plans: null, failed: true });
    } finally {
      setPlanning(false);
    }
  }

  const constraints = [...profile.diets.map(titleCase), ...profile.without.map(a => `No ${titleCase(a)}`)];
  const hall = location === 'all' ? 'All halls' : shortHall(hallName(meta, location));
  const many = location === 'all';

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: C.bg }} edges={['top']}>
      <ScrollView contentContainerStyle={{ paddingBottom: 120 }}>
        <TopBar title="Build a meal" sub={`${hall} · ${shortDay(date)}`} onSub={() => router.push('/hall')} />
        <View style={{ paddingHorizontal: 16, gap: 12 }}>
          <Segmented value={meal} onChange={setMeal} options={meta.meals.map(m => ({
            value: m, label: m, live: isLive(meta, date, m), disabled: !served(meta, date, m) }))} />

          <Panel style={{ gap: 12 }}>
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <Text style={st.h3}>Your targets</Text>
              <Btn kind="ghost" small icon="locate-outline" label={goal.isDefault ? 'Set targets' : 'Targets'}
                onPress={() => router.push('/targets')} />
            </View>
            <View style={st.targets}>
              <Target n={goal.calories} label="calories" />
              <Target n={`${goal.protein}g`} label="protein min" />
              {goal.maxCarbs ? <Target n={`${goal.maxCarbs}g`} label="carbs max" /> : null}
              {goal.maxFat ? <Target n={`${goal.maxFat}g`} label="fat max" /> : null}
            </View>
            {constraints.length ? <Hint>Only using: {constraints.join(' · ')}</Hint> : null}
            {goal.isDefault ? <Hint>These are defaults. Tap Set targets to use your own.</Hint> : null}
            <Btn icon="sparkles" label={plans ? 'Shuffle new options' : 'Build my meal'} onPress={run} disabled={planning} />
          </Panel>

          {planning ? <Loading label="Trying combinations against your targets…" />
          : failed ? <Empty icon="cloud-offline-outline" title="Needs a connection"
              body={`Building fetches ${meal.toLowerCase()} for this day.`}><Btn kind="ghost" label="Try again" onPress={run} /></Empty>
          : plans && !plans.length ? <Empty icon="locate-outline" title="No combination fits"
              body={`Nothing on this menu combines into ${goal.calories} cal with ${goal.protein}g of protein under your filters. Try raising the calorie target, lowering the protein floor, or switching to All halls.`} />
          : plans ? plans.map((plan, i) => (
              <Panel key={plan.items.map(x => x.recipe_id).join('|')} style={{ gap: 12 }}>
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
                  <View style={st.num}><Text style={st.numText}>{i + 1}</Text></View>
                  <Text style={[st.h3, { flex: 1 }]}>Option {i + 1}</Text>
                  <Text style={st.meta}>{Math.round(plan.totals.cal)} cal · {Math.round(plan.totals.p)}g protein</Text>
                </View>
                <View>
                  {plan.items.map(it => (
                    <Pressable key={it.recipe_id} onPress={() => openItem(it.recipe_id)} style={st.row} accessibilityRole="button">
                      <View style={{ flex: 1 }}>
                        <Text style={st.rowName}>{it.name}</Text>
                        <Text style={st.rowSub}>{[it.serving_size || it.portion, many ? `${shortHall(it._hall)} · ${it._stationName}` : it._stationName].filter(Boolean).join(' · ')}</Text>
                      </View>
                      <Text style={st.rowCal}>{Math.round(it.calories!)}<Text style={st.rowUnit}> cal</Text></Text>
                    </Pressable>
                  ))}
                </View>
                <GoalBar label="Calories" value={plan.totals.cal} target={goal.calories} unit="" color={C.accent} />
                <GoalBar label="Protein" value={plan.totals.p} target={goal.protein} unit="g" color={MACRO_COLOR.protein} />
                {goal.maxCarbs ? <GoalBar label="Carbs" value={plan.totals.c} target={goal.maxCarbs} unit="g" color={MACRO_COLOR.carbs} ceiling /> : null}
                {goal.maxFat ? <GoalBar label="Fat" value={plan.totals.f} target={goal.maxFat} unit="g" color={MACRO_COLOR.fat} ceiling /> : null}
                <Btn label={`Put this on my ${meal.toLowerCase()} plate`} onPress={() => addToPlate(plan.items, meal)} />
              </Panel>
            ))
          : <Empty icon="sparkles-outline" title="Ready when you are"
              body={`Suggestions come from what is actually on ${meal.toLowerCase()} this day, and respect your saved diet and allergen filters.`} />}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

function Target({ n, label }: { n: number | string; label: string }) {
  return (
    <View style={st.target}>
      <Text style={st.targetN}>{n}</Text>
      <Text style={st.targetL}>{label}</Text>
    </View>
  );
}

const st = StyleSheet.create({
  h3: { color: C.text, fontSize: T.lg, fontWeight: '800', flex: 1 },
  targets: { flexDirection: 'row', gap: 8, flexWrap: 'wrap' },
  target: { flexGrow: 1, minWidth: 90, backgroundColor: C.card2, borderRadius: R.ctl, padding: 12 },
  targetN: { color: C.text, fontSize: T.xl, fontWeight: '800' },
  targetL: { color: C.text3, fontSize: T.xs, marginTop: 2 },
  num: { width: 26, height: 26, borderRadius: 13, backgroundColor: C.accent, alignItems: 'center', justifyContent: 'center' },
  numText: { color: C.onAccent, fontWeight: '800', fontSize: T.sm },
  meta: { color: C.text2, fontSize: T.sm, fontWeight: '600' },
  row: { flexDirection: 'row', alignItems: 'center', gap: 12, paddingVertical: 10, borderTopWidth: StyleSheet.hairlineWidth, borderTopColor: C.border },
  rowName: { color: C.text, fontSize: T.md, fontWeight: '600' },
  rowSub: { color: C.text3, fontSize: T.sm, marginTop: 2 },
  rowCal: { color: C.text, fontSize: T.md, fontWeight: '800' },
  rowUnit: { color: C.text3, fontSize: T.xs, fontWeight: '500' },
});
