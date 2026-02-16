// Core Types
// Avoid re-exporting conflicting names; export specific groups as needed
export {
  ActivityActionType, ActivityItem, ActivityType, AppError, BaseStoreState, BaseTextProps, BaseViewProps, LoadingState,
  // DeviceInfo intentionally omitted to avoid conflict
  LocaleConfig, NavigationConfig, NotificationSettings, QuickAction, ScreenHeaderProps, ThemeColors, ThemeMode, User,
  UserPreferences
} from './types';

// Sizing Types
export type { AvatarSize, BorderRadiusSize, BorderWidthSize, ButtonSize, GapSize, HeightSize, IconSize, MarginSize, PaddingSize, SpacerSize, SpacingSize, WidthSize } from './types/sizing';

// MasterView Core
export { MasterView as MasterViewComponent } from './components/MasterView';
export { initMasterView, MasterView } from './core/MasterViewCore';
export { useMasterView } from './hooks/useMasterView';
export { useResponsive } from './hooks/useResponsive';

// WebViewer Hook
export { useWebViewer } from './hooks/useWebViewer';
export { createActivityStore, createMasterViewStore, createNavigationStore, createThemeStore, createUserStore, MasterViewStoreFactory } from './stores/MasterViewStore';

// Theme System
export { Colors, colorUtils, getColorsByTheme, getThemeColors, QUICK_ACTION_COLORS } from './constants/Colors';
export { ThemeProvider, useIsDarkMode, useTheme, useThemeAwareColors, useThemeColors } from './contexts/ThemeContext';

// Components
export { ScreenHeader } from './components/ScreenHeader';
export { Spacer } from './components/Spacer';
export { ThemedText } from './components/ThemedText';
export { ThemedView } from './components/ThemedView';

// Constants
export {
  defaultMasterViewConfig, developmentMasterViewConfig, productionMasterViewConfig
} from './constants/MasterViewConfig';
export { Sizing } from './constants/Sizing';

// Utilities
export * from './utils';

// Helpers
export * from './helpers';
export { webViewerHelper } from './helpers/web_viewer_helper';
export { getTypographyStyleFromSizing } from './helpers/typography_helper';

// Note: Do not re-export DeviceInfo from './types' to avoid name conflicts

// Integrations
export { SentryIntegration, sentryIntegration } from './integrations/SentryIntegration';
export type { SentryConfig } from './integrations/SentryIntegration';

export { FirebaseIntegration, firebaseIntegration } from './integrations/FirebaseIntegration';
export type { FirebaseConfig } from './integrations/FirebaseIntegration';
// Convenience re-exports for integration consumers
export { } from './integrations/FirebaseIntegration';

export { SupabaseIntegration, supabaseIntegration } from './integrations/SupabaseIntegration';
export type { SupabaseConfig } from './integrations/SupabaseIntegration';

// Battery Helper
export * from './components/battery/BatteryHelperView';
export * from './components/battery/BatteryStatusCard';
export * from './components/battery/DeviceInfoCard';
export * from './components/battery/LowPowerModeCard';
export * from './helpers/batteryHelper';
export * from './hooks/useBatteryHelper';
export * from './stores/batteryStore';
export * from './types/battery';

// Onboarding Helper
export * from './components/onboarding-helper/OnboardingHelperView';
export * from './hooks/useOnboardingHelperViewModel';
export * from './stores/onboardingStore';

// Video Player Helper (Works on all platforms)
export * from './components/video-player-helper/VideoPlayerHelperView';
export * from './hooks/useVideoPlayerHelper';
export * from './stores/videoPlayerStore';

// Haptic Helper (iOS/Android only, hides on web)
export * from './components/haptic-helper/HapticHelperView';
export * from './hooks/useHapticHelper';
export * from './stores/hapticStore';

// Local Notification Helper (iOS/Android only)
export * from './components/local-notification-helper';
export * from './hooks/useLocalNotificationHelper';

// Shared Video Player & Haptic Components
export * from './components/video-player-haptic-helper/VideoDisplayCard';
export * from './components/video-player-haptic-helper/VideoPlayerCard';
export * from './components/video-player-haptic-helper/VideoPlayerStatusCard';
export * from './components/video-player-haptic-helper/HapticFeedbackCard';
export * from './helpers/videoPlayerHapticHelper';
export * from './types/videoPlayerHaptic';

// Auto-Initialization
export { autoInitMasterView, resetAutoInit } from './auto-init';
export { useAutoInitMasterView } from './hooks/useAutoInitMasterView';
export { setupMasterView } from './setup';

// Auto-Detection Utilities (for advanced users)
export { getAppName, getAppVersion, getEnvironment, isDevelopment, isProduction } from './utils/auto-detect';
export { detectIntegrations, hasIntegration } from './utils/integration-detector';
export { buildMasterViewConfig } from './utils/config-builder';

