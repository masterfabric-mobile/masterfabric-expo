import { MasterViewConfig } from '../core/MasterViewCore';

export const defaultMasterViewConfig: MasterViewConfig = {
  // Core Features
  enableActivityTracking: true,
  enableErrorBoundary: true,
  enableThemeSupport: true,
  enableLocalization: true,
  enableLoadingStates: true,
  enableNavigationTracking: true,
  
  // Performance Settings
  maxActivityItems: 50,
  errorRetryAttempts: 3,
  loadingTimeout: 10000, // 10 seconds
  
  // Storage Settings
  enablePersistence: true,
  storagePrefix: 'masterview_',
  
  // Debug Settings
  enableDebugMode: __DEV__,
  enableLogging: __DEV__,
  logLevel: __DEV__ ? 'debug' : 'error',
  
  // Platform Specific
  enablePlatformFeatures: true,
  enableAccessibility: true,
  enablePermissions: true,
  
  // Custom Settings
  customSettings: {},
  
  // Integrations (disabled by default, auto-detected)
  enableSentry: false,
  sentryConfig: undefined,
  enableFirebase: false,
  firebaseConfig: undefined,
  enableFirebaseAuth: false,
  enableFirebaseAnalytics: false,
  firebaseAnalyticsConfig: undefined,
  enableSupabase: false,
  supabaseConfig: undefined,
  enableSupabaseAuth: false,
};

export const productionMasterViewConfig: MasterViewConfig = {
  ...defaultMasterViewConfig,
  enableActivityTracking: false, // Disable in production for performance
  maxActivityItems: 20,
  errorRetryAttempts: 1,
  enableDebugMode: false,
  enableLogging: false,
  logLevel: 'error',
};

export const developmentMasterViewConfig: MasterViewConfig = {
  ...defaultMasterViewConfig,
  enableActivityTracking: true,
  maxActivityItems: 100,
  errorRetryAttempts: 5,
  loadingTimeout: 30000, // 30 seconds for debugging
  enableDebugMode: true,
  enableLogging: true,
  logLevel: 'debug',
};
