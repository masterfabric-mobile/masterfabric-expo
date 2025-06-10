/**
 * Below are the colors that are used in the app. The colors are defined in the light and dark mode.
 * There are many other ways to style your app. For example, [Nativewind](https://www.nativewind.dev/), [Tamagui](https://tamagui.dev/), [unistyles](https://reactnativeunistyles.vercel.app), etc.
 */

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
    actionDescription: '#8E8E93', // Changed from #666666 to be more consistent
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
    
    // Header/AppBar colors - Better contrast for readability
    headerBackground: '#FFFFFF',
    headerText: '#000000',
    headerIcon: '#000000',
    headerShadow: 'rgba(0, 0, 0, 0.12)',
    
    // Interactive elements - More visible in light theme
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
    
    // Tab bar colors - Better visibility
    tabBarBackground: 'rgba(255, 255, 255, 0.95)',
    tabBarBorder: '#C7C7CC',
    tabBarShadow: 'rgba(0, 0, 0, 0.15)',
    tabBarActiveTint: '#007AFF',
    tabBarInactiveTint: '#8E8E93',
    
    // Splash colors - Better contrast
    splashBackground: '#FFFFFF',
    splashText: '#000000',
    splashSubtext: '#6C757D',
    splashProgress: '#007AFF',
    splashProgressBg: '#E9ECEF',
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
    actionDescription: '#8E8E93', // Changed from #FFFFFF to be more subtle
    headerBorder: '#38383A', // Changed from #1C1C1E for better visibility
    divider: '#3C3C43',
    
    // Quick action colors (same as light for brand consistency)
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
    
    // Header/AppBar colors - Keep good contrast for dark theme
    headerBackground: '#1C1C1E',
    headerText: '#FFFFFF',
    headerIcon: '#FFFFFF',
    headerShadow: 'rgba(255, 255, 255, 0.06)',
    
    // Interactive elements - More visible colors
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
  },
};

// Theme-aware color getter
export const getThemeColors = (isDark: boolean) => {
  return isDark ? Colors.dark : Colors.light;
};

// Quick action color mapping
export const QUICK_ACTION_COLORS = {
  'new-project': '#007AFF',
  'templates': '#34C759',
  'documentation': '#FF9500',
  'settings': '#8E8E93',
  'dev-onboarding': '#FF9500',
  'dev-device-info': '#007AFF',
} as const;
