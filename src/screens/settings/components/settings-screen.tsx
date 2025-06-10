import { getThemeColors } from '@/src/shared/constants/Colors';
import { useTheme } from '@/src/shared/contexts/theme-context';
import { ScreenHeader } from '@/src/shared/components/ScreenHeader';
import { t } from '@/src/shared/i18n';
import React from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useSettingsViewModel } from '../hooks/use-settings-view-model';
import { settingsStyles } from '../styles/settings-styles';
import { SettingsContent } from './settings-content';

export function SettingsScreen() {
  const { currentTheme } = useTheme();
  const isDark = currentTheme === 'dark';
  const colors = getThemeColors(isDark);
  
  const { 
    currentLanguage, 
    handleLanguageChange, 
    selectedTheme, 
    handleThemeChange, 
    navigateBack 
  } = useSettingsViewModel();

  return (
    <SafeAreaView 
      style={[settingsStyles.container, { backgroundColor: colors.settingsBackground }]}
      edges={['top']}
    >
      <ScreenHeader 
        title={t('settings.title')}
        subtitle={t('settings.subtitle')}
        onBackPress={navigateBack}
      />

      <SettingsContent
        currentLanguage={currentLanguage}
        onLanguageChange={handleLanguageChange}
        selectedTheme={selectedTheme}
        onThemeChange={handleThemeChange}
      />
    </SafeAreaView>
  );
}
