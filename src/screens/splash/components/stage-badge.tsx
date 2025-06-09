import React from 'react';
import { StyleSheet, useColorScheme, View } from 'react-native';

import { ThemedText } from '@/src/shared/components/ThemedText';

// Import package.json to access stage data
const packageInfo = require('@/package.json');

export function StageBadge() {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';
  
  const stage = packageInfo.stage || 'development';
  
  const getStageColors = () => {
    switch (stage.toLowerCase()) {
      case 'production':
        return {
          background: isDark ? '#1E3A28' : '#E8F5E8',
          border: isDark ? '#2D5A3D' : '#4CAF50',
          text: isDark ? '#4CAF50' : '#2E7D32'
        };
      case 'development':
        return {
          background: isDark ? '#1A2B3D' : '#E3F2FD',
          border: isDark ? '#2196F3' : '#1976D2',
          text: isDark ? '#2196F3' : '#1565C0'
        };
      case 'debug':
        return {
          background: isDark ? '#3D1A1A' : '#FFEBEE',
          border: isDark ? '#F44336' : '#D32F2F',
          text: isDark ? '#F44336' : '#C62828'
        };
      default:
        return {
          background: isDark ? '#2D2D2D' : '#F5F5F5',
          border: isDark ? '#666666' : '#BDBDBD',
          text: isDark ? '#CCCCCC' : '#757575'
        };
    }
  };
  
  const colors = getStageColors();
  
  return (
    <View 
      style={[
        styles.badge,
        {
          backgroundColor: colors.background,
          borderColor: colors.border,
        }
      ]}
    >
      <ThemedText 
        type="default" 
        style={[
          styles.badgeText,
          { color: colors.text }
        ]}
      >
        {stage.toUpperCase()}
      </ThemedText>
    </View>
  );
}

const styles = StyleSheet.create({
  badge: {
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
    borderWidth: 1,
    alignSelf: 'center',
    marginBottom: 3,
  },
  badgeText: {
    fontSize: 10,
    fontWeight: '600',
    letterSpacing: 0.5,
  },
});
