import { create } from 'zustand';
import {
  HapticFeedbackState,
  HapticFeedbackType,
  VideoPlayerHapticState,
  VideoPlayerState,
} from '../types/videoPlayerHaptic';

interface VideoPlayerHapticStore extends VideoPlayerHapticState {
  // Video player actions
  setVideoPlaying: (isPlaying: boolean) => void;
  setVideoPosition: (position: number) => void;
  setVideoDuration: (duration: number) => void;
  setVideoVolume: (volume: number) => void;
  setVideoPlaybackRate: (rate: number) => void;
  setVideoLoading: (isLoading: boolean) => void;
  setVideoError: (error: string | null) => void;
  resetVideoState: () => void;

  // Haptic actions
  setLastTriggeredHaptic: (type: HapticFeedbackType | null) => void;
  setHapticOnVideoEvents: (enabled: boolean) => void;
  resetHapticState: () => void;

  // Combined actions
  refresh: () => Promise<void>;
}

const initialVideoState: VideoPlayerState = {
  isPlaying: false,
  position: 0,
  duration: 0,
  volume: 0.5,
  playbackRate: 1.0,
  isLoading: false,
  error: null,
};

const initialHapticState: HapticFeedbackState = {
  lastTriggered: null,
  hapticOnVideoEvents: false,
  isSupported: true, // Will be checked in hook
};

export const useVideoPlayerHapticStore = create<VideoPlayerHapticStore>((set, get) => ({
  video: initialVideoState,
  haptic: initialHapticState,

  // Video player actions
  setVideoPlaying: (isPlaying: boolean) =>
    set((state) => ({
      video: { ...state.video, isPlaying },
    })),

  setVideoPosition: (position: number) =>
    set((state) => ({
      video: { ...state.video, position: Math.max(0, position) },
    })),

  setVideoDuration: (duration: number) =>
    set((state) => ({
      video: { ...state.video, duration: Math.max(0, duration) },
    })),

  setVideoVolume: (volume: number) =>
    set((state) => ({
      video: {
        ...state.video,
        volume: Math.max(0, Math.min(1, volume)),
      },
    })),

  setVideoPlaybackRate: (rate: number) =>
    set((state) => ({
      video: { ...state.video, playbackRate: rate },
    })),

  setVideoLoading: (isLoading: boolean) =>
    set((state) => ({
      video: { ...state.video, isLoading },
    })),

  setVideoError: (error: string | null) =>
    set((state) => ({
      video: { ...state.video, error },
    })),

  resetVideoState: () =>
    set({
      video: initialVideoState,
    }),

  // Haptic actions
  setLastTriggeredHaptic: (type: HapticFeedbackType | null) =>
    set((state) => ({
      haptic: { ...state.haptic, lastTriggered: type },
    })),

  setHapticOnVideoEvents: (enabled: boolean) =>
    set((state) => ({
      haptic: { ...state.haptic, hapticOnVideoEvents: enabled },
    })),

  resetHapticState: () =>
    set({
      haptic: initialHapticState,
    }),

  // Combined actions
  refresh: async () => {
    set((state) => ({
      video: { ...state.video, isLoading: true, error: null },
    }));

    try {
      // Simulate refresh - in real implementation, this would check video player status
      await new Promise((resolve) => setTimeout(resolve, 500));

      set((state) => ({
        video: { ...state.video, isLoading: false },
      }));
    } catch (error) {
      set((state) => ({
        video: {
          ...state.video,
          isLoading: false,
          error: error instanceof Error ? error.message : 'Failed to refresh',
        },
      }));
    }
  },
}));
