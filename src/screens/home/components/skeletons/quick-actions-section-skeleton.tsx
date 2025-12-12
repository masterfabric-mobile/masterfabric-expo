import { getThemeColors, useTheme } from 'masterfabric-expo-core';
import React from 'react';
import { View, StyleSheet } from 'react-native';
import { quickActionsStyles } from '../../styles/quick-actions.styles';
import { ActionCardSkeleton } from './action-card-skeleton';

export function QuickActionsSectionSkeleton() {
  const { currentTheme } = useTheme();
  const isDark = currentTheme === 'dark';
  const colors = getThemeColors(isDark);

  return (
    <View style={quickActionsStyles.section}>
      {/* Title skeleton */}
      <View
        style={[
          styles.titleSkeleton,
          {
            backgroundColor: isDark
              ? 'rgba(255, 255, 255, 0.1)'
              : 'rgba(0, 0, 0, 0.05)',
          },
        ]}
      />

      {/* Action cards skeleton */}
      <View style={quickActionsStyles.actionsList}>
        <ActionCardSkeleton count={6} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  titleSkeleton: {
    height: 24,
    width: 150,
    borderRadius: 6,
    marginBottom: 16,
  },
});

