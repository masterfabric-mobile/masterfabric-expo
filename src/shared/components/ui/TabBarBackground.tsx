import { BlurView } from 'expo-blur';
import React from 'react';
import { StyleSheet } from 'react-native';

import { getThemeColors } from '@/src/shared/constants/Colors';
import { useTheme } from '@/src/shared/contexts/theme-context';

export default function TabBarBackground() {
  const { currentTheme } = useTheme();
  const isDark = currentTheme === 'dark';

  return (
    <BlurView
      intensity={100}
      tint={isDark ? 'dark' : 'light'}
      style={StyleSheet.absoluteFill}
    />
  );
}
