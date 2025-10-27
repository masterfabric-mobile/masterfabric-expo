import { StyleProp, ViewStyle } from 'react-native';

/**
 * Available toast notification types with icons
 * @type {('success'|'error'|'warning'|'info'|'custom')} ToastType
 */
export type ToastType = 'success' | 'error' | 'warning' | 'info' | 'custom';

/**
 * Toast icon mapping for each type
 */
export const TOAST_ICONS: Record<Exclude<ToastType, 'custom'>, string> = {
  success: 'checkmark.circle.fill',
  error: 'xmark.circle.fill',
  warning: 'exclamationmark.triangle.fill',
  info: 'info.circle.fill',
};

/**
 * Custom toast configuration
 * @interface CustomToastConfig
 */
export interface CustomToastConfig {
  /** Custom icon name for the toast */
  icon?: string;
  /** Custom background color */
  backgroundColor?: string;
  /** Custom text color */
  textColor?: string;
  /** Custom icon color */
  iconColor?: string;
}

/**
 * Available icon options for custom toast
 */
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

/**
 * Toast notification positions on screen
 * @type {('top'|'bottom'|'center')} ToastPosition
 */
export type ToastPosition = 'top' | 'bottom' | 'center';

/**
 * Animation strength levels for toast notifications
 * @type {('none'|'light'|'medium'|'strong')} AnimationStrength
 */
export type AnimationStrength = 'none' | 'light' | 'medium' | 'strong';

/**
 * Action button configuration for toast notifications
 * @interface ToastAction
 */
export interface ToastAction {
  /** Text to display on the action button */
  text: string;
  /** Function to call when the action button is pressed */
  onPress: () => void;
  /** Optional custom styles for the action button */
  style?: StyleProp<ViewStyle>;
}

/**
 * Options for creating a new toast notification
 * @interface ToastOptions
 */
export interface ToastOptions {
  /** Message text to display in the toast */
  message: string;
  /** Type of toast notification */
  type?: ToastType;
  /** Duration in milliseconds to show the toast (0 = no auto-dismiss) */
  duration?: number;
  /** Position on screen to show the toast */
  position?: ToastPosition;
  /** Optional action button configuration */
  action?: ToastAction;
  /** Optional custom styles for the toast */
  style?: StyleProp<ViewStyle>;
  /** Optional callback when toast is pressed */
  onPress?: () => void;
  /** Animation strength for the toast */
  animation?: AnimationStrength;
  /** Custom configuration for custom type toasts */
  customConfig?: CustomToastConfig;
}

/**
 * Internal toast message object with required fields
 * @interface ToastMessage
 */
export interface ToastMessage extends Required<Pick<ToastOptions, 'message' | 'type'>> {
  /** Unique identifier for the toast */
  id: string;
  /** Duration in milliseconds */
  duration: number;
  /** Screen position */
  position: ToastPosition;
  /** Action button */
  action?: ToastAction;
  /** Custom styles */
  style?: StyleProp<ViewStyle>;
  /** Press callback */
  onPress?: () => void;
  /** Animation configuration */
  animation: AnimationStrength;
  /** Custom configuration for custom type toasts */
  customConfig?: CustomToastConfig;
}

/**
 * Input parameters for toast configuration
 * @interface ToastInput
 */
export interface ToastInput {
  /** Message content */
  message: string;
  /** Display duration */
  duration: number;
  /** Screen position */
  position: ToastPosition;
  /** Toast type */
  type: ToastType;
  /** Animation strength */
  animation: AnimationStrength;
  /** Custom configuration for custom type toasts */
  customConfig?: CustomToastConfig;
}

/**
 * Result object for toast operations
 * @interface ToastResult
 */
export interface ToastResult {
  /** Unique identifier */
  id: string;
  /** Name of the operation */
  operationName: string;
  /** Input parameters */
  input: string;
  /** Output/result */
  output: string;
  /** Description */
  description: string;
}

/**
 * Toast helper state management
 * @interface ToastHelperState
 */
export interface ToastHelperState {
  input: ToastInput;
  results: ToastResult[];
  isLoading: boolean;
}