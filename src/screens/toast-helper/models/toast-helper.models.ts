// Re-export types from core package for backward compatibility
export type {
  AnimationStrength, CustomToastConfig, ToastAction, ToastMessage, ToastOptions, ToastPosition, ToastType
} from 'masterfabric-expo-core';

export {
  CUSTOM_TOAST_ICONS, TOAST_ICONS
} from 'masterfabric-expo-core';

// Import types for legacy interfaces
import type { AnimationStrength, CustomToastConfig, ToastPosition, ToastType } from 'masterfabric-expo-core';

// Legacy types for backward compatibility
export interface ToastInput {
  message: string;
  duration: number;
  position: ToastPosition;
  type: ToastType;
  animation: AnimationStrength;
  customConfig?: CustomToastConfig;
}

export interface ToastResult {
  id: string;
  operationName: string;
  input: string;
  output: string;
  description: string;
}

export interface ToastHelperState {
  input: ToastInput;
  results: ToastResult[];
  isLoading: boolean;
}