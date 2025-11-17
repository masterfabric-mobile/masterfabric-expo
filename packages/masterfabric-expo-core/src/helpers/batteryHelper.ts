/**
 * Format battery level (0-1) to percentage string
 */
export function formatBatteryPercentage(level: number): string {
  return `${Math.round(level * 100)}%`;
}

/**
 * Get battery color based on level
 * Green: >50%, Yellow: 20-50%, Red: <20%
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
 * Get localized charging status text
 */
export function getChargingStatusText(isCharging: boolean): string {
  return isCharging
    ? 'Charging'
    : 'Not Charging';
}

/**
 * Get localized low power mode status text
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

