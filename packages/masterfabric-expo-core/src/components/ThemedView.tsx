import { View, type ViewProps } from 'react-native';
import { useThemeColors } from '../contexts/ThemeContext';
import { ThemeColors } from '../types';

export interface ThemedViewProps extends ViewProps {
  lightColor?: string;
  darkColor?: string;
  backgroundColor?: keyof ThemeColors;
  forceTheme?: 'light' | 'dark';
}

export function ThemedView({ 
  style, 
  lightColor, 
  darkColor, 
  backgroundColor,
  forceTheme,
  ...otherProps 
}: ThemedViewProps) {
  const colors = useThemeColors();
  
  let finalBackgroundColor: string | undefined;
  
  if (backgroundColor && colors[backgroundColor]) {
    finalBackgroundColor = colors[backgroundColor];
  } else if (forceTheme === 'light' && lightColor) {
    finalBackgroundColor = lightColor;
  } else if (forceTheme === 'dark' && darkColor) {
    finalBackgroundColor = darkColor;
  } else if (lightColor || darkColor) {
    finalBackgroundColor = lightColor || darkColor;
  } else {
    finalBackgroundColor = colors.background;
  }

  return (
    <View 
      style={[{ backgroundColor: finalBackgroundColor }, style]} 
      {...otherProps} 
    />
  );
}
