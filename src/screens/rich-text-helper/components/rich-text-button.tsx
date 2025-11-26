/**
 * Rich Text Helper specific Button component
 * Extends the base Button with a 'success' variant for unselected buttons
 */

import { Button } from '@/src/shared/components/button';
import { getThemeColors, useTheme } from 'masterfabric-expo-core';
import React from 'react';
import { TextStyle, ViewStyle } from 'react-native';

interface RichTextButtonProps {
  title: string;
  onPress: () => void;
  variant?: 'primary' | 'secondary' | 'outline' | 'success';
  size?: 'small' | 'medium' | 'large';
  disabled?: boolean;
  style?: ViewStyle;
  textStyle?: TextStyle;
  accessibilityLabel?: string;
  accessibilityHint?: string;
  testID?: string;
}

export function RichTextButton({
  variant = 'primary',
  style,
  textStyle,
  ...props
}: RichTextButtonProps) {
  const { isDark } = useTheme();
  const colors = getThemeColors(isDark);

  // Map 'success' variant to 'secondary' with custom styling
  if (variant === 'success') {
    const successStyle: ViewStyle = {
      backgroundColor: colors.successColor,
      ...style,
    };

    const successTextStyle: TextStyle = {
      color: '#FFFFFF',
      ...textStyle,
    };

    return (
      <Button
        {...props}
        variant="secondary"
        style={successStyle}
        textStyle={successTextStyle}
      />
    );
  }

  return <Button {...props} variant={variant} style={style} textStyle={textStyle} />;
}

