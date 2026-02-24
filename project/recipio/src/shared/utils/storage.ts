/**
 * AsyncStorage helpers for Recipio app
 */

import AsyncStorage from '@react-native-async-storage/async-storage';

const STORAGE_KEYS = {
  ONBOARDING_COMPLETED: '@recipio/onboarding_completed',
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
};
