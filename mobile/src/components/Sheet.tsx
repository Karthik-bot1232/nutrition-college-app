import { router } from 'expo-router';
import { StyleSheet, Text, View } from 'react-native';

import { C, T } from '../lib/theme';
import { IconBtn } from './ui';

/** Title, subtitle and a close button: the top of every sheet. */
export function SheetHead({ title, sub }: { title: string; sub?: string | null }) {
  return (
    <View style={st.head}>
      <View style={{ flex: 1 }}>
        <Text style={st.title} accessibilityRole="header">{title}</Text>
        {sub ? <Text style={st.sub}>{sub}</Text> : null}
      </View>
      <IconBtn name="close" label="Close" onPress={() => router.back()} color={C.text2} />
    </View>
  );
}

const st = StyleSheet.create({
  head: { flexDirection: 'row', alignItems: 'flex-start', gap: 8, paddingHorizontal: 16, paddingTop: 22, paddingBottom: 8 },
  title: { color: C.text, fontSize: T.xl, fontWeight: '800', letterSpacing: -0.3 },
  sub: { color: C.text2, fontSize: T.sm, marginTop: 3 },
});
