import * as ImagePicker from 'expo-image-picker';
import { router } from 'expo-router';
import { useEffect, useRef, useState } from 'react';
import { Image, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { ItemCard, openItem } from '../../components/items';
import { TopBar } from '../../components/TopBar';
import { Btn, Empty, Hint, Loading, Notice, Panel, SectionHead, s as ui } from '../../components/ui';
import { loadDay } from '../../lib/api';
import {
  hallName, homeDate, isToday, matchScan, readableScanText, SCAN_SURE, scanCandidates, scanIsSure, shortDay,
  shortHall, type ScanMatch,
} from '../../lib/logic';
import { useMeta } from '../../lib/store';
import { C, R, T } from '../../lib/theme';

/* On-device text recognition (Apple Vision on iOS, ML Kit on Android). It is
   native code, so it exists in a development or store build but not in Expo
   Go; without it Scan still works by typing the name on the card. */
type Extractor = { isSupported: boolean; extractTextFromImage: (uri: string) => Promise<string[]> };
let ocr: Extractor | null = null;
try {
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  ocr = require('expo-text-extractor') as Extractor;
  if (!ocr.isSupported) ocr = null;
} catch {
  ocr = null;
}

type Status = 'idle' | 'reading' | 'matching' | 'done' | 'error';

export default function Scan() {
  const { meta, meal, location, setDate, date, setFilters } = useMeta();
  const [photo, setPhoto] = useState<string | null>(null);
  const [text, setText] = useState('');
  const [status, setStatus] = useState<Status>('idle');
  const [error, setError] = useState('');
  const [matches, setMatches] = useState<ScanMatch[] | null>(null);
  const token = useRef(0);

  // A card in front of you is today's food, whatever day Menu was left on.
  const today = homeDate(meta);
  useEffect(() => { if (date !== today) setDate(today); }, [date, today, setDate]);

  const where = `${meal.toLowerCase()} at ${location === 'all' ? 'any hall' : shortHall(hallName(meta, location))}, ${isToday(today) ? 'today' : shortDay(today)}`;

  async function match(t: string, autoOpen: boolean) {
    const mine = ++token.current;
    setStatus('matching');
    try {
      const day = await loadDay(meta, today);
      const found = matchScan(t, scanCandidates(day, meal, location));
      if (mine !== token.current) return;
      setMatches(found);
      setStatus('done');
      if (autoOpen && scanIsSure(found)) openItem(found[0].item.recipe_id);
    } catch {
      if (mine !== token.current) return;
      setError('Could not load today’s menu to match against. Check your connection.');
      setStatus('error');
    }
  }

  async function pick(camera: boolean) {
    const perm = camera
      ? await ImagePicker.requestCameraPermissionsAsync()
      : await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!perm.granted) {
      setError(camera ? 'Camera access is off. Turn it on in Settings → Campus Cals.' : 'Photo access is off. Turn it on in Settings → Campus Cals.');
      setStatus('error');
      return;
    }
    const opts: ImagePicker.ImagePickerOptions = { mediaTypes: 'images', quality: 0.8 };
    const res = camera ? await ImagePicker.launchCameraAsync(opts) : await ImagePicker.launchImageLibraryAsync(opts);
    if (res.canceled || !res.assets?.[0]) return;
    const uri = res.assets[0].uri;
    const mine = ++token.current;
    setPhoto(uri); setMatches(null); setText(''); setError('');
    if (!ocr) { setStatus('done'); setMatches(null); return; }
    setStatus('reading');
    try {
      const lines = await ocr.extractTextFromImage(uri);
      if (mine !== token.current) return;
      const t = readableScanText(lines);
      setText(t);
      if (!t) { setMatches([]); setStatus('done'); return; }
      match(t, true);
    } catch {
      if (mine !== token.current) return;
      setError('Could not read that photo. Try again closer, with the card filling the frame.');
      setStatus('error');
    }
  }

  const busy = status === 'reading' || status === 'matching';
  const placeOf = (c: ScanMatch) => {
    const at = c.item._at.find(a => location === 'all' || a.loc === location) || c.item._at[0];
    return `${c.meal === meal ? '' : `${c.meal} · `}${at.hall} · ${at.station}`;
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: C.bg }} edges={['top']}>
      <ScrollView contentContainerStyle={{ paddingBottom: 120 }} keyboardShouldPersistTaps="handled">
        <TopBar title="Scan" sub={`Matching against ${where}`} />
        <View style={{ paddingHorizontal: 16, gap: 12 }}>
          {!photo ? (
            <Panel style={{ gap: 12 }}>
              <Text style={st.h2}>Scan a name card</Text>
              <Text style={ui.muted}>Photograph the card in front of a dish. We read the name on your phone and find it on {where}.</Text>
              <Btn icon="camera" label="Take a photo" onPress={() => pick(true)} />
              <Btn kind="ghost" label="Choose from photos" onPress={() => pick(false)} />
              <Hint>Fill the frame with the card and hold steady. Tilt the phone a little if the light glares off it.</Hint>
            </Panel>
          ) : (
            <View style={{ flexDirection: 'row', gap: 12 }}>
              <Image source={{ uri: photo }} style={st.photo} accessibilityLabel="Your photo of the name card" />
              <View style={{ flex: 1, gap: 8, justifyContent: 'center' }}>
                <Btn icon="camera" small label="Scan another" onPress={() => pick(true)} />
                <Btn kind="ghost" small label="Choose photo" onPress={() => pick(false)} />
              </View>
            </View>
          )}

          {!ocr && (
            <Notice tone="info">Reading text from photos needs the installed app (it is not in Expo Go). Type the name on the card below instead.</Notice>
          )}

          {busy && <Loading label={status === 'reading' ? 'Reading the card…' : 'Finding it on the menu…'} />}
          {status === 'error' && <Notice>{error}</Notice>}

          {(status === 'done' || !ocr || (status === 'error' && text)) && (
            <View style={{ gap: 8 }}>
              <Text style={st.label}>{ocr && photo ? 'We read' : 'Name on the card'}</Text>
              <TextInput value={text} onChangeText={setText} multiline placeholder="Type the name on the card"
                placeholderTextColor={C.text3} style={st.input} autoCorrect={false}
                onSubmitEditing={() => text.trim() && match(text, false)} />
              <Btn kind="ghost" small label="Find this" disabled={!text.trim()} onPress={() => match(text, false)} />
            </View>
          )}
        </View>

        {matches && matches.length > 0 && (
          <View style={{ paddingHorizontal: 16 }}>
            <SectionHead title={matches[0].fit >= SCAN_SURE ? 'Best match' : 'Closest match'} />
            <ItemCard item={matches[0].item} sub={placeOf(matches[0])} />
            {matches.length > 1 && <SectionHead title="Or did you mean" />}
            {matches.slice(1).map(c => <ItemCard key={c.item.recipe_id} item={c.item} sub={placeOf(c)} />)}
          </View>
        )}
        {matches && !matches.length && (
          <Empty title="Not on today’s menu" body={`Nothing served ${where.replace(/^\w+ at /, 'at ')} matches that. Fix the text above, or search every stored day.`}>
            {text ? <Btn kind="ghost" label="Search for it" onPress={() => { setFilters({ q: text.split('\n')[0], scope: 'all' }); router.navigate('/menu'); }} /> : null}
          </Empty>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const st = StyleSheet.create({
  h2: { color: C.text, fontSize: T.xl, fontWeight: '800' },
  photo: { width: 140, height: 140, borderRadius: R.card, backgroundColor: C.card },
  label: { color: C.text2, fontSize: T.sm, fontWeight: '600' },
  input: { minHeight: 52, color: C.text, fontSize: T.md, backgroundColor: C.card, borderRadius: R.ctl, padding: 14, borderWidth: 1, borderColor: C.borderControl },
});
