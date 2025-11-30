import { ThemedText } from '@/src/shared/components/ThemedText';
import { ThemedView } from '@/src/shared/components/ThemedView';
import { t } from '@/src/shared/i18n';
import { getThemeColors, useTheme } from 'masterfabric-expo-core';
import React from 'react';
import { View } from 'react-native';
import { TypographyTestResult } from '../models/typography-helper-models';
import { typographyTestCardStyles } from '../styles/typography-test-card.styles';

interface TypographyTestCardProps {
  result: TypographyTestResult;
}

export function TypographyTestCard({ result }: TypographyTestCardProps) {
  const { currentTheme } = useTheme();
  const isDark = currentTheme === 'dark';
  const colors = getThemeColors(isDark);

  return (
    <ThemedView
      style={[
        typographyTestCardStyles.container,
        {
          backgroundColor: colors.surfaceBackground,
          borderColor: colors.surfaceBorder + '30',
        }
      ]}
    >
      <View style={typographyTestCardStyles.header}>
        <ThemedText
          type="defaultSemiBold"
          style={[typographyTestCardStyles.functionName, { color: colors.titleText }]}
        >
          {result.functionName}()
        </ThemedText>
      </View>

      <ThemedText
        style={[typographyTestCardStyles.description, { color: colors.bodyText }]}
      >
        {result.description}
      </ThemedText>

      <View style={typographyTestCardStyles.inputOutputContainer}>
        <View style={typographyTestCardStyles.inputOutputGroup}>
          <ThemedText
            type="defaultSemiBold"
            style={[typographyTestCardStyles.label, { color: colors.sectionTitle }]}
          >
            {t('helpers.typographyHelper.input')}
          </ThemedText>
          <ThemedView
            style={[
              typographyTestCardStyles.inputOutputBox,
              {
                backgroundColor: colors.inputBackground,
                borderColor: colors.surfaceBorder,
              }
            ]}
          >
            <ThemedText
              style={[typographyTestCardStyles.inputOutputText, { color: colors.bodyText }]}
            >
              {result.input}
            </ThemedText>
          </ThemedView>
        </View>

        <View style={typographyTestCardStyles.inputOutputGroup}>
          <ThemedText
            type="defaultSemiBold"
            style={[typographyTestCardStyles.label, { color: colors.sectionTitle }]}
          >
            {t('helpers.typographyHelper.output')}
          </ThemedText>
          <ThemedView
            style={[
              typographyTestCardStyles.inputOutputBox,
              {
                backgroundColor: colors.successBackground || colors.inputBackground,
                borderColor: colors.successBorder || colors.surfaceBorder,
              }
            ]}
          >
            <ThemedText
              style={[
                typographyTestCardStyles.inputOutputText,
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

