import { Stack } from 'expo-router';
import { initMasterView } from 'masterfabric-expo-core';
import { useEffect } from 'react';

export default function RootLayout() {
  useEffect(() => {
    // Initialize MasterView when app starts
    initMasterView({
      appName: 'My MasterFabric App',
      appVersion: '1.0.0',
      environment: __DEV__ ? 'development' : 'production',
      config: {
        // Enable/disable features as needed
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
        
        // Sentry Integration (optional)
        enableSentry: true,
        sentryConfig: {
          dsn: 'YOUR_SENTRY_DSN_HERE', // Replace with your Sentry DSN
          environment: __DEV__ ? 'development' : 'production',
          debug: __DEV__,
          enableAutoSessionTracking: true,
          enableNativeCrashHandling: true,
          enableAutoPerformanceTracking: true,
          tracesSampleRate: __DEV__ ? 1.0 : 0.1,
          maxBreadcrumbs: 100,
          customOptions: {
            tags: {
              app_name: 'My MasterFabric App',
              version: '1.0.0',
            },
          },
        },
        
        customSettings: {
          apiUrl: 'https://api.myapp.com',
          features: {
            darkMode: true,
            notifications: true,
            analytics: true,
          },
        },
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
      onSentryError: (error) => {
        console.error('Sentry Error:', error);
      },
    }).catch((error) => {
      console.error('Failed to initialize MasterView:', error);
    });
  }, []);

  return (
    <Stack>
      <Stack.Screen name="index" options={{ title: 'Home' }} />
      <Stack.Screen name="settings" options={{ title: 'Settings' }} />
    </Stack>
  );
}
