import React from 'react';
import { useColorScheme, View, type ViewProps } from 'react-native';

import { Colors } from '../constants/Colors';

export type ThemedViewProps = ViewProps & {
  lightColor?: string;
  darkColor?: string;
};

export function ThemedView({ style, lightColor, darkColor, ...otherProps }: ThemedViewProps) {
  const theme = useColorScheme() ?? 'light';
  const backgroundColor = lightColor || darkColor || Colors[theme].background;

  return <View style={[{ backgroundColor }, style]} {...otherProps} />;
}
