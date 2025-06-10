import { ThemedText } from '@/src/shared/components/ThemedText';
import { getThemeColors } from '@/src/shared/constants/Colors';
import { useTheme } from '@/src/shared/contexts/theme-context';
import { t } from '@/src/shared/i18n';
import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { StyleSheet, TouchableOpacity, View } from 'react-native';
import { SettingsHeaderProps } from '../models/settings-models';
import { headerStyles } from '../styles/header-styles';

export function SettingsHeader({ onBackPress }: SettingsHeaderProps) {
  const { currentTheme } = useTheme();
  const isDark = currentTheme === 'dark';
  const colors = getThemeColors(isDark);

  return (
    <View style={[headerStyles.header, { 
      backgroundColor: colors.settingsCardBackground,
      borderBottomColor: colors.settingsHeaderBorder,
      borderBottomWidth: StyleSheet.hairlineWidth
    }]}>
      <TouchableOpacity
        onPress={onBackPress}
        style={[headerStyles.backButton, { backgroundColor: colors.settingsIconBackground }]}
        accessibilityRole="button"
        accessibilityLabel={t('settings.navigation.back')}
      >
        <Ionicons name="chevron-back" size={20} color={colors.text} />
      </TouchableOpacity>
      
      <View style={headerStyles.headerContent}>
        <ThemedText style={[headerStyles.headerTitle, { color: colors.text }]}>
          {t('settings.title')}
        </ThemedText>
        <ThemedText style={[headerStyles.headerSubtitle, { color: colors.settingsDescription }]}>
          {t('settings.subtitle')}
        </ThemedText>
      </View>
      
      <View style={headerStyles.headerSpacer} />
    </View>
  );
}
