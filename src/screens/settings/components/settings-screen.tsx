import React from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';

import { ScreenHeader } from '@/src/shared/components/ScreenHeader';
import { t } from '@/src/shared/i18n';
import {
  useMasterView,
  useThemeColors
} from 'masterfabric-expo-core';
import { useSettingsViewModel } from '../hooks/use-settings-view-model';
import { settingsStyles } from '../styles/settings-styles';
import { SettingsContent } from './settings-content';

// Hook-based MasterView implementation for Settings Screen
function SettingsScreenContent() {
  const colors = useThemeColors();
  const { trackActivity } = useMasterView();
  
  const { 
    currentLanguage, 
    handleLanguageChange, 
    selectedTheme, 
    handleThemeChange, 
    navigateBack 
  } = useSettingsViewModel();

  // Track activity when component mounts
  React.useEffect(() => {
    trackActivity('settings_initialized');
    
    return () => {
      trackActivity('settings_destroyed');
    };
  }, [trackActivity]);

  return (
    <SafeAreaView 
      style={[settingsStyles.container, { backgroundColor: colors.settingsBackground }]}
      edges={['top']}
    >
      <ScreenHeader 
        title={t('settings.title')}
        subtitle={t('settings.subtitle') || t('settings.description')}
        onBackPress={navigateBack}
        variant="minimal"
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

export function SettingsScreen() {
  return <SettingsScreenContent />;
}