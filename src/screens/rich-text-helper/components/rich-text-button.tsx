/**
 * Rich Text Helper specific Button component
 * Extends the base Button with a 'success' variant for unselected buttons
 */

import { Button } from '@/src/shared/components/button';
import React from 'react';
import { TextStyle, useColorScheme, ViewStyle } from 'react-native';

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
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';

  // Map 'success' variant to 'secondary' with custom styling
  if (variant === 'success') {
    const successStyle: ViewStyle = {
      backgroundColor: isDark ? '#34C759' : '#4CAF50',
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

