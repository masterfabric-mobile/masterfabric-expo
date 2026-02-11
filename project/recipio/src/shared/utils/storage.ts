/**
 * AsyncStorage helpers for Recipio app
 */

import AsyncStorage from '@react-native-async-storage/async-storage';

const PREFIX = '@recipio/';

export const storage = {
  async get<T>(key: string): Promise<T | null> {
    const value = await AsyncStorage.getItem(PREFIX + key);
    return value ? JSON.parse(value) : null;
  },

  async set<T>(key: string, value: T): Promise<void> {
    await AsyncStorage.setItem(PREFIX + key, JSON.stringify(value));
  },

  async remove(key: string): Promise<void> {
    await AsyncStorage.removeItem(PREFIX + key);
  },
};
