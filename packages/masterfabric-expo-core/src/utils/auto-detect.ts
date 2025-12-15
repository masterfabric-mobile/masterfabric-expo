import Constants from 'expo-constants';

/**
 * Auto-detect app name from Expo Constants or return fallback
 */
export function getAppName(fallback: string = 'MasterFabric App'): string {
  if (Constants.expoConfig?.name) {
    return Constants.expoConfig.name;
  }
  if (Constants.manifest && typeof Constants.manifest === 'object' && 'name' in Constants.manifest) {
    const name = (Constants.manifest as any).name;
    if (typeof name === 'string') {
      return name;
    }
  }
  return fallback;
}

/**
 * Auto-detect app version from Expo Constants or return fallback
 */
export function getAppVersion(fallback: string = '1.0.0'): string {
  if (Constants.expoConfig?.version) {
    return Constants.expoConfig.version;
  }
  if (Constants.manifest && typeof Constants.manifest === 'object' && 'version' in Constants.manifest) {
    const version = (Constants.manifest as any).version;
    if (typeof version === 'string') {
      return version;
    }
  }
  return fallback;
}

/**
 * Auto-detect environment from __DEV__ or Expo Constants
 */
export function getEnvironment(): 'development' | 'staging' | 'production' {
  // Check explicit environment in expo config
  const configEnv = Constants.expoConfig?.extra?.environment;
  if (configEnv === 'staging' || configEnv === 'production' || configEnv === 'development') {
    return configEnv;
  }
  
  // Fallback to __DEV__ flag
  return __DEV__ ? 'development' : 'production';
}

/**
 * Check if running in development mode
 */
export function isDevelopment(): boolean {
  return getEnvironment() === 'development';
}

/**
 * Check if running in production mode
 */
export function isProduction(): boolean {
  return getEnvironment() === 'production';
}

