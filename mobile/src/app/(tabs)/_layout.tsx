import { Redirect } from 'expo-router';
import { useEffect, useState } from 'react';
import { NativeTabs } from 'expo-router/unstable-native-tabs';
import { StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { Btn, Loading } from '../../components/ui';
import { API_BASE } from '../../lib/api';
import { useStore } from '../../lib/store';
import { C, T } from '../../lib/theme';

export default function TabLayout() {
  const { hydrated, college, onboarded, meta, metaError, reloadMeta } = useStore();

  if (!hydrated) return <View style={{ flex: 1, backgroundColor: C.bg }} />;
  // First launch: set up campus, name, diet and targets. After that the app
  // opens straight onto this person's setup.
  if (!college || !onboarded) return <Redirect href="/welcome" />;

  if (!meta) {
    return (
      <SafeAreaView style={st.wait}>
        {metaError ? (
          <View style={{ gap: 12, alignItems: 'center' }}>
            <Text style={st.title}>Can’t reach the menus</Text>
            <Text style={st.body}>Check your connection and try again. If you just opened the app, the menu server may still be starting up, which can take up to a minute.</Text>
            {__DEV__ && <Text style={[st.body, { fontSize: T.xs }]}>{metaError} ({API_BASE})</Text>}
            <Btn label="Try again" onPress={reloadMeta} style={{ alignSelf: 'stretch' }} />
          </View>
        ) : <SlowLoading />}
      </SafeAreaView>
    );
  }

  return (
    <NativeTabs tintColor={C.accent} labelStyle={{ color: C.text2 }}>
      <NativeTabs.Trigger name="index">
        <NativeTabs.Trigger.Label>Today</NativeTabs.Trigger.Label>
        <NativeTabs.Trigger.Icon sf={{ default: 'house', selected: 'house.fill' }} md="home" />
      </NativeTabs.Trigger>
      <NativeTabs.Trigger name="menu">
        <NativeTabs.Trigger.Label>Menu</NativeTabs.Trigger.Label>
        <NativeTabs.Trigger.Icon sf="fork.knife" md="restaurant_menu" />
      </NativeTabs.Trigger>
      <NativeTabs.Trigger name="scan">
        <NativeTabs.Trigger.Label>Scan</NativeTabs.Trigger.Label>
        <NativeTabs.Trigger.Icon sf="text.viewfinder" md="document_scanner" />
      </NativeTabs.Trigger>
      <NativeTabs.Trigger name="build">
        <NativeTabs.Trigger.Label>Build</NativeTabs.Trigger.Label>
        <NativeTabs.Trigger.Icon sf="sparkles" md="auto_awesome" />
      </NativeTabs.Trigger>
      <NativeTabs.Trigger name="tracker">
        <NativeTabs.Trigger.Label>Tracker</NativeTabs.Trigger.Label>
        <NativeTabs.Trigger.Icon sf={{ default: 'chart.pie', selected: 'chart.pie.fill' }} md="donut_large" />
      </NativeTabs.Trigger>
    </NativeTabs>
  );
}

/** After a few seconds, say why it is slow rather than spinning in silence. */
function SlowLoading() {
  const [slow, setSlow] = useState(false);
  useEffect(() => { const t = setTimeout(() => setSlow(true), 5000); return () => clearTimeout(t); }, []);
  return <Loading label={slow ? 'Still loading. The menu server is starting up, which can take up to a minute.' : 'Loading today’s menus…'} />;
}

const st = StyleSheet.create({
  wait: { flex: 1, backgroundColor: C.bg, justifyContent: 'center', padding: 24 },
  title: { color: C.text, fontSize: T.xl, fontWeight: '800', textAlign: 'center' },
  body: { color: C.text2, fontSize: T.md, lineHeight: 21, textAlign: 'center' },
});
