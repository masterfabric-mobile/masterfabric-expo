import { create } from 'zustand';
import { VideoPlayerState } from '../types/videoPlayerHaptic';

interface VideoPlayerStore extends VideoPlayerState {
  // Video player actions
  setVideoPlaying: (isPlaying: boolean) => void;
  setVideoPosition: (position: number) => void;
  setVideoDuration: (duration: number) => void;
  setVideoVolume: (volume: number) => void;
  setVideoPlaybackRate: (rate: number) => void;
  setVideoLoading: (isLoading: boolean) => void;
  setVideoError: (error: string | null) => void;
  resetVideoState: () => void;
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

export const useVideoPlayerStore = create<VideoPlayerStore>((set, get) => ({
  ...initialVideoState,

  // Video player actions
  setVideoPlaying: (isPlaying: boolean) =>
    set({ isPlaying }),

  setVideoPosition: (position: number) =>
    set({ position: Math.max(0, position) }),

  setVideoDuration: (duration: number) =>
    set({ duration: Math.max(0, duration) }),

  setVideoVolume: (volume: number) =>
    set({ volume: Math.max(0, Math.min(1, volume)) }),

  setVideoPlaybackRate: (rate: number) =>
    set({ playbackRate: rate }),

  setVideoLoading: (isLoading: boolean) =>
    set({ isLoading }),

  setVideoError: (error: string | null) =>
    set({ error }),

  resetVideoState: () =>
    set(initialVideoState),

  // Combined actions
  refresh: async () => {
    set({ isLoading: true, error: null });

    try {
      // Simulate refresh - in real implementation, this would check video player status
      await new Promise((resolve) => setTimeout(resolve, 500));

      set({ isLoading: false });
    } catch (error) {
      set({
        isLoading: false,
        error: error instanceof Error ? error.message : 'Failed to refresh',
      });
    }
  },
}));

