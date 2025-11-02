/**
 * UI Constants for Time Helper components
 * Contains magic numbers, opacity values, colors, and timing constants
 */

// Modal overlay opacity
export const MODAL_OVERLAY_OPACITY = {
  dark: 0.7,
  light: 0.5,
} as const;

// Color opacity suffixes for theme color modifications
export const COLOR_OPACITY = {
  light: '20', // 20% opacity
  medium: '30', // 30% opacity
  heavy: '40', // 40% opacity
} as const;

// Fallback error color
export const FALLBACK_ERROR_COLOR = '#FF3B30';

// Time picker scroll constants
export const TIME_PICKER_ITEM_HEIGHT = 48;
export const TIME_PICKER_SCROLL_DELAY_HOUR = 100; // milliseconds
export const TIME_PICKER_SCROLL_DELAY_MINUTE = 150; // milliseconds

// Active opacity for touchable components
export const ACTIVE_OPACITY = 0.7;

