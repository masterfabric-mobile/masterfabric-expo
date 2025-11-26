import { Stack } from 'expo-router';
import { getThemeColors, useTheme } from 'masterfabric-expo-core';
import React from 'react';
import { Platform } from 'react-native';

import { useLocale } from '@/src/shared/hooks/use-locale';
import { t } from '@/src/shared/i18n';
import { navigationConfig } from './navigation-config';

/**
 * Main App Navigator
 * Handles the main navigation stack configuration
 */
export function AppNavigator() {
  const { isDark } = useTheme();
  const colors = getThemeColors(isDark);
  const { locale } = useLocale(); // This will trigger re-render on locale change

  return (
    <Stack
      screenOptions={{
        ...navigationConfig.defaultScreenOptions,
        headerStyle: {
          backgroundColor: colors.background,
        },
        headerTintColor: colors.text,
        headerTitleStyle: {
          fontWeight: '600',
        },
        // iOS specific options
        ...(Platform.OS === 'ios' && {
          headerBlurEffect: isDark ? 'dark' : 'light',
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
