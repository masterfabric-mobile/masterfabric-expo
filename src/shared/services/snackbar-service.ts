/**
 * Snackbar Service
 * 
 * Centralized service for managing snackbar notifications with queue support.
 * Follows the singleton pattern for global access.
 * 
 * Features:
 * - Queue management for multiple snackbars
 * - Automatic dismiss with timeout
 * - Persistent snackbars (duration: 0)
 * - Observer pattern for state updates
 * - TypeScript type safety
 * 
 * @example
 * ```typescript
 * import { snackbarService } from '@/src/shared/services/snackbar-service';
 * 
 * // Show a snackbar
 * const id = snackbarService.show({
 *   message: 'Item deleted',
 *   type: 'success',
 *   duration: 3000,
 *   action: {
 *     label: 'UNDO',
 *     onPress: () => console.log('Undo clicked')
 *   }
 * });
 * 
 * // Dismiss a specific snackbar
 * snackbarService.dismiss(id);
 * 
 * // Dismiss all snackbars
 * snackbarService.dismissAll();
 * ```
 */

export interface SnackbarAction {
  label: string;
  onPress: () => void;
}

export interface SnackbarProps {
  id: string;
  message: string;
  type?: 'success' | 'error' | 'warning' | 'info';
  duration?: number; // milliseconds, 0 for persistent
  position?: 'top' | 'bottom';
  action?: SnackbarAction;
  persistent?: boolean; // if true, won't auto-dismiss
}

type SnackbarListener = (snackbars: SnackbarProps[]) => void;

/**
 * Generate unique ID for snackbars
 */
function generateId(): string {
  return `snackbar_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
}

/**
 * SnackbarService - Singleton service for managing snackbar notifications
 */
class SnackbarService {
  private static instance: SnackbarService;
  private snackbars: SnackbarProps[] = [];
  private listeners: Set<SnackbarListener> = new Set();
  private timeouts: Map<string, NodeJS.Timeout> = new Map();
  private maxSnackbars: number = 3; // Maximum snackbars to show at once

  /**
   * Get singleton instance
   */
  static getInstance(): SnackbarService {
    if (!SnackbarService.instance) {
      SnackbarService.instance = new SnackbarService();
    }
    return SnackbarService.instance;
  }

  /**
   * Show a snackbar notification
   * @param snackbar - Snackbar configuration without id
   * @returns Snackbar id for later reference
   */
  show(snackbar: Omit<SnackbarProps, 'id'>): string {
    const id = generateId();
    const newSnackbar: SnackbarProps = { 
      ...snackbar, 
      id,
      type: snackbar.type || 'info',
      duration: snackbar.duration ?? 3000,
      position: snackbar.position || 'bottom',
    };

    // Add to queue
    this.snackbars.push(newSnackbar);

    // If we have too many snackbars, remove the oldest one
    if (this.snackbars.length > this.maxSnackbars) {
      const removed = this.snackbars.shift();
      if (removed) {
        this.clearTimeout(removed.id);
      }
    }

    this.notifyListeners();

    // Auto-dismiss if not persistent and has duration
    if (!snackbar.persistent && snackbar.duration && snackbar.duration > 0) {
      const timeout = setTimeout(() => {
        this.dismiss(id);
      }, snackbar.duration);
      this.timeouts.set(id, timeout);
    }

    return id;
  }

  /**
   * Dismiss a specific snackbar by id
   * @param id - Snackbar id to dismiss
   */
  dismiss(id: string): void {
    this.snackbars = this.snackbars.filter(snackbar => snackbar.id !== id);
    this.clearTimeout(id);
    this.notifyListeners();
  }

  /**
   * Dismiss all snackbars
   */
  dismissAll(): void {
    this.snackbars = [];
    this.timeouts.forEach((timeout) => clearTimeout(timeout));
    this.timeouts.clear();
    this.notifyListeners();
  }

  /**
   * Get all active snackbars
   */
  getSnackbars(): SnackbarProps[] {
    return [...this.snackbars];
  }

  /**
   * Subscribe to snackbar changes
   * @param listener - Function to call when snackbars change
   * @returns Unsubscribe function
   */
  subscribe(listener: SnackbarListener): () => void {
    this.listeners.add(listener);
    // Immediately notify with current state
    listener([...this.snackbars]);
    
    return () => {
      this.listeners.delete(listener);
    };
  }

  /**
   * Set maximum number of snackbars to show at once
   * @param max - Maximum number (default: 3)
   */
  setMaxSnackbars(max: number): void {
    this.maxSnackbars = Math.max(1, max);
  }

  /**
   * Clear timeout for a specific snackbar
   */
  private clearTimeout(id: string): void {
    const timeout = this.timeouts.get(id);
    if (timeout) {
      clearTimeout(timeout);
      this.timeouts.delete(id);
    }
  }

  /**
   * Notify all listeners of state change
   */
  private notifyListeners(): void {
    const currentSnackbars = [...this.snackbars];
    this.listeners.forEach(listener => listener(currentSnackbars));
  }

  // Convenience methods

  /**
   * Show success snackbar
   */
  success(message: string, duration = 3000): string {
    return this.show({ message, type: 'success', duration });
  }

  /**
   * Show error snackbar
   */
  error(message: string, duration = 4000): string {
    return this.show({ message, type: 'error', duration });
  }

  /**
   * Show warning snackbar
   */
  warning(message: string, duration = 4000): string {
    return this.show({ message, type: 'warning', duration });
  }

  /**
   * Show info snackbar
   */
  info(message: string, duration = 3000): string {
    return this.show({ message, type: 'info', duration });
  }
}

// Export singleton instance
export const snackbarService = SnackbarService.getInstance();

// Export class for testing
export { SnackbarService };

