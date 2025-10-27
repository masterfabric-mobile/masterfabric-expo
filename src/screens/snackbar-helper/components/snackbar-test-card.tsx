import { ThemedText } from '@/src/shared/components/ThemedText';
import { ThemedView } from '@/src/shared/components/ThemedView';
import { t } from '@/src/shared/i18n';
import { getThemeColors, useTheme } from 'masterfabric-expo-core';
import React from 'react';
import { View } from 'react-native';
import { SnackbarTestResult } from '../models/snackbar-helper-models';
import { snackbarTestCardStyles } from '../styles/snackbar-test-card.styles';

interface SnackbarTestCardProps {
  result: SnackbarTestResult;
}

export function SnackbarTestCard({ result }: SnackbarTestCardProps) {
  const { currentTheme } = useTheme();
  const isDark = currentTheme === 'dark';
  const colors = getThemeColors(isDark);

  return (
    <ThemedView
      style={[
        snackbarTestCardStyles.container,
        {
          backgroundColor: colors.surfaceBackground,
          borderColor: colors.surfaceBorder + '30',
        },
      ]}
    >
      <View style={snackbarTestCardStyles.header}>
        <ThemedText
          type="defaultSemiBold"
          style={[snackbarTestCardStyles.functionName, { color: colors.text }]}
        >
          {result.functionName}
        </ThemedText>
      </View>

      <View style={snackbarTestCardStyles.section}>
        <ThemedText
          type="defaultSemiBold"
          style={[snackbarTestCardStyles.sectionLabel, { color: colors.sectionTitle }]}
        >
          {t('helpers.snackbarHelper.inputLabel')}
        </ThemedText>
        <ThemedText
          style={[snackbarTestCardStyles.sectionValue, { color: colors.text }]}
        >
          {result.input}
        </ThemedText>
      </View>

      <View style={snackbarTestCardStyles.section}>
        <ThemedText
          type="defaultSemiBold"
          style={[snackbarTestCardStyles.sectionLabel, { color: colors.sectionTitle }]}
        >
          {t('helpers.snackbarHelper.outputLabel')}
        </ThemedText>
        <ThemedText
          style={[snackbarTestCardStyles.sectionValue, { color: colors.text }]}
        >
          {result.output}
        </ThemedText>
      </View>

      <View style={snackbarTestCardStyles.section}>
        <ThemedText
          type="defaultSemiBold"
          style={[snackbarTestCardStyles.sectionLabel, { color: colors.sectionTitle }]}
        >
          {t('helpers.snackbarHelper.descriptionLabel')}
        </ThemedText>
        <ThemedText
          style={[snackbarTestCardStyles.sectionValue, { color: colors.text }]}
        >
          {result.description}
        </ThemedText>
      </View>
    </ThemedView>
  );
}

