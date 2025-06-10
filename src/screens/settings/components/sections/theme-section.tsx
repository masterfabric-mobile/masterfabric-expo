import React from 'react';

import { ThemedText } from '@/src/shared/components/ThemedText';
import { ThemedView } from '@/src/shared/components/ThemedView';
import { t } from '@/src/shared/i18n';
import { useSettingsViewModel } from '../../hooks/use-settings-view-model';
import { settingsScreenStyles } from '../../styles/settings-screen.styles';
import { ThemeOptions } from '../theme-options';
import { ThemePreview } from '../theme-preview';

export function ThemeSection() {
  const { selectedTheme, handleThemeChange } = useSettingsViewModel();

  return (
    <ThemedView style={settingsScreenStyles.section}>
      <ThemedText type="subtitle" style={settingsScreenStyles.sectionTitle}>
        {t('settings.theme.title')}
      </ThemedText>
      
      <ThemedText style={settingsScreenStyles.sectionDescription}>
        {t('settings.theme.description')}
      </ThemedText>
      
      <ThemeOptions 
        selectedTheme={selectedTheme}
        onThemeChange={handleThemeChange}
      />

      <ThemePreview />
    </ThemedView>
  );
}
