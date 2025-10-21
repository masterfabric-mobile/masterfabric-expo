import { Text, type TextProps } from 'react-native';
import { useThemeColors } from '../contexts/ThemeContext';
import { ThemeColors } from '../types';

export interface ThemedTextProps extends TextProps {
  lightColor?: string;
  darkColor?: string;
  color?: keyof ThemeColors;
  type?: 'title' | 'subtitle' | 'body' | 'caption' | 'link' | 'default' | 'defaultSemiBold';
  forceTheme?: 'light' | 'dark';
}

export function ThemedText({ 
  style, 
  lightColor, 
  darkColor, 
  color,
  type = 'default',
  forceTheme,
  ...otherProps 
}: ThemedTextProps) {
  const colors = useThemeColors();
  
  let finalColor: string | undefined;
  
  if (color && colors[color]) {
    finalColor = colors[color];
  } else if (forceTheme === 'light' && lightColor) {
    finalColor = lightColor;
  } else if (forceTheme === 'dark' && darkColor) {
    finalColor = darkColor;
  } else if (lightColor || darkColor) {
    finalColor = lightColor || darkColor;
  } else {
    finalColor = colors.text;
  }

  // Type-based styling
  const typeStyles = getTypeStyles(type);

  return (
    <Text 
      style={[
        typeStyles,
        { color: finalColor },
        style
      ]} 
      {...otherProps} 
    />
  );
}

function getTypeStyles(type: ThemedTextProps['type']) {
  switch (type) {
    case 'title':
      return {
        fontSize: 24,
        fontWeight: '700' as const,
        lineHeight: 32,
      };
    case 'subtitle':
      return {
        fontSize: 18,
        fontWeight: '600' as const,
        lineHeight: 24,
      };
    case 'body':
      return {
        fontSize: 16,
        fontWeight: '400' as const,
        lineHeight: 22,
      };
    case 'caption':
      return {
        fontSize: 12,
        fontWeight: '400' as const,
        lineHeight: 16,
        opacity: 0.7,
      };
    case 'link':
      return {
        fontSize: 16,
        fontWeight: '500' as const,
        lineHeight: 22,
        textDecorationLine: 'underline' as const,
      };
    case 'defaultSemiBold':
      return {
        fontSize: 16,
        fontWeight: '600' as const,
        lineHeight: 22,
      };
    case 'default':
    default:
      return {
        fontSize: 16,
        fontWeight: '400' as const,
        lineHeight: 22,
      };
  }
}
