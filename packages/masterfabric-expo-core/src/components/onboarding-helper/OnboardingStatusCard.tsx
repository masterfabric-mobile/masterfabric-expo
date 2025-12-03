
import React from 'react';
import { View, Button, ActivityIndicator } from 'react-native';
import { getThemeColors } from '../../constants/Colors';
import { useTheme } from '../../contexts/ThemeContext';
import { ThemedText } from '../ThemedText';
import { ThemedView } from '../ThemedView';
import { cardStyles } from '../../styles/card.styles'; // A new generic card style

interface OnboardingStatusCardProps {
  statusText: string;
  statusDescription: string;
  isLoading: boolean;
  hasCompleted: boolean;
  onComplete: () => void;
  onReset: () => void;
}

export function OnboardingStatusCard({
  statusText,
  statusDescription,
  isLoading,
  hasCompleted,
  onComplete,
  onReset,
}: OnboardingStatusCardProps) {
  const { currentTheme } = useTheme();
  const isDark = currentTheme === 'dark';
  const colors = getThemeColors(isDark);

  return (
    <ThemedView
      style={[
        cardStyles.container,
        {
          backgroundColor: colors.surfaceBackground,
          borderColor: colors.surfaceBorder + '30',
        },
      ]}
    >
      <View style={cardStyles.header}>
        <ThemedText
          type="subtitle"
          style={[cardStyles.title, { color: colors.sectionTitle }]}
        >
          Onboarding Status
        </ThemedText>
        {isLoading && <ActivityIndicator size="small" color={colors.primary} />}
      </View>

      <View style={cardStyles.statusContainer}>
        <View
          style={[
            cardStyles.statusIndicator,
            {
              backgroundColor: hasCompleted
                ? colors.successColor
                : colors.warningColor,
            },
          ]}
        />
        <ThemedText
          style={[cardStyles.statusText, { color: colors.text }]}
        >
          {statusText}
        </ThemedText>
      </View>

      <ThemedText
        style={[cardStyles.description, { color: colors.text }]}
      >
        {statusDescription}
      </ThemedText>

      <View style={cardStyles.buttonContainer}>
        <Button
          title="Mark as Completed"
          onPress={onComplete}
          disabled={isLoading || hasCompleted}
          color={colors.primary}
        />
        <View style={{ height: 8 }} />
        <Button
          title="Reset Status"
          onPress={onReset}
          disabled={isLoading || !hasCompleted}
          color={colors.errorColor}
        />
      </View>
    </ThemedView>
  );
}
