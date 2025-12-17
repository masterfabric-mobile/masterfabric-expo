import * as Haptics from 'expo-haptics';
import { Platform } from 'react-native';
import { HapticFeedbackType } from '../types/videoPlayerHaptic';

/**
 * Checks if haptic feedback is supported on the current platform.
 *
 * @returns A boolean indicating if haptics are supported.
 *
 * @example
 * ```typescript
 * if (isHapticSupported()) {
 *   triggerHaptic('light');
 * }
 * ```
 */
export function isHapticSupported(): boolean {
  return Platform.OS === 'ios' || Platform.OS === 'android';
}

/**
 * Triggers a haptic feedback of the specified type.
 *
 * @param type The type of haptic feedback to trigger.
 * @returns A promise that resolves when the haptic is triggered.
 *
 * @example
 * ```typescript
 * await triggerHaptic('light');
 * await triggerHaptic('success');
 * ```
 */
export async function triggerHaptic(type: HapticFeedbackType): Promise<void> {
  if (!isHapticSupported()) {
    console.warn('Haptic feedback is not supported on this platform');
    return;
  }

  try {
    switch (type) {
      case 'light':
        await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
        break;
      case 'medium':
        await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
        break;
      case 'heavy':
        await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
        break;
      case 'success':
        await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
        break;
      case 'warning':
        await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
        break;
      case 'error':
        await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
        break;
      case 'selection':
        await Haptics.selectionAsync();
        break;
      default:
        console.warn(`Unknown haptic type: ${type}`);
    }
  } catch (error) {
    console.error('Failed to trigger haptic:', error);
  }
}

/**
 * Formats a time value in seconds to a readable string (MM:SS or HH:MM:SS).
 *
 * @param seconds The time in seconds.
 * @returns A formatted time string (e.g., "1:23" or "1:05:30").
 *
 * @example
 * ```typescript
 * formatVideoTime(83); // Returns "1:23"
 * formatVideoTime(3930); // Returns "1:05:30"
 * ```
 */
export function formatVideoTime(seconds: number): string {
  if (isNaN(seconds) || seconds < 0) {
    return '0:00';
  }

  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const secs = Math.floor(seconds % 60);

  if (hours > 0) {
    return `${hours}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  }

  return `${minutes}:${secs.toString().padStart(2, '0')}`;
}

/**
 * Gets a descriptive label for a haptic feedback type.
 *
 * @param type The haptic feedback type.
 * @returns A human-readable label for the haptic type.
 *
 * @example
 * ```typescript
 * getHapticLabel('light'); // Returns "Light Impact"
 * getHapticLabel('success'); // Returns "Success"
 * ```
 */
export function getHapticLabel(type: HapticFeedbackType): string {
  const labels: Record<HapticFeedbackType, string> = {
    light: 'Light Impact',
    medium: 'Medium Impact',
    heavy: 'Heavy Impact',
    success: 'Success',
    warning: 'Warning',
    error: 'Error',
    selection: 'Selection',
  };

  return labels[type] || type;
}

/**
 * Gets a description for a haptic feedback type.
 *
 * @param type The haptic feedback type.
 * @returns A description of when to use this haptic type.
 *
 * @example
 * ```typescript
 * getHapticDescription('light'); // Returns "Subtle feedback for light interactions"
 * ```
 */
export function getHapticDescription(type: HapticFeedbackType): string {
  const descriptions: Record<HapticFeedbackType, string> = {
    light: 'Subtle feedback for light interactions',
    medium: 'Standard feedback for regular interactions',
    heavy: 'Strong feedback for important actions',
    success: 'Positive feedback for successful actions',
    warning: 'Alert feedback for warnings',
    error: 'Negative feedback for errors',
    selection: 'Feedback for selection changes',
  };

  return descriptions[type] || '';
}

/**
 * Triggers haptic feedback for a video event (play, pause, seek).
 *
 * @param event The video event type.
 * @param hapticType Optional custom haptic type. Defaults to 'light' for play/pause, 'selection' for seek.
 *
 * @example
 * ```typescript
 * triggerVideoEventHaptic('play');
 * triggerVideoEventHaptic('seek', 'medium');
 * ```
 */
export async function triggerVideoEventHaptic(
  event: 'play' | 'pause' | 'seek',
  hapticType?: HapticFeedbackType
): Promise<void> {
  if (!isHapticSupported()) {
    return;
  }

  const defaultHaptic: Record<'play' | 'pause' | 'seek', HapticFeedbackType> = {
    play: 'light',
    pause: 'light',
    seek: 'selection',
  };

  const type = hapticType || defaultHaptic[event];
  await triggerHaptic(type);
}
