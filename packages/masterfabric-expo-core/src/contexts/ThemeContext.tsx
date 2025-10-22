import AsyncStorage from '@react-native-async-storage/async-storage';
import { createContext, ReactNode, useContext, useEffect, useState } from 'react';
import { Appearance, ColorSchemeName } from 'react-native';
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

export function ThemeProvider({ 
  children, 
  defaultTheme = 'system',
  enableSystemTheme = true,
  enablePersistence = true
}: ThemeProviderProps) {
  const [currentTheme, setCurrentTheme] = useState<ThemeMode>(defaultTheme);
  const [systemColorScheme, setSystemColorScheme] = useState<ColorSchemeName>(
    Appearance.getColorScheme() || 'light'
  );
  const [isInitialized, setIsInitialized] = useState(false);

  // Load theme from storage on mount
  useEffect(() => {
    const loadTheme = async () => {
      if (!enablePersistence) {
        console.log('🎨 ThemeProvider: Persistence disabled, using default theme:', defaultTheme);
        setIsInitialized(true);
        return;
      }

      try {
        console.log('🎨 ThemeProvider: Loading theme from storage...');
        const savedTheme = await AsyncStorage.getItem(THEME_STORAGE_KEY);
        console.log('🎨 ThemeProvider: Saved theme from storage:', savedTheme);
        
        if (savedTheme && ['light', 'dark', 'system'].includes(savedTheme)) {
          console.log('🎨 ThemeProvider: Setting theme to saved value:', savedTheme);
          setCurrentTheme(savedTheme as ThemeMode);
        } else {
          console.log('🎨 ThemeProvider: No valid saved theme, using default:', defaultTheme);
        }
      } catch (error) {
        console.warn('🎨 ThemeProvider: Failed to load theme from storage:', error);
      } finally {
        console.log('🎨 ThemeProvider: Initialization complete');
        setIsInitialized(true);
      }
    };

    loadTheme();
  }, [enablePersistence, defaultTheme]);

  // Listen to system theme changes
  useEffect(() => {
    if (!enableSystemTheme || currentTheme !== 'system') {
      return;
    }

    const subscription = Appearance.addChangeListener(({ colorScheme }) => {
      setSystemColorScheme(colorScheme);
    });

    return () => subscription?.remove();
  }, [currentTheme, enableSystemTheme]);

  // Determine if dark mode is active
  const isDark = currentTheme === 'system' 
    ? systemColorScheme === 'dark'
    : currentTheme === 'dark';

  // Get current colors
  const colors = getColorsByTheme(currentTheme, isDark);

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

  // Don't render until theme is loaded
  if (!isInitialized) {
    return null;
  }

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
