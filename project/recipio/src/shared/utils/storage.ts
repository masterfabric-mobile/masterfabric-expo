/**
 * AsyncStorage helpers for Recipio app
 */

import AsyncStorage from '@react-native-async-storage/async-storage';

const STORAGE_KEYS = {
  ONBOARDING_COMPLETED: '@recipio/onboarding_completed',
  LOCALE: '@recipio/locale',
} as const;

export const storage = {
  async setOnboardingCompleted(value: boolean): Promise<void> {
    await AsyncStorage.setItem(
      STORAGE_KEYS.ONBOARDING_COMPLETED,
      JSON.stringify(value)
    );
  },

  async getOnboardingCompleted(): Promise<boolean> {
    const value = await AsyncStorage.getItem(STORAGE_KEYS.ONBOARDING_COMPLETED);
    return value ? JSON.parse(value) : false;
  },

  async clearOnboardingStatus(): Promise<void> {
    await AsyncStorage.removeItem(STORAGE_KEYS.ONBOARDING_COMPLETED);
  },

  async setLocale(locale: 'en' | 'tr'): Promise<void> {
    await AsyncStorage.setItem(STORAGE_KEYS.LOCALE, locale);
  },

  async getLocale(): Promise<'en' | 'tr' | null> {
    const value = await AsyncStorage.getItem(STORAGE_KEYS.LOCALE);
    if (value === 'en' || value === 'tr') return value;
    return null;
  },
};
