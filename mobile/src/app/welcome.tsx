import { router } from 'expo-router';
import { useState } from 'react';
import { Image, KeyboardAvoidingView, Platform, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { CampusPicker } from '../components/CampusPicker';
import { Btn, Chip, LinkBtn } from '../components/ui';
import { DIETS, GOAL_DEFAULTS, titleCase } from '../lib/logic';
import { useStore } from '../lib/store';
import { C, R, T } from '../lib/theme';

/** Used until the campus's own list arrives from the server. */
const ALLERGENS = ['dairy', 'eggs', 'fish', 'shellfish', 'tree_nuts', 'peanuts', 'gluten', 'soy', 'sesame'];

/* First launch only: campus, then a little about the person, then targets.
   Everything chosen here is stored on this phone, so each person who installs
   the app gets their own setup, and the app opens straight onto it after. */
export default function Welcome() {
  const store = useStore();
  const { college, setCollege, meta, name, setName, profile, setProfile, goals, setGoals, completeOnboarding } = store;
  const [step, setStep] = useState(0);
  const [choice, setChoice] = useState<string | null>(college);
  const [typed, setTyped] = useState(name);
  const [shownName, setShownName] = useState(name);
  if (shownName !== name) { setShownName(name); setTyped(name); }
  const [dayCal, setDayCal] = useState(goals.dayCalories);
  const [dayProtein, setDayProtein] = useState(goals.dayProtein);

  const flip = (list: string[], v: string) => (list.includes(v) ? list.filter(x => x !== v) : [...list, v]);
  const allergens = meta?.college === choice && meta.allergens.length ? meta.allergens : ALLERGENS;

  const finish = () => {
    setName(typed);
    setGoals({ ...goals, dayCalories: dayCal, dayProtein: dayProtein });
    completeOnboarding();
    router.replace('/');
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: C.bg }}>
      <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <View style={st.dots} accessibilityLabel={`Step ${step + 1} of 3`}>
          {[0, 1, 2].map(i => <View key={i} style={[st.dot, i === step && st.dotOn]} />)}
        </View>

        <ScrollView contentContainerStyle={st.body} keyboardShouldPersistTaps="handled">
          {step === 0 && (
            <View style={{ alignItems: 'center', alignSelf: 'stretch' }}>
              <Image source={require('../../assets/logo.png')} style={st.mark} accessible={false} />
              <Text style={st.title} accessibilityRole="header">Campus Cals</Text>
              <Text style={st.tag}>What your dining hall is serving, with the full nutrition label for every dish.</Text>
              <View style={{ marginTop: 36, alignSelf: 'stretch' }}>
                <CampusPicker value={choice} onChange={c => setChoice(c.slug)} />
              </View>
            </View>
          )}

          {step === 1 && (
            <View style={{ alignSelf: 'stretch', gap: 6 }}>
              <Text style={st.h1} accessibilityRole="header">Make it yours</Text>
              <Text style={st.lead}>This stays on your phone. Skip anything you like.</Text>

              <Text style={st.label}>Your first name</Text>
              <TextInput value={typed} onChangeText={setTyped} placeholder="Optional" placeholderTextColor={C.text3}
                style={st.input} autoCapitalize="words" autoCorrect={false} maxLength={40} returnKeyType="done"
                accessibilityLabel="Your first name" textContentType="givenName" />

              <Text style={st.label}>Diet</Text>
              <View style={st.wrap}>
                {DIETS.map(d => <Chip key={d} label={titleCase(d)} on={profile.diets.includes(d)}
                  onPress={() => setProfile({ ...profile, diets: flip(profile.diets, d) })} />)}
              </View>

              <Text style={st.label}>Allergies or things you avoid</Text>
              <View style={st.wrap}>
                {allergens.map(a => <Chip key={a} label={titleCase(a)} on={profile.without.includes(a)}
                  onPress={() => setProfile({ ...profile, without: flip(profile.without, a) })} />)}
              </View>
              <Text style={st.fine}>Menus will leave these out, and hide items whose hall published no allergen information. Always check with dining staff if you have a serious allergy.</Text>
            </View>
          )}

          {step === 2 && (
            <View style={{ alignSelf: 'stretch', gap: 6 }}>
              <Text style={st.h1} accessibilityRole="header">Daily targets</Text>
              <Text style={st.lead}>The tracker and meal builder aim for these. You can change them any time.</Text>
              <View style={{ flexDirection: 'row', gap: 10 }}>
                <View style={{ flex: 1 }}>
                  <Text style={st.label}>Calories per day</Text>
                  <TextInput value={dayCal} onChangeText={t => setDayCal(t.replace(/[^\d]/g, ''))} keyboardType="number-pad"
                    placeholder={String(GOAL_DEFAULTS.dayCalories)} placeholderTextColor={C.text3} style={st.input}
                    accessibilityLabel="Calories per day" />
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={st.label}>Protein per day (g)</Text>
                  <TextInput value={dayProtein} onChangeText={t => setDayProtein(t.replace(/[^\d]/g, ''))} keyboardType="number-pad"
                    placeholder={String(GOAL_DEFAULTS.dayProtein)} placeholderTextColor={C.text3} style={st.input}
                    accessibilityLabel="Protein per day in grams" />
                </View>
              </View>
              <Text style={st.fine}>Leave them blank to use {GOAL_DEFAULTS.dayCalories.toLocaleString()} calories, the reference printed on every nutrition label. That is not a recommendation for you; needs vary a lot with size and activity.</Text>
            </View>
          )}
        </ScrollView>

        <View style={st.foot}>
          {step === 0 && <Btn label="Continue" disabled={!choice}
            onPress={() => { if (!choice) return; setCollege(choice); setStep(1); }} />}
          {step === 1 && <Btn label="Continue" onPress={() => { setName(typed); setStep(2); }} />}
          {step === 2 && <Btn label="Start" onPress={finish} />}
          <View style={st.footRow}>
            {step > 0 ? <LinkBtn quiet label="Back" onPress={() => setStep(step - 1)} /> : <View />}
            {step > 0 ? <LinkBtn quiet label="Skip" onPress={() => (step === 1 ? setStep(2) : finish())} /> : null}
          </View>
          {step === 0 && <Text style={[st.fine, { textAlign: 'center', marginTop: 0 }]}>Campus Cals is independent and not affiliated with any university.</Text>}
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const st = StyleSheet.create({
  dots: { flexDirection: 'row', gap: 6, justifyContent: 'center', paddingTop: 12 },
  dot: { width: 6, height: 6, borderRadius: 3, backgroundColor: C.card3 },
  dotOn: { width: 18, backgroundColor: C.accent },
  body: { flexGrow: 1, padding: 24, paddingTop: 48 },
  mark: { width: 96, height: 96, marginBottom: 24 },
  title: { color: C.text, fontSize: 34, fontWeight: '800', letterSpacing: -0.8 },
  tag: { color: C.text2, fontSize: T.md + 1, lineHeight: 23, textAlign: 'center', marginTop: 10, maxWidth: 320 },
  h1: { color: C.text, fontSize: 28, fontWeight: '800', letterSpacing: -0.6 },
  lead: { color: C.text2, fontSize: T.md, lineHeight: 21, marginBottom: 12 },
  label: { color: C.text2, fontSize: T.sm, fontWeight: '600', marginTop: 18, marginBottom: 8 },
  input: { height: 50, color: C.text, fontSize: T.md + 1, backgroundColor: C.card, borderRadius: R.ctl, paddingHorizontal: 16, borderWidth: 1, borderColor: C.borderControl },
  wrap: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  fine: { color: C.text3, fontSize: T.sm, lineHeight: 18, marginTop: 12 },
  foot: { padding: 24, paddingTop: 8, gap: 12 },
  footRow: { flexDirection: 'row', justifyContent: 'space-between', paddingHorizontal: 4 },
});
