import { useEffect, useState } from 'react';
import { ActivityIndicator, Pressable, StyleSheet, Text, View } from 'react-native';

import { listColleges } from '../lib/api';
import { C, R, T, TAP } from '../lib/theme';
import type { College } from '../lib/types';
import { Btn, Icon } from './ui';

/** The campus list, as a dropdown.

    The options come from the server (/api/colleges), not from the app, so a
    newly onboarded school appears here without an App Store release. */
export function CampusPicker({ value, onChange }: { value: string | null; onChange: (c: College) => void }) {
  const [colleges, setColleges] = useState<College[] | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [open, setOpen] = useState(false);
  const [nonce, setNonce] = useState(0);

  useEffect(() => {
    let live = true;
    listColleges()
      .then(list => live && setColleges(list))
      .catch(e => live && setError(String(e?.message || e)));
    return () => { live = false; };
  }, [nonce]);

  if (error) {
    return (
      <View style={{ gap: 10 }}>
        <Text style={st.error}>Couldn’t load campuses. {error}</Text>
        <Btn kind="ghost" label="Try again" onPress={() => { setError(null); setNonce(n => n + 1); }} />
      </View>
    );
  }

  const selected = colleges?.find(c => c.slug === value);
  return (
    <View>
      <Text style={st.label}>Your campus</Text>
      <Pressable onPress={() => colleges && setOpen(o => !o)} disabled={!colleges}
        accessibilityRole="combobox" accessibilityState={{ expanded: open }}
        accessibilityLabel={`Campus: ${selected?.name || 'none selected'}`}
        style={({ pressed }) => [st.field, open && st.fieldOpen, pressed && { opacity: 0.85 }]}>
        {colleges
          ? <Text style={[st.value, !selected && { color: C.text3 }]} numberOfLines={1}>
              {selected?.name || 'Select your campus'}</Text>
          : <ActivityIndicator color={C.text2} />}
        <Icon name={open ? 'chevron-up' : 'chevron-down'} size={18} color={C.text2} />
      </Pressable>

      {open && colleges && (
        <View style={st.menu} accessibilityRole="list">
          {colleges.map((c, i) => {
            const on = c.slug === value;
            return (
              <Pressable key={c.slug} onPress={() => { onChange(c); setOpen(false); }}
                accessibilityRole="button" accessibilityState={{ selected: on }}
                style={({ pressed }) => [st.option, i > 0 && st.optionBorder, pressed && { backgroundColor: C.card3 }]}>
                <View style={{ flex: 1 }}>
                  <Text style={st.optionName}>{c.name}</Text>
                  <Text style={st.optionSub}>{c.locations} dining halls · {c.days} days of menus</Text>
                </View>
                {on && <Icon name="checkmark" size={20} color={C.accentText} />}
              </Pressable>
            );
          })}
          <View style={[st.option, st.optionBorder]}>
            <Text style={st.more}>More campuses are on the way.</Text>
          </View>
        </View>
      )}
    </View>
  );
}

const st = StyleSheet.create({
  label: { color: C.text2, fontSize: T.sm, fontWeight: '600', marginBottom: 8 },
  field: { minHeight: TAP + 8, borderRadius: R.ctl, backgroundColor: C.card, borderWidth: 1, borderColor: C.borderControl, flexDirection: 'row', alignItems: 'center', paddingHorizontal: 16, gap: 10 },
  fieldOpen: { borderColor: C.accent },
  value: { color: C.text, fontSize: T.md + 1, fontWeight: '600', flex: 1 },
  menu: { marginTop: 8, backgroundColor: C.card, borderRadius: R.ctl, borderWidth: StyleSheet.hairlineWidth, borderColor: C.border, overflow: 'hidden' },
  option: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 16, paddingVertical: 14, gap: 10, minHeight: TAP + 8 },
  optionBorder: { borderTopWidth: StyleSheet.hairlineWidth, borderTopColor: C.border },
  optionName: { color: C.text, fontSize: T.md, fontWeight: '700' },
  optionSub: { color: C.text3, fontSize: T.sm, marginTop: 2 },
  more: { color: C.text3, fontSize: T.sm },
  error: { color: C.text2, fontSize: T.md, lineHeight: 21 },
});
