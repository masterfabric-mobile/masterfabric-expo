/**
 * Formats a battery level (0-1) into a percentage string.
 *
 * @param level The battery level, a number between 0 and 1.
 * @returns The battery level formatted as a percentage string (e.g., "75%").
 *
 * @example
 * ```typescript
 * formatBatteryPercentage(0.75); // Returns "75%"
 * formatBatteryPercentage(0.0);  // Returns "0%"
 * ```
 */
export function formatBatteryPercentage(level: number): string {
  return `${Math.round(level * 100)}%`;
}

/**
 * Determines a color for the battery icon based on its level and the current theme.
 *
 * @param level The battery level, a number between 0 and 1.
 * @param isDark A boolean indicating if the current theme is dark.
 * @returns A hex color string (e.g., '#34C759' for green, '#FF3B30' for red).
 *
 * @example
 * ```typescript
 * getBatteryColor(0.8, false); // Returns '#30D158' (light theme green)
 * getBatteryColor(0.15, true); // Returns '#FF3B30' (dark theme red)
 * ```
 */
export function getBatteryColor(level: number, isDark: boolean): string {
  const percentage = level * 100;
  
  if (percentage > 50) {
    return isDark ? '#34C759' : '#30D158'; // Green
  } else if (percentage > 20) {
    return isDark ? '#FF9500' : '#FF9F0A'; // Yellow/Orange
  } else {
    return isDark ? '#FF3B30' : '#FF453A'; // Red
  }
}

/**
 * Provides a descriptive text for the battery charging status.
 *
 * @param isCharging A boolean indicating if the device is currently charging.
 * @returns A string indicating "Charging" or "Not Charging".
 *
 * @example
 * ```typescript
 * getChargingStatusText(true);  // Returns "Charging"
 * getChargingStatusText(false); // Returns "Not Charging"
 * ```
 */
export function getChargingStatusText(isCharging: boolean): string {
  return isCharging
    ? 'Charging'
    : 'Not Charging';
}

/**
 * Provides a descriptive text for the low power mode status.
 *
 * @param lowPowerMode A boolean indicating if low power mode is active, or null if status is unknown/unavailable.
 * @param platform The current platform ('ios', 'android', or 'web').
 * @returns A string indicating "On", "Off", "Not available on this device", or "Unknown".
 *
 * @example
 * ```typescript
 * getLowPowerModeStatusText(true, 'ios');    // Returns "On"
 * getLowPowerModeStatusText(false, 'android'); // Returns "Off"
 * getLowPowerModeStatusText(null, 'android'); // Returns "Not available on this device"
 * ```
 */
export function getLowPowerModeStatusText(
  lowPowerMode: boolean | null,
  platform: 'ios' | 'android' | 'web'
): string {
  if (lowPowerMode === null) {
    if (platform === 'android') {
      return 'Not available on this device';
    }
    return 'Unknown';
  }
  
  return lowPowerMode
    ? 'On'
    : 'Off';
}

