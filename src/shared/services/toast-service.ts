import { ToastMessage, ToastOptions } from '@/src/screens/toast-helper/models/toast-helper.models';

/**
 * Centralized Toast Service for managing toast notifications
 * Provides singleton pattern for global toast management
 */
class ToastService {
  private static instance: ToastService;
  private toasts: ToastMessage[] = [];
  private listeners: Set<(toasts: ToastMessage[]) => void> = new Set();
  private maxToasts = 3;

  /**
   * Get singleton instance of ToastService
   * @returns {ToastService} Singleton instance
   */
  static getInstance(): ToastService {
    if (!ToastService.instance) {
      ToastService.instance = new ToastService();
    }
    return ToastService.instance;
  }

  /**
   * Show a new toast notification
   * @param {ToastOptions} options - Toast configuration
   * @returns {string} Toast ID
   */
  show(options: ToastOptions): string {
    const id = this.generateId();
    const newToast: ToastMessage = {
      id,
      message: options.message,
      type: options.type || 'info',
      duration: options.duration || 4000,
      position: options.position || 'top',
      animation: options.animation || 'medium',
      action: options.action,
      style: options.style,
      onPress: options.onPress,
      customConfig: options.customConfig,
    };

    this.toasts = [newToast, ...this.toasts].slice(0, this.maxToasts);
    this.notifyListeners();

    // Auto-dismiss if duration is set
    if (newToast.duration > 0) {
      setTimeout(() => this.dismiss(id), newToast.duration);
    }

    return id;
  }

  /**
   * Dismiss a specific toast or all toasts
   * @param {string} [id] - Optional toast ID to dismiss. If not provided, dismisses all toasts.
   */
  dismiss(id?: string): void {
    if (id) {
      this.toasts = this.toasts.filter(toast => toast.id !== id);
    } else {
      this.toasts = [];
    }
    this.notifyListeners();
  }

  /**
   * Subscribe to toast changes
   * @param {Function} listener - Callback function for toast updates
   * @returns {Function} Unsubscribe function
   */
  subscribe(listener: (toasts: ToastMessage[]) => void): () => void {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  }

  /**
   * Get current toasts
   * @returns {ToastMessage[]} Current toast array
   */
  getToasts(): ToastMessage[] {
    return [...this.toasts];
  }

  /**
   * Clear all toasts
   */
  clear(): void {
    this.toasts = [];
    this.notifyListeners();
  }

  /**
   * Set maximum number of toasts
   * @param {number} max - Maximum number of toasts
   */
  setMaxToasts(max: number): void {
    this.maxToasts = Math.max(1, max);
    this.toasts = this.toasts.slice(0, this.maxToasts);
    this.notifyListeners();
  }

  /**
   * Generate unique ID for toast
   * @returns {string} Unique ID
   */
  private generateId(): string {
    return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  }

  /**
   * Notify all listeners about toast changes
   */
  private notifyListeners(): void {
    this.listeners.forEach(listener => listener([...this.toasts]));
  }
}

// Export singleton instance
export const toastService = ToastService.getInstance();

// Export class for testing
export { ToastService };

