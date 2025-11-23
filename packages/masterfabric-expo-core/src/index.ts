// Core Types
// Avoid re-exporting conflicting names; export specific groups as needed
export {
    ActivityActionType, ActivityItem, ActivityType, AppError, BaseStoreState, BaseTextProps, BaseViewProps, LoadingState,
    // DeviceInfo intentionally omitted to avoid conflict
    LocaleConfig, NavigationConfig, NotificationSettings, QuickAction, ScreenHeaderProps, ThemeColors, ThemeMode, User,
    UserPreferences
} from './types';

// MasterView Core
export { MasterView as MasterViewComponent } from './components/MasterView';
export { initMasterView, MasterView } from './core/MasterViewCore';
export { useMasterView } from './hooks/useMasterView';
export { createActivityStore, createMasterViewStore, createNavigationStore, createThemeStore, createUserStore, MasterViewStoreFactory } from './stores/MasterViewStore';

// Theme System
export { Colors, colorUtils, getColorsByTheme, getThemeColors, QUICK_ACTION_COLORS } from './constants/Colors';
export { ThemeProvider, useIsDarkMode, useTheme, useThemeAwareColors, useThemeColors } from './contexts/ThemeContext';

// Components
export { ScreenHeader } from './components/ScreenHeader';
export { ThemedText } from './components/ThemedText';
export { ThemedView } from './components/ThemedView';

// Constants
export {
    defaultMasterViewConfig, developmentMasterViewConfig, productionMasterViewConfig
} from './constants/MasterViewConfig';

// Utilities
export * from './utils';

// Helpers
export * from './helpers';

// Note: Do not re-export DeviceInfo from './types' to avoid name conflicts

// Integrations
export { SentryIntegration, sentryIntegration } from './integrations/SentryIntegration';
export type { SentryConfig } from './integrations/SentryIntegration';

export { FirebaseIntegration, firebaseIntegration } from './integrations/FirebaseIntegration';
export type { FirebaseConfig } from './integrations/FirebaseIntegration';
// Convenience re-exports for integration consumers
export {
  // These methods are available on the singleton; re-exported for discoverability
} from './integrations/FirebaseIntegration';

// Battery Helper
export * from './components/battery/BatteryHelperView';
export * from './components/battery/BatteryStatusCard';
export * from './components/battery/DeviceInfoCard';
export * from './components/battery/LowPowerModeCard';
export * from './hooks/useBatteryHelper';
export * from './stores/batteryStore';
export * from './helpers/batteryHelper';
export * from './types/battery';

