import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { TouchableOpacity } from 'react-native';

import { ThemedText } from '@/src/shared/components/ThemedText';
import { ThemedView } from '@/src/shared/components/ThemedView';
import { getThemeColors } from '@/src/shared/constants/Colors';
import { useTheme } from '@/src/shared/contexts/theme-context';
import { t } from '@/src/shared/i18n';
import { ThemeOptionsProps } from '../models/settings-models';
import { themeOptionStyles } from '../styles/theme-option.styles';
import { getThemeAccessibilityLabel, getThemeOptions } from '../utils';

export function ThemeOptions({ selectedTheme, onThemeChange }: ThemeOptionsProps) {
  const { currentTheme } = useTheme();
  const isDark = currentTheme === 'dark';
  const colors = getThemeColors(isDark);
  
  const themes = getThemeOptions(t);

  return (
    <ThemedView style={themeOptionStyles.optionsContainer}>
      {themes.map((theme) => {
        const isSelected = selectedTheme === theme.key;
        
        return (
          <TouchableOpacity
            key={theme.key}
            style={[
              themeOptionStyles.option,
              {
                backgroundColor: colors.settingsThemeOptionBg,
                borderColor: isSelected ? colors.activeButton : colors.settingsThemeOptionBorder,
              }
            ]}
            onPress={() => onThemeChange(theme.key)}
            accessibilityRole="button"
            accessibilityLabel={getThemeAccessibilityLabel(theme.key, theme.label, t)}
          >
            <ThemedView style={themeOptionStyles.optionContent}>
              <Ionicons 
                name={theme.icon} 
                size={20} 
                color={isSelected ? colors.activeButton : colors.icon}
                style={themeOptionStyles.optionIcon}
              />
              <ThemedText 
                style={[
                  themeOptionStyles.optionText,
                  { color: isSelected ? colors.activeButton : colors.text }
                ]}
              >
                {theme.label}
              </ThemedText>
            </ThemedView>
            
            {isSelected && (
              <ThemedText style={[themeOptionStyles.checkmark, { color: colors.activeButton }]}>
                ✓
              </ThemedText>
            )}
          </TouchableOpacity>
        );
      })}
    </ThemedView>
  );
}
