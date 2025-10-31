import { getThemeColors } from 'masterfabric-expo-core';
import { SnackbarType } from '../models/snackbar-helper-models';

/**
 * Get icon name for snackbar type
 */
export const getSnackbarIcon = (type: SnackbarType): string => {
  switch (type) {
    case 'success':
      return 'checkmark-circle';
    case 'error':
      return 'close-circle';
    case 'warning':
      return 'warning';
    case 'info':
    default:
      return 'information-circle';
  }
};

/**
 * Get color for snackbar type
 */
export const getSnackbarColor = (
  type: SnackbarType,
  isDark: boolean
): string => {
  const colors = getThemeColors(isDark);
  
  switch (type) {
    case 'success':
      return colors.successColor;
    case 'error':
      return colors.errorColor;
    case 'warning':
      return colors.warningColor;
    case 'info':
    default:
      return isDark ? colors.snackbarInfoDark : colors.snackbarInfo;
  }
};

/**
 * Format duration for display
 */
export const formatDuration = (duration: number): string => {
  if (duration === 0) return 'Persistent';
  if (duration < 1000) return `${duration}ms`;
  return `${(duration / 1000).toFixed(1)}s`;
};

/**
 * Validate snackbar message
 */
export const validateSnackbarMessage = (message: string): boolean => {
  return message.trim().length > 0 && message.length <= 200;
};

