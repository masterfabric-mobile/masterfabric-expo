import { getThemeColors, useTheme } from 'masterfabric-expo-core';
import React from 'react';
import { View, StyleSheet } from 'react-native';
import { welcomeSectionStyles } from '../../styles/welcome-section.styles';

export function WelcomeSectionSkeleton() {
  const { currentTheme } = useTheme();
  const isDark = currentTheme === 'dark';
  const colors = getThemeColors(isDark);

  return (
    <View style={welcomeSectionStyles.container}>
      {/* Greeting skeleton */}
      <View
        style={[
          styles.greetingSkeleton,
          {
            backgroundColor: isDark
              ? 'rgba(255, 255, 255, 0.1)'
              : 'rgba(0, 0, 0, 0.05)',
          },
        ]}
      />

      {/* Developer text skeleton */}
      <View
        style={[
          styles.developerTextSkeleton,
          {
            backgroundColor: isDark
              ? 'rgba(255, 255, 255, 0.08)'
              : 'rgba(0, 0, 0, 0.04)',
          },
        ]}
      />

      {/* User name skeleton */}
      <View
        style={[
          styles.userNameSkeleton,
          {
            backgroundColor: isDark
              ? 'rgba(255, 255, 255, 0.06)'
              : 'rgba(0, 0, 0, 0.03)',
          },
        ]}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  greetingSkeleton: {
    height: 32,
    width: '60%',
    borderRadius: 8,
    marginBottom: 12,
  },
  developerTextSkeleton: {
    height: 20,
    width: '45%',
    borderRadius: 6,
    marginBottom: 8,
  },
  userNameSkeleton: {
    height: 18,
    width: '35%',
    borderRadius: 6,
  },
});

