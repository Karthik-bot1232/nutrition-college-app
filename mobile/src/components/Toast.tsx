import { Pressable, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { useStore } from '../lib/store';
import { C, R, T } from '../lib/theme';

/** One message at a time, above the tab bar, with Undo when there is one. */
export function ToastHost() {
  const { toast, hideToast } = useStore();
  const insets = useSafeAreaInsets();
  if (!toast) return null;
  return (
    <View pointerEvents="box-none" style={[st.wrap, { bottom: insets.bottom + 70 }]}>
      <View style={st.toast} accessibilityLiveRegion="polite" accessibilityRole="alert">
        <Text style={st.msg} numberOfLines={2}>{toast.msg}</Text>
        {toast.undo && (
          <Pressable hitSlop={10} onPress={() => { toast.undo?.(); hideToast(); }} accessibilityRole="button">
            <Text style={st.undo}>Undo</Text>
          </Pressable>
        )}
      </View>
    </View>
  );
}

const st = StyleSheet.create({
  wrap: { position: 'absolute', left: 16, right: 16, alignItems: 'center' },
  toast: { flexDirection: 'row', alignItems: 'center', gap: 16, backgroundColor: C.card3, borderRadius: R.ctl, paddingHorizontal: 16, paddingVertical: 12, maxWidth: 480, width: '100%', shadowColor: '#000', shadowOpacity: 0.5, shadowRadius: 16, shadowOffset: { width: 0, height: 6 }, elevation: 8 },
  msg: { color: C.text, fontSize: T.sm, fontWeight: '600', flex: 1 },
  undo: { color: C.accentText, fontSize: T.sm, fontWeight: '800' },
});
