import { DarkTheme, DefaultTheme, ThemeProvider as NavigationThemeProvider } from '@react-navigation/native';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useFonts } from 'expo-font';
import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { StatusBar } from 'expo-status-bar';
import { useEffect } from 'react';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import 'react-native-reanimated';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import { ErrorBoundary } from '@/src/shared/components/ErrorBoundary';
import { LocaleProvider, ThemeProvider } from '@/src/shared/contexts';
import { useAppStore } from '@/src/shared/store';
import { useColorScheme } from 'react-native';

// Keep the splash screen visible while we fetch resources
SplashScreen.preventAutoHideAsync();

// Create a client for React Query
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000, // 5 minutes
      gcTime: 10 * 60 * 1000, // 10 minutes (renamed from cacheTime in v5)
    },
  },
});

export default function RootLayout() {
  const colorScheme = useColorScheme();
  const { isAppReady, setAppReady } = useAppStore();
  
  const [loaded] = useFonts({
    SpaceMono: require('../src/assets/fonts/SpaceMono-Regular.ttf'),
  });

  useEffect(() => {
    if (loaded) {
      // Fonts loaded, app is ready for splash screen
      setAppReady(true);
      SplashScreen.hideAsync();
    }
  }, [loaded, setAppReady]);

  if (!loaded || !isAppReady) {
    return null;
  }

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <ErrorBoundary>
        <LocaleProvider>
          <ThemeProvider>
            <QueryClientProvider client={queryClient}>
              <SafeAreaProvider>
                <NavigationThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
               
                    <Stack 
                      screenOptions={{ headerShown: false }}
                    >
                      <Stack.Screen name="splash" />
                      <Stack.Screen name="onboarding" />
                      <Stack.Screen name="(tabs)" />
                      <Stack.Screen name="+not-found" />
                    </Stack>
                    <StatusBar style="auto" />
        
                </NavigationThemeProvider>
              </SafeAreaProvider>
            </QueryClientProvider>
          </ThemeProvider>
        </LocaleProvider>
      </ErrorBoundary>
    </GestureHandlerRootView>
  );
}
