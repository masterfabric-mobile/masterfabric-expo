import { Stack } from 'expo-router';
import { initMasterView } from 'masterfabric-expo-core';
import React, { useEffect } from 'react';

export default function RootLayout() {
  useEffect(() => {
    // Initialize MasterView when app starts
    initMasterView({
      appName: 'My MasterFabric App',
      appVersion: '1.0.0',
      environment: __DEV__ ? 'development' : 'production',
      config: ({
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
        
        // Firebase Integration (optional)
        // Uses .env values if not explicitly provided here
        enableFirebase: true,
        enableFirebaseAuth: true,
        enableFirebaseAnalytics: false, // Analytics via web SDK works on web only
        // .env example (Expo public env vars):
        // EXPO_PUBLIC_FIREBASE_API_KEY=your-api-key
        // EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
        // EXPO_PUBLIC_FIREBASE_PROJECT_ID=your-project-id
        // EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET=your-project.appspot.com
        // EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=1234567890
        // EXPO_PUBLIC_FIREBASE_APP_ID=1:1234567890:web:abcdef123456
        // EXPO_PUBLIC_FIREBASE_MEASUREMENT_ID=G-XXXXXXXXXX
        // firebaseConfig: {
        //   apiKey: process.env.EXPO_PUBLIC_FIREBASE_API_KEY as string,
        //   authDomain: process.env.EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN as string,
        //   projectId: process.env.EXPO_PUBLIC_FIREBASE_PROJECT_ID as string,
        //   storageBucket: process.env.EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET as string,
        //   messagingSenderId: process.env.EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID as string,
        //   appId: process.env.EXPO_PUBLIC_FIREBASE_APP_ID as string,
        //   measurementId: process.env.EXPO_PUBLIC_FIREBASE_MEASUREMENT_ID as string,
        // },
        
        customSettings: {
          apiUrl: 'https://api.myapp.com',
          features: {
            darkMode: true,
            notifications: true,
            analytics: true,
          },
        },
      } as any),
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
