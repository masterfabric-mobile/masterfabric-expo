import { ReactNode } from 'react';
import { TextStyle, ViewStyle } from 'react-native';

// Base View Types
export interface BaseViewProps {
  children?: ReactNode;
  style?: ViewStyle | ViewStyle[];
}

export interface BaseTextProps {
  children?: ReactNode;
  style?: TextStyle | TextStyle[];
}

// Theme Types
export type ThemeMode = 'light' | 'dark' | 'system';

export interface ThemeColors {
  text: string;
  background: string;
  tint: string;
  icon: string;
  tabIconDefault: string;
  tabIconSelected: string;
  cardBackground: string;
  cardBackgroundAlt: string;
  sectionTitle: string;
  actionDescription: string;
  headerBorder: string;
  divider: string;
  headerBackground: string;
  headerText: string;
  headerIcon: string;
  buttonBackground: string;
  buttonBackgroundHover: string;
  buttonBorder: string;
  activeButton: string;
  inactiveText: string;
  surfaceBackground: string;
  surfaceBorder: string;
  surfaceShadow: string;
  labelText: string;
  bodyText: string;
  successColor: string;
  errorColor: string;
  warningColor: string;
  // Additional colors
  projectColor: string;
  templatesColor: string;
  documentationColor: string;
  settingsColor: string;
  onboardingColor: string;
  deviceInfoColor: string;
  onboardingBackground: string;
  onboardingIcon: string;
  onboardingProgressActive: string;
  onboardingProgressInactive: string;
  onboardingSkipText: string;
  onboardingDescriptionBg: string;
  onboardingDescriptionBorder: string;
  settingsBackground: string;
  settingsCardBackground: string;
  settingsCardBorder: string;
  settingsHeaderBorder: string;
  settingsIconBackground: string;
  settingsDropdownBorder: string;
  settingsThemeOptionBg: string;
  settingsThemeOptionBorder: string;
  settingsThemeIconBg: string;
  settingsDescription: string;
  tabBarBackground: string;
  tabBarBorder: string;
  tabBarShadow: string;
  tabBarActiveTint: string;
  tabBarInactiveTint: string;
  splashBackground: string;
  splashText: string;
  splashSubtext: string;
  splashProgress: string;
  splashProgressBg: string;
  // Input & Form colors (shared by helpers)
  inputBackground: string;
  placeholderText: string;
  primary: string;
  titleText: string;
  // Additional colors for string-helper
  successBackground: string;
  successBorder: string;
  successText: string;
  // Time helper colors
  timeHelperSuccessBackground: string;
  timeHelperSuccessBorder: string;
  timeHelperSuccessText: string;
  timeHelperErrorBackground: string;
  timeHelperErrorBorder: string;
  // Snackbar helper colors
  snackbarCustomDefault: string;
  snackbarInfo: string;
  snackbarInfoDark: string;
  snackbarBorderLight: string;
  snackbarBorderWhite: string;
  snackbarWhite: string;
  snackbarBlack: string;
  snackbarTransparent: string;
  snackbarSwitchActiveLight: string;
  snackbarSwitchInactiveDark: string;
  snackbarSwitchInactiveLight: string;
}

// Navigation Types
export interface NavigationConfig {
  defaultScreenOptions: {
    headerShown: boolean;
    gestureEnabled: boolean;
    animation: 'default' | 'slide_from_right' | 'slide_from_left' | 'fade' | 'flip' | 'simple_push';
  };
  tabBarOptions: {
    activeTintColor: string;
    inactiveTintColor: string;
    style: {
      backgroundColor: string;
      borderTopWidth: number;
      borderTopColor: string;
    };
    labelStyle: {
      fontSize: number;
      fontWeight: 'normal' | 'bold' | '100' | '200' | '300' | '400' | '500' | '600' | '700' | '800' | '900';
    };
  };
}

// Store Types
export interface BaseStoreState {
  isLoading: boolean;
  error: string | null;
}

// Activity Tracking Types
export type ActivityActionType = 
  'theme_change' | 
  'language_change' | 
  'notification_settings' | 
  'general_settings' | 
  'device_info' | 
  'dev_tool' | 
  'app_start' |
  'new_project' |
  'templates' |
  'documentation' |
  'settings';

export type ActivityType = 
  'project' | 
  'template' | 
  'documentation' | 
  'settings' | 
  'device_info' | 
  'dev_tool';

export interface ActivityItem {
  id: string;
  title: string;
  description?: string;
  timestamp: string;
  type: ActivityType;
  details?: {
    action: ActivityActionType;
    from?: string;
    to?: string;
    tool?: string;
    actionId?: string;
  };
}

// User Types
export interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  preferences?: UserPreferences;
}

export interface UserPreferences {
  theme: ThemeMode;
  language: string;
  notifications: NotificationSettings;
}

export interface NotificationSettings {
  push: boolean;
  email: boolean;
  updates: boolean;
}

// Screen Header Types
export interface ScreenHeaderProps {
  title: string;
  subtitle?: string;
  onBackPress?: () => void;
  showBackButton?: boolean;
  showStageBadge?: boolean;
}

// Quick Action Types
export interface QuickAction {
  id: string;
  title: string;
  description: string;
  icon: string;
  color: string;
}

// Device Info Types (Legacy - use DeviceInfoHelper from helpers instead)
export interface DeviceInfo {
  platform: string;
  version: string;
  buildNumber?: string;
  deviceName?: string;
  deviceId?: string;
  isEmulator?: boolean;
  hasNotch?: boolean;
  screenWidth?: number;
  screenHeight?: number;
}

// Localization Types
export interface LocaleConfig {
  language: string;
  region?: string;
  currency?: string;
  dateFormat?: string;
  timeFormat?: string;
}

// Error Types
export interface AppError {
  code: string;
  message: string;
  details?: any;
  timestamp: string;
}

// Loading States
export interface LoadingState {
  isLoading: boolean;
  progress?: number;
  message?: string;
}