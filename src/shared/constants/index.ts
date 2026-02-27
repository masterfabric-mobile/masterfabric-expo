import Constants from 'expo-constants';

// Shared constants for the application
export { Colors } from './Colors';

/** OneSignal App ID from app.config extra (from .env) or process.env. Restart Metro after changing .env. */
export function getOneSignalAppId(): string {
  const fromExtra = Constants.expoConfig?.extra?.oneSignalAppId;
  if (fromExtra && typeof fromExtra === 'string') return fromExtra.trim();
  return (process.env.EXPO_PUBLIC_ONE_SIGNAL_APP_ID ?? '').trim();
}

export const APP_CONFIG = {
  API_URL: process.env.EXPO_PUBLIC_API_URL || 'https://api.masterfabric.co',
  APP_VERSION: '1.0.0',
  ENVIRONMENT: process.env.NODE_ENV || 'development',
} as const;

export const COLORS = {
  primary: {
    50: '#eff6ff',
    100: '#dbeafe',
    200: '#bfdbfe',
    300: '#93c5fd',
    400: '#60a5fa',
    500: '#3b82f6',
    600: '#2563eb',
    700: '#1d4ed8',
    800: '#1e40af',
    900: '#1e3a8a',
  },
  gray: {
    50: '#f9fafb',
    100: '#f3f4f6',
    200: '#e5e7eb',
    300: '#d1d5db',
    400: '#9ca3af',
    500: '#6b7280',
    600: '#4b5563',
    700: '#374151',
    800: '#1f2937',
    900: '#111827',
  },
  success: '#10b981',
  warning: '#f59e0b',
  error: '#ef4444',
  white: '#ffffff',
  black: '#000000',
} as const;

export const SPACING = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 48,
} as const;

export const TYPOGRAPHY = {
  fontSizes: {
    xs: 12,
    sm: 14,
    md: 16,
    lg: 18,
    xl: 20,
    xxl: 24,
    xxxl: 32,
  },
  fontWeights: {
    normal: '400',
    medium: '500',
    semibold: '600',
    bold: '700',
  },
  lineHeights: {
    tight: 1.2,
    normal: 1.5,
    relaxed: 1.8,
  },
} as const;

export const ANIMATION_DURATION = {
  fast: 200,
  normal: 300,
  slow: 500,
} as const;

export const STORAGE_KEYS = {
  USER_TOKEN: '@user_token',
  USER_PREFERENCES: '@user_preferences',
  APP_FIRST_LAUNCH: '@app_first_launch',
} as const;

export const SCREEN_NAMES = {
  SPLASH: 'Splash',
  HOME: 'Home',
  AUTH: 'Auth',
  PROFILE: 'Profile',
} as const;
