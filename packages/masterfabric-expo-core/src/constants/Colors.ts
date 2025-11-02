import { ThemeColors, ThemeMode } from '../types';

const tintColorLight = '#007AFF';
const tintColorDark = '#007AFF';

export const Colors = {
  light: {
    text: '#000000',
    background: '#FFFFFF',
    tint: tintColorLight,
    icon: '#666666',
    tabIconDefault: '#8E8E93',
    tabIconSelected: tintColorLight,
    
    // Home screen specific colors
    cardBackground: '#F2F2F7',
    cardBackgroundAlt: '#F8F9FA',
    sectionTitle: '#000000',
    actionDescription: '#8E8E93',
    headerBorder: '#E5E5E5',
    divider: '#C6C6C8',
    
    // Quick action colors
    projectColor: '#007AFF',
    templatesColor: '#34C759',
    documentationColor: '#FF9500',
    settingsColor: '#8E8E93',
    
    // Developer tools colors
    onboardingColor: '#FF9500',
    deviceInfoColor: '#007AFF',
    
    // Status colors
    successColor: '#34C759',
    errorColor: '#FF3B30',
    warningColor: '#FF9500',
    
    // Header/AppBar colors
    headerBackground: '#FFFFFF',
    headerText: '#000000',
    headerIcon: '#000000',
    headerShadow: 'rgba(0, 0, 0, 0.12)',
    
    // Interactive elements
    buttonBackground: '#F2F2F7',
    buttonBackgroundHover: '#E9ECEF',
    buttonBorder: '#C7C7CC',
    activeButton: '#007AFF',
    inactiveText: '#3C3C43',
    
    // Onboarding colors
    onboardingBackground: '#FFFFFF',
    onboardingIcon: '#007AFF',
    onboardingProgressActive: '#007AFF',
    onboardingProgressInactive: '#E5E5E5',
    onboardingSkipText: '#8E8E93',
    onboardingDescriptionBg: 'rgba(0, 0, 0, 0.03)',
    onboardingDescriptionBorder: '#007AFF',
    
    // Settings colors
    settingsBackground: '#F2F2F7',
    settingsCardBackground: '#FFFFFF',
    settingsCardBorder: '#E5E5E5',
    settingsHeaderBorder: '#E5E5E5',
    settingsIconBackground: '#007AFF15',
    settingsDropdownBorder: '#E1E5E9',
    settingsThemeOptionBg: '#F8F9FA',
    settingsThemeOptionBorder: '#E1E5E9',
    settingsThemeIconBg: '#E5E5E5',
    settingsDescription: '#666666',
    
    // Modern minimalist colors
    surfaceBackground: '#FFFFFF',
    surfaceBorder: '#E9ECEF',
    surfaceShadow: 'rgba(0, 0, 0, 0.04)',
    labelText: '#6C757D',
    bodyText: '#343A40',
    
    // Tab bar colors
    tabBarBackground: 'rgba(255, 255, 255, 0.95)',
    tabBarBorder: '#C7C7CC',
    tabBarShadow: 'rgba(0, 0, 0, 0.15)',
    tabBarActiveTint: '#007AFF',
    tabBarInactiveTint: '#8E8E93',
    
    // Splash colors
    splashBackground: '#FFFFFF',
    splashText: '#000000',
    splashSubtext: '#6C757D',
    splashProgress: '#007AFF',
    splashProgressBg: '#E9ECEF',
    
    // Input & Form colors (shared by helpers)
    inputBackground: '#F8F9FA',
    placeholderText: '#8E8E93',
    primary: '#007AFF',
    titleText: '#000000',
    
    // Additional colors for string-helper
    successBackground: '#E8F5E8',
    successBorder: '#34C759',
    successText: '#2E7D32',
    
    // Time helper colors
    timeHelperSuccessBackground: '#E8F5E8',
    timeHelperSuccessBorder: '#34C759',
    timeHelperSuccessText: '#2E7D32',
    timeHelperErrorBackground: '#F8D7DA',
    timeHelperErrorBorder: '#DC3545',
    
    // Snackbar helper colors
    snackbarCustomDefault: '#9C27B0',
    snackbarInfo: '#2196F3',
    snackbarInfoDark: '#0D47A1',
    snackbarBorderLight: '#E0E0E0',
    snackbarBorderWhite: '#FFFFFF',
    snackbarWhite: '#FFFFFF',
    snackbarBlack: '#000000',
    snackbarTransparent: 'transparent',
    snackbarSwitchActiveLight: '#FFFFFF',
    snackbarSwitchInactiveDark: '#48484A',
    snackbarSwitchInactiveLight: '#F4F3F4',
  },
  dark: {
    text: '#FFFFFF',
    background: '#000000',
    tint: tintColorDark,
    icon: '#FFFFFF',
    tabIconDefault: '#8E8E93',
    tabIconSelected: tintColorDark,
    
    // Home screen specific colors
    cardBackground: '#1C1C1E',
    cardBackgroundAlt: '#000000',
    sectionTitle: '#FFFFFF',
    actionDescription: '#8E8E93',
    headerBorder: '#38383A',
    divider: '#3C3C43',
    
    // Quick action colors
    projectColor: '#007AFF',
    templatesColor: '#34C759',
    documentationColor: '#FF9500',
    settingsColor: '#8E8E93',
    
    // Developer tools colors
    onboardingColor: '#FF9500',
    deviceInfoColor: '#007AFF',
    
    // Status colors
    successColor: '#34C759',
    errorColor: '#FF3B30',
    warningColor: '#FF9500',
    
    // Header/AppBar colors
    headerBackground: '#1C1C1E',
    headerText: '#FFFFFF',
    headerIcon: '#FFFFFF',
    headerShadow: 'rgba(255, 255, 255, 0.06)',
    
    // Interactive elements
    buttonBackground: '#2C2C2E',
    buttonBackgroundHover: '#3A3A3C',
    buttonBorder: '#48484A',
    activeButton: '#007AFF',
    inactiveText: '#98989D',
    
    // Onboarding colors
    onboardingBackground: '#000000',
    onboardingIcon: '#007AFF',
    onboardingProgressActive: '#007AFF',
    onboardingProgressInactive: '#333333',
    onboardingSkipText: '#8E8E93',
    onboardingDescriptionBg: 'rgba(255, 255, 255, 0.05)',
    onboardingDescriptionBorder: '#007AFF',
    
    // Settings colors
    settingsBackground: '#000000',
    settingsCardBackground: '#1C1C1E',
    settingsCardBorder: '#3C3C43',
    settingsHeaderBorder: '#1C1C1E',
    settingsIconBackground: '#007AFF15',
    settingsDropdownBorder: '#3C3C43',
    settingsThemeOptionBg: '#2C2C2E',
    settingsThemeOptionBorder: '#3C3C43',
    settingsThemeIconBg: '#3C3C3E',
    settingsDescription: '#8E8E93',
    
    // Modern minimalist colors
    surfaceBackground: '#1C1C1E',
    surfaceBorder: '#38383A',
    surfaceShadow: 'rgba(255, 255, 255, 0.03)',
    labelText: '#98989D',
    bodyText: '#E5E5E7',
    
    // Tab bar colors
    tabBarBackground: 'rgba(28, 28, 30, 0.95)',
    tabBarBorder: '#38383A',
    tabBarShadow: 'rgba(255, 255, 255, 0.1)',
    tabBarActiveTint: '#007AFF',
    tabBarInactiveTint: '#8E8E93',
    
    // Splash colors
    splashBackground: '#000000',
    splashText: '#FFFFFF',
    splashSubtext: '#8E8E93',
    splashProgress: '#007AFF',
    splashProgressBg: '#333333',
    
    // Input & Form colors (shared by helpers)
    inputBackground: '#2C2C2E',
    placeholderText: '#8E8E93',
    primary: '#007AFF',
    titleText: '#FFFFFF',
    
    // Additional colors for string-helper
    successBackground: '#1B5E20',
    successBorder: '#34C759',
    successText: '#4CAF50',
    
    // Time helper colors
    timeHelperSuccessBackground: '#1B5E20',
    timeHelperSuccessBorder: '#34C759',
    timeHelperSuccessText: '#4CAF50',
    timeHelperErrorBackground: '#3A1C1C',
    timeHelperErrorBorder: '#FF3B30',
    
    // Snackbar helper colors
    snackbarCustomDefault: '#9C27B0',
    snackbarInfo: '#2196F3',
    snackbarInfoDark: '#0D47A1',
    snackbarBorderLight: '#E0E0E0',
    snackbarBorderWhite: '#FFFFFF',
    snackbarWhite: '#FFFFFF',
    snackbarBlack: '#000000',
    snackbarTransparent: 'transparent',
    snackbarSwitchActiveLight: '#FFFFFF',
    snackbarSwitchInactiveDark: '#48484A',
    snackbarSwitchInactiveLight: '#F4F3F4',
  },
  system: {
    // System theme will be resolved to light or dark at runtime
    text: '#000000',
    background: '#FFFFFF',
    tint: tintColorLight,
    icon: '#666666',
    tabIconDefault: '#8E8E93',
    tabIconSelected: tintColorLight,
    cardBackground: '#F2F2F7',
    cardBackgroundAlt: '#F8F9FA',
    sectionTitle: '#000000',
    actionDescription: '#8E8E93',
    headerBorder: '#E5E5E5',
    divider: '#C6C6C8',
    headerBackground: '#FFFFFF',
    headerText: '#000000',
    headerIcon: '#000000',
    buttonBackground: '#F2F2F7',
    buttonBackgroundHover: '#E9ECEF',
    buttonBorder: '#C7C7CC',
    activeButton: '#007AFF',
    inactiveText: '#3C3C43',
    surfaceBackground: '#FFFFFF',
    surfaceBorder: '#E9ECEF',
    surfaceShadow: 'rgba(0, 0, 0, 0.04)',
    labelText: '#6C757D',
    bodyText: '#343A40',
    successColor: '#34C759',
    errorColor: '#FF3B30',
    warningColor: '#FF9500',
    projectColor: '#007AFF',
    templatesColor: '#34C759',
    documentationColor: '#FF9500',
    settingsColor: '#8E8E93',
    onboardingColor: '#FF9500',
    deviceInfoColor: '#007AFF',
    onboardingBackground: '#FFFFFF',
    onboardingIcon: '#007AFF',
    onboardingProgressActive: '#007AFF',
    onboardingProgressInactive: '#E5E5E5',
    onboardingSkipText: '#8E8E93',
    onboardingDescriptionBg: 'rgba(0, 0, 0, 0.03)',
    onboardingDescriptionBorder: '#007AFF',
    settingsBackground: '#F2F2F7',
    settingsCardBackground: '#FFFFFF',
    settingsCardBorder: '#E5E5E5',
    settingsHeaderBorder: '#E5E5E5',
    settingsIconBackground: '#007AFF15',
    settingsDropdownBorder: '#E1E5E9',
    settingsThemeOptionBg: '#F8F9FA',
    settingsThemeOptionBorder: '#E1E5E9',
    settingsThemeIconBg: '#E5E5E5',
    settingsDescription: '#666666',
    tabBarBackground: 'rgba(255, 255, 255, 0.95)',
    tabBarBorder: '#C7C7CC',
    tabBarShadow: 'rgba(0, 0, 0, 0.15)',
    tabBarActiveTint: '#007AFF',
    tabBarInactiveTint: '#8E8E93',
    splashBackground: '#FFFFFF',
    splashText: '#000000',
    splashSubtext: '#6C757D',
    splashProgress: '#007AFF',
    splashProgressBg: '#E9ECEF',
    
    // Input & Form colors (shared by helpers)
    inputBackground: '#F8F9FA',
    placeholderText: '#8E8E93',
    primary: '#007AFF',
    titleText: '#000000',
    
    // Additional colors for string-helper
    successBackground: '#E8F5E8',
    successBorder: '#34C759',
    successText: '#2E7D32',
  },
};

// Theme-aware color getter
export const getThemeColors = (isDark: boolean): ThemeColors => {
  return isDark ? Colors.dark : Colors.light;
};

// Get colors based on theme mode
export const getColorsByTheme = (theme: ThemeMode, isDark?: boolean): ThemeColors => {
  if (theme === 'system') {
    return getThemeColors(isDark ?? false);
  }
  return Colors[theme];
};

// Quick action color mapping
export const QUICK_ACTION_COLORS: Record<string, string> = {
  'projects': '#007AFF',
  'templates': '#FF9500',
  'documentation': '#34C759',
  'settings': '#8E8E93',
  'dev-onboarding': '#FF3B30',
  'dev-device-info': '#5856D6',
  'new-project': '#007AFF',
};

// Color utilities
export const colorUtils = {
  // Get color with opacity
  withOpacity: (color: string, opacity: number): string => {
    // Convert hex to rgba
    if (color.startsWith('#')) {
      const hex = color.replace('#', '');
      const r = parseInt(hex.substr(0, 2), 16);
      const g = parseInt(hex.substr(2, 2), 16);
      const b = parseInt(hex.substr(4, 2), 16);
      return `rgba(${r}, ${g}, ${b}, ${opacity})`;
    }
    return color;
  },
  
  // Check if color is light or dark
  isLight: (color: string): boolean => {
    // Simple brightness check
    const hex = color.replace('#', '');
    const r = parseInt(hex.substr(0, 2), 16);
    const g = parseInt(hex.substr(2, 2), 16);
    const b = parseInt(hex.substr(4, 2), 16);
    const brightness = (r * 299 + g * 587 + b * 114) / 1000;
    return brightness > 128;
  },
  
  // Get contrast color (black or white)
  getContrastColor: (color: string): string => {
    return colorUtils.isLight(color) ? '#000000' : '#FFFFFF';
  },
};
