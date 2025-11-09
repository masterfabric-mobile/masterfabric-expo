import { ThemedText } from '@/src/shared/components/ThemedText';
import { Ionicons } from '@expo/vector-icons';
import { getThemeColors, useTheme } from 'masterfabric-expo-core';
import React from 'react';
import { View, StyleSheet } from 'react-native';

interface BatteryInfoItemProps {
  iconName: keyof typeof Ionicons.glyphMap;
  label: string;
  value: string | number | null;
  color?: string;
}

export const BatteryInfoItem: React.FC<BatteryInfoItemProps> = ({ iconName, label, value, color }) => {
  const { currentTheme } = useTheme();
  const isDark = currentTheme === 'dark';
  const colors = getThemeColors(isDark);

  return (
    <View style={styles.itemContainer}>
      <Ionicons name={iconName} size={24} color={color || colors.text} style={styles.icon} />
      <ThemedText style={styles.label}>{label}:</ThemedText>
      <ThemedText style={styles.value}>{value !== null ? value : 'N/A'}</ThemedText>
    </View>
  );
};

const styles = StyleSheet.create({
  itemContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: '#ccc', // This will be themed later
  },
  icon: {
    marginRight: 10,
  },
  label: {
    flex: 1,
    fontSize: 16,
  },
  value: {
    fontSize: 16,
    fontWeight: '600',
  },
});
