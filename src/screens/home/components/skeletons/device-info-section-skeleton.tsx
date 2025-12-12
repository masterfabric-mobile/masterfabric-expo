import { getThemeColors, useTheme } from 'masterfabric-expo-core';
import React from 'react';
import { View, StyleSheet } from 'react-native';
import { deviceInfoStyles } from '../../styles/device-info.styles';

export function DeviceInfoSectionSkeleton() {
  const { currentTheme } = useTheme();
  const isDark = currentTheme === 'dark';
  const colors = getThemeColors(isDark);

  return (
    <View style={deviceInfoStyles.section}>
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

      {/* Info items skeleton */}
      <View style={styles.infoContainer}>
        {[1, 2, 3, 4, 5].map((index) => (
          <View
            key={index}
            style={[
              styles.infoRow,
              {
                borderBottomColor: colors.surfaceBorder + '30',
              },
            ]}
          >
            {/* Label skeleton */}
            <View
              style={[
                styles.labelSkeleton,
                {
                  backgroundColor: isDark
                    ? 'rgba(255, 255, 255, 0.08)'
                    : 'rgba(0, 0, 0, 0.04)',
                },
              ]}
            />

            {/* Value skeleton */}
            <View
              style={[
                styles.valueSkeleton,
                {
                  backgroundColor: isDark
                    ? 'rgba(255, 255, 255, 0.1)'
                    : 'rgba(0, 0, 0, 0.05)',
                },
              ]}
            />
          </View>
        ))}
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
  infoContainer: {
    gap: 0,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
  },
  labelSkeleton: {
    height: 16,
    width: 100,
    borderRadius: 4,
  },
  valueSkeleton: {
    height: 16,
    width: 120,
    borderRadius: 4,
  },
});

