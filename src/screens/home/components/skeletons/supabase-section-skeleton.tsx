import { getThemeColors, useTheme } from 'masterfabric-expo-core';
import React from 'react';
import { View, StyleSheet } from 'react-native';
import { supabaseSectionStyles } from '../../styles/supabase-section.styles';
import { ActionCardSkeleton } from './action-card-skeleton';

export function SupabaseSectionSkeleton() {
  const { currentTheme } = useTheme();
  const isDark = currentTheme === 'dark';
  const colors = getThemeColors(isDark);

  return (
    <View style={supabaseSectionStyles.section}>
      {/* Header skeleton */}
      <View style={supabaseSectionStyles.header}>
        <View style={supabaseSectionStyles.logoTitleRow}>
          {/* Logo skeleton */}
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

          {/* Title and status skeleton */}
          <View style={styles.titleRowSkeleton}>
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
            <View
              style={[
                styles.statusDotSkeleton,
                {
                  backgroundColor: isDark
                    ? 'rgba(255, 255, 255, 0.1)'
                    : 'rgba(0, 0, 0, 0.05)',
                },
              ]}
            />
          </View>
        </View>

        {/* Description skeleton */}
        <View style={supabaseSectionStyles.headerText}>
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

      {/* Action cards skeleton */}
      <View style={supabaseSectionStyles.actionsList}>
        <ActionCardSkeleton count={4} />
      </View>

      {/* Footer skeleton */}
      <View style={supabaseSectionStyles.footer}>
        <View
          style={[
            styles.footerSkeleton,
            {
              backgroundColor: isDark
                ? 'rgba(255, 255, 255, 0.06)'
                : 'rgba(0, 0, 0, 0.03)',
            },
          ]}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  logoSkeleton: {
    width: 24,
    height: 24,
    borderRadius: 6,
  },
  titleRowSkeleton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    flex: 1,
  },
  titleSkeleton: {
    height: 20,
    width: 120,
    borderRadius: 6,
  },
  statusDotSkeleton: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  descriptionSkeleton: {
    height: 14,
    width: '100%',
    borderRadius: 4,
    marginBottom: 6,
  },
  descriptionSkeletonShort: {
    width: '75%',
  },
  footerSkeleton: {
    height: 16,
    width: '60%',
    borderRadius: 4,
  },
});

