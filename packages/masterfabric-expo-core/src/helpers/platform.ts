import Constants from 'expo-constants';
import { Platform } from 'react-native';

/**
 * Platform-specific utilities for MasterView
 */

export type PlatformType = 'ios' | 'android' | 'web';

/**
 * Get current platform type
 */
export function getPlatform(): PlatformType {
  return Platform.OS as PlatformType;
}

/**
 * Check if current platform is iOS
 */
export function isIOS(): boolean {
  return Platform.OS === 'ios';
}

/**
 * Check if current platform is Android
 */
export function isAndroid(): boolean {
  return Platform.OS === 'android';
}

/**
 * Check if current platform is Web
 */
export function isWeb(): boolean {
  return Platform.OS === 'web';
}

/**
 * Get platform-specific value
 */
export function selectPlatform<T>(ios: T, android: T, web?: T): T {
  switch (Platform.OS) {
    case 'ios':
      return ios;
    case 'android':
      return android;
    case 'web':
      return web ?? ios; // Default to iOS values for web
    default:
      return ios;
  }
}

/**
 * Get platform-specific style
 */
export function getPlatformStyle<T extends Record<string, any>>(
  styles: {
    ios?: T;
    android?: T;
    web?: T;
    default?: T;
  }
): T {
  const platform = Platform.OS;
  
  if (platform === 'ios' && styles.ios) {
    return styles.ios;
  }
  
  if (platform === 'android' && styles.android) {
    return styles.android;
  }
  
  if (platform === 'web' && styles.web) {
    return styles.web;
  }
  
  return styles.default || ({} as T);
}

/**
 * Get platform version
 */
export function getPlatformVersion(): string | number {
  return Platform.Version;
}

/**
 * Check if running on simulator/emulator
 */
export function isSimulator(): boolean {
  return !Constants.isDevice;
}

/**
 * Check if running on a real device
 */
export function isDevice(): boolean {
  return Constants.isDevice;
}

/**
 * Get device type information
 */
export function getDeviceType(): {
  isTablet: boolean;
  isPhone: boolean;
  deviceType: string;
} {
  const isTablet = Constants.deviceType === 'tablet';
  const isPhone = Constants.deviceType === 'phone';
  
  return {
    isTablet,
    isPhone,
    deviceType: Constants.deviceType || 'unknown',
  };
}

/**
 * Platform-specific constants
 */
export const PlatformConstants = {
  // iOS specific
  ios: {
    statusBarHeight: isIOS() ? 44 : 0,
    homeIndicatorHeight: isIOS() ? 34 : 0,
    safeAreaTop: isIOS() ? 44 : 0,
    safeAreaBottom: isIOS() ? 34 : 0,
  },
  
  // Android specific
  android: {
    statusBarHeight: isAndroid() ? 24 : 0,
    navigationBarHeight: isAndroid() ? 48 : 0,
    safeAreaTop: isAndroid() ? 24 : 0,
    safeAreaBottom: isAndroid() ? 0 : 0,
  },
  
  // Web specific
  web: {
    statusBarHeight: 0,
    navigationBarHeight: 0,
    safeAreaTop: 0,
    safeAreaBottom: 0,
  },
  
  // Common
  common: {
    headerHeight: 56,
    tabBarHeight: 49,
    buttonHeight: 44,
    inputHeight: 44,
  },
} as const;

/**
 * Get platform-specific safe area values
 */
export function getSafeAreaValues() {
  return PlatformConstants[Platform.OS as keyof typeof PlatformConstants] || PlatformConstants.web;
}

/**
 * Check if platform supports specific feature
 */
export function supportsFeature(feature: string): boolean {
  const features = {
    haptics: isIOS() || isAndroid(),
    camera: isIOS() || isAndroid(),
    location: isIOS() || isAndroid(),
    pushNotifications: isIOS() || isAndroid(),
    biometrics: isIOS() || isAndroid(),
    fileSystem: isIOS() || isAndroid(),
    contacts: isIOS() || isAndroid(),
    calendar: isIOS() || isAndroid(),
    webView: true,
    share: isIOS() || isAndroid(),
    clipboard: true,
    vibration: isIOS() || isAndroid(),
  };
  
  return features[feature as keyof typeof features] || false;
}
