import { ThemedText } from '@/src/shared/components/ThemedText';
import { ThemedView } from '@/src/shared/components/ThemedView';
import { t } from '@/src/shared/i18n';
import { Sizing, getThemeColors, useTheme } from 'masterfabric-expo-core';
import React from 'react';
import { View } from 'react-native';
import { UISizeTestResult } from '../models/ui-size-helper-models';
import { uiSizeTestCardStyles } from '../styles/ui-size-test-card.styles';

interface UISizeTestCardProps {
  result: UISizeTestResult;
}

export function UISizeTestCard({ result }: UISizeTestCardProps) {
  const { currentTheme } = useTheme();
  const isDark = currentTheme === 'dark';
  const colors = getThemeColors(isDark);

  return (
    <ThemedView
      style={[
        uiSizeTestCardStyles.container,
        {
          backgroundColor: colors.surfaceBackground,
          borderColor: colors.surfaceBorder + '30',
        }
      ]}
    >
      <View style={uiSizeTestCardStyles.header}>
        <ThemedText
          type="defaultSemiBold"
          style={[uiSizeTestCardStyles.functionName, { color: colors.titleText }]}
        >
          {result.functionName}()
        </ThemedText>
        <ThemedView
          style={[
            uiSizeTestCardStyles.categoryBadge,
            {
              backgroundColor: colors.primary + '20',
            }
          ]}
        >
          <ThemedText
            style={[
              uiSizeTestCardStyles.categoryText,
              { color: colors.primary }
            ]}
          >
            {result.category}
          </ThemedText>
        </ThemedView>
      </View>

      <ThemedText
        style={[uiSizeTestCardStyles.description, { color: colors.bodyText }]}
      >
        {result.description}
      </ThemedText>

      <View style={uiSizeTestCardStyles.inputOutputContainer}>
        <View style={uiSizeTestCardStyles.inputOutputGroup}>
          <ThemedText
            type="defaultSemiBold"
            style={[uiSizeTestCardStyles.label, { color: colors.sectionTitle }]}
          >
            {t('helpers.uiSizeHelper.input')}
          </ThemedText>
          <ThemedView
            style={[
              uiSizeTestCardStyles.inputOutputBox,
              {
                backgroundColor: colors.inputBackground,
                borderColor: colors.surfaceBorder,
              }
            ]}
          >
            <ThemedText
              style={[uiSizeTestCardStyles.inputOutputText, { color: colors.bodyText }]}
            >
              {result.input}
            </ThemedText>
          </ThemedView>
        </View>

        <View style={uiSizeTestCardStyles.inputOutputGroup}>
          <ThemedText
            type="defaultSemiBold"
            style={[uiSizeTestCardStyles.label, { color: colors.sectionTitle }]}
          >
            {t('helpers.uiSizeHelper.output')}
          </ThemedText>
          <ThemedView
            style={[
              uiSizeTestCardStyles.inputOutputBox,
              {
                backgroundColor: colors.successBackground || colors.inputBackground,
                borderColor: colors.successBorder || colors.surfaceBorder,
              }
            ]}
          >
            <ThemedText
              style={[
                uiSizeTestCardStyles.inputOutputText,
                { color: colors.successText || colors.bodyText }
              ]}
            >
              {result.output}
            </ThemedText>
          </ThemedView>
        </View>
      </View>
    </ThemedView>
  );
}

