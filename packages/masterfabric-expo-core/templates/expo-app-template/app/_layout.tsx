import { Stack } from 'expo-router';
import { useAutoInitMasterView } from 'masterfabric-expo-core';
import React from 'react';

export default function RootLayout() {
  // That's it! Auto-initializes with sensible defaults
  // MasterView will automatically:
  // - Detect app name and version from Expo Constants
  // - Detect environment (development/production)
  // - Detect available integrations from environment variables
  // - Use sensible defaults for all configuration
  useAutoInitMasterView();

  // Optional: Customize initialization
  // useAutoInitMasterView({
  //   appName: 'My Custom App',
  //   config: {
  //     enableSentry: true,
  //     sentryConfig: { dsn: 'your-sentry-dsn' }
  //   }
  // });

  return (
    <Stack>
      <Stack.Screen name="index" options={{ title: 'Home' }} />
      <Stack.Screen name="settings" options={{ title: 'Settings' }} />
    </Stack>
  );
}
