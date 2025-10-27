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

// Scenario Input Model (from Issue #11)
export interface SnackbarScenarioInput {
  message: string;
  duration: number;
  actionLabel: string;
  type: SnackbarType | 'custom';
  position: 'top' | 'bottom' | 'center';
  persistent: boolean;
  customColor?: string;
  customIcon?: string;
}

// Scenario Result Model (from Issue #11)
export interface SnackbarScenarioResult {
  id: string;
  functionName: string;
  input: string;
  output: string;
  description: string;
}

export interface SnackbarHelperState {
  scenarioInput: SnackbarScenarioInput;
  scenarioResults: SnackbarScenarioResult[];
  isLoading: boolean;
}