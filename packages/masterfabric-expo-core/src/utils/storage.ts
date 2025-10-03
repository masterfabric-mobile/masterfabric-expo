import AsyncStorage from '@react-native-async-storage/async-storage';

// Storage utilities for MasterView
export const storage = {
  // Store data
  set: async (key: string, value: any): Promise<boolean> => {
    try {
      const jsonValue = JSON.stringify(value);
      await AsyncStorage.setItem(key, jsonValue);
      return true;
    } catch (error) {
      console.error('Storage set error:', error);
      return false;
    }
  },
  
  // Get data
  get: async <T = any>(key: string): Promise<T | null> => {
    try {
      const jsonValue = await AsyncStorage.getItem(key);
      return jsonValue != null ? JSON.parse(jsonValue) : null;
    } catch (error) {
      console.error('Storage get error:', error);
      return null;
    }
  },
  
  // Remove data
  remove: async (key: string): Promise<boolean> => {
    try {
      await AsyncStorage.removeItem(key);
      return true;
    } catch (error) {
      console.error('Storage remove error:', error);
      return false;
    }
  },
  
  // Clear all data
  clear: async (): Promise<boolean> => {
    try {
      await AsyncStorage.clear();
      return true;
    } catch (error) {
      console.error('Storage clear error:', error);
      return false;
    }
  },
  
  // Get all keys
  getAllKeys: async (): Promise<string[]> => {
    try {
      const keys = await AsyncStorage.getAllKeys();
      return Array.from(keys);
    } catch (error) {
      console.error('Storage get all keys error:', error);
      return [];
    }
  },
  
  // Multi operations
  multiGet: async (keys: string[]): Promise<Array<[string, string | null]>> => {
    try {
      const result = await AsyncStorage.multiGet(keys);
      return Array.from(result);
    } catch (error) {
      console.error('Storage multi get error:', error);
      return [];
    }
  },
  
  multiSet: async (keyValuePairs: Array<[string, string]>): Promise<boolean> => {
    try {
      await AsyncStorage.multiSet(keyValuePairs);
      return true;
    } catch (error) {
      console.error('Storage multi set error:', error);
      return false;
    }
  },
  
  multiRemove: async (keys: string[]): Promise<boolean> => {
    try {
      await AsyncStorage.multiRemove(keys);
      return true;
    } catch (error) {
      console.error('Storage multi remove error:', error);
      return false;
    }
  },
  
  // Check if key exists
  exists: async (key: string): Promise<boolean> => {
    try {
      const value = await AsyncStorage.getItem(key);
      return value !== null;
    } catch (error) {
      console.error('Storage exists check error:', error);
      return false;
    }
  },
  
  // Get storage size info
  getSize: async (): Promise<{ used: number; available: number } | null> => {
    try {
      // This is a simplified implementation
      // In a real app, you might want to calculate actual storage usage
      const keys = await storage.getAllKeys();
      return {
        used: keys.length,
        available: 1000 - keys.length, // Simplified calculation
      };
    } catch (error) {
      console.error('Storage size calculation error:', error);
      return null;
    }
  }
};
