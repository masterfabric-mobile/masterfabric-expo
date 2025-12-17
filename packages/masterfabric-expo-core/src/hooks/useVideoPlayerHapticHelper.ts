import { useCallback, useEffect, useMemo } from 'react';
import { Platform } from 'react-native';
import {
  triggerHaptic as triggerHapticHelper,
  triggerVideoEventHaptic,
  isHapticSupported,
} from '../helpers/videoPlayerHapticHelper';
import { useVideoPlayerHapticStore } from '../stores/videoPlayerHapticStore';
import { HapticFeedbackType } from '../types/videoPlayerHaptic';

export const useVideoPlayerHapticHelper = () => {
  const {
    video: videoState,
    haptic: hapticState,
    setVideoPlaying,
    setVideoPosition,
    setVideoDuration,
    setVideoVolume,
    setVideoPlaybackRate,
    setVideoLoading,
    setVideoError,
    setLastTriggeredHaptic,
    setHapticOnVideoEvents,
    refresh,
  } = useVideoPlayerHapticStore();

  // Check haptic support on mount
  useEffect(() => {
    const supported = isHapticSupported();
    if (!supported && Platform.OS !== 'web') {
      console.warn('Haptic feedback is not fully supported on this platform');
    }
  }, []);

  // Handle video play with optional haptic
  const playVideo = useCallback(async () => {
    try {
      setVideoLoading(true);
      setVideoError(null);

      // Trigger haptic if enabled
      if (hapticState.hapticOnVideoEvents) {
        await triggerVideoEventHaptic('play');
        setLastTriggeredHaptic('light');
      }

      setVideoPlaying(true);
      setVideoLoading(false);
    } catch (error) {
      setVideoError(error instanceof Error ? error.message : 'Failed to play video');
      setVideoLoading(false);
    }
  }, [hapticState.hapticOnVideoEvents, setVideoPlaying, setVideoLoading, setVideoError, setLastTriggeredHaptic]);

  // Handle video pause with optional haptic
  const pauseVideo = useCallback(async () => {
    try {
      // Trigger haptic if enabled
      if (hapticState.hapticOnVideoEvents) {
        await triggerVideoEventHaptic('pause');
        setLastTriggeredHaptic('light');
      }

      setVideoPlaying(false);
    } catch (error) {
      setVideoError(error instanceof Error ? error.message : 'Failed to pause video');
    }
  }, [hapticState.hapticOnVideoEvents, setVideoPlaying, setVideoError, setLastTriggeredHaptic]);

  // Handle video stop
  const stopVideo = useCallback(() => {
    setVideoPlaying(false);
    setVideoPosition(0);
    setVideoError(null);
  }, [setVideoPlaying, setVideoPosition, setVideoError]);

  // Handle video seek with optional haptic
  const seekVideo = useCallback(
    async (position: number) => {
      try {
        // Trigger haptic if enabled
        if (hapticState.hapticOnVideoEvents) {
          await triggerVideoEventHaptic('seek');
          setLastTriggeredHaptic('selection');
        }

        setVideoPosition(position);
      } catch (error) {
        setVideoError(error instanceof Error ? error.message : 'Failed to seek video');
      }
    },
    [hapticState.hapticOnVideoEvents, setVideoPosition, setVideoError, setLastTriggeredHaptic]
  );

  // Handle volume change
  const setVolume = useCallback(
    (volume: number) => {
      setVideoVolume(volume);
    },
    [setVideoVolume]
  );

  // Handle playback rate change
  const setPlaybackRate = useCallback(
    (rate: number) => {
      setVideoPlaybackRate(rate);
    },
    [setVideoPlaybackRate]
  );

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

  // Handle refresh
  const handleRefresh = useCallback(async () => {
    await refresh();
  }, [refresh]);

  return {
    videoState,
    hapticState,
    isLoading: videoState.isLoading,
    error: videoState.error,
    handleRefresh,
    playVideo,
    pauseVideo,
    stopVideo,
    seekVideo,
    setVolume,
    setPlaybackRate,
    triggerHaptic,
    testAllHaptics,
    toggleHapticOnVideoEvents,
  };
};
