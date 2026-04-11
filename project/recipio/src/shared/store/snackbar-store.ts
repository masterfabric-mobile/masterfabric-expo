import { create } from 'zustand';
import type { SnackbarOptions, SnackbarState } from '@/shared/models/snackbar-models';

const DEFAULT_DURATION = 3000;

interface SnackbarStore extends SnackbarState {
  _timeout: ReturnType<typeof setTimeout> | null;
  show: (message: string, options?: SnackbarOptions) => void;
  hide: () => void;
}

export const useSnackbarStore = create<SnackbarStore>((set, get) => ({
  visible: false,
  message: '',
  type: 'info',
  _timeout: null,

  show: (message, options = {}) => {
    const { _timeout } = get();
    if (_timeout) clearTimeout(_timeout);

    const duration = options.duration ?? DEFAULT_DURATION;
    const type = options.type ?? 'info';

    set({
      visible: true,
      message,
      type,
      _timeout:
        duration > 0
          ? setTimeout(() => {
              set({ visible: false, message: '', type: 'info', _timeout: null });
            }, duration)
          : null,
    });
  },

  hide: () => {
    const { _timeout } = get();
    if (_timeout) clearTimeout(_timeout);
    set({ visible: false, message: '', type: 'info', _timeout: null });
  },
}));
