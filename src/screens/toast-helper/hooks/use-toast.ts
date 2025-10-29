import { ToastOptions, toastService } from '@/src/shared/services/toast-service';

/**
 * useToast Hook
 * 
 * A React hook that provides convenient methods for displaying toast notifications.
 * This hook wraps the ToastService and provides a clean API for React components
 * to interact with the toast system.
 * 
 * Features:
 * - Generic show method for custom configurations
 * - Convenience methods for common toast types (success, error, warning, info)
 * - Hide method for dismissing toasts
 * - Type-safe configuration options
 * 
 * @returns Object containing toast methods
 */
export function useToast() {
  /**
   * Generic method to show a toast with custom configuration
   * @param options - Toast configuration options
   */
  const showToast = (options: ToastOptions) => {
    toastService.show(options);
  };

  /**
   * Hide a specific toast by ID or all toasts if no ID provided
   * @param id - Optional toast ID to hide
   */
  const hideToast = (id?: string) => {
    toastService.dismiss(id);
  };

  /**
   * Show a success toast with green styling
   * @param message - Success message to display
   * @param options - Additional toast options
   */
  const showSuccess = (message: string, options?: Partial<ToastOptions>) => {
    toastService.show({ message, type: 'success', ...options });
  };

  /**
   * Show an error toast with red styling
   * @param message - Error message to display
   * @param options - Additional toast options
   */
  const showError = (message: string, options?: Partial<ToastOptions>) => {
    toastService.show({ message, type: 'error', ...options });
  };

  /**
   * Show a warning toast with orange styling
   * @param message - Warning message to display
   * @param options - Additional toast options
   */
  const showWarning = (message: string, options?: Partial<ToastOptions>) => {
    toastService.show({ message, type: 'warning', ...options });
  };

  /**
   * Show an info toast with blue styling
   * @param message - Info message to display
   * @param options - Additional toast options
   */
  const showInfo = (message: string, options?: Partial<ToastOptions>) => {
    toastService.show({ message, type: 'info', ...options });
  };

  return {
    show: showToast,
    hide: hideToast,
    success: showSuccess,
    error: showError,
    warning: showWarning,
    info: showInfo,
  };
}
