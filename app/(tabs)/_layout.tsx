import { Tabs } from 'expo-router';
import React from 'react';
import { Platform } from 'react-native';

import { HapticTab } from '@/src/shared/components/HapticTab';
import { IconSymbol } from '@/src/shared/components/ui/IconSymbol';
import TabBarBackground from '@/src/shared/components/ui/TabBarBackground';
import { Colors } from '@/src/shared/constants/Colors';
import { useLocale } from '@/src/shared/hooks/use-locale';
import { useColorScheme } from '@/src/shared/hooks/useColorScheme';
import { t } from '@/src/shared/i18n';

export default function TabLayout() {
  const colorScheme = useColorScheme();
  const { locale } = useLocale(); // This will trigger re-render on locale change

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: Colors[colorScheme ?? 'light'].tint,
        headerShown: false,
        tabBarButton: HapticTab,
        tabBarBackground: TabBarBackground,
        tabBarStyle: Platform.select({
          ios: {
            // Use a transparent background on iOS to show the blur effect
            position: 'absolute',
          },
          default: {},
        }),
      }}>
      <Tabs.Screen
        name="index"
        options={{
          title: t('home.title'),
          tabBarIcon: ({ color }) => <IconSymbol size={28} name="house.fill" color={color} />,
        }}
      />
      <Tabs.Screen
        name="explore"
        options={{
          title: t('explore.title'),
          tabBarIcon: ({ color }) => <IconSymbol size={28} name="paperplane.fill" color={color} />,
        }}
      />
    </Tabs>
  );
}
