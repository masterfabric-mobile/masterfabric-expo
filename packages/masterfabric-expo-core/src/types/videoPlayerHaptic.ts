/**
 * Types for Video Player and Haptic Feedback integration
 */

export type HapticFeedbackType =
  | 'light'
  | 'medium'
  | 'heavy'
  | 'success'
  | 'warning'
  | 'error'
  | 'selection';

export interface VideoPlayerState {
  isPlaying: boolean;
  position: number; // in seconds
  duration: number; // in seconds
  volume: number; // 0-1
  playbackRate: number; // e.g., 0.5, 1.0, 1.5, 2.0
  isLoading: boolean;
  error: string | null;
}

export interface HapticFeedbackState {
  lastTriggered: HapticFeedbackType | null;
  hapticOnVideoEvents: boolean;
  isSupported: boolean;
}

export interface VideoPlayerHapticState {
  video: VideoPlayerState;
  haptic: HapticFeedbackState;
}
