import { useCallback } from 'react';
import { useVideoPlayerStore } from '../stores/videoPlayerStore';

export const useVideoPlayerHelper = () => {
  const {
    isPlaying,
    position,
    duration,
    volume,
    playbackRate,
    isLoading,
    error,
    setVideoPlaying,
    setVideoPosition,
    setVideoDuration,
    setVideoVolume,
    setVideoPlaybackRate,
    setVideoLoading,
    setVideoError,
    refresh,
  } = useVideoPlayerStore();

  // Handle video play
  const playVideo = useCallback(async () => {
    try {
      setVideoLoading(true);
      setVideoError(null);
      setVideoPlaying(true);
      setVideoLoading(false);
    } catch (error) {
      setVideoError(error instanceof Error ? error.message : 'Failed to play video');
      setVideoLoading(false);
    }
  }, [setVideoPlaying, setVideoLoading, setVideoError]);

  // Handle video pause
  const pauseVideo = useCallback(async () => {
    try {
      setVideoPlaying(false);
    } catch (error) {
      setVideoError(error instanceof Error ? error.message : 'Failed to pause video');
    }
  }, [setVideoPlaying, setVideoError]);

  // Handle video stop
  const stopVideo = useCallback(() => {
    setVideoPlaying(false);
    setVideoPosition(0);
    setVideoError(null);
  }, [setVideoPlaying, setVideoPosition, setVideoError]);

  // Handle video seek
  const seekVideo = useCallback(
    async (position: number) => {
      try {
        setVideoPosition(position);
      } catch (error) {
        setVideoError(error instanceof Error ? error.message : 'Failed to seek video');
      }
    },
    [setVideoPosition, setVideoError]
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

  // Handle refresh
  const handleRefresh = useCallback(async () => {
    await refresh();
  }, [refresh]);

  // Handle playback status update from real video player
  const handlePlaybackStatusUpdate = useCallback(
    (status: {
      isPlaying: boolean;
      positionMillis: number;
      durationMillis: number;
      isBuffering: boolean;
    }) => {
      // Update position in seconds
      setVideoPosition(status.positionMillis / 1000);
      // Update duration in seconds
      if (status.durationMillis > 0) {
        setVideoDuration(status.durationMillis / 1000);
      }
      // Update loading/buffering state
      setVideoLoading(status.isBuffering);
    },
    [setVideoPosition, setVideoDuration, setVideoLoading]
  );

  return {
    videoState: {
      isPlaying,
      position,
      duration,
      volume,
      playbackRate,
      isLoading,
      error,
    },
    isLoading,
    error,
    handleRefresh,
    playVideo,
    pauseVideo,
    stopVideo,
    seekVideo,
    setVolume,
    setPlaybackRate,
    handlePlaybackStatusUpdate,
  };
};

