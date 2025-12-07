import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { Pressable } from 'react-native';

import { getThemeColors, Sizing, useTheme } from 'masterfabric-expo-core';
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
  size = Sizing.icon.s,
  variant = 'default'
}: HeaderActionButtonProps) {
  const { currentTheme } = useTheme();
  const isDark = currentTheme === 'dark';
  const colors = getThemeColors(isDark);

  const buttonStyle = variant === 'profile' 
    ? headerActionButtonStyles.profileButton 
    : headerActionButtonStyles.iconButton;

  return (
    <Pressable
      onPress={onPress}
      style={[
        buttonStyle,
        { backgroundColor: colors.buttonBackground }
      ]}
      accessibilityRole="button"
      accessibilityLabel={accessibilityLabel}
    >
      <Ionicons 
        name={iconName}
        size={size} 
        color={colors.headerIcon} 
      />
    </Pressable>
  );
}
