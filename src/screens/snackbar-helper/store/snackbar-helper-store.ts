import { create } from 'zustand';
import { SnackbarOptions, SnackbarState } from '../models/snackbar-helper-models';

interface SnackbarStore extends SnackbarState {
  show: (message: string, options?: SnackbarOptions) => void;
  hide: () => void;
}

const DEFAULT_OPTIONS: SnackbarOptions = {
  duration: 3000,
  type: 'info',
  position: 'bottom'
};

export const useSnackbarHelperStore = create<SnackbarStore>((set) => ({
  visible: false,
  message: '',
  options: DEFAULT_OPTIONS,
  show: (message, options) => {
    set({
      visible: true,
      message,
      options: { ...DEFAULT_OPTIONS, ...options }
    });
  },
  hide: () => {
    set({
      visible: false,
      message: '',
      options: DEFAULT_OPTIONS
    });
  }
}));