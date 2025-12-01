/**
 * Typography Service
 * 
 * Centralized service for managing typography calculations and font scaling.
 * Provides reactive typography utilities with device font scale support.
 * Follows the singleton pattern for global access.
 * 
 * Features:
 * - Font scaling with system font scale
 * - Typography preset management
 * - Line height calculations
 * - Letter spacing calculations
 * - Font weight conversions
 * - Typography configuration storage
 * - Observer pattern for font scale changes
 * 
 * @example
 * ```typescript
 * import { typographyService } from '@/src/shared/services/typography-service';
 * 
 * // Scale font size
 * const scaledSize = typographyService.scaleFontSize(16, 1.2);
 * 
 * // Calculate line height
 * const lineHeight = typographyService.calculateLineHeight(16);
 * 
 * // Get typography preset
 * const headingStyle = typographyService.getPreset('heading');
 * ```
 */

import * as TypographyHelpers from 'masterfabric-expo-core';
import { Dimensions } from 'react-native';

export interface TypographyConfig {
  baseFontSize: number;
  fontScale: number;
  designWidth: number;
  screenWidth: number;
}

export interface TypographyPreset {
  fontSize: number;
  lineHeight: number;
  letterSpacing: number;
  fontWeight: number | string;
  fontStyle: 'normal' | 'italic';
  color?: string;
}

type FontScaleListener = (fontScale: number) => void;

/**
 * TypographyService - Singleton service for managing typography calculations
 */
class TypographyService {
  private static instance: TypographyService;
  private listeners: Set<FontScaleListener> = new Set();
  private config: TypographyConfig;
  private dimensionSubscription: ReturnType<typeof Dimensions.addEventListener> | null = null;

  /**
   * Get singleton instance
   */
  static getInstance(): TypographyService {
    if (!TypographyService.instance) {
      TypographyService.instance = new TypographyService();
    }
    return TypographyService.instance;
  }

  private constructor() {
    const screen = Dimensions.get('screen');
    this.config = {
      baseFontSize: 16,
      fontScale: screen.fontScale || 1.0,
      designWidth: 375, // iPhone X design width
      screenWidth: screen.width,
    };

    // Listen to dimension changes
    this.dimensionSubscription = Dimensions.addEventListener('change', ({ screen }) => {
      const oldFontScale = this.config.fontScale;
      this.config.fontScale = screen.fontScale || 1.0;
      this.config.screenWidth = screen.width;

      // Notify listeners if font scale changed
      if (oldFontScale !== this.config.fontScale) {
        this.notifyListeners();
      }
    });
  }

  /**
   * Get current typography configuration
   */
  getConfig(): TypographyConfig {
    return { ...this.config };
  }

  /**
   * Update typography configuration
   */
  updateConfig(updates: Partial<TypographyConfig>): void {
    this.config = { ...this.config, ...updates };
    this.notifyListeners();
  }

  /**
   * Get current font scale
   */
  getFontScale(): number {
    return this.config.fontScale;
  }

  /**
   * Get current screen width
   */
  getScreenWidth(): number {
    return this.config.screenWidth;
  }

  /**
   * Scale font size based on system font scale
   * @param baseSize Base font size in pixels
   * @param customScale Optional custom font scale (defaults to system font scale)
   * @returns Scaled font size
   */
  scaleFontSize(baseSize: number, customScale?: number): number {
    const scale = customScale ?? this.config.fontScale;
    return TypographyHelpers.scaleFontSize(baseSize, scale);
  }

  /**
   * Scale font size based on screen width
   * @param baseSize Base font size in pixels
   * @param designWidth Design width the font was designed for (defaults to config)
   * @param screenWidth Current screen width (defaults to config)
   * @returns Scaled font size
   */
  scaleFontSizeByScreen(
    baseSize: number,
    designWidth?: number,
    screenWidth?: number
  ): number {
    return TypographyHelpers.scaleFontSizeByScreen(
      baseSize,
      designWidth ?? this.config.designWidth,
      screenWidth ?? this.config.screenWidth
    );
  }

  /**
   * Calculate accessible font size with limits
   * @param baseSize Base font size
   * @param customScale Optional custom font scale
   * @param min Minimum font size (default: 12)
   * @param max Maximum font size (default: 48)
   * @returns Accessible font size within bounds
   */
  calculateAccessibleFontSize(
    baseSize: number,
    customScale?: number,
    min: number = 12,
    max: number = 48
  ): number {
    const scale = customScale ?? this.config.fontScale;
    return TypographyHelpers.calculateAccessibleFontSize(baseSize, scale, min, max);
  }

  /**
   * Calculate line height
   * @param fontSize Font size in pixels
   * @param multiplier Line height multiplier (default: 1.5)
   * @returns Calculated line height
   */
  calculateLineHeight(fontSize: number, multiplier: number = 1.5): number {
    return TypographyHelpers.calculateLineHeight(fontSize, multiplier);
  }

  /**
   * Calculate tight line height (1.2x)
   */
  calculateTightLineHeight(fontSize: number): number {
    return TypographyHelpers.calculateTightLineHeight(fontSize);
  }

  /**
   * Calculate normal line height (1.5x)
   */
  calculateNormalLineHeight(fontSize: number): number {
    return TypographyHelpers.calculateNormalLineHeight(fontSize);
  }

  /**
   * Calculate relaxed line height (1.8x)
   */
  calculateRelaxedLineHeight(fontSize: number): number {
    return TypographyHelpers.calculateRelaxedLineHeight(fontSize);
  }

  /**
   * Calculate letter spacing
   * @param fontSize Font size in pixels
   * @param tracking Tracking value (typically -50 to 200)
   * @returns Letter spacing in pixels
   */
  calculateLetterSpacing(fontSize: number, tracking: number): number {
    return TypographyHelpers.calculateLetterSpacing(fontSize, tracking);
  }

  /**
   * Convert font weight to numeric
   */
  convertFontWeightToNumeric(weight: string | number): number {
    return TypographyHelpers.convertFontWeightToNumeric(weight);
  }

  /**
   * Convert font weight to string
   */
  convertFontWeightToString(weight: number): string {
    return TypographyHelpers.convertFontWeightToString(weight);
  }

  /**
   * Normalize font weight
   */
  normalizeFontWeight(weight: string | number): number {
    return TypographyHelpers.normalizeFontWeight(weight);
  }

  /**
   * Get typography preset
   * @param preset Preset type
   * @param color Optional text color to apply
   * @returns Typography preset object
   */
  getPreset(
    preset: 'heading' | 'body' | 'caption' | 'label' | 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6' | 'title' | 'subtitle',
    color?: string
  ): TypographyPreset {
    const style = TypographyHelpers.applyTypographyPreset(preset, color);
    return {
      fontSize: style.fontSize || 16,
      lineHeight: style.lineHeight || 24,
      letterSpacing: style.letterSpacing || 0,
      fontWeight: style.fontWeight || 400,
      fontStyle: style.fontStyle || 'normal',
      color: style.color,
    };
  }

  /**
   * Get scaled typography preset (with font scale applied)
   * @param preset Preset type
   * @param customScale Optional custom font scale (defaults to system font scale)
   * @param color Optional text color to apply
   * @returns Typography preset object with scaled font size
   */
  getScaledPreset(
    preset: 'heading' | 'body' | 'caption' | 'label' | 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6' | 'title' | 'subtitle',
    customScale?: number,
    color?: string
  ): TypographyPreset {
    const basePreset = this.getPreset(preset, color);
    const scale = customScale ?? this.config.fontScale;
    
    return {
      ...basePreset,
      fontSize: TypographyHelpers.scaleFontSize(basePreset.fontSize, scale),
      lineHeight: TypographyHelpers.calculateLineHeight(
        TypographyHelpers.scaleFontSize(basePreset.fontSize, scale),
        basePreset.lineHeight / basePreset.fontSize
      ),
    };
  }

  /**
   * Subscribe to font scale changes
   * @param listener Function to call when font scale changes
   * @returns Unsubscribe function
   */
  subscribe(listener: FontScaleListener): () => void {
    this.listeners.add(listener);
    // Immediately notify with current font scale
    listener(this.config.fontScale);
    
    return () => {
      this.listeners.delete(listener);
    };
  }

  /**
   * Notify all listeners of font scale change
   */
  private notifyListeners(): void {
    this.listeners.forEach(listener => listener(this.config.fontScale));
  }

  /**
   * Cleanup: Remove dimension listener
   */
  destroy(): void {
    if (this.dimensionSubscription) {
      this.dimensionSubscription.remove();
      this.dimensionSubscription = null;
    }
    this.listeners.clear();
  }
}

// Export singleton instance
export const typographyService = TypographyService.getInstance();

// Export class for testing
export { TypographyService };

