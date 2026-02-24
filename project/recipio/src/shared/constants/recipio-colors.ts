/**
 * Recipio color palette — unified across all screens.
 * Dark: black + orange accents. Light: white + orange accents.
 */
export const RecipioColors = {
  /** Main accent — use everywhere: tabs, icons, CTAs, buttons, badges */
  primaryAccent: '#FF5722',
  /** Use sparingly — only for shadows or subtle highlights */
  orange: '#FF9800',
  /** Use sparingly — only for softer shadows or glow effects */
  lightOrange: '#FFB74D',

  // Neutrals
  background: '#000000',
  cardBackground: '#1C1C1E',
  text: '#FFFFFF',
  textSecondary: '#8E8E93',
  border: '#38383A',
  success: '#34C759',
  error: '#FF3B30',

  // Light theme (for future)
  light: {
    background: '#FFFFFF',
    cardBackground: '#F2F2F7',
    text: '#000000',
    textSecondary: '#8E8E93',
    border: '#E5E5E5',
  },
} as const;
