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
  switch (type) {
    case 'success':
      return isDark ? '#1B5E20' : '#4CAF50';
    case 'error':
      return isDark ? '#B71C1C' : '#F44336';
    case 'warning':
      return isDark ? '#E65100' : '#FF9800';
    case 'info':
    default:
      return isDark ? '#0D47A1' : '#2196F3';
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

