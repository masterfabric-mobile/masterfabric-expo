import { MasterViewConfig } from '../types/MasterView';

export const defaultMasterViewConfig: MasterViewConfig = {
  enableActivityTracking: true,
  enableErrorBoundary: true,
  enableThemeSupport: true,
  enableLocalization: true,
  enableLoadingStates: true,
  enableNavigationTracking: true,
  maxActivityItems: 50,
  errorRetryAttempts: 3,
  loadingTimeout: 10000, // 10 seconds
};

export const productionMasterViewConfig: MasterViewConfig = {
  ...defaultMasterViewConfig,
  enableActivityTracking: false, // Disable in production for performance
  maxActivityItems: 20,
  errorRetryAttempts: 1,
};

export const developmentMasterViewConfig: MasterViewConfig = {
  ...defaultMasterViewConfig,
  enableActivityTracking: true,
  maxActivityItems: 100,
  errorRetryAttempts: 5,
  loadingTimeout: 30000, // 30 seconds for debugging
};
