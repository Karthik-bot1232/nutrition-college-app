import { router } from 'expo-router';
import { useState } from 'react';
import { KeyboardAvoidingView, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { SheetHead } from '../components/Sheet';
import { Btn, Hint } from '../components/ui';
import { EMPTY_GOALS } from '../lib/logic';
import { useStore } from '../lib/store';
import { C, R, T } from '../lib/theme';
import type { Goals } from '../lib/types';

export default function Targets() {
  const { goals, setGoals } = useStore();
  const [g, setG] = useState<Goals>(goals);
  const insets = useSafeAreaInsets();
  const field = (key: keyof Goals, label: string, placeholder: string) => (
    <View style={st.field}>
      <Text style={st.label}>{label}</Text>
      <TextInput value={g[key]} onChangeText={t => setG({ ...g, [key]: t.replace(/[^\d]/g, '') })}
        keyboardType="number-pad" placeholder={placeholder} placeholderTextColor={C.text3} style={st.input}
        accessibilityLabel={label} />
    </View>
  );
  return (
    <KeyboardAvoidingView behavior="padding" style={{ flex: 1 }}>
      <SheetHead title="Your targets" sub="Used by the tracker and the builder" />
      <ScrollView contentContainerStyle={{ padding: 16, paddingTop: 4 }} keyboardShouldPersistTaps="handled">
        <Text style={st.h3}>For the whole day</Text>
        <View style={st.grid}>
          {field('dayCalories', 'Calories per day', '2000')}
          {field('dayProtein', 'Protein per day (g)', '100')}
          {field('water', 'Water (cups)', '8')}
        </View>
        <Text style={st.h3}>For one meal</Text>
        <View style={st.grid}>
          {field('calories', 'Calories', '700')}
          {field('protein', 'Protein at least (g)', '35')}
          {field('maxCarbs', 'Carbs at most (g)', 'any')}
          {field('maxFat', 'Fat at most (g)', 'any')}
        </View>
        <Hint>Calories and protein steer the builder. Carbs and fat act as ceilings it tries not to cross.</Hint>
        <Hint>2,000 calories is the reference every printed nutrition label uses, not a recommendation for you. Needs vary a lot with size and activity.</Hint>
      </ScrollView>
      <View style={[st.foot, { paddingBottom: Math.max(insets.bottom, 12) }]}>
        <Btn kind="ghost" label="Reset" onPress={() => setG(EMPTY_GOALS)} />
        <Btn style={{ flex: 1 }} label="Save" onPress={() => { setGoals(g); router.back(); }} />
      </View>
    </KeyboardAvoidingView>
  );
}

const st = StyleSheet.create({
  h3: { color: C.text, fontSize: T.md, fontWeight: '800', marginTop: 20, marginBottom: 10 },
  grid: { flexDirection: 'row', flexWrap: 'wrap', gap: 10 },
  field: { flexBasis: '47%', flexGrow: 1, gap: 6 },
  label: { color: C.text2, fontSize: T.sm },
  input: { height: 46, color: C.text, fontSize: T.md, backgroundColor: C.card, borderRadius: R.ctl, paddingHorizontal: 14, borderWidth: 1, borderColor: C.borderControl },
  foot: { flexDirection: 'row', gap: 10, paddingHorizontal: 16, paddingTop: 12, borderTopWidth: StyleSheet.hairlineWidth, borderTopColor: C.border },
});
