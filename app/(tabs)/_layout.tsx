import { Tabs } from 'expo-router';
import React from 'react';
import { Platform, StyleSheet } from 'react-native';

import { HapticTab } from '@/src/shared/components/HapticTab';
import { IconSymbol } from '@/src/shared/components/ui/IconSymbol';
import TabBarBackground from '@/src/shared/components/ui/TabBarBackground';
import { getThemeColors } from '@/src/shared/constants/Colors';
import { useTheme } from '@/src/shared/contexts/theme-context';
import { useLocale } from '@/src/shared/hooks/use-locale';
import { t } from '@/src/shared/i18n';

export default function TabLayout() {
  const { currentTheme } = useTheme();
  const isDark = currentTheme === 'dark';
  const colors = getThemeColors(isDark);
  const { locale } = useLocale();

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: colors.tabBarActiveTint,
        tabBarInactiveTintColor: colors.tabBarInactiveTint,
        headerShown: false,
        tabBarButton: HapticTab,
        tabBarBackground: TabBarBackground,
        tabBarStyle: {
          position: 'absolute',
          bottom: 0,
          left: 0,
          right: 0,
          backgroundColor: colors.tabBarBackground,
          borderTopWidth: StyleSheet.hairlineWidth,
          borderTopColor: colors.tabBarBorder,
          paddingBottom: Platform.OS === 'ios' ? 34 : 10,
          paddingTop: 8,
          height: Platform.OS === 'ios' ? 90 : 70,
          shadowColor: colors.tabBarShadow,
          shadowOffset: { width: 0, height: -3 },
          shadowOpacity: 0.15,
          shadowRadius: 10,
          elevation: 10,
        },
        tabBarLabelStyle: {
          fontSize: 11,
          fontWeight: '600',
          marginTop: 4,
          marginBottom: Platform.OS === 'ios' ? 0 : 4,
        },
        tabBarIconStyle: {
          marginBottom: Platform.OS === 'ios' ? 0 : 2,
        },
        tabBarItemStyle: {
          paddingTop: 8,
        },
      }}>
      <Tabs.Screen
        name="index"
        options={{
          title: t('home.title'),
          tabBarIcon: ({ color, focused }) => (
            <IconSymbol 
              size={focused ? 28 : 24} 
              name="house.fill" 
              color={color}
              style={{
                opacity: focused ? 1 : 0.7,
              }} 
            />
          ),
        }}
      />
      <Tabs.Screen
        name="explore"
        options={{
          title: t('explore.title'),
          tabBarIcon: ({ color, focused }) => (
            <IconSymbol 
              size={focused ? 28 : 24} 
              name="paperplane.fill" 
              color={color}
              style={{
                opacity: focused ? 1 : 0.7,
              }} 
            />
          ),
        }}
      />
    </Tabs>
  );
}
