import React from 'react';
import { Pressable, StyleSheet, TextStyle, useColorScheme, ViewStyle } from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring
} from 'react-native-reanimated';

import { getButtonAccessibilityProps } from '@/src/shared/utils/accessibility';
import { ThemedText } from './ThemedText';

interface ButtonProps {
  title: string;
  onPress: () => void;
  variant?: 'primary' | 'secondary' | 'outline';
  size?: 'small' | 'medium' | 'large';
  disabled?: boolean;
  style?: ViewStyle;
  textStyle?: TextStyle;
  accessibilityLabel?: string;
  accessibilityHint?: string;
  testID?: string;
}

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

export function Button({
  title,
  onPress,
  variant = 'primary',
  size = 'medium',
  disabled = false,
  style,
  textStyle,
  accessibilityLabel,
  accessibilityHint,
  testID
}: ButtonProps) {
  const colorScheme = useColorScheme();
  const scale = useSharedValue(1);
  
  const isDark = colorScheme === 'dark';

  const handlePressIn = () => {
    scale.value = withSpring(0.95);
  };

  const handlePressOut = () => {
    scale.value = withSpring(1);
  };

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const getButtonStyle = () => {
    const baseStyle = [styles.button, styles[size]];
    
    switch (variant) {
      case 'primary':
        return [
          ...baseStyle,
          {
            backgroundColor: disabled 
              ? (isDark ? '#333' : '#E5E5E5')
              : (isDark ? '#007AFF' : '#0066CC'),
          }
        ];
      case 'secondary':
        return [
          ...baseStyle,
          {
            backgroundColor: isDark ? '#1C1C1E' : '#F2F2F7',
          }
        ];
      case 'outline':
        return [
          ...baseStyle,
          {
            backgroundColor: 'transparent',
            borderWidth: 1,
            borderColor: isDark ? '#333' : '#E5E5E5',
          }
        ];
      default:
        return baseStyle;
    }
  };

  const getTextStyle = () => {
    const baseTextStyle = [styles.text, styles[`${size}Text`]];
    
    switch (variant) {
      case 'primary':
        return [
          ...baseTextStyle,
          {
            color: disabled ? (isDark ? '#666' : '#999') : '#FFFFFF',
          }
        ];
      case 'secondary':
      case 'outline':
        return baseTextStyle;
      default:
        return baseTextStyle;
    }
  };

  return (
    <AnimatedPressable
      onPress={disabled ? undefined : onPress}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      style={[animatedStyle, getButtonStyle(), style]}
      disabled={disabled}
      testID={testID}
      {...getButtonAccessibilityProps(
        accessibilityLabel || title,
        accessibilityHint,
        disabled
      )}
    >
      <ThemedText style={[getTextStyle(), textStyle]}>
        {title}
      </ThemedText>
    </AnimatedPressable>
  );
}

const styles = StyleSheet.create({
  button: {
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 12,
  },
  small: {
    paddingVertical: 8,
    paddingHorizontal: 16,
  },
  medium: {
    paddingVertical: 12,
    paddingHorizontal: 24,
  },
  large: {
    paddingVertical: 16,
    paddingHorizontal: 32,
  },
  text: {
    fontWeight: '600',
  },
  smallText: {
    fontSize: 14,
  },
  mediumText: {
    fontSize: 16,
  },
  largeText: {
    fontSize: 18,
  },
});
