export type SnackbarType = 'success' | 'error' | 'info';

export interface SnackbarState {
  visible: boolean;
  message: string;
  type: SnackbarType;
}

export interface SnackbarOptions {
  type?: SnackbarType;
  duration?: number;
}
