import React from 'react';
import { View, type ViewProps } from 'react-native';

import { Colors } from '../constants/Colors';
import { useTheme } from '../contexts/theme-context';

export type ThemedViewProps = ViewProps & {
  lightColor?: string;
  darkColor?: string;
};

export function ThemedView({ style, lightColor, darkColor, ...otherProps }: ThemedViewProps) {
  const { currentTheme } = useTheme();
  const backgroundColor = lightColor || darkColor || Colors[currentTheme].background;

  return <View style={[{ backgroundColor }, style]} {...otherProps} />;
}
