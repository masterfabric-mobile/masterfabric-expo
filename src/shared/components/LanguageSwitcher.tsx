import React, { useState } from 'react';
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
  const [isChanging, setIsChanging] = useState(false);

  const handleLanguageChange = async (locale: string) => {
    if (isChanging || currentLocale.startsWith(locale)) return;

    try {
      setIsChanging(true);
      console.log('🌐 [LanguageSwitcher] Changing language:', currentLocale, '→', locale);
      
      const success = changeLocale(locale);
      console.log('🌐 [LanguageSwitcher] Language change result:', success);
      
      if (success) {
        // Force immediate re-render by triggering callback
        onLanguageChange?.(locale);
        
        // Small delay to allow UI to update
        setTimeout(() => {
          setIsChanging(false);
        }, 100);
      } else {
        setIsChanging(false);
      }
    } catch (error) {
      console.error('🌐 [LanguageSwitcher] Error changing language:', error);
      setIsChanging(false);
    }
  };

  return (
    <View style={styles.container}>
      <ThemedText style={styles.label}>{t('settings.language')}</ThemedText>
      <View style={styles.languageButtons}>
        {availableLocales.map((locale) => {
          const isActive = currentLocale.startsWith(locale);
          const isDisabled = isChanging;
          
          return (
            <TouchableOpacity
              key={locale}
              style={[
                styles.languageButton,
                {
                  borderColor: isDark ? '#3C3C3E' : '#E5E5E5',
                  backgroundColor: isActive 
                    ? '#007AFF' 
                    : (isDark ? '#1C1C1E' : 'transparent'),
                  opacity: isDisabled ? 0.6 : 1,
                },
                isActive && styles.activeLanguageButton,
              ]}
              onPress={() => handleLanguageChange(locale)}
              activeOpacity={0.7}
              disabled={isDisabled}
              accessible={true}
              accessibilityRole="button"
              accessibilityLabel={`${t('settings.switchTo')} ${getLocaleDisplayName(locale)}`}
            >
              <ThemedText
                style={[
                  styles.languageButtonText,
                  {
                    color: isActive 
                      ? '#FFFFFF' 
                      : (isDark ? '#FFFFFF' : '#666')
                  },
                  isActive && styles.activeLanguageButtonText,
                ]}
              >
                {getLocaleDisplayName(locale)}
              </ThemedText>
            </TouchableOpacity>
          );
        })}
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
