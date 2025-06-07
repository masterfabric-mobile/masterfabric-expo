import { router } from 'expo-router';
import type { RootStackParamList } from './types';

/**
 * Centralized navigation utilities
 * Following Expo development rules for navigation management
 */
export const navigationUtils = {
  /**
   * Navigate to a specific screen
   */
  navigate: <T extends keyof RootStackParamList>(
    screen: T,
    params?: RootStackParamList[T]
  ) => {
    if (params) {
      router.push({ pathname: screen as any, params });
    } else {
      router.push(screen as any);
    }
  },

  /**
   * Replace current screen
   */
  replace: <T extends keyof RootStackParamList>(
    screen: T,
    params?: RootStackParamList[T]
  ) => {
    if (params) {
      router.replace({ pathname: screen as any, params });
    } else {
      router.replace(screen as any);
    }
  },

  /**
   * Go back to previous screen
   */
  goBack: () => {
    router.back();
  },

  /**
   * Navigate to home (tabs)
   */
  goToHome: () => {
    router.replace('/(tabs)');
  },

  /**
   * Navigate to splash screen
   */
  goToSplash: () => {
    router.replace('/splash');
  },

  /**
   * Check if we can go back
   */
  canGoBack: () => {
    return router.canGoBack();
  },

  /**
   * Get current route name
   */
  getCurrentRoute: () => {
    // This would need to be implemented with router state if needed
    return null;
  },

  /**
   * Reset navigation stack to a specific screen
   */
  reset: <T extends keyof RootStackParamList>(
    screen: T,
    params?: RootStackParamList[T]
  ) => {
    // Using replace for now, could be enhanced with custom reset logic
    if (params) {
      router.replace({ pathname: screen as any, params });
    } else {
      router.replace(screen as any);
    }
  },
};
