import React from 'react';
import { View, type ViewProps } from 'react-native';

import { getThemeColors, useTheme } from 'masterfabric-expo-core';

export type ThemedViewProps = ViewProps & {
  lightColor?: string;
  darkColor?: string;
};

export function ThemedView({ style, lightColor, darkColor, ...otherProps }: ThemedViewProps) {
  const { isDark } = useTheme();
  const colors = getThemeColors(isDark);
  const backgroundColor = lightColor || darkColor || colors.background;

  return <View style={[{ backgroundColor }, style]} {...otherProps} />;
}
