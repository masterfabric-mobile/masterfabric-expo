import { Ionicons } from '@expo/vector-icons';
import React, { useRef, useEffect, useCallback, useState } from 'react';
import { View, Pressable, StyleSheet, ActivityIndicator } from 'react-native';
import { VideoView, useVideoPlayer } from 'expo-video';
import { ThemedText } from '../ThemedText';
import { ThemedView } from '../ThemedView';
import { useTheme } from '../../contexts/ThemeContext';
import { getThemeColors } from '../../constants/Colors';

// Sample videos from public sources
const SAMPLE_VIDEOS = [
  {
    id: 'big-buck-bunny',
    title: 'Big Buck Bunny',
    uri: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
    thumbnail: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/images/BigBuckBunny.jpg',
  },
  {
    id: 'elephants-dream',
    title: 'Elephants Dream',
    uri: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4',
    thumbnail: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/images/ElephantsDream.jpg',
  },
  {
    id: 'sintel',
    title: 'Sintel',
    uri: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/Sintel.mp4',
    thumbnail: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/images/Sintel.jpg',
  },
];

interface VideoDisplayCardProps {
  isPlaying: boolean;
  volume: number;
  playbackRate: number;
  onPlaybackStatusUpdate?: (status: {
    isPlaying: boolean;
    positionMillis: number;
    durationMillis: number;
    isBuffering: boolean;
  }) => void;
  onPlay?: () => void;
  onPause?: () => void;
}

export function VideoDisplayCard({
  isPlaying,
  volume,
  playbackRate,
  onPlaybackStatusUpdate,
  onPlay,
  onPause,
}: VideoDisplayCardProps) {
  const { currentTheme } = useTheme();
  const isDark = currentTheme === 'dark';
  const colors = getThemeColors(isDark);
  const [selectedVideoIndex, setSelectedVideoIndex] = useState(0);
  const [isBuffering, setIsBuffering] = useState(false);
  const [hasError, setHasError] = useState(false);

  const selectedVideo = SAMPLE_VIDEOS[selectedVideoIndex];

  const player = useVideoPlayer(selectedVideo.uri, (p) => {
    p.loop = true;
    p.timeUpdateEventInterval = 0.5;
  });

  // Keep player state in sync with props
  useEffect(() => {
    player.volume = volume;
  }, [player, volume]);

  useEffect(() => {
    player.playbackRate = playbackRate;
  }, [player, playbackRate]);

  useEffect(() => {
    if (isPlaying) player.play();
    else player.pause();
  }, [player, isPlaying]);

  useEffect(() => {
    const statusSub = player.addListener('statusChange', ({ status, error }) => {
      setIsBuffering(status === 'loading');
      if (status === 'error') {
        console.warn('Video player error', error);
        setHasError(true);
      } else {
        setHasError(false);
      }
    });

    const playingSub = player.addListener('playingChange', ({ isPlaying: nowPlaying }) => {
      onPlaybackStatusUpdate?.({
        isPlaying: nowPlaying,
        positionMillis: Math.floor(player.currentTime * 1000),
        durationMillis: Math.floor(player.duration * 1000),
        isBuffering: player.status === 'loading',
      });
    });

    const timeSub = player.addListener('timeUpdate', ({ currentTime }) => {
      onPlaybackStatusUpdate?.({
        isPlaying: player.playing,
        positionMillis: Math.floor(currentTime * 1000),
        durationMillis: Math.floor(player.duration * 1000),
        isBuffering: player.status === 'loading',
      });
    });

    return () => {
      statusSub.remove();
      playingSub.remove();
      timeSub.remove();
    };
  }, [player, onPlaybackStatusUpdate]);

  const handleVideoPress = useCallback(() => {
    if (isPlaying) {
      onPause?.();
    } else {
      onPlay?.();
    }
  }, [isPlaying, onPlay, onPause]);

  const handleSelectVideo = useCallback((index: number) => {
    setSelectedVideoIndex(index);
    setHasError(false);
  }, []);

  return (
    <ThemedView
      style={[
        styles.container,
        {
          backgroundColor: colors.surfaceBackground,
          borderColor: colors.surfaceBorder + '30',
        },
      ]}
    >
      <View style={styles.header}>
        <ThemedText
          type="subtitle"
          style={[styles.title, { color: colors.sectionTitle }]}
        >
          Video Player
        </ThemedText>
        <Ionicons name="film" size={20} color={colors.tint} />
      </View>

      {/* Video Selection */}
      <View style={styles.videoSelector}>
        <ThemedText style={[styles.selectorLabel, { color: colors.text }]}>
          Select Video:
        </ThemedText>
        <View style={styles.videoButtons}>
          {SAMPLE_VIDEOS.map((video, index) => (
            <Pressable
              key={video.id}
              style={[
                styles.videoButton,
                {
                  backgroundColor:
                    selectedVideoIndex === index
                      ? colors.tint + '30'
                      : colors.surfaceBorder + '20',
                  borderColor:
                    selectedVideoIndex === index ? colors.tint : colors.surfaceBorder,
                },
              ]}
              onPress={() => handleSelectVideo(index)}
            >
              <ThemedText
                style={[
                  styles.videoButtonText,
                  {
                    color: selectedVideoIndex === index ? colors.tint : colors.text,
                    fontWeight: selectedVideoIndex === index ? '600' : '400',
                  },
                ]}
                numberOfLines={1}
              >
                {video.title}
              </ThemedText>
            </Pressable>
          ))}
        </View>
      </View>

      {/* Video Player */}
      <Pressable 
        style={styles.videoContainer}
        onPress={handleVideoPress}
      >
        {hasError ? (
          <View style={[styles.errorContainer, { backgroundColor: colors.errorColor + '20' }]}>
            <Ionicons name="alert-circle" size={48} color={colors.errorColor} />
            <ThemedText style={[styles.errorText, { color: colors.errorColor }]}>
              Failed to load video
            </ThemedText>
            <Pressable
              style={[styles.retryButton, { backgroundColor: colors.tint }]}
              onPress={() => setHasError(false)}
            >
              <ThemedText style={styles.retryButtonText}>Retry</ThemedText>
            </Pressable>
          </View>
        ) : (
          <>
            <VideoView
              player={player}
              style={styles.video}
              nativeControls={false}
              contentFit="contain"
            />
            
            {/* Play/Pause Overlay */}
            {!isPlaying && !isBuffering && (
              <View style={styles.playOverlay}>
                <View style={[styles.playButton, { backgroundColor: colors.tint + 'CC' }]}>
                  <Ionicons name="play" size={40} color="#FFFFFF" />
                </View>
              </View>
            )}

            {/* Buffering Indicator */}
            {isBuffering && (
              <View style={styles.bufferingOverlay}>
                <ActivityIndicator size="large" color={colors.tint} />
                <ThemedText style={[styles.bufferingText, { color: colors.text }]}>
                  Buffering...
                </ThemedText>
              </View>
            )}
          </>
        )}
      </Pressable>

      {/* Video Info */}
      <View style={[styles.videoInfo, { borderTopColor: colors.surfaceBorder + '30' }]}>
        <ThemedText style={[styles.videoTitle, { color: colors.text }]}>
          {selectedVideo.title}
        </ThemedText>
        <ThemedText style={[styles.videoHint, { color: colors.text + '80' }]}>
          Tap video to play/pause • Use controls below to adjust
        </ThemedText>
      </View>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    borderRadius: 16,
    borderWidth: 1,
    overflow: 'hidden',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    paddingBottom: 12,
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
  },
  videoSelector: {
    paddingHorizontal: 16,
    paddingBottom: 12,
  },
  selectorLabel: {
    fontSize: 14,
    marginBottom: 8,
    fontWeight: '500',
  },
  videoButtons: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  videoButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
    borderWidth: 1,
  },
  videoButtonText: {
    fontSize: 12,
  },
  videoContainer: {
    aspectRatio: 16 / 9,
    backgroundColor: '#000000',
    position: 'relative',
  },
  video: {
    flex: 1,
    backgroundColor: '#000000',
  },
  playOverlay: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
  },
  playButton: {
    width: 72,
    height: 72,
    borderRadius: 36,
    justifyContent: 'center',
    alignItems: 'center',
  },
  bufferingOverlay: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  bufferingText: {
    marginTop: 8,
    fontSize: 14,
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
  },
  errorText: {
    marginTop: 12,
    fontSize: 14,
    textAlign: 'center',
  },
  retryButton: {
    marginTop: 16,
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 8,
  },
  retryButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600',
  },
  videoInfo: {
    padding: 16,
    borderTopWidth: 1,
  },
  videoTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
  },
  videoHint: {
    fontSize: 12,
  },
});

