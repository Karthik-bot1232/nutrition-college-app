import { router } from 'expo-router';
import { useState } from 'react';
import { ScrollView, View } from 'react-native';

import { CampusPicker } from '../components/CampusPicker';
import { SheetHead } from '../components/Sheet';
import { Btn, Hint } from '../components/ui';
import { useStore } from '../lib/store';

export default function Campus() {
  const { college, setCollege } = useStore();
  const [choice, setChoice] = useState(college);
  return (
    <View style={{ flex: 1 }}>
      <SheetHead title="Campus" sub="Menus, halls and hours follow this choice" />
      <ScrollView contentContainerStyle={{ padding: 16, gap: 16 }}>
        <CampusPicker value={choice} onChange={c => setChoice(c.slug)} />
        <Hint>Favorites are kept per campus. Your tracker, targets and diet profile stay the same.</Hint>
        <Btn label="Save" disabled={!choice}
          onPress={() => { if (choice) setCollege(choice); router.back(); }} />
      </ScrollView>
    </View>
  );
}
