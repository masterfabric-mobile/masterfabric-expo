import { t } from '@/src/shared/i18n';
import { Ionicons } from '@expo/vector-icons';
import { getThemeColors, Sizing, useTheme } from 'masterfabric-expo-core';
import React from 'react';
import { Pressable, View } from 'react-native';
import { headerActionsStyles as styles } from '../styles/header-actions.styles';
import { getHeaderIconName } from '../utils';

export interface HeaderActionsProps {
  onNotificationPress?: () => void;
}

export function HeaderActions({ 
  onNotificationPress = () => {} 
}: HeaderActionsProps) {
  const { currentTheme } = useTheme();
  const isDark = currentTheme === 'dark';
  const colors = getThemeColors(isDark);

  return (
    <View style={styles.container}>
      <Pressable
        style={[styles.iconButton, { backgroundColor: colors.headerBackground }]}
        onPress={onNotificationPress}
        accessibilityLabel={t('accessibility.notifications')}
      >
        <Ionicons
          name={getHeaderIconName('notification') as any}
          size={Sizing.icon.m}
          color={colors.headerIcon}
        />
      </Pressable>
    </View>
  );
}
