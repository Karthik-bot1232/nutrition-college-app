import { router } from 'expo-router';
import { ScrollView, StyleSheet, Switch, Text, TextInput, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { SheetHead } from '../components/Sheet';
import { Btn, Chip, Hint } from '../components/ui';
import { DIETS, SCOPE_LABEL, SORT_LABEL, titleCase, type Scope, type Sort } from '../lib/logic';
import { NO_FILTERS, useMeta } from '../lib/store';
import { C, R, T } from '../lib/theme';

export default function FiltersSheet() {
  const { meta, filters, setFilters, profile, setProfile } = useMeta();
  const insets = useSafeAreaInsets();
  const flip = (list: string[], v: string) => (list.includes(v) ? list.filter(x => x !== v) : [...list, v]);

  return (
    <View style={{ flex: 1 }}>
      <SheetHead title="Filters" sub="Diet and allergens are remembered on this phone" />
      <ScrollView contentContainerStyle={{ padding: 16, paddingTop: 4 }}>
        <Text style={st.h3}>Diet</Text>
        <View style={st.wrap}>
          {DIETS.map(d => <Chip key={d} label={titleCase(d)} on={profile.diets.includes(d)}
            onPress={() => setProfile({ ...profile, diets: flip(profile.diets, d) })} />)}
        </View>

        <Text style={st.h3}>Leave out</Text>
        <View style={st.wrap}>
          {meta.allergens.map(a => <Chip key={a} label={titleCase(a)} on={profile.without.includes(a)}
            onPress={() => setProfile({ ...profile, without: flip(profile.without, a) })} />)}
        </View>
        <View style={st.switchRow}>
          <Text style={st.switchLabel}>Also show items with no allergen data</Text>
          <Switch value={profile.includeUnknown} onValueChange={v => setProfile({ ...profile, includeUnknown: v })}
            trackColor={{ true: C.accent, false: C.card3 }} />
        </View>
        <Hint>About a third of items publish no allergen information. They are hidden while you leave anything out, because nothing published is not the same as free of it.</Hint>

        <Text style={st.h3}>Nutrition</Text>
        <View style={{ flexDirection: 'row', gap: 10 }}>
          <Field label="Protein at least (g)" value={filters.minProtein} onChange={v => setFilters({ minProtein: v })} placeholder="any" />
          <Field label="Calories at most" value={filters.maxCalories} onChange={v => setFilters({ maxCalories: v })} placeholder="any" />
        </View>

        <Text style={st.h3}>Sort</Text>
        <View style={st.wrap}>
          {(Object.keys(SORT_LABEL) as Sort[]).map(k => <Chip key={k} label={SORT_LABEL[k]} on={filters.sort === k} onPress={() => setFilters({ sort: k })} />)}
        </View>

        <Text style={st.h3}>Search in</Text>
        <View style={st.wrap}>
          {(Object.keys(SCOPE_LABEL) as Scope[]).map(k => <Chip key={k} label={SCOPE_LABEL[k]} on={filters.scope === k} onPress={() => setFilters({ scope: k })} />)}
        </View>

        <View style={[st.switchRow, { marginTop: 20 }]}>
          <Text style={st.switchLabel}>Hide labels that look wrong</Text>
          <Switch value={filters.hideImplausible} onValueChange={v => setFilters({ hideImplausible: v })}
            trackColor={{ true: C.accent, false: C.card3 }} />
        </View>
      </ScrollView>
      <View style={[st.foot, { paddingBottom: Math.max(insets.bottom, 12) }]}>
        <Btn kind="ghost" label="Reset" onPress={() => {
          setFilters({ ...NO_FILTERS, q: filters.q, favOnly: filters.favOnly });
          setProfile({ diets: [], without: [], includeUnknown: false });
        }} />
        <Btn style={{ flex: 1 }} label="Show results" onPress={() => router.back()} />
      </View>
    </View>
  );
}

function Field({ label, value, onChange, placeholder }: { label: string; value: string; onChange: (v: string) => void; placeholder?: string }) {
  return (
    <View style={{ flex: 1, gap: 6 }}>
      <Text style={st.fieldLabel}>{label}</Text>
      <TextInput value={value} onChangeText={t => onChange(t.replace(/[^\d]/g, ''))} keyboardType="number-pad"
        placeholder={placeholder} placeholderTextColor={C.text3} style={st.input} accessibilityLabel={label} />
    </View>
  );
}

const st = StyleSheet.create({
  h3: { color: C.text, fontSize: T.md, fontWeight: '800', marginTop: 20, marginBottom: 10 },
  wrap: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  switchRow: { flexDirection: 'row', alignItems: 'center', gap: 12, marginTop: 14 },
  switchLabel: { color: C.text, fontSize: T.md, flex: 1 },
  fieldLabel: { color: C.text2, fontSize: T.sm },
  input: { height: 46, color: C.text, fontSize: T.md, backgroundColor: C.card, borderRadius: R.ctl, paddingHorizontal: 14, borderWidth: 1, borderColor: C.borderControl },
  foot: { flexDirection: 'row', gap: 10, paddingHorizontal: 16, paddingTop: 12, borderTopWidth: StyleSheet.hairlineWidth, borderTopColor: C.border },
});
