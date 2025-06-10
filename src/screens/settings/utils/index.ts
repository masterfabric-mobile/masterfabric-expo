import { Colors } from '@/src/shared/constants/Colors';
import { getLocaleDisplayName } from '@/src/shared/i18n';
import { SettingsConfig, Theme, ThemeOption } from '../models/settings-models';

// Available language options
export const getLanguageOptions = () => [
  { label: getLocaleDisplayName('en'), value: 'en' },
  { label: getLocaleDisplayName('tr'), value: 'tr' },
];

export const createSettingsConfig = (): SettingsConfig => ({
  defaultTheme: 'system',
  defaultLanguage: 'en',
  supportedLanguages: ['en', 'tr', 'es', 'fr', 'de'],
  supportedThemes: ['light', 'dark', 'system'],
});

export const getThemeOptions = (t?: (key: string) => string): ThemeOption[] => [
  { 
    key: 'light', 
    label: t ? t('settings.theme.light') : 'Light', 
    desc: t ? t('settings.theme.lightDesc') : 'Light theme', 
    icon: 'sunny' 
  },
  { 
    key: 'dark', 
    label: t ? t('settings.theme.dark') : 'Dark', 
    desc: t ? t('settings.theme.darkDesc') : 'Dark theme', 
    icon: 'moon' 
  },
  { 
    key: 'system', 
    label: t ? t('settings.theme.system') : 'System', 
    desc: t ? t('settings.theme.systemDesc') : 'Follow system theme', 
    icon: 'phone-portrait' 
  },
];

// Theme utility functions
export const getThemePreviewColors = (theme: Theme) => {
  switch (theme) {
    case 'light':
      return {
        background: Colors.light.background,
        element1: Colors.light.settingsCardBackground,
        element2: Colors.light.settingsThemeOptionBg,
      };
    case 'dark':
      return {
        background: Colors.dark.background,
        element1: Colors.dark.settingsCardBackground,
        element2: Colors.dark.settingsThemeOptionBg,
      };
    default:
      return {
        background: Colors.light.tint,
        element1: Colors.dark.settingsCardBackground,
        element2: Colors.dark.settingsThemeOptionBg,
      };
  }
};

export const getThemeIcon = (theme: Theme): 'sunny' | 'moon' | 'phone-portrait' => {
  const icons: Record<Theme, 'sunny' | 'moon' | 'phone-portrait'> = {
    light: 'sunny' as const,
    dark: 'moon' as const,
    system: 'phone-portrait' as const,
  };
  return icons[theme];
};

// Settings validation helpers
export const isValidLanguage = (language: string): boolean => {
  const config = createSettingsConfig();
  return config.supportedLanguages.includes(language);
};

export const isValidTheme = (theme: string): theme is Theme => {
  const config = createSettingsConfig();
  return config.supportedThemes.includes(theme as Theme);
};

// Settings accessibility helpers
export const getThemeAccessibilityLabel = (theme: string, label: string, t: (key: string) => string): string => {
  return `${t('settings.switchTo')} ${label}`;
};
