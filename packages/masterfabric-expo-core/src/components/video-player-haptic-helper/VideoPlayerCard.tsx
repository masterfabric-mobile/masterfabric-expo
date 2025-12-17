import { Ionicons } from '@expo/vector-icons';
import { useState } from 'react';
import { Button, Pressable, Slider, View } from 'react-native';
import { ThemedText } from '../ThemedText';
import { ThemedView } from '../ThemedView';
import { useTheme } from '../../contexts/ThemeContext';
import { getThemeColors } from '../../constants/Colors';
import { videoPlayerCardStyles } from '../../styles/video_player_card.styles';

interface VideoPlayerCardProps {
  isPlaying: boolean;
  isLoading: boolean;
  onPlay: () => void;
  onPause: () => void;
  onStop: () => void;
  onSeek: (position: number) => void;
  onVolumeChange: (volume: number) => void;
  onPlaybackRateChange: (rate: number) => void;
  currentVolume: number;
  currentPlaybackRate: number;
}

const PLAYBACK_RATES = [0.5, 0.75, 1.0, 1.25, 1.5, 2.0];

export function VideoPlayerCard({
  isPlaying,
  isLoading,
  onPlay,
  onPause,
  onStop,
  onSeek,
  onVolumeChange,
  onPlaybackRateChange,
  currentVolume,
  currentPlaybackRate,
}: VideoPlayerCardProps) {
  const { currentTheme } = useTheme();
  const isDark = currentTheme === 'dark';
  const colors = getThemeColors(isDark);
  const [seekPosition, setSeekPosition] = useState(0);

  const handleSeek = (value: number) => {
    setSeekPosition(value);
    onSeek(value);
  };

  return (
    <ThemedView
      style={[
        videoPlayerCardStyles.container,
        {
          backgroundColor: colors.surfaceBackground,
          borderColor: colors.surfaceBorder + '30',
        },
      ]}
    >
      <View style={videoPlayerCardStyles.header}>
        <ThemedText
          type="subtitle"
          style={[videoPlayerCardStyles.title, { color: colors.sectionTitle }]}
        >
          Video Controls
        </ThemedText>
        <Ionicons name="videocam" size={20} color={colors.tint} />
      </View>

      <View style={videoPlayerCardStyles.controlsContainer}>
        <View style={videoPlayerCardStyles.buttonRow}>
          <Pressable
            style={[
              videoPlayerCardStyles.controlButton,
              {
                backgroundColor: colors.tint + '20',
                borderColor: colors.tint,
              },
            ]}
            onPress={isPlaying ? onPause : onPlay}
            disabled={isLoading}
          >
            <Ionicons
              name={isPlaying ? 'pause' : 'play'}
              size={24}
              color={colors.tint}
            />
          </Pressable>

          <Pressable
            style={[
              videoPlayerCardStyles.controlButton,
              {
                backgroundColor: colors.errorColor + '20',
                borderColor: colors.errorColor,
              },
            ]}
            onPress={onStop}
            disabled={isLoading}
          >
            <Ionicons name="stop" size={24} color={colors.errorColor} />
          </Pressable>
        </View>

        <View style={videoPlayerCardStyles.sliderContainer}>
          <ThemedText
            style={[videoPlayerCardStyles.sliderLabel, { color: colors.text }]}
          >
            Seek Position (seconds)
          </ThemedText>
          <Slider
            style={videoPlayerCardStyles.slider}
            minimumValue={0}
            maximumValue={100}
            value={seekPosition}
            onValueChange={handleSeek}
            minimumTrackTintColor={colors.tint}
            maximumTrackTintColor={colors.surfaceBorder}
            thumbTintColor={colors.tint}
            disabled={isLoading}
          />
          <ThemedText
            style={[videoPlayerCardStyles.sliderValue, { color: colors.text }]}
          >
            {Math.round(seekPosition)}s
          </ThemedText>
        </View>

        <View style={videoPlayerCardStyles.sliderContainer}>
          <ThemedText
            style={[videoPlayerCardStyles.sliderLabel, { color: colors.text }]}
          >
            Volume: {Math.round(currentVolume * 100)}%
          </ThemedText>
          <Slider
            style={videoPlayerCardStyles.slider}
            minimumValue={0}
            maximumValue={1}
            value={currentVolume}
            onValueChange={onVolumeChange}
            minimumTrackTintColor={colors.tint}
            maximumTrackTintColor={colors.surfaceBorder}
            thumbTintColor={colors.tint}
            disabled={isLoading}
          />
        </View>

        <View style={videoPlayerCardStyles.playbackRateContainer}>
          <ThemedText
            style={[videoPlayerCardStyles.sliderLabel, { color: colors.text }]}
          >
            Playback Rate: {currentPlaybackRate}x
          </ThemedText>
          <View style={videoPlayerCardStyles.playbackRateButtons}>
            {PLAYBACK_RATES.map((rate) => (
              <Pressable
                key={rate}
                style={[
                  videoPlayerCardStyles.playbackRateButton,
                  {
                    backgroundColor:
                      currentPlaybackRate === rate
                        ? colors.tint + '30'
                        : colors.surfaceBorder + '20',
                    borderColor:
                      currentPlaybackRate === rate ? colors.tint : colors.surfaceBorder,
                  },
                ]}
                onPress={() => onPlaybackRateChange(rate)}
                disabled={isLoading}
              >
                <ThemedText
                  style={[
                    videoPlayerCardStyles.playbackRateText,
                    {
                      color:
                        currentPlaybackRate === rate ? colors.tint : colors.text,
                      fontWeight: currentPlaybackRate === rate ? '600' : '400',
                    },
                  ]}
                >
                  {rate}x
                </ThemedText>
              </Pressable>
            ))}
          </View>
        </View>
      </View>
    </ThemedView>
  );
}
