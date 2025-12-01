/**
 * Typography Helper
 *
 * Provides utilities for font scaling, line height calculations,
 * letter spacing, font weight conversions, and typography-related operations.
 * Includes Flutter-style copyWith pattern for creating style variations.
 *
 * This helper offers a complete typography system with predefined styles and
 * utilities for creating consistent text styling across the application.
 *
 * @example
 * ```typescript
 * import { Typography, copyWith, t } from 'masterfabric-expo-core';
 * 
 * // Use predefined styles
 * const titleStyle = Typography.title;
 * 
 * // Create variations with copyWith
 * const redTitle = copyWith(Typography.title, { color: 'red' });
 * 
 * // Quick styling with t() helper
 * const boldSubtitle = t('subtitle', { fontWeight: '700' });
 * ```
 */

// ---- Types ----

export interface TextStyleObject {
  fontSize?: number;
  lineHeight?: number;
  letterSpacing?: number;
  fontWeight?: string | number;
  fontStyle?: 'normal' | 'italic';
  fontFamily?: string;
  textDecorationLine?: 'none' | 'underline' | 'line-through' | 'underline line-through';
  textTransform?: 'none' | 'uppercase' | 'lowercase' | 'capitalize';
  color?: string; // Text color (hex, rgb, rgba, or named color)
  textShadowOffset?: { width: number; height: number }; // Text shadow offset
  textShadowOpacity?: number; // Text shadow opacity (0-1)
  textShadowRadius?: number; // Text shadow blur radius
  textShadowColor?: string; // Text shadow color (hex, rgb, rgba, or named color)
}

export interface TypographyScale {
  base: number;
  ratio: number;
  sizes: number[];
}

export interface TypographySystemConfig {
  baseSize: number;
  ratio: number;
  minSize?: number;
  maxSize?: number;
}

export interface TypographySystem {
  scale: TypographyScale;
  presets: {
    heading: TextStyleObject;
    body: TextStyleObject;
    caption: TextStyleObject;
    label: TextStyleObject;
  };
}

// ---- Font Scaling Functions ----

/**
 * Scales font size based on system font scale
 * @param baseSize The base font size in pixels
 * @param fontScale The system font scale factor (default: 1.0)
 * @returns The scaled font size
 */
export function scaleFontSize(baseSize: number, fontScale: number = 1.0): number {
  if (baseSize <= 0) return 0;
  if (fontScale <= 0) return baseSize;
  return Math.round(baseSize * fontScale);
}

/**
 * Scales font size based on screen width
 * @param baseSize The base font size in pixels
 * @param designWidth The design width the font was designed for
 * @param screenWidth The current screen width
 * @returns The scaled font size
 */
export function scaleFontSizeByScreen(baseSize: number, designWidth: number, screenWidth: number): number {
  if (baseSize <= 0 || designWidth <= 0 || screenWidth <= 0) return baseSize;
  const scale = screenWidth / designWidth;
  return Math.round(baseSize * scale);
}

/**
 * Normalizes font size within bounds
 * @param size The font size to normalize
 * @param min The minimum allowed font size
 * @param max The maximum allowed font size
 * @returns The normalized font size
 */
export function normalizeFontSize(size: number, min: number, max: number): number {
  if (size < min) return min;
  if (size > max) return max;
  return size;
}

/**
 * Calculates accessible font size with limits
 * @param baseSize The base font size
 * @param fontScale The system font scale factor
 * @param min The minimum allowed font size (default: 12)
 * @param max The maximum allowed font size (default: 48)
 * @returns The accessible font size within bounds
 */
export function calculateAccessibleFontSize(
  baseSize: number,
  fontScale: number = 1.0,
  min: number = 12,
  max: number = 48
): number {
  const scaled = scaleFontSize(baseSize, fontScale);
  return normalizeFontSize(scaled, min, max);
}

// ---- Line Height Calculations ----

/**
 * Calculates line height from font size
 * @param fontSize The font size in pixels
 * @param multiplier The multiplier for line height (default: 1.5)
 * @returns The calculated line height
 */
export function calculateLineHeight(fontSize: number, multiplier: number = 1.5): number {
  if (fontSize <= 0) return 0;
  return Math.round(fontSize * multiplier);
}

/**
 * Calculates tight line height (1.2x)
 * @param fontSize The font size in pixels
 * @returns The tight line height
 */
export function calculateTightLineHeight(fontSize: number): number {
  return calculateLineHeight(fontSize, 1.2);
}

/**
 * Calculates normal line height (1.5x)
 * @param fontSize The font size in pixels
 * @returns The normal line height
 */
export function calculateNormalLineHeight(fontSize: number): number {
  return calculateLineHeight(fontSize, 1.5);
}

/**
 * Calculates relaxed line height (1.8x)
 * @param fontSize The font size in pixels
 * @returns The relaxed line height
 */
export function calculateRelaxedLineHeight(fontSize: number): number {
  return calculateLineHeight(fontSize, 1.8);
}

/**
 * Ensures minimum line height
 * @param fontSize The font size in pixels
 * @param minPixels The minimum line height in pixels
 * @returns The line height (either calculated or minimum)
 */
export function calculateMinLineHeight(fontSize: number, minPixels: number): number {
  const calculated = calculateLineHeight(fontSize);
  return Math.max(calculated, minPixels);
}

// ---- Letter Spacing (Tracking) Functions ----

/**
 * Calculates letter spacing in pixels
 * @param fontSize The font size in pixels
 * @param tracking The tracking value (typically -50 to 200)
 * @returns The letter spacing in pixels
 */
export function calculateLetterSpacing(fontSize: number, tracking: number): number {
  if (fontSize <= 0) return 0;
  // Tracking is typically in thousandths of an em (e.g., 50 = 0.05em)
  const em = tracking / 1000;
  return fontSize * em;
}

/**
 * Normalizes tracking value (-50 to 200)
 * @param tracking The tracking value to normalize
 * @returns The normalized tracking value
 */
export function normalizeLetterSpacing(tracking: number): number {
  if (tracking < -50) return -50;
  if (tracking > 200) return 200;
  return tracking;
}

/**
 * Converts tracking value to pixels
 * @param tracking The tracking value
 * @param fontSize The font size in pixels
 * @returns The letter spacing in pixels
 */
export function convertTrackingToPixel(tracking: number, fontSize: number): number {
  return calculateLetterSpacing(fontSize, normalizeLetterSpacing(tracking));
}

// ---- Font Weight Utilities ----

/**
 * Converts font weight string to number
 * @param weight The font weight (string or number)
 * @returns The numeric font weight
 */
export function convertFontWeightToNumeric(weight: string | number): number {
  if (typeof weight === 'number') {
    return weight;
  }

  const weightMap: Record<string, number> = {
    'normal': 400,
    'regular': 400,
    'medium': 500,
    'semibold': 600,
    'bold': 700,
    'extrabold': 800,
    'black': 900,
    '100': 100,
    '200': 200,
    '300': 300,
    '400': 400,
    '500': 500,
    '600': 600,
    '700': 700,
    '800': 800,
    '900': 900,
  };

  const lowerWeight = weight.toLowerCase();
  return weightMap[lowerWeight] || 400;
}

/**
 * Converts font weight number to string
 * @param weight The numeric font weight
 * @returns The string font weight
 */
export function convertFontWeightToString(weight: number): string {
  const weightMap: Record<number, string> = {
    100: '100',
    200: '200',
    300: '300',
    400: 'normal',
    500: 'medium',
    600: 'semibold',
    700: 'bold',
    800: 'extrabold',
    900: 'black',
  };

  return weightMap[weight] || weight.toString();
}

/**
 * Validates font weight value
 * @param weight The font weight to validate
 * @returns True if valid, false otherwise
 */
export function isValidFontWeight(weight: string | number): boolean {
  if (typeof weight === 'number') {
    return weight >= 100 && weight <= 900 && weight % 100 === 0;
  }

  const validStrings = ['normal', 'regular', 'medium', 'semibold', 'bold', 'extrabold', 'black', '100', '200', '300', '400', '500', '600', '700', '800', '900'];
  return validStrings.includes(weight.toLowerCase());
}

/**
 * Normalizes font weight to standard values
 * @param weight The font weight to normalize
 * @returns The normalized font weight (100-900, multiples of 100)
 */
export function normalizeFontWeight(weight: string | number): number {
  const numeric = convertFontWeightToNumeric(weight);
  // Round to nearest valid weight (100, 200, ..., 900)
  const rounded = Math.round(numeric / 100) * 100;
  if (rounded < 100) return 100;
  if (rounded > 900) return 900;
  return rounded;
}

/**
 * Gets all available font weight variants
 * @param baseWeight The base font weight
 * @returns Array of available font weight variants
 */
export function getFontWeightVariants(baseWeight: number): number[] {
  const weights = [100, 200, 300, 400, 500, 600, 700, 800, 900];
  return weights.filter(w => w !== baseWeight);
}

/**
 * Checks if weight is considered bold (>= 600)
 * @param weight The font weight to check
 * @returns True if bold, false otherwise
 */
export function isBoldFontWeight(weight: string | number): boolean {
  const numeric = convertFontWeightToNumeric(weight);
  return numeric >= 600;
}

/**
 * Applies bold styling to weight
 * @param weight The current font weight
 * @returns The bold font weight (700 or higher)
 */
export function applyBoldStyle(weight: string | number): number {
  const numeric = convertFontWeightToNumeric(weight);
  if (numeric >= 600) return numeric;
  return 700;
}

// ---- Font Style Utilities ----

/**
 * Returns italic font style
 * @returns 'italic'
 */
export function applyItalicStyle(): 'italic' {
  return 'italic';
}

/**
 * Returns normal font style
 * @returns 'normal'
 */
export function applyNormalStyle(): 'normal' {
  return 'normal';
}

// ---- Text Style Utilities ----

/**
 * Creates a text style object
 * @param config The text style configuration
 * @returns A complete text style object
 */
export function createTextStyle(config: Partial<TextStyleObject>): TextStyleObject {
  return {
    fontSize: config.fontSize,
    lineHeight: config.lineHeight,
    letterSpacing: config.letterSpacing,
    fontWeight: config.fontWeight,
    fontStyle: config.fontStyle || 'normal',
    fontFamily: config.fontFamily,
    textDecorationLine: config.textDecorationLine || 'none',
    textTransform: config.textTransform || 'none',
    color: config.color,
    textShadowOffset: config.textShadowOffset,
    textShadowOpacity: config.textShadowOpacity,
    textShadowRadius: config.textShadowRadius,
    textShadowColor: config.textShadowColor,
  };
}

/**
 * Applies typography preset
 * @param preset The preset type
 * @param color Optional text color to apply to the preset
 * @returns A text style object for the preset
 */
export function applyTypographyPreset(
  preset: 'heading' | 'body' | 'caption' | 'label' | 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6' | 'title' | 'subtitle',
  color?: string
): TextStyleObject {
  switch (preset) {
    case 'h1':
      return createTextStyle({
        fontSize: 32,
        fontWeight: 700,
        lineHeight: 40,
        letterSpacing: -0.5,
        color,
      });
    case 'h2':
      return createTextStyle({
        fontSize: 28,
        fontWeight: 700,
        lineHeight: 36,
        letterSpacing: -0.5,
        color,
      });
    case 'h3':
      return createTextStyle({
        fontSize: 24,
        fontWeight: 700,
        lineHeight: 32,
        letterSpacing: 0,
        color,
      });
    case 'h4':
      return createTextStyle({
        fontSize: 20,
        fontWeight: 600,
        lineHeight: 28,
        letterSpacing: 0,
        color,
      });
    case 'h5':
      return createTextStyle({
        fontSize: 18,
        fontWeight: 600,
        lineHeight: 26,
        letterSpacing: 0,
        color,
      });
    case 'h6':
      return createTextStyle({
        fontSize: 16,
        fontWeight: 600,
        lineHeight: 24,
        letterSpacing: 0,
        color,
      });
    case 'title':
      return createTextStyle({
        fontSize: 20,
        fontWeight: 600,
        lineHeight: 28,
        letterSpacing: 0,
        color,
      });
    case 'subtitle':
      return createTextStyle({
        fontSize: 16,
        fontWeight: 500,
        lineHeight: 24,
        letterSpacing: 0,
        color,
      });
    case 'heading':
      return createTextStyle({
        fontSize: 24,
        fontWeight: 700,
        lineHeight: 32,
        letterSpacing: 0,
        color,
      });
    case 'body':
      return createTextStyle({
        fontSize: 16,
        fontWeight: 400,
        lineHeight: 24,
        letterSpacing: 0,
        color,
      });
    case 'caption':
      return createTextStyle({
        fontSize: 12,
        fontWeight: 400,
        lineHeight: 16,
        letterSpacing: 0,
        color,
      });
    case 'label':
      return createTextStyle({
        fontSize: 14,
        fontWeight: 600,
        lineHeight: 20,
        letterSpacing: 0,
        color,
      });
    default:
      return createTextStyle({});
  }
}

/**
 * Combines multiple text styles
 * @param styles Array of partial text styles
 * @returns Combined text style object
 */
export function combineTextStyles(...styles: Partial<TextStyleObject>[]): TextStyleObject {
  return styles.reduce((acc, style) => ({ ...acc, ...style }), {} as TextStyleObject);
}

/**
 * Merges typography styles with override
 * @param base The base text style
 * @param override The override text style
 * @returns Merged text style object
 */
export function mergeTypographyStyles(base: TextStyleObject, override: Partial<TextStyleObject>): TextStyleObject {
  return { ...base, ...override };
}

/**
 * Validates typography style object
 * @param style The style object to validate
 * @returns True if valid, false otherwise
 */
export function validateTypographyStyle(style: any): boolean {
  if (!style || typeof style !== 'object') return false;

  if (style.fontSize !== undefined && (typeof style.fontSize !== 'number' || style.fontSize < 0)) return false;
  if (style.lineHeight !== undefined && (typeof style.lineHeight !== 'number' || style.lineHeight < 0)) return false;
  if (style.letterSpacing !== undefined && typeof style.letterSpacing !== 'number') return false;
  if (style.fontWeight !== undefined && !isValidFontWeight(style.fontWeight)) return false;
  if (style.fontStyle !== undefined && !['normal', 'italic'].includes(style.fontStyle)) return false;
  if (style.color !== undefined && typeof style.color !== 'string') return false;
  if (style.textShadowOffset !== undefined && (
    typeof style.textShadowOffset !== 'object' ||
    typeof style.textShadowOffset.width !== 'number' ||
    typeof style.textShadowOffset.height !== 'number'
  )) return false;
  if (style.textShadowOpacity !== undefined && (typeof style.textShadowOpacity !== 'number' || style.textShadowOpacity < 0 || style.textShadowOpacity > 1)) return false;
  if (style.textShadowRadius !== undefined && (typeof style.textShadowRadius !== 'number' || style.textShadowRadius < 0)) return false;
  if (style.textShadowColor !== undefined && typeof style.textShadowColor !== 'string') return false;

  return true;
}

/**
 * Validates if a color string is valid
 * Supports hex (#RRGGBB, #RGB, #RRGGBBAA), rgb/rgba, and named colors
 * React Native natively supports named colors, so we only validate format for hex/rgb
 * Named colors are validated by React Native itself at runtime
 * @param color The color string to validate
 * @returns True if valid color format, false otherwise
 */
export function isValidColor(color: string): boolean {
  if (!color || typeof color !== 'string') return false;

  // Hex color validation (#RGB, #RRGGBB, #RRGGBBAA)
  const hexPattern = /^#([A-Fa-f0-9]{3}|[A-Fa-f0-9]{6}|[A-Fa-f0-9]{8})$/;
  if (hexPattern.test(color)) return true;

  // RGB/RGBA validation
  const rgbPattern = /^rgba?\(\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)(?:\s*,\s*[\d.]+)?\s*\)$/;
  if (rgbPattern.test(color)) return true;

  // Named colors: React Native supports many named colors (black, white, red, etc.)
  // We allow any string that doesn't match hex/rgb patterns, as React Native will
  // validate it at runtime. Invalid named colors will be handled by React Native.
  // This approach is more flexible and doesn't require maintaining a hardcoded list.
  return true;
}

/**
 * Sets text color to a typography style
 * @param style The base text style object
 * @param color The color to apply (hex, rgb, rgba, or named color)
 * @returns Text style object with color applied
 */
export function setTextColor(style: TextStyleObject, color: string): TextStyleObject {
  if (!isValidColor(color)) {
    console.warn(`Invalid color format: ${color}. Color not applied.`);
    return style;
  }
  return { ...style, color };
}

// ---- Typography Structure Functions ----

/**
 * Creates a typography scale
 * @param baseSize The base font size
 * @param ratio The ratio for the scale (default: 1.25)
 * @returns A typography scale object
 */
export function createTypographyScale(baseSize: number, ratio: number = 1.25): TypographyScale {
  const sizes: number[] = [];
  for (let i = -2; i <= 4; i++) {
    sizes.push(Math.round(baseSize * Math.pow(ratio, i)));
  }
  return {
    base: baseSize,
    ratio,
    sizes,
  };
}

/**
 * Gets heading font sizes from typography scale
 * @param baseScale The base typography scale
 * @returns Record of heading sizes (h1-h6)
 */
export function getHeadingFontSizes(baseScale: TypographyScale): Record<'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6', number> {
  // sizes array: [-2, -1, 0, 1, 2, 3, 4] -> indices [0, 1, 2, 3, 4, 5, 6]
  return {
    h1: baseScale.sizes[6] || baseScale.base * 2, // i=4
    h2: baseScale.sizes[5] || baseScale.base * 1.75, // i=3
    h3: baseScale.sizes[4] || baseScale.base * 1.5, // i=2
    h4: baseScale.sizes[3] || baseScale.base * 1.25, // i=1
    h5: baseScale.sizes[2] || baseScale.base, // i=0
    h6: baseScale.sizes[1] || baseScale.base * 0.875, // i=-1
  };
}

/**
 * Gets responsive heading sizes
 * @param baseScale The base typography scale
 * @param screenWidth The current screen width
 * @param breakpoint The breakpoint for responsive scaling (default: 768)
 * @returns Record of responsive heading sizes
 */
export function getResponsiveHeadingSizes(
  baseScale: TypographyScale,
  screenWidth: number,
  breakpoint: number = 768
): Record<string, number> {
  const scale = screenWidth >= breakpoint ? 1.2 : 1.0;
  const baseSizes = getHeadingFontSizes(baseScale);
  const responsive: Record<string, number> = {};
  
  Object.keys(baseSizes).forEach((key) => {
    responsive[key] = Math.round((baseSizes as any)[key] * scale);
  });
  
  return responsive;
}

/**
 * Creates a complete typography system
 * @param config The typography system configuration
 * @returns A complete typography system
 */
export function createTypographySystem(config: TypographySystemConfig): TypographySystem {
  const scale = createTypographyScale(config.baseSize, config.ratio);
  
  return {
    scale,
    presets: {
      heading: applyTypographyPreset('heading'),
      body: applyTypographyPreset('body'),
      caption: applyTypographyPreset('caption'),
      label: applyTypographyPreset('label'),
    },
  };
}

// ---- Flutter-style Helper Functions ----

/**
 * Flutter-style copyWith for text styles (creates a new style with overrides)
 * @param baseStyle The base text style to copy
 * @param overrides The style properties to override
 * @returns A new text style object with applied overrides
 * 
 * @example
 * ```typescript
 * const redTitle = copyWith(Typography.title, { color: 'red' });
 * const boldBody = copyWith(Typography.body, { fontWeight: '700' });
 * ```
 */
export function copyWith(baseStyle: TextStyleObject, overrides: Partial<TextStyleObject>): TextStyleObject {
  return { ...baseStyle, ...overrides };
}

/**
 * Quick typography helper - applies preset with optional overrides
 * @param presetName The typography preset name
 * @param overrides Optional style overrides to apply
 * @returns A text style object
 * 
 * @example
 * ```typescript
 * const greySubtitle = t('subtitle', { color: '#999' });
 * const boldCaption = t('caption', { fontWeight: '600' });
 * ```
 */
export function t(
  presetName: 'heading' | 'body' | 'caption' | 'label' | 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6' | 'title' | 'subtitle' | 'header',
  overrides?: Partial<TextStyleObject>
): TextStyleObject {
  // Map 'header' to 'heading' for compatibility
  const preset = presetName === 'header' ? 'heading' : presetName;
  const baseStyle = applyTypographyPreset(preset);
  
  if (!overrides) {
    return baseStyle;
  }
  
  return copyWith(baseStyle, overrides);
}

// ---- Pre-defined Typography Styles ----

/**
 * Pre-defined typography styles for consistent text styling
 * 
 * @example
 * ```typescript
 * // Direct usage
 * <Text style={Typography.title}>Title Text</Text>
 * <Text style={Typography.body}>Body Text</Text>
 * 
 * // With modifications
 * const customTitle = { ...Typography.title, color: 'blue' };
 * ```
 */
export const Typography = {
  // Headers
  header: applyTypographyPreset('heading'),
  h1: applyTypographyPreset('h1'),
  h2: applyTypographyPreset('h2'),
  h3: applyTypographyPreset('h3'),
  h4: applyTypographyPreset('h4'),
  h5: applyTypographyPreset('h5'),
  h6: applyTypographyPreset('h6'),
  
  // Content
  title: applyTypographyPreset('title'),
  subtitle: applyTypographyPreset('subtitle'),
  body: applyTypographyPreset('body'),
  caption: applyTypographyPreset('caption'),
  label: applyTypographyPreset('label'),
} as const;

// ---- Convenience Helper Object ----

/**
 * Typography helper object with common utilities
 * Provides an organized way to access typography functions
 * 
 * @example
 * ```typescript
 * import { typographyHelper } from 'masterfabric-expo-core';
 * 
 * // Scale font size
 * const scaledSize = typographyHelper.scale.font(16, 1.2);
 * 
 * // Calculate line height
 * const lineHeight = typographyHelper.calculate.lineHeight(16);
 * 
 * // Create style variations
 * const redTitle = typographyHelper.copyWith(Typography.title, { color: 'red' });
 * ```
 */
export const typographyHelper = {
  // Direct access to main utilities
  copyWith,
  t,
  
  // Scale utilities
  scale: {
    font: scaleFontSize,
    fontByScreen: scaleFontSizeByScreen,
    accessible: calculateAccessibleFontSize,
  },
  
  // Calculation utilities
  calculate: {
    lineHeight: calculateLineHeight,
    tightLineHeight: calculateTightLineHeight,
    normalLineHeight: calculateNormalLineHeight,
    relaxedLineHeight: calculateRelaxedLineHeight,
    letterSpacing: calculateLetterSpacing,
  },
  
  // Font weight utilities
  fontWeight: {
    convert: {
      toNumeric: convertFontWeightToNumeric,
      toString: convertFontWeightToString,
    },
    normalize: normalizeFontWeight,
    isBold: isBoldFontWeight,
    applyBold: applyBoldStyle,
  },
  
  // Style utilities
  style: {
    create: createTextStyle,
    combine: combineTextStyles,
    merge: mergeTypographyStyles,
    validate: validateTypographyStyle,
    setColor: setTextColor,
  },
  
  // System utilities
  system: {
    createScale: createTypographyScale,
    createSystem: createTypographySystem,
    getHeadingSizes: getHeadingFontSizes,
    getResponsiveSizes: getResponsiveHeadingSizes,
  },
} as const;

