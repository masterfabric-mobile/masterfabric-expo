import { getThemeColors, useTheme } from 'masterfabric-expo-core';
import React from 'react';
import { View, StyleSheet } from 'react-native';

interface BatteryBarProps {
  level: number | null; // 0-100
}

export const BatteryBar: React.FC<BatteryBarProps> = ({ level }) => {
  const { currentTheme } = useTheme();
  const isDark = currentTheme === 'dark';
  const colors = getThemeColors(isDark);

  const barColor = React.useMemo(() => {
    if (level === null) return colors.text; // Or some default for N/A
    if (level <= 20) return '#FF3B30'; // Red for low battery
    if (level <= 50) return '#FF9500'; // Orange for medium battery
    return '#34C759'; // Green for good battery
  }, [level, colors.text]);

  const barWidth = level !== null ? `${Math.max(0, Math.min(100, level))}%` : '0%';

  return (
    <View style={[styles.batteryBarContainer, { borderColor: colors.border }]}>
      {level !== null ? (
        <View style={[styles.batteryBarFill, { width: barWidth, backgroundColor: barColor }]} />
      ) : (
        <View style={[styles.batteryBarFill, { width: '100%', backgroundColor: colors.cardBackground }]} />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  batteryBarContainer: {
    width: '100%',
    height: 20,
    borderRadius: 5,
    borderWidth: 1,
    overflow: 'hidden',
    marginBottom: 10,
  },
  batteryBarFill: {
    height: '100%',
    borderRadius: 4,
  },
});
