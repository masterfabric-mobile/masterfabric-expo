import { Stack } from 'expo-router';
import React from 'react';
import { Platform } from 'react-native';

import { Colors } from '@/src/shared/constants/Colors';
import { useLocale } from '@/src/shared/hooks/use-locale';
import { useColorScheme } from '@/src/shared/hooks/useColorScheme';
import { t } from '@/src/shared/i18n';
import { navigationConfig } from './navigation-config';

/**
 * Main App Navigator
 * Handles the main navigation stack configuration
 */
export function AppNavigator() {
  const colorScheme = useColorScheme();
  const { locale } = useLocale(); // This will trigger re-render on locale change
  const themeKey = colorScheme === 'dark' ? 'dark' : 'light';

  return (
    <Stack
      screenOptions={{
        ...navigationConfig.defaultScreenOptions,
        headerStyle: {
          backgroundColor: Colors[themeKey].background,
        },
        headerTintColor: Colors[themeKey].text,
        headerTitleStyle: {
          fontWeight: '600',
        },
        // iOS specific options
        ...(Platform.OS === 'ios' && {
          headerBlurEffect: colorScheme === 'dark' ? 'dark' : 'light',
          headerTransparent: false,
        }),
      }}
    >
      {/* Splash Screen */}
      <Stack.Screen 
        name="splash" 
        options={{
          title: t('common.loading'),
          headerShown: false,
          gestureEnabled: false,
        }}
      />
      
      {/* Main Tabs */}
      <Stack.Screen 
        name="(tabs)" 
        options={{
          headerShown: false,
        }}
      />
      
      {/* Not Found Screen */}
      <Stack.Screen 
        name="+not-found" 
        options={{
          title: t('notFound.title'),
          presentation: 'modal',
        }}
      />
    </Stack>
  );
}
