/**
 * UI Size Helper
 *
 * Provides a rich set of utilities around the `Sizing` system:
 * - Responsive helpers (phone / tablet / desktop)
 * - Spacing, padding, margin, grid and touch–target calculations
 * - Introspection helpers to list all sizing tokens (used by the UI Size Helper screen)
 *
 * The examples below show **practical usage patterns** you would typically have
 * in screens and components.
 *
 * @example
 * ```typescript
 * import { uiSizeHelper, Sizing } from 'masterfabric-expo-core';
 *
 * //
 * // 1. Responsive spacing for a screen container
 * //
 *
 * // Automatically picks the right value based on current device width
 * const containerPadding = uiSizeHelper.getResponsiveSpacingAuto({
 *   phone: Sizing.padding.l,
 *   tablet: Sizing.padding.xl,
 *   desktop: Sizing.padding.xxl,
 * });
 *
 * // Same logic, but with an explicit width (e.g. from Dimensions)
 * const width = uiSizeHelper.getScreenWidth();
 * const containerPaddingManual = uiSizeHelper.getResponsiveSpacing(width, {
 *   phone: Sizing.padding.m,
 *   tablet: Sizing.padding.l,
 *   desktop: Sizing.padding.xl,
 * });
 *
 * //
 * // 2. Device–type & grid usage
 * //
 *
 * const deviceType = uiSizeHelper.getDeviceTypeAuto(); // 'phone' | 'tablet' | 'desktop'
 * const columns = uiSizeHelper.getGridColumnsAuto();   // e.g. 4 / 8 / 12
 *
 * // You can branch your layout according to device type:
 * const cardWidth =
 *   deviceType === 'phone'
 *     ? Sizing.card.width.small
 *     : deviceType === 'tablet'
 *     ? Sizing.card.width.medium
 *     : Sizing.card.width.large;
 *
 * //
 * // 3. Working with base unit & spacing tokens
 * //
 *
 * // Base unit of the 8pt grid system
 * const baseUnit = uiSizeHelper.getBaseUnit(); // e.g. 8
 *
 * // Calculate a custom spacing on the fly (3 * baseUnit)
 * const customSpacing = uiSizeHelper.calculateSpacing(3); // 24px
 *
 * // Or use named spacing tokens directly
 * const gapM = uiSizeHelper.getSpacing('m'); // Sizing.spacing.m
 *
 * //
 * // 4. Introspection helpers (used by the UI Size Helper screen)
 * //
 *
 * // You can list all spacing values to build a viewer/debug screen:
 * const allSpacings = uiSizeHelper.getAllSpacings();
 * // -> [{ size: 'xxs', value: 2, category: 'spacing' }, ...]
 *
 * const allButtonHeights = uiSizeHelper.getAllButtonHeights();
 * // -> [{ size: 'small', value: 32, category: 'button.height' }, ...]
 * ```
 */

import { Dimensions } from 'react-native';
import { Sizing } from '../constants/Sizing';
import type { MarginSize, PaddingSize, SpacingSize } from '../types/sizing';
import { getBasicDeviceInfo } from './device-info';

export interface ResponsiveSpacingOptions {
  phone: number | string;
  tablet?: number | string;
  desktop?: number | string;
}

export interface SizeInfo {
  value: number | string;
  size: string;
  category: string;
}

/**
 * UI Size Helper class providing utilities for sizing operations
 */
class UISizeHelper {
  /**
   * Gets a spacing value by size key
   * @param size - The spacing size key
   * @returns The spacing value in pixels
   */
  getSpacing(size: SpacingSize): number {
    return Sizing.spacing[size];
  }

  /**
   * Gets a padding value by size key
   * @param size - The padding size key
   * @returns The padding value in pixels
   */
  getPadding(size: PaddingSize): number {
    return Sizing.padding[size];
  }

  /**
   * Gets a margin value by size key
   * @param size - The margin size key
   * @returns The margin value in pixels
   */
  getMargin(size: MarginSize): number {
    return Sizing.margin[size];
  }

  /**
   * Gets a gap value by size key
   * @param size - The gap size key
   * @returns The gap value in pixels
   */
  getGap(size: 'xxs' | 'xs' | 's' | 'm' | 'l' | 'xl' | 'xxl' | 'xxxl'): number {
    return Sizing.gap[size];
  }

  /**
   * Gets a padding start value by size key (RTL aware)
   * @param size - The padding start size key
   * @returns The padding start value in pixels
   */
  getPaddingStart(size: 'xxs' | 'xs' | 's' | 'm' | 'l' | 'xl' | 'xxl' | 'xxxl'): number {
    return Sizing.paddingStart[size];
  }

  /**
   * Gets a padding end value by size key (RTL aware)
   * @param size - The padding end size key
   * @returns The padding end value in pixels
   */
  getPaddingEnd(size: 'xxs' | 'xs' | 's' | 'm' | 'l' | 'xl' | 'xxl' | 'xxxl'): number {
    return Sizing.paddingEnd[size];
  }

  /**
   * Gets a padding top value by size key
   * @param size - The padding top size key
   * @returns The padding top value in pixels
   */
  getPaddingTop(size: 'xxs' | 'xs' | 's' | 'm' | 'l' | 'xl' | 'xxl' | 'xxxl'): number {
    return Sizing.paddingTop[size];
  }

  /**
   * Gets a padding bottom value by size key
   * @param size - The padding bottom size key
   * @returns The padding bottom value in pixels
   */
  getPaddingBottom(size: 'xxs' | 'xs' | 's' | 'm' | 'l' | 'xl' | 'xxl' | 'xxxl'): number {
    return Sizing.paddingBottom[size];
  }

  /**
   * Gets a padding left value by size key
   * @param size - The padding left size key
   * @returns The padding left value in pixels
   */
  getPaddingLeft(size: 'xxs' | 'xs' | 's' | 'm' | 'l' | 'xl' | 'xxl' | 'xxxl'): number {
    return Sizing.paddingLeft[size];
  }

  /**
   * Gets a padding right value by size key
   * @param size - The padding right size key
   * @returns The padding right value in pixels
   */
  getPaddingRight(size: 'xxs' | 'xs' | 's' | 'm' | 'l' | 'xl' | 'xxl' | 'xxxl'): number {
    return Sizing.paddingRight[size];
  }

  /**
   * Gets a margin start value by size key (RTL aware)
   * @param size - The margin start size key
   * @returns The margin start value in pixels
   */
  getMarginStart(size: 'xxs' | 'xs' | 's' | 'm' | 'l' | 'xl' | 'xxl' | 'xxxl'): number {
    return Sizing.marginStart[size];
  }

  /**
   * Gets a margin end value by size key (RTL aware)
   * @param size - The margin end size key
   * @returns The margin end value in pixels
   */
  getMarginEnd(size: 'xxs' | 'xs' | 's' | 'm' | 'l' | 'xl' | 'xxl' | 'xxxl'): number {
    return Sizing.marginEnd[size];
  }

  /**
   * Gets a margin top value by size key
   * @param size - The margin top size key
   * @returns The margin top value in pixels
   */
  getMarginTop(size: 'xxs' | 'xs' | 's' | 'm' | 'l' | 'xl' | 'xxl' | 'xxxl'): number {
    return Sizing.marginTop[size];
  }

  /**
   * Gets a margin bottom value by size key
   * @param size - The margin bottom size key
   * @returns The margin bottom value in pixels
   */
  getMarginBottom(size: 'xxs' | 'xs' | 's' | 'm' | 'l' | 'xl' | 'xxl' | 'xxxl'): number {
    return Sizing.marginBottom[size];
  }

  /**
   * Gets a margin left value by size key
   * @param size - The margin left size key
   * @returns The margin left value in pixels
   */
  getMarginLeft(size: 'xxs' | 'xs' | 's' | 'm' | 'l' | 'xl' | 'xxl' | 'xxxl'): number {
    return Sizing.marginLeft[size];
  }

  /**
   * Gets a margin right value by size key
   * @param size - The margin right size key
   * @returns The margin right value in pixels
   */
  getMarginRight(size: 'xxs' | 'xs' | 's' | 'm' | 'l' | 'xl' | 'xxl' | 'xxxl'): number {
    return Sizing.marginRight[size];
  }

  /**
   * Gets a row gap value by size key
   * @param size - The row gap size key
   * @returns The row gap value in pixels
   */
  getRowGap(size: 'xxs' | 'xs' | 's' | 'm' | 'l' | 'xl' | 'xxl' | 'xxxl'): number {
    return Sizing.rowGap[size];
  }

  /**
   * Gets a column gap value by size key
   * @param size - The column gap size key
   * @returns The column gap value in pixels
   */
  getColumnGap(size: 'xxs' | 'xs' | 's' | 'm' | 'l' | 'xl' | 'xxl' | 'xxxl'): number {
    return Sizing.columnGap[size];
  }

  /**
   * Gets a scroll padding value by size key
   * @param size - The scroll padding size key
   * @returns The scroll padding value in pixels
   */
  getScrollPadding(size: 'xxs' | 'xs' | 's' | 'm' | 'l' | 'xl' | 'xxl'): number {
    return Sizing.scroll.padding[size];
  }

  /**
   * Gets a scroll margin value by size key
   * @param size - The scroll margin size key
   * @returns The scroll margin value in pixels
   */
  getScrollMargin(size: 'xxs' | 'xs' | 's' | 'm' | 'l' | 'xl' | 'xxl'): number {
    return Sizing.scroll.margin[size];
  }

  /**
   * Gets a border radius value by size key
   * @param size - The border radius size key
   * @returns The border radius value in pixels
   */
  getBorderRadius(size: 'small' | 'large'): number {
    return Sizing.borderRadius[size];
  }

  /**
   * Gets a border width value by size key
   * @param size - The border width size key
   * @returns The border width value in pixels
   */
  getBorderWidth(size: 'none' | 'hairline' | 's' | 'm' | 'l' | 'xl' | 'xxl'): number {
    return Sizing.borderWidth[size];
  }

  /**
   * Gets a button height value by size key
   * @param size - The button height size key
   * @returns The button height value in pixels
   */
  getButtonHeight(size: 'small' | 'medium' | 'large'): number {
    return Sizing.button.height[size];
  }

  /**
   * Gets an input height value by size key
   * @param size - The input height size key
   * @returns The input height value in pixels
   */
  getInputHeight(size: 'small' | 'medium' | 'large'): number {
    return Sizing.input.height[size];
  }

  /**
   * Gets a card padding value by size key
   * @param size - The card padding size key
   * @returns The card padding value in pixels
   */
  getCardPadding(size: 'xxs' | 'xs' | 'small' | 'medium' | 'large' | 'xl' | 'xxl'): number {
    return Sizing.card.padding[size];
  }

  /**
   * Gets responsive spacing based on screen width
   * @param width - Current screen width
   * @param options - Spacing options for different breakpoints
   * @returns The appropriate spacing value
   */
  getResponsiveSpacing(
    width: number,
    options: ResponsiveSpacingOptions
  ): number | string {
    if (width >= Sizing.breakpoints.desktop.small && options.desktop !== undefined) {
      return options.desktop;
    }
    if (width >= Sizing.breakpoints.tablet.small && options.tablet !== undefined) {
      return options.tablet;
    }
    return options.phone;
  }

  /**
   * Gets responsive spacing automatically using device info helper
   * @param options - Spacing options for different breakpoints
   * @returns The appropriate spacing value
   */
  getResponsiveSpacingAuto(
    options: ResponsiveSpacingOptions
  ): number | string {
    const deviceInfo = getBasicDeviceInfo();
    const width = deviceInfo.screenWidth || Dimensions.get('window').width;
    return this.getResponsiveSpacing(width, options);
  }

  /**
   * Gets current screen width from device info
   * @returns Screen width in pixels
   */
  getScreenWidth(): number {
    const deviceInfo = getBasicDeviceInfo();
    return deviceInfo.screenWidth || Dimensions.get('window').width;
  }

  /**
   * Gets current screen height from device info
   * @returns Screen height in pixels
   */
  getScreenHeight(): number {
    const deviceInfo = getBasicDeviceInfo();
    return deviceInfo.screenHeight || Dimensions.get('window').height;
  }

  /**
   * Checks if the given width is a phone breakpoint
   * @param width - Screen width
   * @returns True if width is in phone range
   */
  isPhone(width: number): boolean {
    return width < Sizing.breakpoints.tablet.small;
  }

  /**
   * Checks if the given width is a tablet breakpoint
   * @param width - Screen width
   * @returns True if width is in tablet range
   */
  isTablet(width: number): boolean {
    return (
      width >= Sizing.breakpoints.tablet.small &&
      width < Sizing.breakpoints.desktop.small
    );
  }

  /**
   * Checks if the given width is a desktop breakpoint
   * @param width - Screen width
   * @returns True if width is in desktop range
   */
  isDesktop(width: number): boolean {
    return width >= Sizing.breakpoints.desktop.small;
  }

  /**
   * Checks if current device is a phone (uses device info helper)
   * @returns True if device is a phone
   */
  isPhoneAuto(): boolean {
    const width = this.getScreenWidth();
    return this.isPhone(width);
  }

  /**
   * Checks if current device is a tablet (uses device info helper)
   * @returns True if device is a tablet
   */
  isTabletAuto(): boolean {
    const width = this.getScreenWidth();
    return this.isTablet(width);
  }

  /**
   * Checks if current device is a desktop (uses device info helper)
   * @returns True if device is a desktop
   */
  isDesktopAuto(): boolean {
    const width = this.getScreenWidth();
    return this.isDesktop(width);
  }

  /**
   * Gets the device type based on width
   * @param width - Screen width
   * @returns 'phone' | 'tablet' | 'desktop'
   */
  getDeviceType(width: number): 'phone' | 'tablet' | 'desktop' {
    if (this.isDesktop(width)) return 'desktop';
    if (this.isTablet(width)) return 'tablet';
    return 'phone';
  }

  /**
   * Gets the device type automatically using device info helper
   * @returns 'phone' | 'tablet' | 'desktop'
   */
  getDeviceTypeAuto(): 'phone' | 'tablet' | 'desktop' {
    const width = this.getScreenWidth();
    return this.getDeviceType(width);
  }

  /**
   * Gets grid columns based on device type
   * @param width - Screen width
   * @returns Number of grid columns
   */
  getGridColumns(width: number): number {
    if (this.isDesktop(width)) return Sizing.grid.columns.desktop;
    if (this.isTablet(width)) return Sizing.grid.columns.tablet;
    return Sizing.grid.columns.phone;
  }

  /**
   * Gets grid columns automatically using device info helper
   * @returns Number of grid columns
   */
  getGridColumnsAuto(): number {
    const width = this.getScreenWidth();
    return this.getGridColumns(width);
  }

  /**
   * Gets all spacing values as an array
   * @returns Array of spacing size info
   */
  getAllSpacings(): SizeInfo[] {
    return Object.entries(Sizing.spacing).map(([size, value]) => ({
      value,
      size,
      category: 'spacing',
    }));
  }

  /**
   * Gets all padding values as an array
   * @returns Array of padding size info
   */
  getAllPaddings(): SizeInfo[] {
    return Object.entries(Sizing.padding).map(([size, value]) => ({
      value,
      size,
      category: 'padding',
    }));
  }

  /**
   * Gets all margin values as an array
   * @returns Array of margin size info
   */
  getAllMargins(): SizeInfo[] {
    return Object.entries(Sizing.margin).map(([size, value]) => ({
      value,
      size,
      category: 'margin',
    }));
  }

  /**
   * Gets all icon sizes as an array
   * @returns Array of icon size info
   */
  getAllIconSizes(): SizeInfo[] {
    return Object.entries(Sizing.icon).map(([size, value]) => ({
      value,
      size,
      category: 'icon',
    }));
  }

  /**
   * Gets all avatar sizes as an array
   * @returns Array of avatar size info
   */
  getAllAvatarSizes(): SizeInfo[] {
    return Object.entries(Sizing.avatar).map(([size, value]) => ({
      value,
      size,
      category: 'avatar',
    }));
  }

  /**
   * Gets all button heights as an array
   * @returns Array of button height info
   */
  getAllButtonHeights(): SizeInfo[] {
    return Object.entries(Sizing.button.height).map(([size, value]) => ({
      value,
      size,
      category: 'button.height',
    }));
  }

  /**
   * Gets all input heights as an array
   * @returns Array of input height info
   */
  getAllInputHeights(): SizeInfo[] {
    return Object.entries(Sizing.input.height).map(([size, value]) => ({
      value,
      size,
      category: 'input.height',
    }));
  }

  /**
   * Gets all card paddings as an array
   * @returns Array of card padding info
   */
  getAllCardPaddings(): SizeInfo[] {
    return Object.entries(Sizing.card.padding).map(([size, value]) => ({
      value,
      size,
      category: 'card.padding',
    }));
  }

  /**
   * Gets all border radius values as an array
   * @returns Array of border radius info
   */
  getAllBorderRadiuses(): SizeInfo[] {
    return Object.entries(Sizing.borderRadius).map(([size, value]) => ({
      value,
      size,
      category: 'borderRadius',
    }));
  }

  /**
   * Gets all border width values as an array
   * @returns Array of border width info
   */
  getAllBorderWidths(): SizeInfo[] {
    return Object.entries(Sizing.borderWidth).map(([size, value]) => ({
      value: typeof value === 'number' ? value : 'hairline',
      size,
      category: 'borderWidth',
    }));
  }

  /**
   * Gets all z-index values as an array
   * @returns Array of z-index info
   */
  getAllZIndexes(): SizeInfo[] {
    return Object.entries(Sizing.zIndex).map(([size, value]) => ({
      value,
      size,
      category: 'zIndex',
    }));
  }

  /**
   * Gets all gap values as an array
   * @returns Array of gap size info
   */
  getAllGaps(): SizeInfo[] {
    return Object.entries(Sizing.gap).map(([size, value]) => ({
      value,
      size,
      category: 'gap',
    }));
  }

  /**
   * Gets all width values as an array
   * @returns Array of width size info
   */
  getAllWidths(): SizeInfo[] {
    return Object.entries(Sizing.width).map(([size, value]) => ({
      value,
      size,
      category: 'width',
    }));
  }

  /**
   * Gets all height values as an array
   * @returns Array of height size info
   */
  getAllHeights(): SizeInfo[] {
    return Object.entries(Sizing.height).map(([size, value]) => ({
      value,
      size,
      category: 'height',
    }));
  }

  /**
   * Gets all min width values as an array
   * @returns Array of min width size info
   */
  getAllMinWidths(): SizeInfo[] {
    return Object.entries(Sizing.minWidth).map(([size, value]) => ({
      value,
      size,
      category: 'minWidth',
    }));
  }

  /**
   * Gets all max width values as an array
   * @returns Array of max width size info
   */
  getAllMaxWidths(): SizeInfo[] {
    return Object.entries(Sizing.maxWidth).map(([size, value]) => ({
      value,
      size,
      category: 'maxWidth',
    }));
  }

  /**
   * Gets all min height values as an array
   * @returns Array of min height size info
   */
  getAllMinHeights(): SizeInfo[] {
    return Object.entries(Sizing.minHeight).map(([size, value]) => ({
      value,
      size,
      category: 'minHeight',
    }));
  }

  /**
   * Gets all max height values as an array
   * @returns Array of max height size info
   */
  getAllMaxHeights(): SizeInfo[] {
    return Object.entries(Sizing.maxHeight).map(([size, value]) => ({
      value,
      size,
      category: 'maxHeight',
    }));
  }

  /**
   * Gets all button widths as an array
   * @returns Array of button width info
   */
  getAllButtonWidths(): SizeInfo[] {
    return Object.entries(Sizing.button.width).map(([size, value]) => ({
      value,
      size,
      category: 'button.width',
    }));
  }

  /**
   * Gets all button paddings (horizontal) as an array
   * @returns Array of button padding horizontal info
   */
  getAllButtonPaddingHorizontal(): SizeInfo[] {
    return Object.entries(Sizing.button.padding.horizontal).map(([size, value]) => ({
      value,
      size,
      category: 'button.padding.horizontal',
    }));
  }

  /**
   * Gets all button paddings (vertical) as an array
   * @returns Array of button padding vertical info
   */
  getAllButtonPaddingVertical(): SizeInfo[] {
    return Object.entries(Sizing.button.padding.vertical).map(([size, value]) => ({
      value,
      size,
      category: 'button.padding.vertical',
    }));
  }

  /**
   * Gets all button border radiuses as an array
   * @returns Array of button border radius info
   */
  getAllButtonBorderRadiuses(): SizeInfo[] {
    return Object.entries(Sizing.button.borderRadius).map(([size, value]) => ({
      value: typeof value === 'number' ? value : 'round',
      size,
      category: 'button.borderRadius',
    }));
  }

  /**
   * Gets all input widths as an array
   * @returns Array of input width info
   */
  getAllInputWidths(): SizeInfo[] {
    return Object.entries(Sizing.input.width).map(([size, value]) => ({
      value,
      size,
      category: 'input.width',
    }));
  }

  /**
   * Gets all input paddings (horizontal) as an array
   * @returns Array of input padding horizontal info
   */
  getAllInputPaddingHorizontal(): SizeInfo[] {
    return Object.entries(Sizing.input.padding.horizontal).map(([size, value]) => ({
      value,
      size,
      category: 'input.padding.horizontal',
    }));
  }

  /**
   * Gets all input paddings (vertical) as an array
   * @returns Array of input padding vertical info
   */
  getAllInputPaddingVertical(): SizeInfo[] {
    return Object.entries(Sizing.input.padding.vertical).map(([size, value]) => ({
      value,
      size,
      category: 'input.padding.vertical',
    }));
  }

  /**
   * Gets all input border radiuses as an array
   * @returns Array of input border radius info
   */
  getAllInputBorderRadiuses(): SizeInfo[] {
    return Object.entries(Sizing.input.borderRadius).map(([size, value]) => ({
      value,
      size,
      category: 'input.borderRadius',
    }));
  }

  /**
   * Gets all input border widths as an array
   * @returns Array of input border width info
   */
  getAllInputBorderWidths(): SizeInfo[] {
    return Object.entries(Sizing.input.borderWidth).map(([size, value]) => ({
      value,
      size,
      category: 'input.borderWidth',
    }));
  }

  /**
   * Gets all input min heights as an array
   * @returns Array of input min height info
   */
  getAllInputMinHeights(): SizeInfo[] {
    return Object.entries(Sizing.input.minHeight).map(([size, value]) => ({
      value,
      size,
      category: 'input.minHeight',
    }));
  }

  /**
   * Gets all card border radiuses as an array
   * @returns Array of card border radius info
   */
  getAllCardBorderRadiuses(): SizeInfo[] {
    return Object.entries(Sizing.card.borderRadius).map(([size, value]) => ({
      value,
      size,
      category: 'card.borderRadius',
    }));
  }

  /**
   * Gets all card gaps as an array
   * @returns Array of card gap info
   */
  getAllCardGaps(): SizeInfo[] {
    return Object.entries(Sizing.card.gap).map(([size, value]) => ({
      value,
      size,
      category: 'card.gap',
    }));
  }

  /**
   * Gets all card widths as an array
   * @returns Array of card width info
   */
  getAllCardWidths(): SizeInfo[] {
    return Object.entries(Sizing.card.width).map(([size, value]) => ({
      value,
      size,
      category: 'card.width',
    }));
  }

  /**
   * Gets all card min heights as an array
   * @returns Array of card min height info
   */
  getAllCardMinHeights(): SizeInfo[] {
    return Object.entries(Sizing.card.minHeight).map(([size, value]) => ({
      value,
      size,
      category: 'card.minHeight',
    }));
  }

  /**
   * Gets all breakpoint values
   * @returns Object with phone, tablet, and desktop breakpoints
   */
  getAllBreakpoints() {
    return {
      phone: Sizing.breakpoints.phone,
      tablet: Sizing.breakpoints.tablet,
      desktop: Sizing.breakpoints.desktop,
    };
  }

  /**
   * Gets all touch target values as an array
   * @returns Array of touch target info
   */
  getAllTouchTargets(): SizeInfo[] {
    return Object.entries(Sizing.touchTarget).map(([size, value]) => ({
      value,
      size,
      category: 'touchTarget',
    }));
  }

  /**
   * Gets all spacer values as an array
   * @returns Array of spacer size info
   */
  getAllSpacers(): SizeInfo[] {
    return Object.entries(Sizing.spacer).map(([size, value]) => ({
      value,
      size,
      category: 'spacer',
    }));
  }

  /**
   * Gets all grid gap values as an array
   * @returns Array of grid gap info
   */
  getAllGridGaps(): SizeInfo[] {
    return Object.entries(Sizing.grid.gap).map(([size, value]) => ({
      value,
      size,
      category: 'grid.gap',
    }));
  }

  /**
   * Gets all grid column values
   * @returns Object with phone, tablet, and desktop grid columns
   */
  getAllGridColumns() {
    return Sizing.grid.columns;
  }

  /**
   * Gets all aspect ratio values as an array
   * @returns Array of aspect ratio info
   */
  getAllAspectRatios(): SizeInfo[] {
    return Object.entries(Sizing.aspectRatio).map(([size, value]) => ({
      value,
      size,
      category: 'aspectRatio',
    }));
  }

  /**
   * Gets all opacity values as an array
   * @returns Array of opacity info
   */
  getAllOpacities(): SizeInfo[] {
    return Object.entries(Sizing.opacity).map(([size, value]) => ({
      value,
      size,
      category: 'opacity',
    }));
  }

  /**
   * Gets all directional spacing values (paddingStart) as an array
   * @returns Array of paddingStart size info
   */
  getAllPaddingStarts(): SizeInfo[] {
    return Object.entries(Sizing.paddingStart).map(([size, value]) => ({
      value,
      size,
      category: 'paddingStart',
    }));
  }

  /**
   * Gets all directional spacing values (paddingEnd) as an array
   * @returns Array of paddingEnd size info
   */
  getAllPaddingEnds(): SizeInfo[] {
    return Object.entries(Sizing.paddingEnd).map(([size, value]) => ({
      value,
      size,
      category: 'paddingEnd',
    }));
  }

  /**
   * Gets all directional spacing values (marginStart) as an array
   * @returns Array of marginStart size info
   */
  getAllMarginStarts(): SizeInfo[] {
    return Object.entries(Sizing.marginStart).map(([size, value]) => ({
      value,
      size,
      category: 'marginStart',
    }));
  }

  /**
   * Gets all directional spacing values (marginEnd) as an array
   * @returns Array of marginEnd size info
   */
  getAllMarginEnds(): SizeInfo[] {
    return Object.entries(Sizing.marginEnd).map(([size, value]) => ({
      value,
      size,
      category: 'marginEnd',
    }));
  }

  /**
   * Gets all row gap values as an array
   * @returns Array of row gap size info
   */
  getAllRowGaps(): SizeInfo[] {
    return Object.entries(Sizing.rowGap).map(([size, value]) => ({
      value,
      size,
      category: 'rowGap',
    }));
  }

  /**
   * Gets all column gap values as an array
   * @returns Array of column gap size info
   */
  getAllColumnGaps(): SizeInfo[] {
    return Object.entries(Sizing.columnGap).map(([size, value]) => ({
      value,
      size,
      category: 'columnGap',
    }));
  }

  /**
   * Gets all inset values as an array
   * @returns Array of inset size info
   */
  getAllInsets(): SizeInfo[] {
    return Object.entries(Sizing.inset).map(([size, value]) => ({
      value,
      size,
      category: 'inset',
    }));
  }

  /**
   * Gets all offset values as an array
   * @returns Array of offset size info
   */
  getAllOffsets(): SizeInfo[] {
    return Object.entries(Sizing.offset).map(([size, value]) => ({
      value,
      size,
      category: 'offset',
    }));
  }

  /**
   * Gets all flex values as an array
   * @returns Array of flex info
   */
  getAllFlexes(): SizeInfo[] {
    return Object.entries(Sizing.flex).map(([size, value]) => ({
      value,
      size,
      category: 'flex',
    }));
  }

  /**
   * Gets all flex grow values as an array
   * @returns Array of flex grow info
   */
  getAllFlexGrows(): SizeInfo[] {
    return Object.entries(Sizing.flexGrow).map(([size, value]) => ({
      value,
      size,
      category: 'flexGrow',
    }));
  }

  /**
   * Gets all flex shrink values as an array
   * @returns Array of flex shrink info
   */
  getAllFlexShrinks(): SizeInfo[] {
    return Object.entries(Sizing.flexShrink).map(([size, value]) => ({
      value,
      size,
      category: 'flexShrink',
    }));
  }

  /**
   * Gets all flex basis values as an array
   * @returns Array of flex basis info
   */
  getAllFlexBases(): SizeInfo[] {
    return Object.entries(Sizing.flexBasis).map(([size, value]) => ({
      value,
      size,
      category: 'flexBasis',
    }));
  }

  /**
   * Gets all position top values as an array
   * @returns Array of position top info
   */
  getAllPositionTops(): SizeInfo[] {
    return Object.entries(Sizing.position.top).map(([size, value]) => ({
      value,
      size,
      category: 'position.top',
    }));
  }

  /**
   * Gets all position bottom values as an array
   * @returns Array of position bottom info
   */
  getAllPositionBottoms(): SizeInfo[] {
    return Object.entries(Sizing.position.bottom).map(([size, value]) => ({
      value,
      size,
      category: 'position.bottom',
    }));
  }

  /**
   * Gets all position left values as an array
   * @returns Array of position left info
   */
  getAllPositionLefts(): SizeInfo[] {
    return Object.entries(Sizing.position.left).map(([size, value]) => ({
      value,
      size,
      category: 'position.left',
    }));
  }

  /**
   * Gets all position right values as an array
   * @returns Array of position right info
   */
  getAllPositionRights(): SizeInfo[] {
    return Object.entries(Sizing.position.right).map(([size, value]) => ({
      value,
      size,
      category: 'position.right',
    }));
  }

  /**
   * Gets all hit slop values as an array
   * @returns Array of hit slop info
   */
  getAllHitSlops(): SizeInfo[] {
    return Object.entries(Sizing.hitSlop).map(([size, value]) => ({
      value,
      size,
      category: 'hitSlop',
    }));
  }

  /**
   * Gets the base unit (8pt grid system)
   * @returns The base unit value
   */
  getBaseUnit(): number {
    return Sizing.baseUnit;
  }

  /**
   * Calculates spacing based on multiplier of base unit
   * @param multiplier - Multiplier for base unit (e.g., 2 for 16px)
   * @returns Calculated spacing value
   */
  calculateSpacing(multiplier: number): number {
    return Sizing.baseUnit * multiplier;
  }

  /**
   * Gets touch target size based on platform recommendation
   * @param platform - 'ios' | 'android' | 'default'
   * @returns Recommended touch target size
   */
  getTouchTarget(platform: 'ios' | 'android' | 'default' = 'default'): number {
    if (platform === 'ios') return Sizing.touchTarget.minimum;
    if (platform === 'android') return Sizing.touchTarget.recommended;
    return Sizing.touchTarget.recommended;
  }

  /**
   * Gets all modal widths as an array
   * @returns Array of modal width info
   */
  getAllModalWidths(): SizeInfo[] {
    return Object.entries(Sizing.modal.width).map(([size, value]) => ({
      value,
      size,
      category: 'modal.width',
    }));
  }

  /**
   * Gets all modal max widths as an array
   * @returns Array of modal max width info
   */
  getAllModalMaxWidths(): SizeInfo[] {
    return Object.entries(Sizing.modal.maxWidth).map(([size, value]) => ({
      value,
      size,
      category: 'modal.maxWidth',
    }));
  }

  /**
   * Gets all modal max heights as an array
   * @returns Array of modal max height info
   */
  getAllModalMaxHeights(): SizeInfo[] {
    return Object.entries(Sizing.modal.maxHeight).map(([size, value]) => ({
      value,
      size,
      category: 'modal.maxHeight',
    }));
  }

  /**
   * Gets all modal paddings as an array
   * @returns Array of modal padding info
   */
  getAllModalPaddings(): SizeInfo[] {
    return Object.entries(Sizing.modal.padding).map(([size, value]) => ({
      value,
      size,
      category: 'modal.padding',
    }));
  }

  /**
   * Gets all modal border radiuses as an array
   * @returns Array of modal border radius info
   */
  getAllModalBorderRadiuses(): SizeInfo[] {
    return Object.entries(Sizing.modal.borderRadius).map(([size, value]) => ({
      value,
      size,
      category: 'modal.borderRadius',
    }));
  }

  /**
   * Gets all snackbar min heights as an array
   * @returns Array of snackbar min height info
   */
  getAllSnackbarMinHeights(): SizeInfo[] {
    return Object.entries(Sizing.snackbar.minHeight).map(([size, value]) => ({
      value,
      size,
      category: 'snackbar.minHeight',
    }));
  }

  /**
   * Gets all snackbar paddings (horizontal) as an array
   * @returns Array of snackbar padding horizontal info
   */
  getAllSnackbarPaddingHorizontal(): SizeInfo[] {
    return Object.entries(Sizing.snackbar.padding.horizontal).map(([size, value]) => ({
      value,
      size,
      category: 'snackbar.padding.horizontal',
    }));
  }

  /**
   * Gets all snackbar paddings (vertical) as an array
   * @returns Array of snackbar padding vertical info
   */
  getAllSnackbarPaddingVertical(): SizeInfo[] {
    return Object.entries(Sizing.snackbar.padding.vertical).map(([size, value]) => ({
      value,
      size,
      category: 'snackbar.padding.vertical',
    }));
  }

  /**
   * Gets all snackbar border radiuses as an array
   * @returns Array of snackbar border radius info
   */
  getAllSnackbarBorderRadiuses(): SizeInfo[] {
    return Object.entries(Sizing.snackbar.borderRadius).map(([size, value]) => ({
      value,
      size,
      category: 'snackbar.borderRadius',
    }));
  }

  /**
   * Gets all snackbar icon sizes as an array
   * @returns Array of snackbar icon size info
   */
  getAllSnackbarIconSizes(): SizeInfo[] {
    return Object.entries(Sizing.snackbar.iconSize).map(([size, value]) => ({
      value,
      size,
      category: 'snackbar.iconSize',
    }));
  }

  /**
   * Gets all header heights as an array
   * @returns Array of header height info
   */
  getAllHeaderHeights(): SizeInfo[] {
    return Object.entries(Sizing.header.height).map(([size, value]) => ({
      value,
      size,
      category: 'header.height',
    }));
  }

  /**
   * Gets all header paddings (horizontal) as an array
   * @returns Array of header padding horizontal info
   */
  getAllHeaderPaddingHorizontal(): SizeInfo[] {
    return Object.entries(Sizing.header.padding.horizontal).map(([size, value]) => ({
      value,
      size,
      category: 'header.padding.horizontal',
    }));
  }

  /**
   * Gets all header icon sizes as an array
   * @returns Array of header icon size info
   */
  getAllHeaderIconSizes(): SizeInfo[] {
    return Object.entries(Sizing.header.iconSize).map(([size, value]) => ({
      value,
      size,
      category: 'header.iconSize',
    }));
  }

  /**
   * Gets all list item heights as an array
   * @returns Array of list item height info
   */
  getAllListItemHeights(): SizeInfo[] {
    return Object.entries(Sizing.listItem.height).map(([size, value]) => ({
      value,
      size,
      category: 'listItem.height',
    }));
  }

  /**
   * Gets all list item icon sizes as an array
   * @returns Array of list item icon size info
   */
  getAllListItemIconSizes(): SizeInfo[] {
    return Object.entries(Sizing.listItem.iconSize).map(([size, value]) => ({
      value,
      size,
      category: 'listItem.iconSize',
    }));
  }

  /**
   * Gets all badge heights as an array
   * @returns Array of badge height info
   */
  getAllBadgeHeights(): SizeInfo[] {
    return Object.entries(Sizing.badge.height).map(([size, value]) => ({
      value,
      size,
      category: 'badge.height',
    }));
  }

  /**
   * Gets all divider heights as an array
   * @returns Array of divider height info
   */
  getAllDividerHeights(): SizeInfo[] {
    return Object.entries(Sizing.divider.height).map(([size, value]) => ({
      value: typeof value === 'number' ? value : 'hairline',
      size,
      category: 'divider.height',
    }));
  }

  /**
   * Gets all tab bar heights as an array
   * @returns Array of tab bar height info
   */
  getAllTabBarHeights(): SizeInfo[] {
    return Object.entries(Sizing.tabBar.height).map(([size, value]) => ({
      value,
      size,
      category: 'tabBar.height',
    }));
  }

  /**
   * Gets all tab bar icon sizes as an array
   * @returns Array of tab bar icon size info
   */
  getAllTabBarIconSizes(): SizeInfo[] {
    return Object.entries(Sizing.tabBar.iconSize).map(([size, value]) => ({
      value,
      size,
      category: 'tabBar.iconSize',
    }));
  }

  /**
   * Gets all parallax header heights as an array
   * @returns Array of parallax header height info
   */
  getAllParallaxHeaderHeights(): SizeInfo[] {
    return Object.entries(Sizing.parallax.headerHeight).map(([size, value]) => ({
      value,
      size,
      category: 'parallax.headerHeight',
    }));
  }

  /**
   * Gets all animation durations as an array
   * @returns Array of animation duration info
   */
  getAllAnimationDurations(): SizeInfo[] {
    return Object.entries(Sizing.animation.duration).map(([size, value]) => ({
      value,
      size,
      category: 'animation.duration',
    }));
  }

  /**
   * Gets all animation delays as an array
   * @returns Array of animation delay info
   */
  getAllAnimationDelays(): SizeInfo[] {
    return Object.entries(Sizing.animation.delay).map(([size, value]) => ({
      value,
      size,
      category: 'animation.delay',
    }));
  }

  /**
   * Gets all safe area values
   * @returns Object with top, bottom, left, right safe area values
   */
  getAllSafeAreas() {
    return Sizing.safeArea;
  }

  /**
   * Gets all screen dimension values
   * @returns Object with screen width, height, statusBarHeight, navigationBarHeight, keyboardHeight
   */
  getAllScreenDimensions() {
    return Sizing.screen;
  }

  /**
   * Gets all units values (vw, vh, percent, rem, em)
   * @returns Object with all unit types
   */
  getAllUnits() {
    return Sizing.units;
  }

  /**
   * Gets all scroll padding values as an array
   * @returns Array of scroll padding info
   */
  getAllScrollPaddings(): SizeInfo[] {
    return Object.entries(Sizing.scroll.padding).map(([size, value]) => ({
      value,
      size,
      category: 'scroll.padding',
    }));
  }

  /**
   * Gets all scroll margin values as an array
   * @returns Array of scroll margin info
   */
  getAllScrollMargins(): SizeInfo[] {
    return Object.entries(Sizing.scroll.margin).map(([size, value]) => ({
      value,
      size,
      category: 'scroll.margin',
    }));
  }

  /**
   * Gets all list item separator heights as an array
   * @returns Array of list item separator height info
   */
  getAllListItemSeparatorHeights(): SizeInfo[] {
    return Object.entries(Sizing.list.itemSeparatorHeight).map(([size, value]) => ({
      value: typeof value === 'number' ? value : 'hairline',
      size,
      category: 'list.itemSeparatorHeight',
    }));
  }

  /**
   * Gets all list section gaps as an array
   * @returns Array of list section gap info
   */
  getAllListSectionGaps(): SizeInfo[] {
    return Object.entries(Sizing.list.sectionGap).map(([size, value]) => ({
      value,
      size,
      category: 'list.sectionGap',
    }));
  }

  /**
   * Gets all sizing values in a structured format
   * @returns Complete sizing structure
   */
  getAllSizingValues() {
    return {
      baseUnit: Sizing.baseUnit,
      spacing: Sizing.spacing,
      padding: Sizing.padding,
      margin: Sizing.margin,
      gap: Sizing.gap,
      borderRadius: Sizing.borderRadius,
      borderWidth: Sizing.borderWidth,
      width: Sizing.width,
      height: Sizing.height,
      icon: Sizing.icon,
      avatar: Sizing.avatar,
      button: Sizing.button,
      input: Sizing.input,
      card: Sizing.card,
      modal: Sizing.modal,
      snackbar: Sizing.snackbar,
      breakpoints: Sizing.breakpoints,
      zIndex: Sizing.zIndex,
      touchTarget: Sizing.touchTarget,
      header: Sizing.header,
      listItem: Sizing.listItem,
      badge: Sizing.badge,
      divider: Sizing.divider,
      tabBar: Sizing.tabBar,
      parallax: Sizing.parallax,
      aspectRatio: Sizing.aspectRatio,
      opacity: Sizing.opacity,
      spacer: Sizing.spacer,
      grid: Sizing.grid,
      safeArea: Sizing.safeArea,
      animation: Sizing.animation,
      paddingStart: Sizing.paddingStart,
      paddingEnd: Sizing.paddingEnd,
      marginStart: Sizing.marginStart,
      marginEnd: Sizing.marginEnd,
      rowGap: Sizing.rowGap,
      columnGap: Sizing.columnGap,
      inset: Sizing.inset,
      offset: Sizing.offset,
      flex: Sizing.flex,
      flexGrow: Sizing.flexGrow,
      flexShrink: Sizing.flexShrink,
      flexBasis: Sizing.flexBasis,
      position: Sizing.position,
      units: Sizing.units,
      screen: Sizing.screen,
      hitSlop: Sizing.hitSlop,
      scroll: Sizing.scroll,
      list: Sizing.list,
    };
  }
}

// Export singleton instance
export const uiSizeHelper = new UISizeHelper();

// Export class for custom instances if needed
export { UISizeHelper };

