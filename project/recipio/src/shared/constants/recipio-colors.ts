/**
 * Recipio color palette — unified across all screens.
 * Dark: black + orange accents. Light: white + orange accents.
 * Use getRecipioColors(isDark) or useRecipioColors() for theme-aware colors.
 */
export type RecipioColorsPalette = {
  primaryAccent: string;
  orange: string;
  lightOrange: string;
  background: string;
  cardBackground: string;
  text: string;
  textSecondary: string;
  border: string;
  success: string;
  error: string;
};

const dark: RecipioColorsPalette = {
  primaryAccent: '#FF5722',
  orange: '#FF9800',
  lightOrange: '#FFB74D',
  background: '#000000',
  cardBackground: '#1C1C1E',
  text: '#FFFFFF',
  textSecondary: '#8E8E93',
  border: '#38383A',
  success: '#34C759',
  error: '#FF3B30',
};

const light: RecipioColorsPalette = {
  primaryAccent: '#FF5722',
  orange: '#FF9800',
  lightOrange: '#FFB74D',
  background: '#FFFFFF',
  cardBackground: '#F2F2F7',
  text: '#000000',
  textSecondary: '#6C6C70',
  border: '#E5E5E5',
  success: '#34C759',
  error: '#FF3B30',
};

/** Theme-aware palette. Dark: black bg; Light: white bg. */
export function getRecipioColors(isDark: boolean): RecipioColorsPalette {
  return isDark ? dark : light;
}

/** @deprecated Use getRecipioColors(true) or useRecipioColors() for theme-aware colors. */
export const RecipioColors: RecipioColorsPalette = dark;
