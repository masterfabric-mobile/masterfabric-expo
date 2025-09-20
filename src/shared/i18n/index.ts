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

// Set the locale based on device settings but default to English if not available
const deviceLocale = Localization.locale ? Localization.locale.split('-')[0] : 'en';
i18n.locale = Object.keys(i18n.translations).includes(deviceLocale) ? deviceLocale : 'en';

// Enable fallback if locale is not supported
i18n.enableFallback = true;
i18n.defaultLocale = 'en';

// Direct translations for specific keys that might not use dot notation
const directTranslations: Record<string, Record<string, string>> = {
  en: {
    "Language": "Language",
    "Appearance": "Appearance",
    "Device Information": "Device Information",
    "Settings": "Settings",
    "Developer Tools": "Developer Tools",
    "Home": "Home", 
    "Explore": "Explore",
    "Templates": "Templates",
    "New Project": "New Project",
    "Projects": "Projects",
    "Docs": "Docs",
    "View Onboarding": "View Onboarding",
    "Dil": "Language",
    "Görünüm": "Appearance", 
    "Cihaz Bilgileri": "Device Information",
    "Ayarlar": "Settings",
    "Geliştirici Araçları": "Developer Tools",
    "Ana Sayfa": "Home",
    "Keşfet": "Explore",
    "Şablonlar": "Templates",
    "Yeni Proje": "New Project",
    "Projeler": "Projects",
    "Belgeler": "Docs",
    "Tanıtımı Görüntüle": "View Onboarding",
    "light": "Light",
    "dark": "Dark",
    "system": "System",
    // Theme and language descriptions
    "Theme changed": "Theme changed",
    "Language changed": "Language changed",
    // Activity descriptions
    "Device information retrieved": "Device information retrieved",
    "Viewed device information details": "Viewed device information details",
    "Notification settings updated": "Notification settings updated",
    "Settings updated": "Settings updated",
    "Opened settings page": "Opened settings page",
    "Used developer tool": "Used developer tool",
    "Started onboarding preview": "Started onboarding preview",
    "Application started": "Application started",
    "View all project": "View all project",
    "Viewed projects": "Viewed projects",
    "Browsed project templates": "Browsed project templates",
    "Opened documentation": "Opened documentation"
  },
  tr: {
    "Language": "Dil",
    "Appearance": "Görünüm",
    "Device Information": "Cihaz Bilgileri",
    "Settings": "Ayarlar",
    "Developer Tools": "Geliştirici Araçları",
    "Home": "Ana Sayfa",
    "Explore": "Keşfet",
    "Templates": "Şablonlar",
    "New Project": "Yeni Proje",
    "Projects": "Projeler",
    "Docs": "Belgeler",
    "View Onboarding": "Tanıtımı Görüntüle",
    "Dil": "Dil",
    "Görünüm": "Görünüm",
    "Cihaz Bilgileri": "Cihaz Bilgileri",
    "Ayarlar": "Ayarlar", 
    "Geliştirici Araçları": "Geliştirici Araçları",
    "Ana Sayfa": "Ana Sayfa",
    "Keşfet": "Keşfet",
    "Şablonlar": "Şablonlar",
    "Yeni Proje": "Yeni Proje",
    "Projeler": "Projeler",
    "Belgeler": "Belgeler",
    "Tanıtımı Görüntüle": "Tanıtımı Görüntüle",
    "light": "Açık",
    "dark": "Koyu",
    "system": "Sistem",
    // Theme and language descriptions
    "Theme changed": "Tema değiştirildi",
    "Language changed": "Dil değiştirildi",
    // Activity descriptions
    "Device information retrieved": "Cihaz bilgileri alındı",
    "Viewed device information details": "Cihaz bilgi detayları görüntülendi",
    "Notification settings updated": "Bildirim ayarları güncellendi",
    "Settings updated": "Ayarlar güncellendi",
    "Opened settings page": "Ayarlar sayfası açıldı",
    "Used developer tool": "Geliştirici aracı kullanıldı",
    "Started onboarding preview": "Tanıtım önizlemesi başlatıldı",
    "Application started": "Uygulama başlatıldı",
    "View all project": "Tüm projeleri görüntülendi",
    "Viewed projects": "Projeler görüntülendi",
    "Browsed project templates": "Proje şablonlarına göz atıldı",
    "Opened documentation": "Belgeler açıldı"
  }
};

// Add title translations specifically for developer tools and quick actions
const titleTranslationMappings: Record<string, Record<string, string>> = {
  en: {
    "Device Information": "deviceInfo.title",
    "Settings": "settings.title",
    "Projects": "projects.title",
    "View Onboarding": "home.developer.onboarding.title",
    "New Project": "home.actions.allProjects.title",
    "Templates": "home.actions.templates.title",
    "Docs": "home.actions.documentation.title"
  },
  tr: {
    "Cihaz Bilgileri": "deviceInfo.title",
    "Ayarlar": "settings.title",
    "Projeler": "projects.title",
    "Tanıtımı Görüntüle": "home.developer.onboarding.title",
    "Yeni Proje": "home.actions.allProjects.title",
    "Şablonlar": "home.actions.templates.title",
    "Belgeler": "home.actions.documentation.title"
  }
};

// Add activity description mappings
const activityDescriptionMappings: Record<string, Record<string, string>> = {
  en: {
    "home.activity.deviceInfoRetrieved": "Device information retrieved",
    "home.activity.deviceInfoViewed": "Viewed device information details",
    "home.activity.notificationsChanged": "Notification settings updated",
    "home.activity.settingsChanged": "Settings updated",
    "home.activity.settingsOpened": "Opened settings page",
    "home.activity.devToolUsed": "Used developer tool",
    "home.activity.onboardingStarted": "Started onboarding preview",
    "home.activity.appStarted": "Application started",
    "home.activity.allProjects": "View all project",
    "home.activity.projectsViewed": "Viewed projects",
    "home.activity.templatesViewed": "Browsed project templates", 
    "home.activity.documentationOpened": "Opened documentation",
    "home.activity.themeChanged": "Theme changed: {{from}} → {{to}}",
    "home.activity.languageChanged": "Language changed: {{from}} → {{to}}"
  },
  tr: {
    "home.activity.deviceInfoRetrieved": "Cihaz bilgileri alındı",
    "home.activity.deviceInfoViewed": "Cihaz bilgi detayları görüntülendi",
    "home.activity.notificationsChanged": "Bildirim ayarları güncellendi",
    "home.activity.settingsChanged": "Ayarlar güncellendi",
    "home.activity.settingsOpened": "Ayarlar sayfası açıldı",
    "home.activity.devToolUsed": "Geliştirici aracı kullanıldı",
    "home.activity.onboardingStarted": "Tanıtım önizlemesi başlatıldı",
    "home.activity.appStarted": "Uygulama başlatıldı",
    "home.activity.allProjects": "Yeni proje oluşturulmaya başlandı",
    "home.activity.projectsViewed": "Projeler görüntülendi",
    "home.activity.templatesViewed": "Proje şablonlarına göz atıldı",
    "home.activity.documentationOpened": "Belgeler açıldı",
    "home.activity.themeChanged": "Tema değiştirildi: {{from}} → {{to}}",
    "home.activity.languageChanged": "Dil değiştirildi: {{from}} → {{to}}"
  }
};

// Expanded translation function that handles direct translations
export const t = (key: string, options?: any): string => {
  try {
    // Check for activity description keys
    const currentLocale = i18n.locale as keyof typeof activityDescriptionMappings;
    if (activityDescriptionMappings[currentLocale] && activityDescriptionMappings[currentLocale][key]) {
      return activityDescriptionMappings[currentLocale][key];
    }
    
    // First check if this is a direct translation key
    if (directTranslations[currentLocale] && directTranslations[currentLocale][key]) {
      return directTranslations[currentLocale][key];
    }

    // Try to get the translation from i18n-js
    let translation = i18n.t(key, options);
    
    // If the translation is the same as the key and doesn't look like a proper key
    // (e.g., doesn't contain a dot), and the current locale isn't English,
    // try to find a direct mapping for common strings
    if (translation === key && !key.includes('.') && currentLocale !== 'en') {
      // Try to find the key in English and then use that to find it in the current locale
      for (const englishKey in directTranslations.en) {
        if (directTranslations.en[englishKey] === key && directTranslations[currentLocale][englishKey]) {
          return directTranslations[currentLocale][englishKey];
        }
      }
    }
    
    // Check if translation failed (equals the key) but we actually have a translation
    if (translation === key) {
      // For Turkish translations of English text
      if (currentLocale === 'tr' && directTranslations.tr[key]) {
        return directTranslations.tr[key];
      }
      // For English translations of Turkish text 
      else if (currentLocale === 'en') {
        // Find the key in the Turkish mappings where the value matches the requested key
        const turkishKey = Object.entries(directTranslations.tr).find(([_, val]) => val === key)?.[0];
        if (turkishKey && directTranslations.en[turkishKey]) {
          return directTranslations.en[turkishKey];
        }
      }
    }
    
    return translation;
  } catch (error) {
    console.warn(`Translation warning for key: ${key}`, error);
    
    // For better user experience, try to see if we can find the key in directTranslations
    if (typeof key === 'string') {
      const currentLocale = i18n.locale as keyof typeof directTranslations;
      
      // Handle special case for [missing "en.Dil" translation] issues
      if (key.includes('missing') && key.includes('translation')) {
        const missingKey = key.match(/missing "([^"]+)" translation/)?.[1];
        if (missingKey) {
          const parts = missingKey.split('.');
          const actualKey = parts.length > 1 ? parts[1] : parts[0];
          
          // Try direct translations first
          if (directTranslations[currentLocale][actualKey]) {
            return directTranslations[currentLocale][actualKey];
          }
          
          // Fallback to trying to get a translation path
          if (titleTranslationMappings[currentLocale][actualKey]) {
            return i18n.t(titleTranslationMappings[currentLocale][actualKey]);
          }
          
          return actualKey; // Last resort - return the key without locale prefix
        }
      }
      
      // Look for exact or partial matches
      const keys = Object.keys(directTranslations[currentLocale] || {});
      for (const dictKey of keys) {
        if (dictKey.toLowerCase() === key.toLowerCase() || 
            dictKey.toLowerCase().includes(key.toLowerCase()) || 
            key.toLowerCase().includes(dictKey.toLowerCase())) {
          return directTranslations[currentLocale][dictKey];
        }
      }
    }
    
    return key; // Return the key as fallback
  }
};

// Function to get translated activity description
export const formatActivityDescription = (description: string): string => {
  const currentLocale = i18n.locale as keyof typeof activityDescriptionMappings;
  
  // First check if it's a direct key in our activity descriptions
  if (activityDescriptionMappings[currentLocale] && activityDescriptionMappings[currentLocale][description]) {
    return activityDescriptionMappings[currentLocale][description];
  }
  
  // Next check if it's in our direct translations
  if (directTranslations[currentLocale] && directTranslations[currentLocale][description]) {
    return directTranslations[currentLocale][description];
  }
  
  // Try to translate it as a normal key
  try {
    const translation = i18n.t(description);
    if (translation !== description) {
      return translation;
    }
  } catch (e) {
    // Ignore error and continue
  }
  
  return description;
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
  // Special case for the missing translation error format
  if (title && title.startsWith('[missing "') && title.endsWith('" translation]')) {
    const missingKey = title.match(/missing "([^"]+)" translation/)?.[1];
    if (missingKey) {
      const parts = missingKey.split('.');
      const actualKey = parts.length > 1 ? parts[1] : parts[0];
      
      const currentLocale = i18n.locale as keyof typeof directTranslations;
      // Try direct translations first
      if (directTranslations[currentLocale][actualKey]) {
        return directTranslations[currentLocale][actualKey];
      }
    }
  }

  // First, check if the title is already a translated string (not a key)
  const currentLocale = i18n.locale as keyof typeof directTranslations;
  const isTranslatedAlready = Object.values(directTranslations[currentLocale]).includes(title);
  
  if (isTranslatedAlready) {
    return title;
  }
  
  // Check if it's a direct translation key
  if (directTranslations[currentLocale] && directTranslations[currentLocale][title]) {
    return directTranslations[currentLocale][title];
  }
  
  // Try to translate through i18n
  try {
    const translation = i18n.t(title);
    if (translation !== title) {
      return translation;
    }
  } catch (e) {
    // Ignore error and continue
  }
  
  // Check if there's a mapping for this title
  if (titleTranslationMappings[currentLocale][title]) {
    return i18n.t(titleTranslationMappings[currentLocale][title]);
  }
  
  // Last attempt - check if the other locale has this as a key
  const otherLocale = currentLocale === 'en' ? 'tr' : 'en';
  if (directTranslations[otherLocale]) {
    // Find if there's an entry where the key in the other locale maps to this title
    for (const [key, value] of Object.entries(directTranslations[otherLocale])) {
      if (value === title && directTranslations[currentLocale][key]) {
        return directTranslations[currentLocale][key];
      }
    }
  }
  
  return title;
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

// Simple translation function - in a real app this would be more sophisticated
let currentLanguage = 'en';

export const setLanguage = (lang: 'en' | 'tr') => {
  currentLanguage = lang;
};

export const translate = (key: string): string => {
  const keys = key.split('.');
  let value: any = directTranslations[currentLanguage as keyof typeof directTranslations];
  
  for (const k of keys) {
    value = value?.[k];
  }
  
  return value || key;
};

