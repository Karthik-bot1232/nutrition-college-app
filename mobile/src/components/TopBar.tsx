import { router } from 'expo-router';
import type { ReactNode } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { C, T } from '../lib/theme';
import { Icon, IconBtn } from './ui';

/** The top of every tab: a title, a line under it, and favorites / you. */
export function TopBar({ title, sub, onSub, right }: {
  title: string; sub?: string; onSub?: () => void; right?: ReactNode;
}) {
  return (
    <View style={st.bar}>
      <View style={{ flex: 1 }}>
        <Text style={st.title} accessibilityRole="header" numberOfLines={1} adjustsFontSizeToFit minimumFontScale={0.75}>{title}</Text>
        {sub ? (
          <Pressable onPress={onSub} disabled={!onSub} hitSlop={8}
            style={{ flexDirection: 'row', alignItems: 'center', gap: 3 }}
            accessibilityRole={onSub ? 'button' : 'text'}>
            <Text style={st.sub} numberOfLines={1}>{sub}</Text>
            {onSub && <Icon name="chevron-down" size={14} color={C.text3} />}
          </Pressable>
        ) : null}
      </View>
      {right}
      <IconBtn name="heart-outline" label="Favorites" onPress={() => router.push('/favorites')} />
      <IconBtn name="person-circle-outline" label="You and settings" onPress={() => router.push('/settings')} />
    </View>
  );
}

const st = StyleSheet.create({
  bar: { flexDirection: 'row', alignItems: 'center', gap: 4, paddingHorizontal: 16, paddingTop: 8, paddingBottom: 12 },
  title: { color: C.text, fontSize: 28, fontWeight: '800', letterSpacing: -0.6 },
  sub: { color: C.text3, fontSize: T.sm, flexShrink: 1 },
});
