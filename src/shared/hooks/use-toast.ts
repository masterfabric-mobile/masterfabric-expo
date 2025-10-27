import { ToastOptions } from '../../screens/toast-helper/models/toast-helper.models';
import { toastService } from '../services/toast-service';

export function useToast() {
  const showToast = (options: ToastOptions) => {
    toastService.show(options);
  };

  const hideToast = (id?: string) => {
    toastService.dismiss(id);
  };

  const showSuccess = (message: string, options?: Partial<ToastOptions>) => {
    toastService.show({ message, type: 'success', ...options });
  };

  const showError = (message: string, options?: Partial<ToastOptions>) => {
    toastService.show({ message, type: 'error', ...options });
  };

  const showWarning = (message: string, options?: Partial<ToastOptions>) => {
    toastService.show({ message, type: 'warning', ...options });
  };

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
