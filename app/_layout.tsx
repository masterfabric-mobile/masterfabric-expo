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

import { ToastContainer } from '@/src/screens/toast-helper/components/toast-container';
import { ErrorBoundary } from '@/src/shared/components/ErrorBoundary';
import { SnackbarQueue } from '@/src/shared/components/SnackbarQueue';
import { LocaleProvider } from '@/src/shared/contexts';
import { useAppStore } from '@/src/shared/store';
import { ThemeProvider as MasterViewThemeProvider, initMasterView, useTheme } from 'masterfabric-expo-core';
import { connectivityHelper } from 'masterfabric-expo-core/src/helpers/connectivity';

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

// Navigation wrapper that uses core theme
function NavigationWrapper({ children }: { children: React.ReactNode }) {
  const { isDark } = useTheme();
  
  return (
    <NavigationThemeProvider value={isDark ? DarkTheme : DefaultTheme}>
      {children}
    </NavigationThemeProvider>
  );
}

export default function RootLayout() {
  const { isAppReady, setAppReady } = useAppStore();
  
  const [loaded] = useFonts({
    SpaceMono: require('../src/assets/fonts/SpaceMono-Regular.ttf'),
  });

  useEffect(() => {
    if (loaded) {
      // Start connectivity monitoring while app is active
      connectivityHelper.start(5000);
      // Initialize MasterView
      initMasterView({
        appName: 'MasterFabric Expo',
        appVersion: '1.0.0',
        environment: __DEV__ ? 'development' : 'production',
        config: {
          enableActivityTracking: true,
          enableErrorBoundary: true,
          enableThemeSupport: true,
          enableLocalization: true,
          enableLoadingStates: true,
          enableNavigationTracking: true,
          maxActivityItems: 100,
          enableDebugMode: __DEV__,
          enableLogging: __DEV__,
          logLevel: __DEV__ ? 'debug' : 'error',
          enablePlatformFeatures: true,
          enableAccessibility: true,
          enablePermissions: true,
          enableSentry: false, // Disable Sentry for now
          // Firebase integration
          enableFirebase: true,
          enableFirebaseAuth: true,
          enableFirebaseAnalytics: false,
        },
        onError: (error) => {
          console.error('MasterView Error:', error);
        },
        onActivityTracked: (activity) => {
          console.log('Activity Tracked:', activity);
        },
        onThemeChanged: (theme) => {
          console.log('Theme Changed:', theme);
        },
        onLocaleChanged: (locale) => {
          console.log('Locale Changed:', locale);
        },
      }).then(() => {
        // MasterView initialized, app is ready for splash screen
        setAppReady(true);
        SplashScreen.hideAsync();
      }).catch((error) => {
        console.error('Failed to initialize MasterView:', error);
        // Still proceed with app loading
        setAppReady(true);
        SplashScreen.hideAsync();
      });
    }
  }, [loaded, setAppReady]);

  if (!loaded || !isAppReady) {
    return null;
  }

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <ErrorBoundary>
        <LocaleProvider>
          <MasterViewThemeProvider>
            <QueryClientProvider client={queryClient}>
              <SafeAreaProvider>
              <NavigationWrapper>
                  <Stack 
                    screenOptions={{ headerShown: false }}
                  >
                    <Stack.Screen name="splash" />
                    <Stack.Screen name="onboarding" />
                    <Stack.Screen name="projects" />
                    <Stack.Screen name="settings" />
                    <Stack.Screen name="(tabs)" />
                    <Stack.Screen name="+not-found" />
                  </Stack>
                  <StatusBar style="auto" />
                  <SnackbarQueue />
                  <ToastContainer />

                </NavigationWrapper>
              </SafeAreaProvider>
            </QueryClientProvider>
          </MasterViewThemeProvider>
        </LocaleProvider>
      </ErrorBoundary>
    </GestureHandlerRootView>
  );
}
