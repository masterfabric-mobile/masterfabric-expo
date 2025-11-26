import React from 'react';
import { StyleSheet, View, ViewStyle } from 'react-native';
import { getThemeColors, useTheme } from 'masterfabric-expo-core';

interface CardProps {
  children: React.ReactNode;
  style?: ViewStyle;
  padding?: number;
  shadow?: boolean;
}

export function Card({ 
  children, 
  style, 
  padding = 16,
  shadow = true 
}: CardProps) {
  const { isDark } = useTheme();
  const colors = getThemeColors(isDark);

  return (
    <View
      style={[
        styles.card,
        {
          backgroundColor: colors.surfaceBackground,
          padding,
        },
        shadow && (isDark ? styles.shadowDark : styles.shadowLight),
        style,
      ]}
    >
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: 16,
  },
  shadowLight: {
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  shadowDark: {
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 3,
  },
});
