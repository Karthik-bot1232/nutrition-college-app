import { useState } from 'react';
import { Pressable, StyleSheet, Text, TextInput, View } from 'react-native';

import { convertPortion, fmtQty, servingOz, toServings, UNIT_LABEL, UNIT_MAX, UNIT_STEP } from '../lib/logic';
import { C, MACRO_COLOR, R, T } from '../lib/theme';
import type { Portion, Unit } from '../lib/types';
import { Chip, Hint, Icon, Segmented } from './ui';

const QUICK: Record<Unit, number[]> = { serving: [0.5, 1, 1.5, 2], oz: [2, 4, 6, 8], g: [50, 100, 150, 200] };
const SHORT: Record<Unit, string> = { serving: 'servings', oz: 'oz', g: 'g' };

const show = (p: Portion) => (p.unit === 'g' ? String(Math.round(p.amount)) : String(Math.round(p.amount * 100) / 100));

/** What one serving of the label holds, multiplied out live as the amount changes. */
export interface PerServing { calories: number; protein: number; carbs: number; fat: number }

/** How much was eaten, in servings or by weight. `onChange` gets null while the
    box holds something that is not an amount, so the caller can hold off saving. */
export function PortionPicker({ serving, per, value, onChange }: {
  serving: string | null; per: PerServing; value: Portion; onChange: (p: Portion | null) => void;
}) {
  const oz = servingOz(serving);
  const [text, setText] = useState(show(value));
  const [unit, setUnit] = useState<Unit>(oz ? value.unit : 'serving');
  const amount = Number(text.replace(',', '.'));
  const valid = text.trim() !== '' && amount > 0 && amount <= UNIT_MAX[unit];
  const servings = valid ? toServings({ unit, amount }, oz) : 0;

  const set = (p: Portion) => { setUnit(p.unit); setText(show(p)); onChange(p); };
  const type = (t: string) => {
    const clean = t.replace(/[^\d.,]/g, '');
    setText(clean);
    const n = Number(clean.replace(',', '.'));
    onChange(clean && n > 0 && n <= UNIT_MAX[unit] ? { unit, amount: n } : null);
  };
  const step = (dir: 1 | -1) => {
    const s = UNIT_STEP[unit], base = valid ? amount : 0;
    const next = (dir > 0 ? Math.floor(base / s) + 1 : Math.ceil(base / s) - 1) * s;
    set({ unit, amount: Math.min(UNIT_MAX[unit], Math.max(s, next)) });
  };

  return (
    <View style={{ gap: 12 }}>
      <Segmented<Unit> value={unit}
        onChange={u => set(convertPortion(valid ? { unit, amount } : { unit, amount: 1 }, u, oz))}
        options={(['serving', 'oz', 'g'] as Unit[]).map(u => ({ value: u, label: UNIT_LABEL[u], disabled: u !== 'serving' && !oz }))} />

      <View style={st.entry}>
        <Pressable onPress={() => step(-1)} style={st.step} accessibilityRole="button" accessibilityLabel="Less">
          <Icon name="remove" size={20} color={C.text} />
        </Pressable>
        <View style={st.box}>
          <TextInput value={text} onChangeText={type} keyboardType="decimal-pad" selectTextOnFocus
            style={[st.input, !valid && text !== '' && { color: C.danger }]} accessibilityLabel={`Amount in ${UNIT_LABEL[unit].toLowerCase()}`} />
          <Text style={st.unit}>{unit === 'serving' && valid && amount <= 1 ? 'serving' : SHORT[unit]}</Text>
        </View>
        <Pressable onPress={() => step(1)} style={st.step} accessibilityRole="button" accessibilityLabel="More">
          <Icon name="add" size={20} color={C.text} />
        </Pressable>
      </View>

      <View style={st.chips}>
        {QUICK[unit].map(q => (
          <Chip key={q} label={unit === 'serving' ? fmtQty(q) : `${q} ${SHORT[unit]}`}
            on={valid && amount === q} onPress={() => set({ unit, amount: q })} />
        ))}
      </View>

      <View style={st.sum}>
        <Text style={st.sumCal}>{valid ? Math.round(per.calories * servings).toLocaleString() : '–'}<Text style={st.sumUnit}> cal</Text></Text>
        <Text style={st.sumMacros}>
          <Text style={{ color: MACRO_COLOR.protein }}>{valid ? Math.round(per.protein * servings) : '–'}g protein</Text>
          {'  '}<Text style={{ color: MACRO_COLOR.carbs }}>{valid ? Math.round(per.carbs * servings) : '–'}g carbs</Text>
          {'  '}<Text style={{ color: MACRO_COLOR.fat }}>{valid ? Math.round(per.fat * servings) : '–'}g fat</Text>
        </Text>
        {valid && unit !== 'serving' && <Text style={st.sumNote}>{fmtQty(Math.round(servings * 100) / 100)} × the {serving} serving</Text>}
      </View>

      {!oz ? (
        <Hint>The label gives its serving as “{serving || 'not listed'}”, not a weight, so this can only be logged in servings.</Hint>
      ) : !valid && text !== '' ? (
        <Hint>Enter an amount up to {UNIT_MAX[unit].toLocaleString()} {SHORT[unit]}.</Hint>
      ) : null}
    </View>
  );
}

const st = StyleSheet.create({
  entry: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  step: { width: 48, height: 48, borderRadius: R.pill, backgroundColor: C.card2, alignItems: 'center', justifyContent: 'center' },
  box: { flex: 1, height: 52, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 6, backgroundColor: C.card, borderRadius: R.ctl, borderWidth: 1, borderColor: C.borderControl, paddingHorizontal: 14 },
  input: { color: C.text, fontSize: T.xl, fontWeight: '800', minWidth: 48, textAlign: 'right', paddingVertical: 0 },
  unit: { color: C.text2, fontSize: T.md, fontWeight: '600' },
  chips: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  sum: { backgroundColor: C.card, borderRadius: R.card, padding: 14, gap: 4 },
  sumCal: { color: C.text, fontSize: T.xl, fontWeight: '800' },
  sumUnit: { color: C.text3, fontSize: T.md, fontWeight: '600' },
  sumMacros: { color: C.text2, fontSize: T.sm, fontWeight: '700' },
  sumNote: { color: C.text3, fontSize: T.sm },
});
