import { getThemeColors, useTheme } from 'masterfabric-expo-core';
import React from 'react';
import { View, StyleSheet } from 'react-native';
import { activitySectionStyles } from '../../styles/activity-section.styles';

export function ActivitySectionSkeleton() {
  const { currentTheme } = useTheme();
  const isDark = currentTheme === 'dark';
  const colors = getThemeColors(isDark);

  return (
    <View style={activitySectionStyles.section}>
      {/* Section header skeleton */}
      <View style={activitySectionStyles.sectionHeader}>
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
      </View>

      {/* Activity items skeleton */}
      <View style={activitySectionStyles.activitiesList}>
        {[1, 2, 3].map((index) => (
          <View key={index}>
            <View style={activitySectionStyles.activityItem}>
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
              <View style={activitySectionStyles.activityContent}>
                <View style={activitySectionStyles.activityHeader}>
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

                  {/* Time skeleton */}
                  <View
                    style={[
                      styles.timeSkeleton,
                      {
                        backgroundColor: isDark
                          ? 'rgba(255, 255, 255, 0.08)'
                          : 'rgba(0, 0, 0, 0.04)',
                      },
                    ]}
                  />
                </View>

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

            {/* Divider skeleton */}
            {index < 3 && (
              <View
                style={[
                  activitySectionStyles.activityDivider,
                  {
                    backgroundColor: colors.divider + '40',
                  },
                ]}
              />
            )}
          </View>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  titleSkeleton: {
    height: 20,
    width: 120,
    borderRadius: 6,
  },
  iconSkeleton: {
    width: 40,
    height: 40,
    borderRadius: 20,
  },
  timeSkeleton: {
    height: 14,
    width: 50,
    borderRadius: 4,
  },
  descriptionSkeleton: {
    height: 12,
    width: '100%',
    borderRadius: 4,
    marginTop: 6,
  },
  descriptionSkeletonShort: {
    width: '80%',
  },
});

