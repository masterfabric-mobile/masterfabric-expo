/**
 * useTypography Hook
 * 
 * Global hook for typography calculations with reactive font scale support.
 * Integrates with TypographyService for centralized typography management.
 * 
 * @example
 * ```typescript
 * import { useTypography } from '@/src/shared/hooks/use-typography';
 * 
 * function MyComponent() {
 *   const { scaleFontSize, calculateLineHeight, fontScale } = useTypography();
 * 
 *   const fontSize = scaleFontSize(16);
 *   const lineHeight = calculateLineHeight(fontSize);
 * 
 *   return (
 *     <Text style={{ fontSize, lineHeight }}>
 *       Responsive text
 *     </Text>
 *   );
 * }
 * ```
 */

import { useCallback, useEffect, useState } from 'react';
import { TypographyPreset, typographyService } from '../services/typography-service';

export interface UseTypographyReturn {
  /**
   * Current font scale
   */
  fontScale: number;

  /**
   * Current screen width
   */
  screenWidth: number;

  /**
   * Scale font size based on system font scale
   * @param baseSize Base font size in pixels
   * @param customScale Optional custom font scale
   * @returns Scaled font size
   */
  scaleFontSize: (baseSize: number, customScale?: number) => number;

  /**
   * Scale font size based on screen width
   * @param baseSize Base font size in pixels
   * @param designWidth Optional design width (defaults to 375)
   * @returns Scaled font size
   */
  scaleFontSizeByScreen: (baseSize: number, designWidth?: number) => number;

  /**
   * Calculate accessible font size with limits
   * @param baseSize Base font size
   * @param customScale Optional custom font scale
   * @param min Minimum font size (default: 12)
   * @param max Maximum font size (default: 48)
   * @returns Accessible font size
   */
  calculateAccessibleFontSize: (
    baseSize: number,
    customScale?: number,
    min?: number,
    max?: number
  ) => number;

  /**
   * Calculate line height
   * @param fontSize Font size in pixels
   * @param multiplier Line height multiplier (default: 1.5)
   * @returns Calculated line height
   */
  calculateLineHeight: (fontSize: number, multiplier?: number) => number;

  /**
   * Calculate tight line height (1.2x)
   */
  calculateTightLineHeight: (fontSize: number) => number;

  /**
   * Calculate normal line height (1.5x)
   */
  calculateNormalLineHeight: (fontSize: number) => number;

  /**
   * Calculate relaxed line height (1.8x)
   */
  calculateRelaxedLineHeight: (fontSize: number) => number;

  /**
   * Calculate letter spacing
   * @param fontSize Font size in pixels
   * @param tracking Tracking value
   * @returns Letter spacing in pixels
   */
  calculateLetterSpacing: (fontSize: number, tracking: number) => number;

  /**
   * Convert font weight to numeric
   */
  convertFontWeightToNumeric: (weight: string | number) => number;

  /**
   * Convert font weight to string
   */
  convertFontWeightToString: (weight: number) => string;

  /**
   * Normalize font weight
   */
  normalizeFontWeight: (weight: string | number) => number;

  /**
   * Get typography preset
   * @param preset Preset type
   * @param color Optional text color to apply
   * @returns Typography preset object
   */
  getPreset: (
    preset: 'heading' | 'body' | 'caption' | 'label' | 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6' | 'title' | 'subtitle',
    color?: string
  ) => TypographyPreset;

  /**
   * Get scaled typography preset (with font scale applied)
   * @param preset Preset type
   * @param customScale Optional custom font scale
   * @param color Optional text color to apply
   */
  getScaledPreset: (
    preset: 'heading' | 'body' | 'caption' | 'label' | 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6' | 'title' | 'subtitle',
    customScale?: number,
    color?: string
  ) => TypographyPreset;
}

/**
 * Global hook for typography calculations
 */
export function useTypography(): UseTypographyReturn {
  const [fontScale, setFontScale] = useState(() => typographyService.getFontScale());
  const [screenWidth, setScreenWidth] = useState(() => typographyService.getScreenWidth());

  useEffect(() => {
    // Subscribe to font scale changes
    const unsubscribe = typographyService.subscribe((newFontScale) => {
      setFontScale(newFontScale);
      setScreenWidth(typographyService.getScreenWidth());
    });

    return () => {
      unsubscribe();
    };
  }, []);

  const scaleFontSize = useCallback((baseSize: number, customScale?: number) => {
    return typographyService.scaleFontSize(baseSize, customScale);
  }, []);

  const scaleFontSizeByScreen = useCallback((baseSize: number, designWidth?: number) => {
    return typographyService.scaleFontSizeByScreen(baseSize, designWidth);
  }, []);

  const calculateAccessibleFontSize = useCallback((
    baseSize: number,
    customScale?: number,
    min: number = 12,
    max: number = 48
  ) => {
    return typographyService.calculateAccessibleFontSize(baseSize, customScale, min, max);
  }, []);

  const calculateLineHeight = useCallback((fontSize: number, multiplier: number = 1.5) => {
    return typographyService.calculateLineHeight(fontSize, multiplier);
  }, []);

  const calculateTightLineHeight = useCallback((fontSize: number) => {
    return typographyService.calculateTightLineHeight(fontSize);
  }, []);

  const calculateNormalLineHeight = useCallback((fontSize: number) => {
    return typographyService.calculateNormalLineHeight(fontSize);
  }, []);

  const calculateRelaxedLineHeight = useCallback((fontSize: number) => {
    return typographyService.calculateRelaxedLineHeight(fontSize);
  }, []);

  const calculateLetterSpacing = useCallback((fontSize: number, tracking: number) => {
    return typographyService.calculateLetterSpacing(fontSize, tracking);
  }, []);

  const convertFontWeightToNumeric = useCallback((weight: string | number) => {
    return typographyService.convertFontWeightToNumeric(weight);
  }, []);

  const convertFontWeightToString = useCallback((weight: number) => {
    return typographyService.convertFontWeightToString(weight);
  }, []);

  const normalizeFontWeight = useCallback((weight: string | number) => {
    return typographyService.normalizeFontWeight(weight);
  }, []);

  const getPreset = useCallback((
    preset: 'heading' | 'body' | 'caption' | 'label' | 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6' | 'title' | 'subtitle',
    color?: string
  ) => {
    return typographyService.getPreset(preset, color);
  }, []);

  const getScaledPreset = useCallback((
    preset: 'heading' | 'body' | 'caption' | 'label' | 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6' | 'title' | 'subtitle',
    customScale?: number,
    color?: string
  ) => {
    return typographyService.getScaledPreset(preset, customScale, color);
  }, []);

  return {
    fontScale,
    screenWidth,
    scaleFontSize,
    scaleFontSizeByScreen,
    calculateAccessibleFontSize,
    calculateLineHeight,
    calculateTightLineHeight,
    calculateNormalLineHeight,
    calculateRelaxedLineHeight,
    calculateLetterSpacing,
    convertFontWeightToNumeric,
    convertFontWeightToString,
    normalizeFontWeight,
    getPreset,
    getScaledPreset,
  };
}

