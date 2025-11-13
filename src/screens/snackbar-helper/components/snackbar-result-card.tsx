import { t } from '@/src/shared/i18n';
import { ThemedText, ThemedView, getThemeColors, useTheme } from 'masterfabric-expo-core';
import React from 'react';
import { View } from 'react-native';
import { SnackbarScenarioResult } from '../models/snackbar-helper-models';
import { snackbarResultCardStyles } from '../styles/snackbar-result-card.styles';

interface SnackbarResultCardProps {
  result: SnackbarScenarioResult;
}

export function SnackbarResultCard({ result }: SnackbarResultCardProps) {
  const { currentTheme } = useTheme();
  const isDark = currentTheme === 'dark';
  const colors = getThemeColors(isDark);

  return (
    <ThemedView
      style={[
        snackbarResultCardStyles.container,
        {
          backgroundColor: colors.surfaceBackground,
          borderColor: colors.surfaceBorder + '30',
        },
      ]}
    >
      <View style={snackbarResultCardStyles.header}>
        <ThemedText
          type="defaultSemiBold"
          style={[snackbarResultCardStyles.functionName, { color: colors.text }]}
        >
          {result.functionName}
        </ThemedText>
      </View>

      <View style={snackbarResultCardStyles.section}>
        <ThemedText
          type="defaultSemiBold"
          style={[snackbarResultCardStyles.sectionLabel, { color: colors.sectionTitle }]}
        >
          {t('helpers.snackbarHelper.inputLabel')}
        </ThemedText>
        <ThemedText
          style={[snackbarResultCardStyles.sectionValue, { color: colors.text }]}
        >
          {result.input}
        </ThemedText>
      </View>

      <View style={snackbarResultCardStyles.section}>
        <ThemedText
          type="defaultSemiBold"
          style={[snackbarResultCardStyles.sectionLabel, { color: colors.sectionTitle }]}
        >
          {t('helpers.snackbarHelper.outputLabel')}
        </ThemedText>
        <ThemedText
          style={[snackbarResultCardStyles.sectionValue, { color: colors.text }]}
        >
          {result.output}
        </ThemedText>
      </View>

      <View style={snackbarResultCardStyles.section}>
        <ThemedText
          type="defaultSemiBold"
          style={[snackbarResultCardStyles.sectionLabel, { color: colors.sectionTitle }]}
        >
          {t('helpers.snackbarHelper.descriptionLabel')}
        </ThemedText>
        <ThemedText
          style={[snackbarResultCardStyles.sectionValue, { color: colors.text }]}
        >
          {result.description}
        </ThemedText>
      </View>
    </ThemedView>
  );
}

