import { useCallback } from 'react';
import { useSnackbarStore } from '@/shared/store/snackbar-store';
import type { SnackbarOptions } from '@/shared/models/snackbar-models';

export function useSnackbar() {
  const show = useSnackbarStore((s) => s.show);
  const hide = useSnackbarStore((s) => s.hide);

  const success = useCallback(
    (message: string, duration?: number) => {
      show(message, { type: 'success', duration });
    },
    [show]
  );

  const error = useCallback(
    (message: string, duration?: number) => {
      show(message, { type: 'error', duration: duration ?? 4000 });
    },
    [show]
  );

  const info = useCallback(
    (message: string, duration?: number) => {
      show(message, { type: 'info', duration });
    },
    [show]
  );

  return {
    show: (message: string, options?: SnackbarOptions) => show(message, options),
    hide,
    success,
    error,
    info,
  };
}
