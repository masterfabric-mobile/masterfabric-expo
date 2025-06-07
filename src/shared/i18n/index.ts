import * as Localization from 'expo-localization';
import { I18n } from 'i18n-js';

// Import translation files
import en from './translations/en.json';
import tr from './translations/tr.json';

// Create i18n instance
const i18n = new I18n({
  en,
  tr,
});

// Set the locale based on device settings
i18n.locale = Localization.locale;

// Enable fallback if locale is not supported
i18n.enableFallback = true;
i18n.defaultLocale = 'en';

// Translation function with better error handling
export const t = (key: string, options?: any): string => {
  try {
    return i18n.t(key, options);
  } catch (error) {
    console.warn(`Translation key not found: ${key}`);
    return key; // Return the key as fallback
  }
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
