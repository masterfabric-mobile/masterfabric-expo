import { Ionicons } from '@expo/vector-icons';
import { View } from 'react-native';
import { ThemedText } from '../ThemedText';
import { ThemedView } from '../ThemedView';
import { useTheme } from '../../contexts/ThemeContext';
import { getThemeColors } from '../../constants/Colors';
import { combinedDemoCardStyles } from '../../styles/combined_demo_card.styles';

interface CombinedDemoCardProps {
  videoState: {
    isPlaying: boolean;
    position: number;
    duration: number;
    volume: number;
    playbackRate: number;
    isLoading: boolean;
  };
  hapticState: {
    lastTriggered: string | null;
    hapticOnVideoEvents: boolean;
  };
  onPlayWithHaptic: () => void;
  onPauseWithHaptic: () => void;
  onSeekWithHaptic: (position: number) => void;
}

export function CombinedDemoCard({
  videoState,
  hapticState,
  onPlayWithHaptic,
  onPauseWithHaptic,
  onSeekWithHaptic,
}: CombinedDemoCardProps) {
  const { currentTheme } = useTheme();
  const isDark = currentTheme === 'dark';
  const colors = getThemeColors(isDark);

  return (
    <ThemedView
      style={[
        combinedDemoCardStyles.container,
        {
          backgroundColor: colors.surfaceBackground,
          borderColor: colors.surfaceBorder + '30',
        },
      ]}
    >
      <View style={combinedDemoCardStyles.header}>
        <ThemedText
          type="subtitle"
          style={[combinedDemoCardStyles.title, { color: colors.sectionTitle }]}
        >
          Combined Demo
        </ThemedText>
        <Ionicons name="sync" size={20} color={colors.tint} />
      </View>

      <ThemedText
        style={[combinedDemoCardStyles.description, { color: colors.text, opacity: 0.7 }]}
      >
        This demonstrates how video player controls can be enhanced with haptic feedback.
        When "Haptic on Video Events" is enabled, haptics will trigger automatically
        during video interactions.
      </ThemedText>

      <View style={combinedDemoCardStyles.infoContainer}>
        <View style={[combinedDemoCardStyles.infoRow, { borderBottomColor: colors.surfaceBorder + '30' }]}>
          <ThemedText
            style={[combinedDemoCardStyles.infoLabel, { color: colors.text }]}
          >
            Haptic Integration
          </ThemedText>
          <View style={combinedDemoCardStyles.statusBadge}>
            <Ionicons
              name={hapticState.hapticOnVideoEvents ? 'checkmark-circle' : 'close-circle'}
              size={16}
              color={hapticState.hapticOnVideoEvents ? colors.tint : colors.errorColor}
            />
            <ThemedText
              style={[
                combinedDemoCardStyles.statusText,
                {
                  color: hapticState.hapticOnVideoEvents ? colors.tint : colors.errorColor,
                },
              ]}
            >
              {hapticState.hapticOnVideoEvents ? 'Enabled' : 'Disabled'}
            </ThemedText>
          </View>
        </View>

        <View style={[combinedDemoCardStyles.infoRow, { borderBottomColor: colors.surfaceBorder + '30' }]}>
          <ThemedText
            style={[combinedDemoCardStyles.infoLabel, { color: colors.text }]}
          >
            Last Haptic Triggered
          </ThemedText>
          <ThemedText
            style={[combinedDemoCardStyles.infoValue, { color: colors.text }]}
          >
            {hapticState.lastTriggered || 'None'}
          </ThemedText>
        </View>

        <View style={combinedDemoCardStyles.infoRow}>
          <ThemedText
            style={[combinedDemoCardStyles.infoLabel, { color: colors.text }]}
          >
            Video Status
          </ThemedText>
          <ThemedText
            style={[combinedDemoCardStyles.infoValue, { color: colors.text }]}
          >
            {videoState.isLoading
              ? 'Loading...'
              : videoState.isPlaying
              ? 'Playing'
              : 'Paused'}
          </ThemedText>
        </View>
      </View>

      <ThemedText
        style={[combinedDemoCardStyles.note, { color: colors.text, opacity: 0.5 }]}
      >
        💡 Tip: Enable "Haptic on Video Events" and use the video controls above
        to experience haptic feedback during playback interactions.
      </ThemedText>
    </ThemedView>
  );
}
