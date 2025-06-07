import AsyncStorage from '@react-native-async-storage/async-storage';
import { logger } from './logger';

export class StorageService {
  static async setItem(key: string, value: any): Promise<void> {
    try {
      const stringValue = JSON.stringify(value);
      await AsyncStorage.setItem(key, stringValue);
      logger.debug(`Storage: Set ${key}`);
    } catch (error) {
      logger.error(`Storage: Failed to set ${key}`, error);
      throw error;
    }
  }

  static async getItem<T>(key: string, defaultValue?: T): Promise<T | null> {
    try {
      const value = await AsyncStorage.getItem(key);
      if (value === null) {
        return defaultValue || null;
      }
      logger.debug(`Storage: Get ${key}`);
      return JSON.parse(value);
    } catch (error) {
      logger.error(`Storage: Failed to get ${key}`, error);
      return defaultValue || null;
    }
  }

  static async removeItem(key: string): Promise<void> {
    try {
      await AsyncStorage.removeItem(key);
      logger.debug(`Storage: Removed ${key}`);
    } catch (error) {
      logger.error(`Storage: Failed to remove ${key}`, error);
      throw error;
    }
  }

  static async clear(): Promise<void> {
    try {
      await AsyncStorage.clear();
      logger.debug('Storage: Cleared all items');
    } catch (error) {
      logger.error('Storage: Failed to clear', error);
      throw error;
    }
  }

  static async getAllKeys(): Promise<string[]> {
    try {
      const keys = await AsyncStorage.getAllKeys();
      logger.debug('Storage: Retrieved all keys');
      return keys;
    } catch (error) {
      logger.error('Storage: Failed to get all keys', error);
      return [];
    }
  }
}
