import { t } from '@/src/shared/i18n';
import { getThemeColors, ThemedText, ThemedView, useTheme } from 'masterfabric-expo-core';
import React from 'react';
import { View } from 'react-native';
import { RichTextTestCardProps } from '../models/rich-text-helper-models';
import { richTextTestCardStyles } from '../styles/rich-text-test-card.styles';

export function RichTextTestCard({ result }: RichTextTestCardProps) {
  const { currentTheme } = useTheme();
  const isDark = currentTheme === 'dark';
  const colors = getThemeColors(isDark);

  return (
    <ThemedView
      style={[
        richTextTestCardStyles.container,
        {
          backgroundColor: colors.surfaceBackground,
          borderColor: isDark ? colors.cardBorderDark : colors.cardBorderLight,
        },
      ]}
    >
      <View style={richTextTestCardStyles.header}>
        <ThemedText
          type="defaultSemiBold"
          style={[richTextTestCardStyles.functionName, { color: colors.titleText }]}
        >
          {result.functionName}()
        </ThemedText>
      </View>

      <ThemedText
        style={[richTextTestCardStyles.description, { color: colors.bodyText }]}
      >
        {result.description}
      </ThemedText>

      <View style={richTextTestCardStyles.inputOutputContainer}>
        <View style={richTextTestCardStyles.inputOutputGroup}>
          <ThemedText
            type="defaultSemiBold"
            style={[richTextTestCardStyles.label, { color: colors.sectionTitle }]}
          >
            {t('helpers.richTextHelper.input')}
          </ThemedText>
          <ThemedView
            style={[
              richTextTestCardStyles.inputOutputBox,
              {
                backgroundColor: colors.inputBackground,
                borderColor: colors.surfaceBorder,
              },
            ]}
          >
            <ThemedText
              style={[richTextTestCardStyles.inputOutputText, { color: colors.bodyText }]}
            >
              {result.input}
            </ThemedText>
          </ThemedView>
        </View>

        <View style={richTextTestCardStyles.inputOutputGroup}>
          <ThemedText
            type="defaultSemiBold"
            style={[richTextTestCardStyles.label, { color: colors.sectionTitle }]}
          >
            {t('helpers.richTextHelper.output')}
          </ThemedText>
          <ThemedView
            style={[
              richTextTestCardStyles.inputOutputBox,
              {
                backgroundColor: colors.successBackground || colors.inputBackground,
                borderColor: colors.successBorder || colors.surfaceBorder,
              },
            ]}
          >
            <ThemedText
              style={[
                richTextTestCardStyles.inputOutputText,
                { color: colors.successText || colors.bodyText },
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

