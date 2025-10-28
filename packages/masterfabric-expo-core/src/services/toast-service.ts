import { ToastMessage, ToastOptions } from '../types';

/**
 * Centralized Toast Service for managing toast notifications
 * 
 * This service implements the singleton pattern to provide a centralized way
 * to manage toast notifications across the entire application. It handles:
 * - Toast creation and configuration
 * - Toast lifecycle management (show, dismiss, auto-dismiss)
 * - Toast queue management with configurable limits
 * - Event subscription for UI updates
 * - Toast persistence and state management
 * 
 * Features:
 * - Singleton pattern for global access
 * - Configurable maximum toast count
 * - Auto-dismiss functionality
 * - Event-driven architecture
 * - Type-safe toast configuration
 */
class ToastService {
  // Singleton instance
  private static instance: ToastService;
  
  // Current active toasts array
  private toasts: ToastMessage[] = [];
  
  // Event listeners for toast state changes
  private listeners: Set<(toasts: ToastMessage[]) => void> = new Set();
  
  // Maximum number of toasts to display simultaneously
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
   * 
   * Creates a new toast with the provided configuration and adds it to the queue.
   * The toast will be displayed immediately and auto-dismissed after the specified duration.
   * If the maximum toast limit is reached, older toasts will be removed.
   * 
   * @param {ToastOptions} options - Toast configuration object
   * @returns {string} Unique toast ID for later reference
   */
  show(options: ToastOptions): string {
    // Generate unique ID for this toast
    const id = this.generateId();
    
    // Create toast message with default values
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

    // Add new toast to the beginning of the array and limit to maxToasts
    this.toasts = [newToast, ...this.toasts].slice(0, this.maxToasts);
    
    // Notify all listeners about the toast state change
    this.notifyListeners();

    // Set up auto-dismiss timer if duration is specified
    if (newToast.duration > 0) {
      setTimeout(() => this.dismiss(id), newToast.duration);
    }

    return id;
  }

  /**
   * Dismiss a specific toast or all toasts
   * 
   * Removes toast(s) from the active toasts array and notifies listeners.
   * Can dismiss a specific toast by ID or all toasts if no ID is provided.
   * 
   * @param {string} [id] - Optional toast ID to dismiss. If not provided, dismisses all toasts.
   */
  dismiss(id?: string): void {
    if (id) {
      // Remove specific toast by ID
      this.toasts = this.toasts.filter(toast => toast.id !== id);
    } else {
      // Clear all toasts
      this.toasts = [];
    }
    // Notify listeners about the state change
    this.notifyListeners();
  }

  /**
   * Subscribe to toast changes
   * 
   * Adds a listener function that will be called whenever the toast state changes.
   * The listener receives the current array of active toasts as a parameter.
   * Returns an unsubscribe function to remove the listener.
   * 
   * @param {Function} listener - Callback function for toast updates
   * @returns {Function} Unsubscribe function to remove the listener
   */
  subscribe(listener: (toasts: ToastMessage[]) => void): () => void {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  }

  /**
   * Get current toasts
   * 
   * Returns a copy of the current active toasts array.
   * This method provides read-only access to the toast state.
   * 
   * @returns {ToastMessage[]} Current toast array (defensive copy)
   */
  getToasts(): ToastMessage[] {
    return [...this.toasts];
  }

  /**
   * Clear all toasts
   * 
   * Removes all active toasts from the queue and notifies listeners.
   * This is equivalent to calling dismiss() without an ID parameter.
   */
  clear(): void {
    this.toasts = [];
    this.notifyListeners();
  }

  /**
   * Set maximum number of toasts
   * 
   * Configures the maximum number of toasts that can be displayed simultaneously.
   * If the current toast count exceeds the new limit, older toasts will be removed.
   * The minimum value is 1.
   * 
   * @param {number} max - Maximum number of toasts (minimum 1)
   */
  setMaxToasts(max: number): void {
    this.maxToasts = Math.max(1, max);
    this.toasts = this.toasts.slice(0, this.maxToasts);
    this.notifyListeners();
  }

  /**
   * Generate unique ID for toast
   * 
   * Creates a unique identifier for each toast using timestamp and random string.
   * This ensures that each toast has a unique ID for tracking and management.
   * 
   * @returns {string} Unique ID combining timestamp and random string
   */
  private generateId(): string {
    return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  }

  /**
   * Notify all listeners about toast changes
   * 
   * Iterates through all registered listeners and calls them with the current toast state.
   * This method is called whenever the toast state changes to keep UI components updated.
   */
  private notifyListeners(): void {
    this.listeners.forEach(listener => listener([...this.toasts]));
  }
}

// Export singleton instance for global use
export const toastService = ToastService.getInstance();

// Export class for testing purposes
export { ToastService };

