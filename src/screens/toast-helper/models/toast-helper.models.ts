import { StyleProp, ViewStyle } from 'react-native';

// Toast Types
export type ToastType = 'success' | 'error' | 'warning' | 'info' | 'custom';

export const TOAST_ICONS: Record<Exclude<ToastType, 'custom'>, string> = {
  success: 'checkmark.circle.fill',
  error: 'xmark.circle.fill',
  warning: 'exclamationmark.triangle.fill',
  info: 'info.circle.fill',
};

export interface CustomToastConfig {
  icon?: string;
  backgroundColor?: string;
  textColor?: string;
  iconColor?: string;
}

export const CUSTOM_TOAST_ICONS = [
  { id: 'star', name: 'Star', icon: 'star.fill' },
  { id: 'heart', name: 'Heart', icon: 'heart.fill' },
  { id: 'fire', name: 'Fire', icon: 'flame.fill' },
  { id: 'diamond', name: 'Diamond', icon: 'diamond.fill' },
  { id: 'crown', name: 'Crown', icon: 'crown.fill' },
  { id: 'lightning', name: 'Lightning', icon: 'bolt.fill' },
  { id: 'moon', name: 'Moon', icon: 'moon.fill' },
  { id: 'sun', name: 'Sun', icon: 'sun.max.fill' },
  { id: 'rocket', name: 'Rocket', icon: 'paperplane.fill' },
  { id: 'gift', name: 'Gift', icon: 'gift.fill' },
  { id: 'music', name: 'Music', icon: 'music.note' },
  { id: 'camera', name: 'Camera', icon: 'camera.fill' },
];

export type ToastPosition = 'top' | 'bottom' | 'center';
export type AnimationStrength = 'none' | 'light' | 'medium' | 'strong';

export interface ToastAction {
  text: string;
  onPress: () => void;
  style?: StyleProp<ViewStyle>;
}

export interface ToastOptions {
  message: string;
  type?: ToastType;
  duration?: number;
  position?: ToastPosition;
  action?: ToastAction;
  style?: StyleProp<ViewStyle>;
  onPress?: () => void;
  animation?: AnimationStrength;
  customConfig?: CustomToastConfig;
}

export interface ToastMessage extends Required<Pick<ToastOptions, 'message' | 'type'>> {
  id: string;
  duration: number;
  position: ToastPosition;
  action?: ToastAction;
  style?: StyleProp<ViewStyle>;
  onPress?: () => void;
  animation: AnimationStrength;
  customConfig?: CustomToastConfig;
}

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