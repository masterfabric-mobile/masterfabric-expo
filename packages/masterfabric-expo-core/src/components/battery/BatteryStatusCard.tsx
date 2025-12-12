import { Ionicons } from '@expo/vector-icons';
import { View } from 'react-native';
import { ThemedText } from '../ThemedText';
import { ThemedView } from '../ThemedView';
import { getThemeColors, useTheme } from '../../contexts/ThemeContext';
import { getBatteryColor } from '../../helpers/batteryHelper';
import { batteryStatusCardStyles } from '../../styles/battery_status_card.styles';

interface BatteryStatusCardProps {
  batteryLevel: number;
  isCharging: boolean;
  chargingStatusText: string;
  batteryPercentage: string;
}

export function BatteryStatusCard({
  batteryLevel,
  isCharging,
  chargingStatusText,
  batteryPercentage,
}: BatteryStatusCardProps) {
  const { currentTheme } = useTheme();
  const isDark = currentTheme === 'dark';
  const colors = getThemeColors(isDark);
  const batteryColor = getBatteryColor(batteryLevel, isDark);

  const batteryWidth = Math.max(10, batteryLevel * 100);

  return (
    <ThemedView
      style={[
        batteryStatusCardStyles.container,
        {
          backgroundColor: colors.surfaceBackground,
          borderColor: colors.surfaceBorder + '30',
        },
      ]}
    >
      <View style={batteryStatusCardStyles.header}>
        <ThemedText
          type="subtitle"
          style={[batteryStatusCardStyles.title, { color: colors.sectionTitle }]}
        >
          Battery Status
        </ThemedText>
        {isCharging && (
          <Ionicons name="flash" size={20} color={batteryColor} />
        )}
      </View>

      <View style={batteryStatusCardStyles.batteryContainer}>
        <View
          style={[
            batteryStatusCardStyles.batteryIcon,
            {
              borderColor: colors.surfaceBorder,
              backgroundColor: colors.background,
            },
          ]}
        >
          <View
            style={[
              batteryStatusCardStyles.batteryLevel,
              {
                width: `${batteryWidth}%`,
                backgroundColor: batteryColor,
              },
            ]}
          />
          <View
            style={[
              batteryStatusCardStyles.batteryTip,
              {
                backgroundColor: colors.surfaceBorder,
              },
            ]}
          />
        </View>

        <ThemedText
          style={[batteryStatusCardStyles.percentage, { color: colors.text }]}
        >
          {batteryPercentage}
        </ThemedText>

        <ThemedText
          style={[batteryStatusCardStyles.statusText, { color: colors.text }]}
        >
          {chargingStatusText}
        </ThemedText>
      </View>

      <View style={[batteryStatusCardStyles.infoRow, { borderTopColor: colors.surfaceBorder + '30' }]}>
        <View style={batteryStatusCardStyles.infoItem}>
          <ThemedText
            style={[batteryStatusCardStyles.infoLabel, { color: colors.text }]}
          >
            Level
          </ThemedText>
          <ThemedText
            style={[batteryStatusCardStyles.infoValue, { color: colors.text }]}
          >
            {batteryPercentage}
          </ThemedText>
        </View>
        <View style={batteryStatusCardStyles.infoItem}>
          <ThemedText
            style={[batteryStatusCardStyles.infoLabel, { color: colors.text }]}
          >
            Status
          </ThemedText>
          <ThemedText
            style={[batteryStatusCardStyles.infoValue, { color: colors.text }]}
          >
            {chargingStatusText}
          </ThemedText>
        </View>
      </View>
    </ThemedView>
  );
}

