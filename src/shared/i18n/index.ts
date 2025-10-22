import * as Localization from 'expo-localization';
import { I18n } from 'i18n-js';
import { Platform } from 'react-native';

// Import translation files
import en from './translations/en.json';
import tr from './translations/tr.json';

// Create i18n instance
const i18n = new I18n({
  en,
  tr,
});

// Set the locale based on device settings but default to English if not available
// On web, expo-localization may sometimes be undefined
let deviceLocale = 'en';
try {
  if (Platform.OS === 'web') {
    // On web, use the browser language
    deviceLocale = navigator.language?.split('-')[0] || 'en';
  } else {
    // On mobile, use expo-localization
    deviceLocale = Localization.getLocales()?.[0]?.languageCode || 'en';
  }
} catch (error) {
  console.warn('Failed to get device locale:', error);
  deviceLocale = 'en';
}

i18n.locale = Object.keys(i18n.translations).includes(deviceLocale) ? deviceLocale : 'en';

// Enable fallback if locale is not supported
i18n.enableFallback = true;
i18n.defaultLocale = 'en';

// Simple translation function
export const t = (key: string, options?: any): string => {
  try {
    // Get translation from i18n-js
    const translation = i18n.t(key, options);
    
    // Check if translation failed (i18n-js returns missing translation format)
    if (translation && translation.startsWith('[missing "') && translation.endsWith('" translation]')) {
      const missingKey = translation.match(/missing "([^"]+)" translation/)?.[1];
      if (missingKey) {
        // Extract the actual key from the missing translation error
        const parts = missingKey.split('.');
        const actualKey = parts.length > 1 ? parts[1] : parts[0];
        console.warn(`Missing translation for key: ${key}, falling back to: ${actualKey}`);
        return actualKey;
      }
    }
    
    return translation;
  } catch (error) {
    console.warn(`Translation error for key: ${key}`, error);
    return key;
  }
};

// Function to get translated activity description
export const formatActivityDescription = (description: string): string => {
  return t(description);
};

/**
 * Function to get translated theme name
 */
export const translateTheme = (theme: string): string => {
  if (!theme) return '';
  
  const themeKey = `settings.theme.${theme.toLowerCase()}`;
  const translation = t(themeKey);
  
  if (translation === themeKey) {
    // Fallback to capitalizing the theme name
    return theme.charAt(0).toUpperCase() + theme.slice(1);
  }
  
  return translation;
};

/**
 * Function to get translated language name
 */
export const translateLanguage = (locale: string): string => {
  if (!locale) return '';
  
  // If we have a translation for this language code
  const langKey = `settings.languageNames.${locale}`;
  const translation = t(langKey);
  
  if (translation !== langKey) {
    return translation;
  }
  
  // Fallback to uppercase language code
  return locale.toUpperCase();
};

// Function to get translated activity title
export const getTranslatedTitle = (title: string): string => {
  // If the title is already a translation key, translate it
  if (title.includes('.')) {
    return t(title);
  }
  
  // If it's a plain text title, try to find a translation for common activity titles
  const activityTitleMap: Record<string, string> = {
    'Appearance': t('settings.theme.title'),
    'Language': t('settings.language'),
    'Settings': t('settings.title'),
    'Notifications': t('settings.notifications.title'),
    'Device Information': t('deviceInfo.title'),
    'Projects': t('home.actions.projects.title'),
    'Templates': t('home.actions.templates.title'),
    'Helpers': t('home.actions.helpers.title'),
    'Documentation': t('home.actions.documentation.title'),
  };
  
  return activityTitleMap[title] || title;
};

// Export i18n instance for advanced usage
export { i18n };

// Export available locales
export const availableLocales = Object.keys(i18n.translations);

// Export current locale
export const getCurrentLocale = () => i18n.locale;

// Function to change locale
export const changeLocale = (locale: string) => {
  if (availableLocales.includes(locale)) {
    i18n.locale = locale;
    return true;
  }
  console.warn(`Locale not supported: ${locale}`);
  return false;
};

// Get locale display name
export const getLocaleDisplayName = (locale: string): string => {
  const localeNames: Record<string, string> = {
    en: 'English',
    tr: 'Türkçe',
  };
  return localeNames[locale] || locale;
};

// React hook for translation with forcing update
export const useTranslation = () => {
  // Return t with locale to help track dependencies
  return {
    t,
    locale: i18n.locale
  };
};

