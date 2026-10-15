import { DarkTheme, Stack, ThemeProvider, type ErrorBoundaryProps, type NativeStackNavigationOptions } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { Btn } from '../components/ui';

import { ToastHost } from '../components/Toast';
import { StoreProvider } from '../lib/store';
import { C } from '../lib/theme';

const theme = {
  ...DarkTheme,
  colors: { ...DarkTheme.colors, background: C.bg, card: C.surface, text: C.text, border: C.border, primary: C.accent },
};

/** Sheets that slide up over the tabs, like the web app's <dialog> sheets. */
const sheet: NativeStackNavigationOptions = {
  presentation: 'formSheet',
  sheetGrabberVisible: true,
  sheetAllowedDetents: [0.6, 1],
  sheetCornerRadius: 22,
  headerShown: false,
  contentStyle: { backgroundColor: C.surface },
};

/** If a screen throws, say so and offer a retry instead of a blank app. */
export function ErrorBoundary({ retry }: ErrorBoundaryProps) {
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: C.bg, justifyContent: 'center', padding: 24, gap: 12 }}>
      <Text style={{ color: C.text, fontSize: 22, fontWeight: '800', textAlign: 'center' }}>Something went wrong</Text>
      <Text style={{ color: C.text2, fontSize: 15, lineHeight: 21, textAlign: 'center' }}>
        Your saved data is safe. Try again, and if it keeps happening, let us know from Settings → Help and feedback.
      </Text>
      <Btn label="Try again" onPress={retry} />
    </SafeAreaView>
  );
}

export default function RootLayout() {
  return (
    <StoreProvider>
      <ThemeProvider value={theme}>
        <StatusBar style="light" />
        <View style={{ flex: 1, backgroundColor: C.bg }}>
          <Stack screenOptions={{ headerShown: false, contentStyle: { backgroundColor: C.bg } }}>
            <Stack.Screen name="(tabs)" />
            <Stack.Screen name="welcome" options={{ gestureEnabled: false, animation: 'fade' }} />
            <Stack.Screen name="item/[id]" options={{ ...sheet, sheetAllowedDetents: [0.75, 1] }} />
            <Stack.Screen name="portion" options={{ ...sheet, sheetAllowedDetents: [0.7, 1] }} />
            <Stack.Screen name="filters" options={{ ...sheet, sheetAllowedDetents: [0.8, 1] }} />
            <Stack.Screen name="hall" options={{ ...sheet, sheetAllowedDetents: [0.5, 0.8] }} />
            <Stack.Screen name="targets" options={{ ...sheet, sheetAllowedDetents: [0.85, 1] }} />
            <Stack.Screen name="favorites" options={sheet} />
            <Stack.Screen name="stats" options={sheet} />
            <Stack.Screen name="campus" options={sheet} />
            <Stack.Screen name="settings" options={{ ...sheet, sheetAllowedDetents: [1] }} />
          </Stack>
          <ToastHost />
        </View>
      </ThemeProvider>
    </StoreProvider>
  );
}
