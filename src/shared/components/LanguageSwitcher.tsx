import React from 'react';
import { StyleSheet, TouchableOpacity, View, useColorScheme } from 'react-native';
import { useLocale } from '../hooks/use-locale';
import { getLocaleDisplayName, t } from '../i18n';
import { ThemedText } from './ThemedText';

interface LanguageSwitcherProps {
  onLanguageChange?: (locale: string) => void;
}

export const LanguageSwitcher: React.FC<LanguageSwitcherProps> = ({
  onLanguageChange,
}) => {
  const { locale: currentLocale, changeLocale } = useLocale();
  const availableLocales = ['en', 'tr'];
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';

  const handleLanguageChange = (locale: string) => {
    console.log('Language button pressed:', locale);
    const success = changeLocale(locale);
    console.log('Language change success:', success);
    if (success && onLanguageChange) {
      onLanguageChange(locale);
    }
  };

  return (
    <View style={styles.container}>
      <ThemedText style={styles.label}>{t('settings.language')}</ThemedText>
      <View style={styles.languageButtons}>
        {availableLocales.map((locale) => (
          <TouchableOpacity
            key={locale}
            style={[
              styles.languageButton,
              {
                borderColor: isDark ? '#3C3C3E' : '#E5E5E5',
                backgroundColor: currentLocale.startsWith(locale) 
                  ? '#007AFF' 
                  : (isDark ? '#1C1C1E' : 'transparent')
              },
              currentLocale.startsWith(locale) && styles.activeLanguageButton,
            ]}
            onPress={() => handleLanguageChange(locale)}
            activeOpacity={0.7}
            accessible={true}
            accessibilityRole="button"
            accessibilityLabel={`${t('settings.switchTo')} ${getLocaleDisplayName(locale)}`}
          >
            <ThemedText
              style={[
                styles.languageButtonText,
                {
                  color: currentLocale.startsWith(locale) 
                    ? '#FFFFFF' 
                    : (isDark ? '#FFFFFF' : '#666')
                },
                currentLocale.startsWith(locale) && styles.activeLanguageButtonText,
              ]}
            >
              {getLocaleDisplayName(locale)}
            </ThemedText>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 16,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 12,
  },
  languageButtons: {
    flexDirection: 'row',
    gap: 8,
  },
  languageButton: {
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#E5E5E5',
    backgroundColor: 'transparent',
    minWidth: 80,
    alignItems: 'center',
  },
  activeLanguageButton: {
    backgroundColor: '#007AFF',
    borderColor: '#007AFF',
  },
  languageButtonText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#666',
  },
  activeLanguageButtonText: {
    color: '#FFFFFF',
  },
});
