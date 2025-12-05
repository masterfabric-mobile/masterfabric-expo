import { getThemeColors, useTheme } from 'masterfabric-expo-core';
import React from 'react';
import { View, StyleSheet } from 'react-native';
import { homeHeaderStyles } from '../../styles/home-header.styles';

export function HomeHeaderSkeleton() {
  const { currentTheme } = useTheme();
  const isDark = currentTheme === 'dark';
  const colors = getThemeColors(isDark);

  return (
    <View
      style={[
        homeHeaderStyles.container,
        {
          backgroundColor: colors.tabBarBackground,
          borderBottomColor: colors.headerBorder,
        },
        styles.skeletonContainer,
      ]}
    >
      {/* Logo skeleton */}
      <View style={styles.logoContainer}>
        <View
          style={[
            styles.logoSkeleton,
            {
              backgroundColor: isDark
                ? 'rgba(255, 255, 255, 0.1)'
                : 'rgba(0, 0, 0, 0.05)',
            },
          ]}
        />
      </View>

      {/* Actions skeleton */}
      <View style={styles.actionsContainer}>
        <View
          style={[
            styles.actionButtonSkeleton,
            {
              backgroundColor: isDark
                ? 'rgba(255, 255, 255, 0.1)'
                : 'rgba(0, 0, 0, 0.05)',
            },
          ]}
        />
        <View
          style={[
            styles.actionButtonSkeleton,
            {
              backgroundColor: isDark
                ? 'rgba(255, 255, 255, 0.1)'
                : 'rgba(0, 0, 0, 0.05)',
            },
          ]}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  skeletonContainer: {
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  logoContainer: {
    flex: 1,
  },
  logoSkeleton: {
    width: 120,
    height: 32,
    borderRadius: 8,
  },
  actionsContainer: {
    flexDirection: 'row',
    gap: 12,
  },
  actionButtonSkeleton: {
    width: 40,
    height: 40,
    borderRadius: 20,
  },
});

