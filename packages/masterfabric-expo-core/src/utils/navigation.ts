import { router } from 'expo-router';

// Navigation utilities for MasterView
export const navigation = {
  // Navigate to a route
  navigate: (route: string, params?: any): void => {
    try {
      if (params) {
        // @ts-ignore - Expo Router typing issue
        router.push({ pathname: route, params });
      } else {
        // @ts-ignore - Expo Router typing issue
        router.push(route);
      }
    } catch (error) {
      console.error('Navigation error:', error);
    }
  },
  
  // Navigate back
  goBack: (): void => {
    try {
      if (router.canGoBack()) {
        router.back();
      }
    } catch (error) {
      console.error('Go back error:', error);
    }
  },
  
  // Replace current route
  replace: (route: string, params?: any): void => {
    try {
      if (params) {
        // @ts-ignore - Expo Router typing issue
        router.replace({ pathname: route, params });
      } else {
        // @ts-ignore - Expo Router typing issue
        router.replace(route);
      }
    } catch (error) {
      console.error('Replace navigation error:', error);
    }
  },
  
  // Check if can go back
  canGoBack: (): boolean => {
    try {
      return router.canGoBack();
    } catch (error) {
      console.error('Can go back check error:', error);
      return false;
    }
  },
  
  // Get current route
  getCurrentRoute: (): string | null => {
    try {
      // This is a simplified implementation
      // In a real app, you might want to track this differently
      return null;
    } catch (error) {
      console.error('Get current route error:', error);
      return null;
    }
  },
  
  // Navigate with animation
  navigateWithAnimation: (route: string, animation?: 'slide' | 'fade' | 'modal'): void => {
    try {
      // Animation support would depend on your navigation setup
      navigation.navigate(route);
    } catch (error) {
      console.error('Navigate with animation error:', error);
    }
  },
  
  // Reset navigation stack
  resetTo: (route: string): void => {
    try {
      // @ts-ignore - Expo Router typing issue
      router.replace(route);
    } catch (error) {
      console.error('Reset navigation error:', error);
    }
  },
  
  // Navigate to tab
  navigateToTab: (tabName: string): void => {
    try {
      // @ts-ignore - Expo Router typing issue
      router.push(`/(tabs)/${tabName}`);
    } catch (error) {
      console.error('Navigate to tab error:', error);
    }
  }
};
