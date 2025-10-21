import React from 'react';
import { AccessibilityInfo, Platform } from 'react-native';

/**
 * Accessibility utilities for MasterView
 */

export interface AccessibilityConfig {
  isScreenReaderEnabled: boolean;
  isReduceMotionEnabled: boolean;
  isBoldTextEnabled: boolean;
  isGrayscaleEnabled: boolean;
  isInvertColorsEnabled: boolean;
  isReduceTransparencyEnabled: boolean;
  preferredContentSizeCategory?: string;
}

/**
 * Check if screen reader is enabled
 */
export async function isScreenReaderEnabled(): Promise<boolean> {
  try {
    return await AccessibilityInfo.isScreenReaderEnabled();
  } catch (error) {
    console.warn('Failed to check screen reader status:', error);
    return false;
  }
}

/**
 * Check if reduce motion is enabled
 */
export async function isReduceMotionEnabled(): Promise<boolean> {
  try {
    return await AccessibilityInfo.isReduceMotionEnabled();
  } catch (error) {
    console.warn('Failed to check reduce motion status:', error);
    return false;
  }
}

/**
 * Check if bold text is enabled
 */
export async function isBoldTextEnabled(): Promise<boolean> {
  try {
    return await AccessibilityInfo.isBoldTextEnabled();
  } catch (error) {
    console.warn('Failed to check bold text status:', error);
    return false;
  }
}

/**
 * Check if grayscale is enabled
 */
export async function isGrayscaleEnabled(): Promise<boolean> {
  try {
    return await AccessibilityInfo.isGrayscaleEnabled();
  } catch (error) {
    console.warn('Failed to check grayscale status:', error);
    return false;
  }
}

/**
 * Check if invert colors is enabled
 */
export async function isInvertColorsEnabled(): Promise<boolean> {
  try {
    return await AccessibilityInfo.isInvertColorsEnabled();
  } catch (error) {
    console.warn('Failed to check invert colors status:', error);
    return false;
  }
}

/**
 * Check if reduce transparency is enabled
 */
export async function isReduceTransparencyEnabled(): Promise<boolean> {
  try {
    return await AccessibilityInfo.isReduceTransparencyEnabled();
  } catch (error) {
    console.warn('Failed to check reduce transparency status:', error);
    return false;
  }
}

/**
 * Get all accessibility settings
 */
export async function getAccessibilityConfig(): Promise<AccessibilityConfig> {
  try {
    const [
      screenReaderEnabled,
      reduceMotionEnabled,
      boldTextEnabled,
      grayscaleEnabled,
      invertColorsEnabled,
      reduceTransparencyEnabled,
    ] = await Promise.all([
      isScreenReaderEnabled(),
      isReduceMotionEnabled(),
      isBoldTextEnabled(),
      isGrayscaleEnabled(),
      isInvertColorsEnabled(),
      isReduceTransparencyEnabled(),
    ]);

    return {
      isScreenReaderEnabled: screenReaderEnabled,
      isReduceMotionEnabled: reduceMotionEnabled,
      isBoldTextEnabled: boldTextEnabled,
      isGrayscaleEnabled: grayscaleEnabled,
      isInvertColorsEnabled: invertColorsEnabled,
      isReduceTransparencyEnabled: reduceTransparencyEnabled,
    };
  } catch (error) {
    console.warn('Failed to get accessibility config:', error);
    return {
      isScreenReaderEnabled: false,
      isReduceMotionEnabled: false,
      isBoldTextEnabled: false,
      isGrayscaleEnabled: false,
      isInvertColorsEnabled: false,
      isReduceTransparencyEnabled: false,
    };
  }
}

/**
 * Announce message to screen readers
 */
export function announceForAccessibility(message: string): void {
  if (Platform.OS === 'ios') {
    AccessibilityInfo.announceForAccessibility(message);
  }
}

/**
 * Set accessibility focus
 */
export function setAccessibilityFocus(reactTag: number): void {
  AccessibilityInfo.setAccessibilityFocus(reactTag);
}

/**
 * Get accessibility size category (iOS only)
 */
export async function getAccessibilitySizeCategory(): Promise<string | null> {
  if (Platform.OS !== 'ios') {
    return null;
  }

  try {
    // This would need to be implemented with react-native-accessibility-info
    // For now, return a default value
    return 'medium';
  } catch (error) {
    console.warn('Failed to get accessibility size category:', error);
    return null;
  }
}

/**
 * Check if high contrast is enabled
 */
export async function isHighContrastEnabled(): Promise<boolean> {
  try {
    // This is platform-specific and may need additional libraries
    // For now, return false
    return false;
  } catch (error) {
    console.warn('Failed to check high contrast status:', error);
    return false;
  }
}

/**
 * Accessibility-friendly animation duration
 */
export function getAccessibilityAnimationDuration(
  defaultDuration: number = 300,
  config?: AccessibilityConfig
): number {
  if (config?.isReduceMotionEnabled) {
    return 0; // Disable animations for reduced motion
  }
  return defaultDuration;
}

/**
 * Get accessibility-friendly font size
 */
export function getAccessibilityFontSize(
  baseFontSize: number,
  sizeCategory?: string
): number {
  if (!sizeCategory) {
    return baseFontSize;
  }

  const sizeMultipliers: Record<string, number> = {
    'extra-small': 0.8,
    'small': 0.9,
    'medium': 1.0,
    'large': 1.1,
    'extra-large': 1.2,
    'extra-extra-large': 1.3,
    'extra-extra-extra-large': 1.4,
  };

  const multiplier = sizeMultipliers[sizeCategory] || 1.0;
  return Math.round(baseFontSize * multiplier);
}

/**
 * Accessibility helper hook for React components
 */
export function useAccessibility() {
  const [config, setConfig] = React.useState<AccessibilityConfig | null>(null);

  React.useEffect(() => {
    let mounted = true;

    const loadConfig = async () => {
      try {
        const accessibilityConfig = await getAccessibilityConfig();
        if (mounted) {
          setConfig(accessibilityConfig);
        }
      } catch (error) {
        console.warn('Failed to load accessibility config:', error);
      }
    };

    loadConfig();

    return () => {
      mounted = false;
    };
  }, []);

  const announce = (message: string) => {
    announceForAccessibility(message);
  };

  const setFocus = (reactTag: number) => {
    setAccessibilityFocus(reactTag);
  };

  const getAnimationDuration = (defaultDuration?: number) => {
    return getAccessibilityAnimationDuration(defaultDuration, config || undefined);
  };

  const getFontSize = (baseFontSize: number, sizeCategory?: string) => {
    return getAccessibilityFontSize(baseFontSize, sizeCategory);
  };

  return {
    config,
    announce,
    setFocus,
    getAnimationDuration,
    getFontSize,
    isScreenReaderEnabled: config?.isScreenReaderEnabled || false,
    isReduceMotionEnabled: config?.isReduceMotionEnabled || false,
    isBoldTextEnabled: config?.isBoldTextEnabled || false,
    isGrayscaleEnabled: config?.isGrayscaleEnabled || false,
    isInvertColorsEnabled: config?.isInvertColorsEnabled || false,
    isReduceTransparencyEnabled: config?.isReduceTransparencyEnabled || false,
  };
}
