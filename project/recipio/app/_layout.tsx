import { ThemeProvider } from '@masterfabric-expo/core';
import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { useEffect } from 'react';
import { Platform, useWindowDimensions, View } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import { I18nProvider } from '@/shared/i18n';
import { Snackbar } from '@/shared/components/Snackbar';
import { RecipioThemeSync } from '@/shared/components/RecipioThemeSync';
import { getSupabaseClient } from '@/shared/services/supabase-service';
import { syncSessionToStore } from '@/shared/services/profile-service';
import { storage } from '@/shared/utils/storage';
import { useProfileStore } from '@/screens/profile/store/profile-store';

SplashScreen.preventAutoHideAsync();

const MOBILE_WIDTH = 393;
const MOBILE_HEIGHT = 852;

export default function RootLayout() {
  const { height: windowHeight } = useWindowDimensions();
  const theme = useProfileStore((s) => s.settings.theme);
  const setSettings = useProfileStore((s) => s.setSettings);

  useEffect(() => {
    storage.getTheme().then((t) => {
      if (t) setSettings({ theme: t });
    });
  }, [setSettings]);

  useEffect(() => {
    const supabase = getSupabaseClient();
    if (supabase) {
      const { setSignedIn, setStats } = useProfileStore.getState();
      syncSessionToStore(setSignedIn, setStats).catch(() => {});
    }
  }, []);

  useEffect(() => {
    SplashScreen.hideAsync();
  }, []);

  const stack = (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="index" />
      <Stack.Screen name="onboarding" />
      <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
      <Stack.Screen
        name="find-next-meal"
        options={{
          headerShown: false,
          presentation: 'fullScreenModal',
          gestureEnabled: true,
        }}
      />
      <Stack.Screen name="enter-ingredients" options={{ headerShown: false }} />
      <Stack.Screen name="recipe-search" options={{ headerShown: false }} />
      <Stack.Screen name="recipe-results" options={{ headerShown: false }} />
      <Stack.Screen name="recipe-detail/[id]" options={{ headerShown: false }} />
      <Stack.Screen name="cooking-guide/[id]" options={{ headerShown: false }} />
      <Stack.Screen name="auth" options={{ headerShown: false }} />
      <Stack.Screen name="dietary-preferences" options={{ headerShown: false }} />
      <Stack.Screen name="help-support" options={{ headerShown: false }} />
      <Stack.Screen name="notifications" options={{ headerShown: false }} />
    </Stack>
  );

  const webBackgroundColor = theme === 'dark' ? '#000000' : '#e8e8e8';

  if (Platform.OS === 'web') {
    const scale = Math.min(1, windowHeight / MOBILE_HEIGHT);
    return (
      <ThemeProvider defaultTheme={theme} enablePersistence={false}>
        <RecipioThemeSync />
        <SafeAreaProvider>
        <I18nProvider>
          <Snackbar />
          <View
            style={{
              flex: 1,
              minHeight: windowHeight,
              height: windowHeight,
              justifyContent: 'center',
              alignItems: 'center',
              backgroundColor: webBackgroundColor,
            }}
          >
            <View
              style={{
                width: MOBILE_WIDTH,
                height: MOBILE_HEIGHT,
                overflow: 'hidden',
                transform: [{ scale }],
                transformOrigin: 'center center',
              }}
            >
              {stack}
            </View>
          </View>
        </I18nProvider>
        </SafeAreaProvider>
      </ThemeProvider>
    );
  }

  return (
    <ThemeProvider defaultTheme={theme} enablePersistence={false}>
      <RecipioThemeSync />
      <SafeAreaProvider>
      <I18nProvider>
        <Snackbar />
        {stack}
      </I18nProvider>
      </SafeAreaProvider>
    </ThemeProvider>
  );
}
