import { Button, Platform, View } from 'react-native';
import { ThemedText } from '../../../shared/components/ThemedText';
import { ThemedView } from '../../../shared/components/ThemedView';
import { getThemeColors } from '../../../shared/constants/Colors';
import { useTheme } from '../../../shared/contexts/theme-context';
import { lowPowerModeCardStyles } from '../styles/low-power-mode-card.styles';

interface LowPowerModeCardProps {
  lowPowerMode: boolean | null;
  lowPowerModeStatusText: string;
  onOpenSettings: () => void;
}

export function LowPowerModeCard({
  lowPowerMode,
  lowPowerModeStatusText,
  onOpenSettings,
}: LowPowerModeCardProps) {
  const { currentTheme } = useTheme();
  const isDark = currentTheme === 'dark';
  const colors = getThemeColors(isDark);

  const isAvailable = lowPowerMode !== null || Platform.OS === 'android';

  return (
    <ThemedView
      style={[
        lowPowerModeCardStyles.container,
        {
          backgroundColor: colors.surfaceBackground,
          borderColor: colors.surfaceBorder + '30',
        },
      ]}
    >
      <View style={lowPowerModeCardStyles.header}>
        <ThemedText
          type="subtitle"
          style={[lowPowerModeCardStyles.title, { color: colors.sectionTitle }]}
        >
          Low Power Mode
        </ThemedText>
      </View>

      <View style={lowPowerModeCardStyles.statusContainer}>
        <View
          style={[
            lowPowerModeCardStyles.statusIndicator,
            {
              backgroundColor:
                lowPowerMode === true
                  ? colors.errorColor
                  : lowPowerMode === false
                    ? colors.successColor
                    : colors.surfaceBorder,
            },
          ]}
        />
        <ThemedText
          style={[lowPowerModeCardStyles.statusText, { color: colors.text }]}
        >
          {lowPowerModeStatusText}
        </ThemedText>
      </View>

      <ThemedText
        style={[lowPowerModeCardStyles.description, { color: colors.text }]}
      >
        {Platform.OS === 'ios'
          ? 'Low Power Mode reduces background activity to save battery.'
          : 'Battery Saver mode helps improve battery life by limiting some features.'}
      </ThemedText>

      {isAvailable && (
        <Button
          title="Open Settings"
          onPress={onOpenSettings}
          color={colors.tint}
        />
      )}
    </ThemedView>
  );
}

