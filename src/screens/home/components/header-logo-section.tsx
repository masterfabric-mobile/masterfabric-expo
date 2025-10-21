import { ThemedText } from '@/src/shared/components/ThemedText';
import { t } from '@/src/shared/i18n';
import { getThemeColors, useTheme } from 'masterfabric-expo-core';
import React from 'react';
import { View } from 'react-native';
import { homeHeaderStyles } from '../styles/home-header.styles';

export function HeaderLogoSection() {
  const { currentTheme } = useTheme();
  const isDark = currentTheme === 'dark';
  const colors = getThemeColors(isDark);

  return (
    <View style={homeHeaderStyles.logoSection}>
      <ThemedText
        style={[
          homeHeaderStyles.logoText,
          { color: colors.headerText }
        ]}
      >
        {t('app.name')}
      </ThemedText>
    </View>
  );
}