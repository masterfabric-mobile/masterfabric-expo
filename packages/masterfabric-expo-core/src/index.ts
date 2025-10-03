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
export { MasterView, initMasterView } from './core/MasterViewCore';
export { useMasterView } from './hooks/useMasterView';
export { MasterViewStoreFactory, createActivityStore, createMasterViewStore, createNavigationStore, createThemeStore, createUserStore } from './stores/MasterViewStore';

// Theme System
export { Colors, QUICK_ACTION_COLORS, colorUtils, getColorsByTheme, getThemeColors } from './constants/Colors';
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

