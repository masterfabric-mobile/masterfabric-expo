import { getThemeColors } from '../../constants/Colors';
import { useTheme } from '../../contexts/ThemeContext';
import { ThemedText } from '../ThemedText';
import { ThemedView } from '../ThemedView';
import React from 'react';
import { View, Platform, Button } from 'react-native';
import { lowPowerModeCardStyles } from '../../styles/LowPowerModeCard.styles';

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
          color={colors.primary}
        />
      )}
    </ThemedView>
  );
}

