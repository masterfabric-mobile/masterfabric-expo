import { Ionicons } from '@expo/vector-icons';
import { View } from 'react-native';
import { ThemedText } from '../ThemedText';
import { ThemedView } from '../ThemedView';
import { useTheme } from '../../contexts/ThemeContext';
import { getThemeColors } from '../../constants/Colors';
import { formatVideoTime } from '../../helpers/videoPlayerHapticHelper';
import { videoPlayerStatusCardStyles } from '../../styles/video_player_status_card.styles';

interface VideoPlayerStatusCardProps {
  isPlaying: boolean;
  position: number;
  duration: number;
  volume: number;
  playbackRate: number;
  isLoading: boolean;
}

export function VideoPlayerStatusCard({
  isPlaying,
  position,
  duration,
  volume,
  playbackRate,
  isLoading,
}: VideoPlayerStatusCardProps) {
  const { currentTheme } = useTheme();
  const isDark = currentTheme === 'dark';
  const colors = getThemeColors(isDark);

  const progress = duration > 0 ? (position / duration) * 100 : 0;
  const progressColor = isPlaying ? colors.tint : colors.surfaceBorder;

  return (
    <ThemedView
      style={[
        videoPlayerStatusCardStyles.container,
        {
          backgroundColor: colors.surfaceBackground,
          borderColor: colors.surfaceBorder + '30',
        },
      ]}
    >
      <View style={videoPlayerStatusCardStyles.header}>
        <ThemedText
          type="subtitle"
          style={[videoPlayerStatusCardStyles.title, { color: colors.sectionTitle }]}
        >
          Video Player Status
        </ThemedText>
        {isLoading ? (
          <Ionicons name="hourglass-outline" size={20} color={colors.tint} />
        ) : isPlaying ? (
          <Ionicons name="play-circle" size={20} color={progressColor} />
        ) : (
          <Ionicons name="pause-circle" size={20} color={colors.surfaceBorder} />
        )}
      </View>

      <View style={videoPlayerStatusCardStyles.statusContainer}>
        <View style={videoPlayerStatusCardStyles.progressContainer}>
          <View
            style={[
              videoPlayerStatusCardStyles.progressBar,
              {
                backgroundColor: colors.surfaceBorder + '30',
              },
            ]}
          >
            <View
              style={[
                videoPlayerStatusCardStyles.progressFill,
                {
                  width: `${progress}%`,
                  backgroundColor: progressColor,
                },
              ]}
            />
          </View>
        </View>

        <View style={videoPlayerStatusCardStyles.timeContainer}>
          <ThemedText
            style={[videoPlayerStatusCardStyles.timeText, { color: colors.text }]}
          >
            {formatVideoTime(position)}
          </ThemedText>
          <ThemedText
            style={[videoPlayerStatusCardStyles.timeText, { color: colors.text, opacity: 0.6 }]}
          >
            / {formatVideoTime(duration)}
          </ThemedText>
        </View>

        <View style={[videoPlayerStatusCardStyles.infoRow, { borderTopColor: colors.surfaceBorder + '30' }]}>
          <View style={videoPlayerStatusCardStyles.infoItem}>
            <ThemedText
              style={[videoPlayerStatusCardStyles.infoLabel, { color: colors.text }]}
            >
              Status
            </ThemedText>
            <ThemedText
              style={[videoPlayerStatusCardStyles.infoValue, { color: colors.text }]}
            >
              {isLoading ? 'Loading...' : isPlaying ? 'Playing' : 'Paused'}
            </ThemedText>
          </View>
          <View style={videoPlayerStatusCardStyles.infoItem}>
            <ThemedText
              style={[videoPlayerStatusCardStyles.infoLabel, { color: colors.text }]}
            >
              Volume
            </ThemedText>
            <ThemedText
              style={[videoPlayerStatusCardStyles.infoValue, { color: colors.text }]}
            >
              {Math.round(volume * 100)}%
            </ThemedText>
          </View>
          <View style={videoPlayerStatusCardStyles.infoItem}>
            <ThemedText
              style={[videoPlayerStatusCardStyles.infoLabel, { color: colors.text }]}
            >
              Speed
            </ThemedText>
            <ThemedText
              style={[videoPlayerStatusCardStyles.infoValue, { color: colors.text }]}
            >
              {playbackRate}x
            </ThemedText>
          </View>
        </View>
      </View>
    </ThemedView>
  );
}
