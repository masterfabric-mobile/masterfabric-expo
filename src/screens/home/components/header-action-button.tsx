import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { Pressable, useColorScheme } from 'react-native';

import { headerActionButtonStyles } from '../styles/header-action-button.styles';

interface HeaderActionButtonProps {
  iconName: keyof typeof Ionicons.glyphMap;
  onPress?: () => void;
  accessibilityLabel?: string;
  size?: number;
  variant?: 'default' | 'profile';
}

export function HeaderActionButton({ 
  iconName, 
  onPress, 
  accessibilityLabel,
  size = 20,
  variant = 'default'
}: HeaderActionButtonProps) {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';

  const buttonStyle = variant === 'profile' 
    ? headerActionButtonStyles.profileButton 
    : headerActionButtonStyles.iconButton;

  return (
    <Pressable
      onPress={onPress}
      style={[
        buttonStyle,
        { backgroundColor: isDark ? '#1C1C1E' : '#F2F2F7' }
      ]}
      accessibilityRole="button"
      accessibilityLabel={accessibilityLabel}
    >
      <Ionicons 
        name={iconName}
        size={size} 
        color={isDark ? '#FFFFFF' : '#000000'} 
      />
    </Pressable>
  );
}
