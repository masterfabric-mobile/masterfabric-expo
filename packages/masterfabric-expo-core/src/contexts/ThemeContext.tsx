import AsyncStorage from '@react-native-async-storage/async-storage';
import { createContext, ReactNode, useContext, useEffect, useState } from 'react';
import { Appearance, ColorSchemeName, Platform } from 'react-native';
import { getColorsByTheme } from '../constants/Colors';
import { ThemeColors, ThemeMode } from '../types';

interface ThemeContextValue {
  currentTheme: ThemeMode;
  isDark: boolean;
  colors: ThemeColors;
  setTheme: (theme: ThemeMode) => void;
  toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextValue | undefined>(undefined);

interface ThemeProviderProps {
  children: ReactNode;
  defaultTheme?: ThemeMode;
  enableSystemTheme?: boolean;
  enablePersistence?: boolean;
}

const THEME_STORAGE_KEY = 'masterfabric_theme';
// Its when open web app from browser and its will detect the browser color scheme preference.

// Helper function to detect browser color scheme preference on web
const getBrowserColorScheme = (): ColorSchemeName => {
  console.log('🎨 getBrowserColorScheme: Platform.OS:', Platform.OS);
  if (Platform.OS === 'web' && typeof window !== 'undefined' && window.matchMedia) {

    const darkModeQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const matches = darkModeQuery.matches;
    return darkModeQuery.matches ? 'dark' : 'light';
  }
  // Fallback to React Native Appearance API for native platforms
  return Appearance.getColorScheme() || 'light';
};

export function ThemeProvider({ 
  children, 
  defaultTheme = 'system',
  enableSystemTheme = true,
  enablePersistence = true
}: ThemeProviderProps) {
  // Detect browser/system preference synchronously on web before any state initialization
  // This ensures we have the correct preference immediately, especially on web
  const initialBrowserScheme = getBrowserColorScheme();
  
  // Initialize theme state immediately with browser preference (for zero cookie time)
  // This allows immediate rendering during splash screen
  const [currentTheme, setCurrentTheme] = useState<ThemeMode>(defaultTheme);
  const [systemColorScheme, setSystemColorScheme] = useState<ColorSchemeName>(
    initialBrowserScheme
  );

  // Apply initial theme to DOM IMMEDIATELY on web (synchronously, before any async operations)
  // This happens during splash screen and ensures no flash of wrong theme
  // This runs on every render to ensure theme is always applied, especially during splash
  if (Platform.OS === 'web' && typeof document !== 'undefined') {
    // Calculate initial isDark state based on browser preference
    const initialIsDark = defaultTheme === 'system' 
      ? initialBrowserScheme === 'dark'
      : defaultTheme === 'dark';
    
    const htmlElement = document.documentElement;
    const themeValue = initialIsDark ? 'dark' : 'light';
    
    // Remove existing theme classes/attributes
    htmlElement.removeAttribute('data-theme');
    htmlElement.classList.remove('light', 'dark');
    
    // Apply initial theme IMMEDIATELY (synchronously, not in useEffect)
    // This ensures theme is applied before React renders anything
    htmlElement.setAttribute('data-theme', themeValue);
    htmlElement.classList.add(themeValue);
    htmlElement.style.colorScheme = themeValue;
    
    // Also apply to body for better coverage
    if (document.body) {
      document.body.classList.remove('light', 'dark');
      document.body.classList.add(themeValue);
      document.body.setAttribute('data-theme', themeValue);
    }
    
    console.log('🎨 ThemeProvider: Applied initial theme to DOM (splash time):', themeValue, '(browser preference:', initialBrowserScheme, ')');
  }

  // Load theme from storage asynchronously (non-blocking)
  // App renders immediately with browser preference, then updates if saved preference exists
  useEffect(() => {
    const loadTheme = async () => {
      // Detect browser/system preference first (ensure we have latest)
      const detectedScheme = getBrowserColorScheme();
      setSystemColorScheme(detectedScheme);
      console.log('🎨 ThemeProvider: Detected system color scheme:', detectedScheme);
      
      if (!enablePersistence) {
        console.log('🎨 ThemeProvider: Persistence disabled, using default theme:', defaultTheme);
        return;
      }

      try {
        console.log('🎨 ThemeProvider: Loading theme from storage...');
        const savedTheme = await AsyncStorage.getItem(THEME_STORAGE_KEY);
        console.log('🎨 ThemeProvider: Saved theme from storage:', savedTheme);
        
        if (savedTheme && ['light', 'dark', 'system'].includes(savedTheme)) {
          console.log('🎨 ThemeProvider: Updating theme to saved value:', savedTheme);
          setCurrentTheme(savedTheme as ThemeMode);
          // If saved theme is 'system', ensure we have the latest browser preference
          if (savedTheme === 'system') {
            const currentBrowserScheme = getBrowserColorScheme();
            setSystemColorScheme(currentBrowserScheme);
            console.log('🎨 ThemeProvider: Updated system color scheme for system theme:', currentBrowserScheme);
          }
        } else {
          // No saved theme - use defaultTheme (which defaults to 'system')
          // When defaultTheme is 'system', ensure browser preference is properly set
          if (defaultTheme === 'system') {
            const currentBrowserScheme = getBrowserColorScheme();
            setSystemColorScheme(currentBrowserScheme);
            console.log('🎨 ThemeProvider: No saved theme, using system theme with browser preference:', currentBrowserScheme);
          } else {
            console.log('🎨 ThemeProvider: No saved theme, using default:', defaultTheme);
          }
        }
      } catch (error) {
        console.warn('🎨 ThemeProvider: Failed to load theme from storage:', error);
        // On error, ensure browser preference is set if using system theme
        if (defaultTheme === 'system') {
          const currentBrowserScheme = getBrowserColorScheme();
          setSystemColorScheme(currentBrowserScheme);
          console.log('🎨 ThemeProvider: Error loading theme, using system theme with browser preference:', currentBrowserScheme);
        }
      }
    };

    loadTheme();
  }, [enablePersistence, defaultTheme]);

  // Listen to system theme changes
  useEffect(() => {
    if (!enableSystemTheme || currentTheme !== 'system') {
      return;
    }

    // For web, use media query listener
    if (Platform.OS === 'web' && typeof window !== 'undefined' && window.matchMedia) {
      const darkModeQuery = window.matchMedia('(prefers-color-scheme: dark)');
      
      // Set initial value
      setSystemColorScheme(darkModeQuery.matches ? 'dark' : 'light');
      
      // Listen for changes - handle both modern and legacy APIs
      // Modern browsers: addEventListener passes MediaQueryListEvent
      // Legacy browsers: addListener passes MediaQueryList (which also has .matches)
      const handleChangeModern = (e: MediaQueryListEvent) => {
        setSystemColorScheme(e.matches ? 'dark' : 'light');
        console.log('🎨 ThemeProvider: Browser color scheme changed to:', e.matches ? 'dark' : 'light');
      };
      
      const handleChangeLegacy = (mql: MediaQueryList) => {
        setSystemColorScheme(mql.matches ? 'dark' : 'light');
        console.log('🎨 ThemeProvider: Browser color scheme changed to:', mql.matches ? 'dark' : 'light');
      };
      
      // Modern browsers support addEventListener
      if (typeof darkModeQuery.addEventListener === 'function') {
        darkModeQuery.addEventListener('change', handleChangeModern);
        return () => darkModeQuery.removeEventListener('change', handleChangeModern);
      } 
      // Fallback for older browsers (using type assertion for legacy API)
      else if (typeof (darkModeQuery as any).addListener === 'function') {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        (darkModeQuery as any).addListener(handleChangeLegacy);
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        return () => (darkModeQuery as any).removeListener(handleChangeLegacy);
      }
    } 
    // For native platforms, use React Native Appearance API
    else {
      const subscription = Appearance.addChangeListener(({ colorScheme }) => {
        setSystemColorScheme(colorScheme);
        console.log('🎨 ThemeProvider: System color scheme changed to:', colorScheme);
      });

      return () => subscription?.remove();
    }
  }, [currentTheme, enableSystemTheme]);

  // Determine if dark mode is active
  const isDark = currentTheme === 'system' 
    ? systemColorScheme === 'dark'
    : currentTheme === 'dark';

  // Get current colors
  const colors = getColorsByTheme(currentTheme, isDark);

  // Sync theme to DOM for web platform - runs whenever theme changes
  // This ensures all pages get the correct theme immediately
  useEffect(() => {
    if (Platform.OS === 'web' && typeof document !== 'undefined') {
      const htmlElement = document.documentElement;
      const themeValue = isDark ? 'dark' : 'light';
      
      // Remove existing theme classes/attributes
      htmlElement.removeAttribute('data-theme');
      htmlElement.classList.remove('light', 'dark');
      
      // Apply new theme
      htmlElement.setAttribute('data-theme', themeValue);
      htmlElement.classList.add(themeValue);
      
      // Also set color-scheme CSS property for better browser support
      htmlElement.style.colorScheme = themeValue;
      
      // Apply to body as well for better coverage
      if (document.body) {
        document.body.classList.remove('light', 'dark');
        document.body.classList.add(themeValue);
        document.body.setAttribute('data-theme', themeValue);
      }
      
      console.log('🎨 ThemeProvider: Synced theme to DOM:', themeValue, '(currentTheme:', currentTheme, ', systemColorScheme:', systemColorScheme, ')');
    }
  }, [isDark, currentTheme, systemColorScheme]);

  // Set theme function with persistence
  const setTheme = async (theme: ThemeMode) => {
    console.log('🎨 ThemeProvider: Setting theme to:', theme);
    setCurrentTheme(theme);
    
    if (enablePersistence) {
      try {
        console.log('🎨 ThemeProvider: Saving theme to storage:', theme);
        await AsyncStorage.setItem(THEME_STORAGE_KEY, theme);
        console.log('🎨 ThemeProvider: Theme saved successfully');
      } catch (error) {
        console.warn('🎨 ThemeProvider: Failed to save theme to storage:', error);
      }
    }
  };

  // Toggle between light and dark
  const toggleTheme = async () => {
    const newTheme = currentTheme === 'system' 
      ? (isDark ? 'light' : 'dark')
      : (currentTheme === 'light' ? 'dark' : 'light');
    
    await setTheme(newTheme);
  };

  const value: ThemeContextValue = {
    currentTheme,
    isDark,
    colors,
    setTheme,
    toggleTheme,
  };

  // Render immediately with browser-detected theme (non-blocking)
  // Theme is already applied to DOM synchronously, so safe to render during splash
  // AsyncStorage loading happens in background and updates theme if needed
  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  );
}

// Hook to use theme context
export function useTheme(): ThemeContextValue {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
}

// Hook to get theme colors directly
export function useThemeColors(): ThemeColors {
  const { colors } = useTheme();
  return colors;
}

// Hook to check if dark mode is active
export function useIsDarkMode(): boolean {
  const { isDark } = useTheme();
  return isDark;
}

// Theme-aware color getter hook
export function useThemeAwareColors(isDarkOverride?: boolean): ThemeColors {
  const { currentTheme, isDark } = useTheme();
  const shouldUseDark = isDarkOverride !== undefined ? isDarkOverride : isDark;
  return getColorsByTheme(currentTheme, shouldUseDark);
}
