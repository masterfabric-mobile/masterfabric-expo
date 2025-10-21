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
}

export function ThemeProvider({ 
  children, 
  defaultTheme = 'system',
  enableSystemTheme = true 
}: ThemeProviderProps) {
  const [currentTheme, setCurrentTheme] = useState<ThemeMode>(defaultTheme);
  const [systemColorScheme, setSystemColorScheme] = useState<ColorSchemeName>(
    Appearance.getColorScheme() || 'light'
  );

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

  // Set theme function
  const setTheme = (theme: ThemeMode) => {
    setCurrentTheme(theme);
  };

  // Toggle between light and dark
  const toggleTheme = () => {
    if (currentTheme === 'system') {
      setCurrentTheme(isDark ? 'light' : 'dark');
    } else {
      setCurrentTheme(currentTheme === 'light' ? 'dark' : 'light');
    }
  };

  const value: ThemeContextValue = {
    currentTheme,
    isDark,
    colors,
    setTheme,
    toggleTheme,
  };

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
