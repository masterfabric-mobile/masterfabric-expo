import { ThemedView } from '@/src/shared/components/ThemedView';
import { getThemeColors, useTheme } from 'masterfabric-expo-core';
import React from 'react';
import { View, StyleSheet } from 'react-native';

export function NotificationSkeleton() {
  const { currentTheme } = useTheme();
  const isDark = currentTheme === 'dark';
  const colors = getThemeColors(isDark);

  return (
    <View style={styles.container}>
      {[1, 2, 3, 4, 5].map((index) => (
        <View
          key={index}
          style={[
            styles.skeletonItem,
            {
              backgroundColor: colors.surfaceBackground,
              borderColor: colors.surfaceBorder + '30',
            },
          ]}
        >
          {/* Icon skeleton */}
          <View
            style={[
              styles.iconSkeleton,
              {
                backgroundColor: isDark
                  ? 'rgba(255, 255, 255, 0.1)'
                  : 'rgba(0, 0, 0, 0.05)',
              },
            ]}
          />

          {/* Content skeleton */}
          <View style={styles.contentContainer}>
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

            {/* Message skeleton */}
            <View
              style={[
                styles.messageSkeleton,
                {
                  backgroundColor: isDark
                    ? 'rgba(255, 255, 255, 0.08)'
                    : 'rgba(0, 0, 0, 0.04)',
                },
              ]}
            />
            <View
              style={[
                styles.messageSkeleton,
                styles.messageSkeletonShort,
                {
                  backgroundColor: isDark
                    ? 'rgba(255, 255, 255, 0.08)'
                    : 'rgba(0, 0, 0, 0.04)',
                },
              ]}
            />

            {/* Time skeleton */}
            <View
              style={[
                styles.timeSkeleton,
                {
                  backgroundColor: isDark
                    ? 'rgba(255, 255, 255, 0.06)'
                    : 'rgba(0, 0, 0, 0.03)',
                },
              ]}
            />
          </View>
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
    gap: 12,
  },
  skeletonItem: {
    flexDirection: 'row',
    padding: 16,
    borderRadius: 16,
    borderWidth: 1,
    gap: 12,
  },
  iconSkeleton: {
    width: 40,
    height: 40,
    borderRadius: 20,
  },
  contentContainer: {
    flex: 1,
    gap: 8,
  },
  titleSkeleton: {
    height: 16,
    width: '70%',
    borderRadius: 4,
  },
  messageSkeleton: {
    height: 12,
    width: '100%',
    borderRadius: 4,
  },
  messageSkeletonShort: {
    width: '85%',
  },
  timeSkeleton: {
    height: 10,
    width: '30%',
    borderRadius: 4,
    marginTop: 4,
  },
});

