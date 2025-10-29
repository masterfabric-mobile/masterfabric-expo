/**
 * Toast Helper
 * 
 * Provides an imperative API to show toast notifications from anywhere in the app,
 * using a pub/sub model to trigger declarative UI updates in React.
 * 
 * This helper provides convenient methods for common toast operations with 
 * consistent naming and behavior. It requires the toast service to be 
 * initialized in the consuming application.
 * 
 * @example
 * ```typescript
 * import { toastHelper } from 'masterfabric-expo-core';
 * 
 * // Show a success message
 * toastHelper.showSuccess('Operation completed!');
 * 
 * // Show with custom options
 * toastHelper.show({
 *   message: 'Custom toast',
 *   type: 'info',
 *   duration: 5000,
 *   position: 'top',
 * });
 * 
 * // Show with action button
 * toastHelper.show({
 *   message: 'Item deleted',
 *   type: 'warning',
 *   duration: 5000,
 *   action: {
 *     text: 'UNDO',
 *     onPress: () => console.log('Undo clicked'),
 *   },
 * });
 * ```
 */

// Toast Types (copied from toast-helper models for core package independence)
export type ToastType = 'success' | 'error' | 'warning' | 'info' | 'custom';
export type ToastPosition = 'top' | 'bottom' | 'center';
export type AnimationStrength = 'none' | 'light' | 'medium' | 'strong';

export interface CustomToastConfig {
  icon?: string;
  backgroundColor?: string;
  textColor?: string;
  iconColor?: string;
}

export interface ToastAction {
  text: string;
  onPress: () => void;
  style?: any;
}

export interface ToastOptions {
  message: string;
  type?: ToastType;
  duration?: number;
  position?: ToastPosition;
  action?: ToastAction;
  style?: any;
  onPress?: () => void;
  animation?: AnimationStrength;
  customConfig?: CustomToastConfig;
}

// Toast Service Interface (to be implemented by consuming application)
export interface ToastServiceInterface {
  show(options: ToastOptions): string;
  dismiss(id?: string): void;
  clear(): void;
  getToasts(): any[];
  setMaxToasts(max: number): void;
  subscribe(listener: (toasts: any[]) => void): () => void;
}

// Global toast service instance (to be set by consuming application)
let globalToastService: ToastServiceInterface | null = null;

/**
 * Set the global toast service instance
 * This should be called by the consuming application during initialization
 * @param service - Toast service instance
 */
const setToastService = (service: ToastServiceInterface): void => {
  globalToastService = service;
};

/**
 * Get the global toast service instance
 * @returns Toast service instance or null if not set
 */
const getToastService = (): ToastServiceInterface | null => {
  return globalToastService;
};

/**
 * Toast Helper Class
 * 
 * Provides convenient methods for displaying toast notifications.
 * All methods are static for easy access without instantiation.
 */
class ToastHelper {
  /**
   * Check if toast service is available
   * @throws Error if toast service is not initialized
   */
  private static ensureService(): ToastServiceInterface {
    if (!globalToastService) {
      throw new Error(
        'Toast service not initialized. Please call setToastService() with a valid toast service instance.'
      );
    }
    return globalToastService;
  }

  /**
   * Show a toast with custom configuration
   * @param options - Toast configuration options
   * @returns Unique toast ID
   */
  static show(options: ToastOptions): string {
    return this.ensureService().show(options);
  }

  /**
   * Show a success toast with green styling
   * @param message - Success message to display
   * @param options - Additional toast options
   * @returns Unique toast ID
   */
  static showSuccess(message: string, options?: Partial<ToastOptions>): string {
    return this.ensureService().show({ 
      message, 
      type: 'success', 
      duration: 4000,
      ...options 
    });
  }

  /**
   * Show an error toast with red styling
   * @param message - Error message to display
   * @param options - Additional toast options
   * @returns Unique toast ID
   */
  static showError(message: string, options?: Partial<ToastOptions>): string {
    return this.ensureService().show({ 
      message, 
      type: 'error', 
      duration: 5000,
      ...options 
    });
  }

  /**
   * Show a warning toast with orange styling
   * @param message - Warning message to display
   * @param options - Additional toast options
   * @returns Unique toast ID
   */
  static showWarning(message: string, options?: Partial<ToastOptions>): string {
    return this.ensureService().show({ 
      message, 
      type: 'warning', 
      duration: 4500,
      ...options 
    });
  }

  /**
   * Show an info toast with blue styling
   * @param message - Info message to display
   * @param options - Additional toast options
   * @returns Unique toast ID
   */
  static showInfo(message: string, options?: Partial<ToastOptions>): string {
    return this.ensureService().show({ 
      message, 
      type: 'info', 
      duration: 4000,
      ...options 
    });
  }

  /**
   * Show a custom toast with custom configuration
   * @param message - Custom message to display
   * @param customConfig - Custom styling and icon configuration
   * @param options - Additional toast options
   * @returns Unique toast ID
   */
  static showCustom(
    message: string, 
    customConfig: ToastOptions['customConfig'], 
    options?: Partial<ToastOptions>
  ): string {
    return this.ensureService().show({ 
      message, 
      type: 'custom', 
      customConfig,
      duration: 4000,
      ...options 
    });
  }

  /**
   * Hide a specific toast by ID
   * @param id - Toast ID to hide
   */
  static hide(id: string): void {
    this.ensureService().dismiss(id);
  }

  /**
   * Hide all toasts
   */
  static hideAll(): void {
    this.ensureService().dismiss();
  }

  /**
   * Clear all toasts (alias for hideAll)
   */
  static clear(): void {
    this.ensureService().clear();
  }

  /**
   * Get current active toasts
   * @returns Array of current toast messages
   */
  static getToasts() {
    return this.ensureService().getToasts();
  }

  /**
   * Set maximum number of toasts to display simultaneously
   * @param max - Maximum number of toasts (minimum 1)
   */
  static setMaxToasts(max: number): void {
    this.ensureService().setMaxToasts(max);
  }

  /**
   * Subscribe to toast changes
   * @param listener - Callback function for toast updates
   * @returns Unsubscribe function
   */
  static subscribe(listener: (toasts: any[]) => void): () => void {
    return this.ensureService().subscribe(listener);
  }
}

// Export singleton instance for convenience
const toastHelper = ToastHelper;

// Export helper functions and class
export {
  ToastHelper,
  toastHelper,
  setToastService,
  getToastService,
};

