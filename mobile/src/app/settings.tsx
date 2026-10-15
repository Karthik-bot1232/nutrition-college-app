import Constants from 'expo-constants';
import { router } from 'expo-router';
import { useState } from 'react';
import { Alert, Linking, Platform, Pressable, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';

import { SheetHead } from '../components/Sheet';
import { Chip, Icon, type IconName } from '../components/ui';
import { PRIVACY_URL, SUPPORT_URL } from '../lib/api';
import { DIETS, titleCase } from '../lib/logic';
import { useStore } from '../lib/store';
import { C, R, T } from '../lib/theme';

/** Everything about this person, in one place: who they are, what they eat,
    what they aim for, and the way to wipe it all. */
export default function Settings() {
  const { name, setName, meta, profile, setProfile, goal, eraseAll } = useStore();
  const [typed, setTyped] = useState(name);
  // Follow the stored name if it arrives after this screen (storage still
  // loading on a cold start, or an erase).
  const [shownName, setShownName] = useState(name);
  if (shownName !== name) { setShownName(name); setTyped(name); }
  const flip = (list: string[], v: string) => (list.includes(v) ? list.filter(x => x !== v) : [...list, v]);
  const version = Constants.expoConfig?.version ?? '';

  const erase = async () => {
    await eraseAll();
    if (router.canDismiss()) router.dismissAll();
    router.replace('/welcome');
  };
  const confirmErase = () => {
    const title = 'Erase all your data?';
    const body = 'This removes your name, campus, favorites, diet settings, targets and every logged meal from this phone. It cannot be undone.';
    // react-native-web's Alert is a no-op; the browser preview needs its own.
    if (Platform.OS === 'web') { if (window.confirm(`${title}\n\n${body}`)) erase(); return; }
    Alert.alert(title, body, [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Erase', style: 'destructive', onPress: erase },
    ]);
  };

  return (
    <View style={{ flex: 1 }}>
      <SheetHead title="You" sub="Saved only on this phone" />
      <ScrollView contentContainerStyle={{ padding: 16, paddingTop: 4, paddingBottom: 48 }} keyboardShouldPersistTaps="handled">
        <Text style={st.h3}>Name</Text>
        <TextInput value={typed} onChangeText={setTyped} onEndEditing={() => setName(typed)} onBlur={() => setName(typed)}
          placeholder="Your first name" placeholderTextColor={C.text3} style={st.input} autoCapitalize="words"
          autoCorrect={false} maxLength={40} returnKeyType="done" accessibilityLabel="Your first name" />

        <View style={st.group}>
          <Row icon="school-outline" label="Campus" value={meta?.college_name} onPress={() => router.push('/campus')} />
          <Row icon="locate-outline" label="Targets" value={`${goal.dayCalories.toLocaleString()} cal · ${goal.dayProtein}g protein a day`}
            onPress={() => router.push('/targets')} />
        </View>

        <Text style={st.h3}>Diet</Text>
        <View style={st.wrap}>
          {DIETS.map(d => <Chip key={d} label={titleCase(d)} on={profile.diets.includes(d)}
            onPress={() => setProfile({ ...profile, diets: flip(profile.diets, d) })} />)}
        </View>
        <Text style={st.h3}>Allergies or things you avoid</Text>
        <View style={st.wrap}>
          {(meta?.allergens || []).map(a => <Chip key={a} label={titleCase(a)} on={profile.without.includes(a)}
            onPress={() => setProfile({ ...profile, without: flip(profile.without, a) })} />)}
        </View>
        <Text style={st.note}>Always confirm with dining staff if you have a serious allergy. Halls do not publish allergen information for every item.</Text>

        <Text style={st.h3}>About</Text>
        <View style={st.group}>
          <Row icon="shield-checkmark-outline" label="Privacy policy" onPress={() => Linking.openURL(PRIVACY_URL)} external />
          <Row icon="help-circle-outline" label="Help and feedback" onPress={() => Linking.openURL(SUPPORT_URL)} external />
          <Row icon="information-circle-outline" label="About the menu data" onPress={() => router.push('/stats')} />
        </View>
        <Text style={st.note}>Campus Cals is independent and not affiliated with, or endorsed by, any university or its dining services. Menus and nutrition labels are copied from each campus’s public dining website and can differ from what is served. Nutrition information is not medical advice.</Text>

        <Text style={st.h3}>Your data</Text>
        <Text style={st.note}>There is no account. Your name, favorites, targets and meal log are stored only on this phone and are never sent anywhere. They are included in your phone’s iCloud backup.</Text>
        <Pressable onPress={confirmErase} style={({ pressed }) => [st.danger, pressed && { opacity: 0.8 }]} accessibilityRole="button">
          <Icon name="trash-outline" size={18} color={C.danger} />
          <Text style={st.dangerText}>Erase all my data</Text>
        </Pressable>

        <Text style={[st.note, { textAlign: 'center', marginTop: 28 }]}>Campus Cals {version}</Text>
      </ScrollView>
    </View>
  );
}

function Row({ icon, label, value, onPress, external }: {
  icon: IconName; label: string; value?: string; onPress: () => void; external?: boolean;
}) {
  return (
    <Pressable onPress={onPress} style={({ pressed }) => [st.row, pressed && { backgroundColor: C.card2 }]}
      accessibilityRole={external ? 'link' : 'button'}>
      <Icon name={icon} size={20} color={C.text2} />
      <View style={{ flex: 1 }}>
        <Text style={st.rowLabel}>{label}</Text>
        {value ? <Text style={st.rowValue} numberOfLines={1}>{value}</Text> : null}
      </View>
      <Icon name={external ? 'open-outline' : 'chevron-forward'} size={16} color={C.text3} />
    </Pressable>
  );
}

const st = StyleSheet.create({
  h3: { color: C.text, fontSize: T.md, fontWeight: '800', marginTop: 22, marginBottom: 10 },
  input: { height: 48, color: C.text, fontSize: T.md, backgroundColor: C.card, borderRadius: R.ctl, paddingHorizontal: 14, borderWidth: 1, borderColor: C.borderControl },
  group: { backgroundColor: C.card, borderRadius: R.card, marginTop: 16, overflow: 'hidden' },
  row: { flexDirection: 'row', alignItems: 'center', gap: 12, paddingHorizontal: 16, minHeight: 56, paddingVertical: 10, borderBottomWidth: StyleSheet.hairlineWidth, borderBottomColor: C.border },
  rowLabel: { color: C.text, fontSize: T.md, fontWeight: '600' },
  rowValue: { color: C.text3, fontSize: T.sm, marginTop: 2 },
  wrap: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  note: { color: C.text3, fontSize: T.sm, lineHeight: 19, marginTop: 10 },
  danger: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8, height: 50, borderRadius: R.ctl, backgroundColor: C.dangerWash, marginTop: 14 },
  dangerText: { color: C.danger, fontSize: T.md, fontWeight: '700' },
});
