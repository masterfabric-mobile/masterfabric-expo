import { getThemeColors, useTheme } from 'masterfabric-expo-core';
import React from 'react';
import { View, StyleSheet } from 'react-native';

interface ActionCardSkeletonProps {
  count?: number;
}

export function ActionCardSkeleton({ count = 1 }: ActionCardSkeletonProps) {
  const { currentTheme } = useTheme();
  const isDark = currentTheme === 'dark';
  const colors = getThemeColors(isDark);

  return (
    <>
      {Array.from({ length: count }).map((_, index) => (
        <View
          key={index}
          style={[
            styles.card,
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

            {/* Description skeleton */}
            <View
              style={[
                styles.descriptionSkeleton,
                {
                  backgroundColor: isDark
                    ? 'rgba(255, 255, 255, 0.08)'
                    : 'rgba(0, 0, 0, 0.04)',
                },
              ]}
            />
            <View
              style={[
                styles.descriptionSkeleton,
                styles.descriptionSkeletonShort,
                {
                  backgroundColor: isDark
                    ? 'rgba(255, 255, 255, 0.08)'
                    : 'rgba(0, 0, 0, 0.04)',
                },
              ]}
            />
          </View>
        </View>
      ))}
    </>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    padding: 16,
    borderRadius: 16,
    borderWidth: 1.5,
    marginBottom: 12,
    gap: 16,
  },
  iconSkeleton: {
    width: 56,
    height: 56,
    borderRadius: 16,
  },
  contentContainer: {
    flex: 1,
    gap: 8,
    justifyContent: 'center',
  },
  titleSkeleton: {
    height: 20,
    width: '70%',
    borderRadius: 6,
  },
  descriptionSkeleton: {
    height: 14,
    width: '100%',
    borderRadius: 4,
  },
  descriptionSkeletonShort: {
    width: '85%',
  },
});

