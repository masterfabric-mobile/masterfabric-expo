import { getThemeColors } from '@/src/shared/constants/Colors';
import { useTheme } from '@/src/shared/contexts/theme-context';
import React from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useSettingsViewModel } from '../hooks/use-settings-view-model';
import { settingsStyles } from '../styles/settings-styles';
import { SettingsContent } from './settings-content';
import { SettingsHeader } from './settings-header';

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
      <SettingsHeader onBackPress={navigateBack} />

      <SettingsContent
        currentLanguage={currentLanguage}
        onLanguageChange={handleLanguageChange}
        selectedTheme={selectedTheme}
        onThemeChange={handleThemeChange}
      />
    </SafeAreaView>
  );
}
