import { router, useLocalSearchParams } from 'expo-router';
import { useState } from 'react';
import { KeyboardAvoidingView, ScrollView, StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { PortionPicker } from '../components/Portion';
import { SheetHead } from '../components/Sheet';
import { Btn, Empty } from '../components/ui';
import { rowPortion, shortDay } from '../lib/logic';
import { useStore } from '../lib/store';
import { C } from '../lib/theme';
import type { Portion } from '../lib/types';

/** Change how much of a logged item was eaten, in servings or by weight. */
export default function PortionSheet() {
  const { date, meal, id } = useLocalSearchParams<{ date: string; meal: string; id: string }>();
  const { platesFor, setPortion, removeFromPlate } = useStore();
  const insets = useSafeAreaInsets();
  const row = (platesFor(date)[meal] || []).find(r => r.recipe_id === id);
  const [portion, setP] = useState<Portion | null>(row ? rowPortion(row) : null);

  if (!row) return <View style={{ flex: 1 }}><SheetHead title="Not logged" /><Empty icon="alert-circle-outline" title="This item is no longer logged" /></View>;

  return (
    <KeyboardAvoidingView behavior="padding" style={{ flex: 1 }}>
      <SheetHead title={row.name} sub={`${meal} · ${shortDay(date)} · ${row.serving || 'Serving size not listed'}`} />
      <ScrollView contentContainerStyle={{ padding: 16, paddingTop: 8 }} keyboardShouldPersistTaps="handled">
        <PortionPicker serving={row.serving} value={rowPortion(row)} onChange={setP}
          per={{ calories: row.calories, protein: row.protein, carbs: row.carbs, fat: row.fat }} />
      </ScrollView>
      <View style={[st.foot, { paddingBottom: Math.max(insets.bottom, 12) }]}>
        <Btn kind="ghost" icon="trash-outline" label="Remove" onPress={() => { removeFromPlate(date, meal, id); router.back(); }} />
        <Btn style={{ flex: 1 }} label="Save" disabled={!portion}
          onPress={() => { if (portion) setPortion(date, meal, id, portion); router.back(); }} />
      </View>
    </KeyboardAvoidingView>
  );
}

const st = StyleSheet.create({
  foot: { flexDirection: 'row', gap: 10, paddingHorizontal: 16, paddingTop: 12, borderTopWidth: StyleSheet.hairlineWidth, borderTopColor: C.border, backgroundColor: C.surface },
});
