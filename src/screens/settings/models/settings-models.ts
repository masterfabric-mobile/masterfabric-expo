import { ReactNode } from 'react';

export type Theme = 'light' | 'dark' | 'system';

export interface SettingsState {
  isLoading: boolean;
  currentLanguage: string;
}

export interface SettingsConfig {
  defaultTheme: Theme;
  defaultLanguage: string;
  supportedLanguages: string[];
  supportedThemes: Theme[];
}

export interface SettingsActions {
  setLoading: (loading: boolean) => void;
  setLanguage: (language: string) => void;
  updateSettings: (settings: Partial<Pick<SettingsState, 'currentLanguage'>>) => void;
  reset: () => void;
}

// Component Props Interfaces
export interface SettingsHeaderProps {
  onBackPress: () => void;
}

export interface SettingsContentProps {
  currentLanguage: string;
  onLanguageChange: (language: string) => void;
  selectedTheme: Theme;
  onThemeChange: (theme: Theme) => void;
}

export interface LanguageCardProps {
  currentLanguage: string;
  onLanguageChange: (language: string) => void;
}

export interface AppearanceCardProps {
  selectedTheme: Theme;
  onThemeChange: (theme: Theme) => void;
}

export interface ThemeOptionsProps {
  selectedTheme: Theme;
  onThemeChange: (theme: Theme) => void;
}

export interface ThemeOption {
  key: Theme;
  label: string;
  desc: string;
  icon: 'sunny' | 'moon' | 'phone-portrait';
}

export interface LanguageOption {
  key: string;
  label: string;
  desc: ReactNode;
}
