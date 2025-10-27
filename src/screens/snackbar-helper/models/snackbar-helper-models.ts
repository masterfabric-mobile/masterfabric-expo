export type SnackbarType = 'success' | 'error' | 'info' | 'warning';
export type ActionType = 'primary' | 'secondary';

export interface SnackbarOptions {
  duration?: number;
  type?: SnackbarType;
  action?: {
    label: string;
    onPress: () => void;
  };
  position?: 'top' | 'bottom' | 'center';
  persistent?: boolean;
  customColor?: string;
  customIcon?: string;
}

export interface SnackbarState {
  visible: boolean;
  message: string;
  options: SnackbarOptions;
}

export type ShowSnackbar = (message: string, options?: SnackbarOptions) => void;

// Test Input Model (from Issue #11)
export interface SnackbarTestInput {
  message: string;
  duration: number;
  actionLabel: string;
  type: SnackbarType | 'custom';
  position: 'top' | 'bottom' | 'center';
  persistent: boolean;
  customColor?: string;
  customIcon?: string;
}

// Test Result Model (from Issue #11)
export interface SnackbarTestResult {
  id: string;
  functionName: string;
  input: string;
  output: string;
  description: string;
}

export interface SnackbarHelperState {
  testInput: SnackbarTestInput;
  testResults: SnackbarTestResult[];
  isLoading: boolean;
}