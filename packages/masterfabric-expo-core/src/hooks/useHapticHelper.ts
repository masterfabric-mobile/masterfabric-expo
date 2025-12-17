import { useCallback, useEffect } from 'react';
import { Platform } from 'react-native';
import {
  triggerHaptic as triggerHapticHelper,
  triggerVideoEventHaptic,
  isHapticSupported,
} from '../helpers/videoPlayerHapticHelper';
import { useHapticStore } from '../stores/hapticStore';
import { HapticFeedbackType } from '../types/videoPlayerHaptic';

export const useHapticHelper = () => {
  const {
    lastTriggered,
    hapticOnVideoEvents,
    isSupported,
    setLastTriggeredHaptic,
    setHapticOnVideoEvents,
    checkSupport,
  } = useHapticStore();

  // Check haptic support on mount
  useEffect(() => {
    checkSupport();
    if (!isHapticSupported() && Platform.OS !== 'web') {
      console.warn('Haptic feedback is not fully supported on this platform');
    }
  }, [checkSupport]);

  // Trigger haptic feedback
  const triggerHaptic = useCallback(
    async (type: HapticFeedbackType) => {
      try {
        await triggerHapticHelper(type);
        setLastTriggeredHaptic(type);
      } catch (error) {
        console.error('Failed to trigger haptic:', error);
      }
    },
    [setLastTriggeredHaptic]
  );

  // Test all haptic types sequentially
  const testAllHaptics = useCallback(async () => {
    const hapticTypes: HapticFeedbackType[] = [
      'light',
      'medium',
      'heavy',
      'success',
      'warning',
      'error',
      'selection',
    ];

    for (const type of hapticTypes) {
      await triggerHaptic(type);
      // Small delay between haptics
      await new Promise((resolve) => setTimeout(resolve, 300));
    }
  }, [triggerHaptic]);

  // Toggle haptic on video events
  const toggleHapticOnVideoEvents = useCallback(
    (enabled: boolean) => {
      setHapticOnVideoEvents(enabled);
    },
    [setHapticOnVideoEvents]
  );

  // Trigger haptic for video events (for integration with video player)
  const triggerVideoEventHapticWrapper = useCallback(
    async (event: 'play' | 'pause' | 'seek') => {
      if (hapticOnVideoEvents && isSupported) {
        await triggerVideoEventHaptic(event);
        const defaultHaptic: Record<'play' | 'pause' | 'seek', HapticFeedbackType> = {
          play: 'light',
          pause: 'light',
          seek: 'selection',
        };
        setLastTriggeredHaptic(defaultHaptic[event]);
      }
    },
    [hapticOnVideoEvents, isSupported, setLastTriggeredHaptic]
  );

  return {
    hapticState: {
      lastTriggered,
      hapticOnVideoEvents,
      isSupported,
    },
    triggerHaptic,
    testAllHaptics,
    toggleHapticOnVideoEvents,
    triggerVideoEventHaptic: triggerVideoEventHapticWrapper,
  };
};

