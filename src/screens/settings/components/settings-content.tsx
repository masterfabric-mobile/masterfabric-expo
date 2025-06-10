import React from 'react';
import { ScrollView } from 'react-native';
import { SettingsContentProps } from '../models/settings-models';
import { settingsStyles } from '../styles/settings-styles';
import { AppearanceCard } from './appearance-card';
import { LanguageCard } from './language-card';

export function SettingsContent({
  currentLanguage,
  onLanguageChange,
  selectedTheme,
  onThemeChange
}: SettingsContentProps) {
  return (
    <ScrollView 
      style={settingsStyles.content}
      showsVerticalScrollIndicator={false}
      contentContainerStyle={settingsStyles.contentContainer}
    >
      <LanguageCard 
        currentLanguage={currentLanguage}
        onLanguageChange={onLanguageChange}
      />

      <AppearanceCard 
        selectedTheme={selectedTheme}
        onThemeChange={onThemeChange}
      />
    </ScrollView>
  );
}
