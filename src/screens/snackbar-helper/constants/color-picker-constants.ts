/**
 * Color Picker Constants
 * 
 * Configuration constants for the color picker component
 */

import { Colors } from 'masterfabric-expo-core';

// Color constants for UI (using light theme colors as base)
export const COLOR_PICKER_COLORS = {
  white: Colors.light.snackbarWhite,
  black: Colors.light.snackbarBlack,
  borderLight: Colors.light.snackbarBorderLight,
  borderWhite: Colors.light.snackbarBorderWhite,
} as const;

// Picker dimensions
export const COLOR_PICKER_DIMENSIONS = {
  gradientSquareWidth: 300,
  gradientSquareHeight: 200,
  hueSliderWidth: 300,
  hueSliderHeight: 40,
  pointerSize: 20,
  huePointerWidth: 20,
  huePointerHeight: 40,
} as const;

// Default values
export const COLOR_PICKER_DEFAULTS = {
  defaultHue: 280, // Purple
  maxHue: 360,
  maxSaturation: 100,
  maxLightness: 100,
} as const;

// Hue gradient colors (rainbow spectrum)
export const HUE_GRADIENT_COLORS = [
  '#ff0000', // Red
  '#ffff00', // Yellow
  '#00ff00', // Green
  '#00ffff', // Cyan
  '#0000ff', // Blue
  '#ff00ff', // Magenta
  '#ff0000', // Red (wrap around)
] as const;

