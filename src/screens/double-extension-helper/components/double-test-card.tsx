import React from 'react';
import { View } from 'react-native';
import { getThemeColors, ThemedText, ThemedView, useTheme } from 'masterfabric-expo-core';
import { t } from '@/src/shared/i18n';
import { BORDER_OPACITY_SUFFIX } from '../constants/double-helper.constants';
import type { DoubleTestResult } from '../models/double-helper-models';
import { doubleTestCardStyles } from '../styles/double-test-card.styles';

interface DoubleTestCardProps {
  result: DoubleTestResult;
}

export function DoubleTestCard({ result }: DoubleTestCardProps) {
  const { isDark } = useTheme();
  const colors = getThemeColors(isDark);

  return (
    <ThemedView
      style={
        [
          doubleTestCardStyles.container,
          {
            backgroundColor: colors.surfaceBackground,
            borderColor: colors.surfaceBorder + BORDER_OPACITY_SUFFIX,
          },
        ] as any
      }
    >
      <View style={doubleTestCardStyles.header as any}>
        <ThemedText
          type="defaultSemiBold"
          style={[doubleTestCardStyles.functionName, { color: colors.titleText }] as any}
        >
          {result.functionName}()
        </ThemedText>
      </View>

      <ThemedText
        style={[doubleTestCardStyles.description, { color: colors.bodyText }] as any}
      >
        {result.descriptionKey ? t(result.descriptionKey) : result.description}
      </ThemedText>

      <View style={doubleTestCardStyles.inputOutputContainer}>
        <View style={doubleTestCardStyles.inputOutputGroup}>
          <ThemedText
            type="defaultSemiBold"
            style={[doubleTestCardStyles.label, { color: colors.sectionTitle }] as any}
          >
            {t('helpers.doubleExtensionHelper.input')}
          </ThemedText>
          <ThemedView
            style={
              [
                doubleTestCardStyles.inputOutputBox,
                {
                  backgroundColor: colors.inputBackground,
                  borderColor: colors.surfaceBorder,
                },
              ] as any
            }
          >
            <ThemedText
              style={[doubleTestCardStyles.inputOutputText, { color: colors.bodyText }] as any}
            >
              {result.input}
            </ThemedText>
          </ThemedView>
        </View>

        <View style={doubleTestCardStyles.inputOutputGroup}>
          <ThemedText
            type="defaultSemiBold"
            style={[doubleTestCardStyles.label, { color: colors.sectionTitle }] as any}
          >
            {t('helpers.doubleExtensionHelper.output')}
            {result.success === false ? ` (${t('helpers.doubleExtensionHelper.fail')})` : ''}
          </ThemedText>
          <ThemedView
            style={
              [
                doubleTestCardStyles.inputOutputBox,
                result.success === false
                  ? {
                      backgroundColor: colors.validatorErrorBackground,
                      borderColor: colors.errorColor,
                    }
                  : {
                      backgroundColor: colors.successBackground ?? colors.inputBackground,
                      borderColor: colors.successBorder ?? colors.surfaceBorder,
                    },
              ] as any
            }
          >
            <ThemedText
              style={[
                doubleTestCardStyles.inputOutputText,
                result.success === false
                  ? { color: colors.errorColor }
                  : { color: colors.successText ?? colors.bodyText },
              ] as any}
            >
              {result.success === false
                ? ((result.errorMessage ?? result.output) || t('helpers.doubleExtensionHelper.invalidCurrencyOrLocale'))
                : result.output}
            </ThemedText>
          </ThemedView>
        </View>
      </View>
    </ThemedView>
  );
}
