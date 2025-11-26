import { t } from '@/src/shared/i18n';
import {
  getThemeColors,
  ThemedText,
  ThemedView,
  useTheme,
} from 'masterfabric-expo-core';
import React from 'react';
import { View } from 'react-native';
import { ValidatorTestResult } from '../models/validator-helper-models';
import { validatorTestCardStyles } from '../styles/validator-test-card.styles';
import { addBorderOpacity, translateErrorMessage } from '../utils/validator-helper-utils';

interface ValidatorTestCardProps {
  result: ValidatorTestResult;
}

export function ValidatorTestCard({ result }: ValidatorTestCardProps) {
  const { currentTheme } = useTheme();
  const isDark = currentTheme === 'dark';
  const colors = getThemeColors(isDark);

  const isValid = result.result.isValid;
  const statusColor = isValid ? colors.successColor : colors.errorColor;
  const statusBgColor = isValid
    ? colors.successBackground
    : colors.validatorErrorBackground;
  const statusText = isValid
    ? t('helpers.validatorHelper.valid')
    : t('helpers.validatorHelper.invalid');

  return (
    <ThemedView
      style={[
        validatorTestCardStyles.container,
        {
          backgroundColor: colors.surfaceBackground,
          borderColor: addBorderOpacity(colors.surfaceBorder),
        },
      ]}
    >
      <View style={validatorTestCardStyles.header}>
        <ThemedText
          type="defaultSemiBold"
          style={[validatorTestCardStyles.validatorType, { color: colors.titleText }]}
        >
          {t(`helpers.validatorHelper.validatorTypes.${result.validatorType}`)}
        </ThemedText>
        <View
          style={[
            validatorTestCardStyles.statusBadge,
            { backgroundColor: statusBgColor },
          ]}
        >
          <ThemedText
            style={[validatorTestCardStyles.statusText, { color: statusColor }]}
          >
            {statusText}
          </ThemedText>
        </View>
      </View>

      <ThemedText
        style={[validatorTestCardStyles.description, { color: colors.bodyText }]}
      >
        {result.description}
      </ThemedText>

      <View style={validatorTestCardStyles.inputOutputContainer}>
        <View style={validatorTestCardStyles.inputOutputGroup}>
          <ThemedText
            type="defaultSemiBold"
            style={[validatorTestCardStyles.label, { color: colors.sectionTitle }]}
          >
            {t('helpers.validatorHelper.input')}
          </ThemedText>
          <ThemedView
            style={[
              validatorTestCardStyles.inputOutputBox,
              {
                backgroundColor: colors.inputBackground,
                borderColor: colors.surfaceBorder,
              },
            ]}
          >
            <ThemedText
              style={[
                validatorTestCardStyles.inputOutputText,
                { color: colors.bodyText },
              ]}
            >
              {result.input || t('helpers.validatorHelper.empty')}
            </ThemedText>
          </ThemedView>
        </View>

        {!isValid && result.result.error && (
          <View
            style={[
              validatorTestCardStyles.errorContainer,
              {
                backgroundColor: colors.validatorErrorBackground,
                borderColor: colors.validatorErrorBorder,
              },
            ]}
          >
            <ThemedText
              style={[
                validatorTestCardStyles.errorText,
                { color: colors.validatorErrorText },
              ]}
            >
              {translateErrorMessage(result.result.error)}
            </ThemedText>
            {result.result.errors && result.result.errors.length > 1 && (
              <View style={{ marginTop: 8 }}>
                {result.result.errors.slice(1).map((error: string, index: number) => (
                  <ThemedText
                    key={index}
                    style={[
                      validatorTestCardStyles.errorText,
                      { color: colors.validatorErrorText, marginTop: 4 },
                    ]}
                  >
                    • {translateErrorMessage(error)}
                  </ThemedText>
                ))}
              </View>
            )}
          </View>
        )}
      </View>
    </ThemedView>
  );
}

