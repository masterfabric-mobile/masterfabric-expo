import { ThemedText } from '@/src/shared/components/ThemedText';
import { ThemedView } from '@/src/shared/components/ThemedView';
import { getThemeColors } from '@/src/shared/constants/Colors';
import { useTheme } from '@/src/shared/contexts/theme-context';
import { t } from '@/src/shared/i18n';
import React from 'react';
import { TouchableOpacity } from 'react-native';
import { useSettingsViewModel } from '../../hooks/use-settings-view-model';
import { cardStyles } from '../../styles/card-styles';
import { languageStyles } from '../../styles/language-styles';
import { getLanguageOptions } from '../../utils';

export function LanguageSection() {
  const { currentTheme } = useTheme();
  const isDark = currentTheme === 'dark';
  const colors = getThemeColors(isDark);
  const { currentLanguage, handleLanguageChange } = useSettingsViewModel();

  const languageOptions = getLanguageOptions();

  return (
    <ThemedView style={[cardStyles.card, { backgroundColor: colors.surfaceBackground }]}>
      <ThemedText type="subtitle" style={[cardStyles.cardTitle, { color: colors.bodyText }]}>
        {t('settings.language')}
      </ThemedText>
      
      <ThemedView style={languageStyles.optionsContainer}>
        {languageOptions.map((option) => {
          const isSelected = currentLanguage.startsWith(option.value);
          
          return (
            <TouchableOpacity
              key={option.value}
              style={[
                languageStyles.option,
                {
                  backgroundColor: colors.buttonBackground,
                  borderColor: isSelected ? colors.activeButton : colors.surfaceBorder,
                }
              ]}
              onPress={() => handleLanguageChange(option.value)}
              accessibilityRole="button"
              accessibilityLabel={`${t('settings.switchTo')} ${option.label}`}
            >
              <ThemedText 
                style={[
                  languageStyles.optionText,
                  { color: isSelected ? colors.activeButton : colors.bodyText }
                ]}
              >
                {option.label}
              </ThemedText>
              
              {isSelected && (
                <ThemedText style={[languageStyles.checkmark, { color: colors.activeButton }]}>✓</ThemedText>
              )}
            </TouchableOpacity>
          );
        })}
      </ThemedView>
    </ThemedView>
  );
}
