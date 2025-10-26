/**
 * useSnackbar Hook
 * 
 * Global hook for showing snackbar notifications from anywhere in the app.
 * Integrates with SnackbarService for queue management.
 * 
 * @example
 * ```typescript
 * import { useSnackbar } from '@/src/shared/hooks/use-snackbar';
 * 
 * function MyComponent() {
 *   const { showSnackbar, dismissSnackbar, dismissAll } = useSnackbar();
 * 
 *   const handleDelete = () => {
 *     const id = showSnackbar({
 *       message: 'Item deleted',
 *       type: 'success',
 *       action: {
 *         label: 'UNDO',
 *         onPress: () => {
 *           // Restore item
 *           dismissSnackbar(id);
 *         }
 *       }
 *     });
 *   };
 * 
 *   return <Button onPress={handleDelete}>Delete</Button>;
 * }
 * ```
 */

import { useCallback, useEffect, useState } from 'react';
import { snackbarService, SnackbarProps } from '../services/snackbar-service';

export interface UseSnackbarReturn {
  /**
   * Show a snackbar notification
   * @param snackbar - Snackbar configuration
   * @returns Snackbar id for later reference
   */
  showSnackbar: (snackbar: Omit<SnackbarProps, 'id'>) => string;
  
  /**
   * Dismiss a specific snackbar
   * @param id - Snackbar id to dismiss
   */
  dismissSnackbar: (id: string) => void;
  
  /**
   * Dismiss all snackbars
   */
  dismissAll: () => void;
  
  /**
   * All active snackbars
   */
  snackbars: SnackbarProps[];
  
  // Convenience methods
  success: (message: string, duration?: number) => string;
  error: (message: string, duration?: number) => string;
  warning: (message: string, duration?: number) => string;
  info: (message: string, duration?: number) => string;
}

/**
 * Global hook for snackbar notifications
 */
export function useSnackbar(): UseSnackbarReturn {
  const [snackbars, setSnackbars] = useState<SnackbarProps[]>([]);

  useEffect(() => {
    // Subscribe to snackbar service
    const unsubscribe = snackbarService.subscribe((updatedSnackbars) => {
      setSnackbars(updatedSnackbars);
    });

    return () => {
      unsubscribe();
    };
  }, []);

  const showSnackbar = useCallback((snackbar: Omit<SnackbarProps, 'id'>) => {
    return snackbarService.show(snackbar);
  }, []);

  const dismissSnackbar = useCallback((id: string) => {
    snackbarService.dismiss(id);
  }, []);

  const dismissAll = useCallback(() => {
    snackbarService.dismissAll();
  }, []);

  const success = useCallback((message: string, duration = 3000) => {
    return snackbarService.success(message, duration);
  }, []);

  const error = useCallback((message: string, duration = 4000) => {
    return snackbarService.error(message, duration);
  }, []);

  const warning = useCallback((message: string, duration = 4000) => {
    return snackbarService.warning(message, duration);
  }, []);

  const info = useCallback((message: string, duration = 3000) => {
    return snackbarService.info(message, duration);
  }, []);

  return {
    showSnackbar,
    dismissSnackbar,
    dismissAll,
    snackbars,
    success,
    error,
    warning,
    info,
  };
}

