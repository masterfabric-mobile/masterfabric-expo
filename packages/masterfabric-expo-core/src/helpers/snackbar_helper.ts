/**
 * Snackbar Helper
 * 
 * Provides an imperative API to show snackbars from anywhere in the app,
 * using a pub/sub model to trigger declarative UI updates in React.
 * 
 * Inspired by Swift implementation patterns for cross-platform consistency.
 * 
 * @example
 * ```typescript
 * import { snackbarHelper } from 'masterfabric-expo-core';
 * 
 * // Show a success message
 * snackbarHelper.show({
 *   message: 'Operation completed!',
 *   type: 'success',
 *   duration: 3000,
 * });
 * 
 * // Show with action button
 * snackbarHelper.show({
 *   message: 'Item deleted',
 *   type: 'info',
 *   duration: 5000,
 *   action: {
 *     label: 'UNDO',
 *     onPress: () => console.log('Undo clicked'),
 *   },
 * });
 * ```
 */

export type SnackbarType = 'success' | 'error' | 'warning' | 'info';

export interface SnackbarAction {
  label: string;
  onPress: () => void;
}

export interface SnackbarOptions {
  message: string;
  type?: SnackbarType;
  duration?: number; // in milliseconds, 0 for persistent
  position?: 'top' | 'bottom';
  action?: SnackbarAction;
}

type Listener = (options: SnackbarOptions) => void;

class SnackbarHelper {
  private listeners: Listener[] = [];

  /**
   * Subscribe to snackbar events
   * @param listener - Function to be called when a snackbar is shown
   * @returns Unsubscribe function
   */
  subscribe(listener: Listener) {
    this.listeners.push(listener);
    return () => {
      // Return an unsubscribe function
      this.listeners = this.listeners.filter(l => l !== listener);
    };
  }

  /**
   * Show a snackbar message
   * @param options - Snackbar configuration options
   */
  show(options: SnackbarOptions) {
    // Notify all listeners
    for (const listener of this.listeners) {
      listener(options);
    }
  }

  /**
   * Convenience method to show a success message
   * @param message - Message to display
   * @param duration - Duration in milliseconds (default: 3000)
   */
  success(message: string, duration = 3000) {
    this.show({ message, type: 'success', duration });
  }

  /**
   * Convenience method to show an error message
   * @param message - Message to display
   * @param duration - Duration in milliseconds (default: 4000)
   */
  error(message: string, duration = 4000) {
    this.show({ message, type: 'error', duration });
  }

  /**
   * Convenience method to show a warning message
   * @param message - Message to display
   * @param duration - Duration in milliseconds (default: 4000)
   */
  warning(message: string, duration = 4000) {
    this.show({ message, type: 'warning', duration });
  }

  /**
   * Convenience method to show an info message
   * @param message - Message to display
   * @param duration - Duration in milliseconds (default: 3000)
   */
  info(message: string, duration = 3000) {
    this.show({ message, type: 'info', duration });
  }
}

// Export a singleton instance
export const snackbarHelper = new SnackbarHelper();
