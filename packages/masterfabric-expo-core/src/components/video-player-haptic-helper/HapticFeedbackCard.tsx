import { Ionicons } from '@expo/vector-icons';
import { Pressable, Switch, View } from 'react-native';
import { ThemedText } from '../ThemedText';
import { ThemedView } from '../ThemedView';
import { useTheme } from '../../contexts/ThemeContext';
import { getThemeColors } from '../../constants/Colors';
import { HapticFeedbackType } from '../../types/videoPlayerHaptic';
import { hapticFeedbackCardStyles } from '../../styles/haptic_feedback_card.styles';

interface HapticFeedbackCardProps {
  hapticState: {
    lastTriggered: HapticFeedbackType | null;
    hapticOnVideoEvents: boolean;
  };
  onTriggerHaptic: (type: HapticFeedbackType) => void;
  onTestAll: () => void;
  onToggleVideoEvents: (enabled: boolean) => void;
  hapticOnVideoEvents: boolean;
}

const HAPTIC_TYPES: Array<{
  type: HapticFeedbackType;
  label: string;
  icon: keyof typeof Ionicons.glyphMap;
  description: string;
}> = [
  {
    type: 'light',
    label: 'Light Impact',
    icon: 'flash-outline',
    description: 'Subtle feedback for light interactions',
  },
  {
    type: 'medium',
    label: 'Medium Impact',
    icon: 'flash',
    description: 'Standard feedback for regular interactions',
  },
  {
    type: 'heavy',
    label: 'Heavy Impact',
    icon: 'flash',
    description: 'Strong feedback for important actions',
  },
  {
    type: 'success',
    label: 'Success',
    icon: 'checkmark-circle',
    description: 'Positive feedback for successful actions',
  },
  {
    type: 'warning',
    label: 'Warning',
    icon: 'warning',
    description: 'Alert feedback for warnings',
  },
  {
    type: 'error',
    label: 'Error',
    icon: 'close-circle',
    description: 'Negative feedback for errors',
  },
  {
    type: 'selection',
    label: 'Selection',
    icon: 'radio-button-on',
    description: 'Feedback for selection changes',
  },
];

export function HapticFeedbackCard({
  hapticState,
  onTriggerHaptic,
  onTestAll,
  onToggleVideoEvents,
  hapticOnVideoEvents,
}: HapticFeedbackCardProps) {
  const { currentTheme } = useTheme();
  const isDark = currentTheme === 'dark';
  const colors = getThemeColors(isDark);

  return (
    <ThemedView
      style={[
        hapticFeedbackCardStyles.container,
        {
          backgroundColor: colors.surfaceBackground,
          borderColor: colors.surfaceBorder + '30',
        },
      ]}
    >
      <View style={hapticFeedbackCardStyles.header}>
        <ThemedText
          type="subtitle"
          style={[hapticFeedbackCardStyles.title, { color: colors.sectionTitle }]}
        >
          Haptic Feedback
        </ThemedText>
        <Ionicons name="phone-portrait" size={20} color={colors.tint} />
      </View>

      <View style={hapticFeedbackCardStyles.toggleContainer}>
        <View style={hapticFeedbackCardStyles.toggleRow}>
          <View style={hapticFeedbackCardStyles.toggleLabelContainer}>
            <ThemedText
              style={[hapticFeedbackCardStyles.toggleLabel, { color: colors.text }]}
            >
              Haptic on Video Events
            </ThemedText>
            <ThemedText
              style={[
                hapticFeedbackCardStyles.toggleDescription,
                { color: colors.text, opacity: 0.6 },
              ]}
            >
              Trigger haptics when video plays, pauses, or seeks
            </ThemedText>
          </View>
          <Switch
            value={hapticOnVideoEvents}
            onValueChange={onToggleVideoEvents}
            trackColor={{ false: colors.surfaceBorder, true: colors.tint + '50' }}
            thumbColor={hapticOnVideoEvents ? colors.tint : colors.surfaceBorder}
          />
        </View>
      </View>

      <View style={hapticFeedbackCardStyles.hapticsContainer}>
        {HAPTIC_TYPES.map((haptic) => {
          const isActive = hapticState.lastTriggered === haptic.type;
          return (
            <Pressable
              key={haptic.type}
              style={[
                hapticFeedbackCardStyles.hapticButton,
                {
                  backgroundColor: isActive
                    ? colors.tint + '20'
                    : colors.surfaceBorder + '10',
                  borderColor: isActive ? colors.tint : colors.surfaceBorder + '30',
                },
              ]}
              onPress={() => onTriggerHaptic(haptic.type)}
            >
              <View style={hapticFeedbackCardStyles.hapticButtonContent}>
                <Ionicons
                  name={haptic.icon}
                  size={24}
                  color={isActive ? colors.tint : colors.text}
                />
                <View style={hapticFeedbackCardStyles.hapticButtonText}>
                  <ThemedText
                    style={[
                      hapticFeedbackCardStyles.hapticButtonLabel,
                      {
                        color: isActive ? colors.tint : colors.text,
                        fontWeight: isActive ? '600' : '400',
                      },
                    ]}
                  >
                    {haptic.label}
                  </ThemedText>
                  <ThemedText
                    style={[
                      hapticFeedbackCardStyles.hapticButtonDescription,
                      { color: colors.text, opacity: 0.6 },
                    ]}
                  >
                    {haptic.description}
                  </ThemedText>
                </View>
              </View>
            </Pressable>
          );
        })}
      </View>

      <Pressable
        style={[
          hapticFeedbackCardStyles.testAllButton,
          {
            backgroundColor: colors.tint + '20',
            borderColor: colors.tint,
          },
        ]}
        onPress={onTestAll}
      >
        <Ionicons name="play" size={20} color={colors.tint} />
        <ThemedText
          style={[hapticFeedbackCardStyles.testAllButtonText, { color: colors.tint }]}
        >
          Test All Haptics Sequentially
        </ThemedText>
      </Pressable>
    </ThemedView>
  );
}
