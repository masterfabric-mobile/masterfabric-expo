import React from 'react';
import { TouchableOpacity } from 'react-native';

import { ThemedText } from '@/src/shared/components/ThemedText';
import { ThemedView } from '@/src/shared/components/ThemedView';
import { t } from '@/src/shared/i18n';
import { getThemeColors, useTheme } from 'masterfabric-expo-core';
import { themePreviewStyles } from '../styles/theme-preview.styles';

export function ThemePreview() {
  const { currentTheme } = useTheme();
  const isDark = currentTheme === 'dark';
  const colors = getThemeColors(isDark);

  return (
    <ThemedView style={themePreviewStyles.previewSection}>
      <ThemedText type="subtitle" style={[themePreviewStyles.previewTitle, { color: colors.text }]}>
        {t('settings.preview')}
      </ThemedText>
      
      <ThemedView 
        style={[
          themePreviewStyles.previewCard,
          { 
            backgroundColor: colors.settingsCardBackground,
            borderColor: colors.settingsCardBorder,
            borderWidth: 1
          }
        ]}
      >
        <ThemedText style={[themePreviewStyles.previewCardTitle, { color: colors.text }]}>
          {t('settings.previewTitle')}
        </ThemedText>
        <ThemedText style={[themePreviewStyles.previewCardText, { color: colors.settingsDescription }]}>
          {t('settings.previewText')}
        </ThemedText>
        <TouchableOpacity 
          style={[
            themePreviewStyles.previewButton,
            { backgroundColor: colors.activeButton }
          ]}
        >
          <ThemedText style={[themePreviewStyles.previewButtonText, { color: colors.settingsCardBackground }]}>
            {t('settings.previewButton')}
          </ThemedText>
        </TouchableOpacity>
      </ThemedView>
    </ThemedView>
  );
}
