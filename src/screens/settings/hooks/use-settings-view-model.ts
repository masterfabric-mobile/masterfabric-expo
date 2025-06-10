import { useHomeStore } from '@/src/screens/home/store/home-store';
import { useTheme } from '@/src/shared/contexts/theme-context';
import { useLocale } from '@/src/shared/hooks/use-locale';
import { StorageService } from '@/src/shared/services/storage';
import { router } from 'expo-router';
import { useCallback, useEffect, useMemo } from 'react';
import { useColorScheme } from 'react-native';
import { Theme } from '../models/settings-models';
import { useSettingsStore } from '../store/settings-store';
import {
  getLanguageOptions,
  getThemeOptions
} from '../utils';

// Storage constants
const STORAGE_KEYS = {
  THEME: 'app_theme',
  LANGUAGE: 'app_language',
};

export function useSettingsViewModel() {
  const { isLoading, setLoading } = useSettingsStore();
  const { locale, changeLocale } = useLocale();
  const { themeMode, setThemeMode } = useTheme();
  const systemColorScheme = useColorScheme();
  const { addActivity } = useHomeStore();
  
  // Track settings changes function
  const trackSettingChange = useCallback((
    settingType: 'theme_change' | 'language_change',
    from: string,
    to: string
  ) => {
    // Create activity item based on setting type
    let title = settingType === 'theme_change' ? 'Appearance' : 'Language';
    
    const activity = {
      id: Date.now().toString(),
      title,
      timestamp: new Date().toISOString(),
      type: 'settings' as const,
      details: {
        action: settingType,
        from,
        to
      }
    };
    
    // Add activity to store
    addActivity(activity);
  }, [addActivity]);
  
  // Memoize theme options with translations if needed
  const themeOptions = useMemo(() => {
    return getThemeOptions();
  }, [/* translations dependencies if any */]);
  
  // Memoize language options
  const languageOptions = useMemo(() => {
    return getLanguageOptions();
  }, []);

  useEffect(() => {
    initializeSettings();
  }, []);

  const initializeSettings = async () => {
    setLoading(true);
    
    // Simulate any async initialization if needed
    await new Promise(resolve => setTimeout(resolve, 100));
    
    setLoading(false);
  };

  // When language changes
  const handleLanguageChange = useCallback(
    (value: string) => {
      const previousLanguage = locale;
      changeLocale(value);

      // Track the change with language codes for activity feed
      trackSettingChange(
        'language_change',
        previousLanguage,
        value
      );

      // Save the new language selection using the static method
      StorageService.setItem(STORAGE_KEYS.LANGUAGE, value);
    },
    [locale, changeLocale, trackSettingChange]
  );

  // When theme changes
  const handleThemeChange = useCallback(
    (value: Theme) => {
      const previousTheme = themeMode;
      setThemeMode(value);

      // Track the theme change values, not the translated names
      trackSettingChange(
        'theme_change',
        previousTheme,
        value
      );

      // Save the new theme selection using the static method
      StorageService.setItem(STORAGE_KEYS.THEME, value);
    },
    [themeMode, setThemeMode, trackSettingChange]
  );

  const isThemeSelected = useCallback((targetTheme: Theme): boolean => {
    return themeMode === targetTheme;
  }, [themeMode]);

  // Navigation functions
  const navigateBack = useCallback(() => {
    if (router.canGoBack()) {
      router.back();
    } else {
      router.replace('/(tabs)');
    }
  }, []);

  const navigateToHome = useCallback(() => {
    router.replace('/(tabs)');
  }, []);

  return {
    isLoading,
    // Language settings
    currentLanguage: locale,
    languageOptions,
    handleLanguageChange,
    // Theme settings
    selectedTheme: themeMode,
    themeOptions,
    handleThemeChange,
    isThemeSelected,
    // Navigation
    navigateBack,
    navigateToHome,
  };
}
