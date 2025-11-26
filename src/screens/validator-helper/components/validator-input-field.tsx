import { Button } from '@/src/shared/components/button';
import { Dropdown } from '@/src/shared/components/Dropdown';
import { useLocale } from '@/src/shared/hooks/use-locale';
import { i18n, t } from '@/src/shared/i18n';
import {
  getThemeColors,
  ThemedText,
  ThemedView,
  useTheme,
  ValidatorType,
} from 'masterfabric-expo-core';
import React from 'react';
import { Switch, TextInput, View } from 'react-native';
import {
  DEFAULT_MAX_LENGTH_PLACEHOLDER,
  DEFAULT_MIN_LENGTH_PLACEHOLDER,
} from '../constants/validator-helper-constants';
import { ValidatorTestInput } from '../models/validator-helper-models';
import { validatorInputFieldStyles } from '../styles/validator-input-field.styles';
import { addBorderOpacity, getValidatorTypeOptions } from '../utils/validator-helper-utils';

interface ValidatorInputFieldProps {
  testInput: ValidatorTestInput;
  onInputChange: (updates: Partial<ValidatorTestInput>) => void;
  onRunTests: () => void;
  isLoading: boolean;
}

export function ValidatorInputField({
  testInput,
  onInputChange,
  onRunTests,
  isLoading,
}: ValidatorInputFieldProps) {
  const { currentTheme } = useTheme();
  const isDark = currentTheme === 'dark';
  const colors = getThemeColors(isDark);
  const { locale } = useLocale();

  // Ensure i18n locale is synced with context locale before translating
  // This must happen synchronously before calling t() to ensure correct translations
  if (i18n.locale !== locale) {
    i18n.locale = locale;
  }

  // Get validator type options (dynamically generated with translations)
  const validatorTypeOptions = getValidatorTypeOptions();

  return (
    <ThemedView
      style={[
        validatorInputFieldStyles.container,
        {
          backgroundColor: colors.surfaceBackground,
          borderColor: addBorderOpacity(colors.surfaceBorder),
        },
      ]}
    >
      <ThemedText
        type="subtitle"
        style={[validatorInputFieldStyles.title, { color: colors.sectionTitle }]}
      >
        {t('helpers.validatorHelper.testInput')}
      </ThemedText>

      <View style={validatorInputFieldStyles.inputGroup}>
        <ThemedText
          style={[validatorInputFieldStyles.label, { color: colors.bodyText }]}
        >
          {t('helpers.validatorHelper.validatorType')}
        </ThemedText>
        <Dropdown
          options={validatorTypeOptions}
          selectedValue={testInput.validatorType}
          onSelect={(value) => onInputChange({ validatorType: value as ValidatorType })}
          placeholder={t('helpers.validatorHelper.selectValidatorType')}
        />
      </View>

      <View style={validatorInputFieldStyles.inputGroup}>
        <ThemedText
          style={[validatorInputFieldStyles.label, { color: colors.bodyText }]}
        >
          {t('helpers.validatorHelper.inputValue')}
        </ThemedText>
        <TextInput
          style={[
            validatorInputFieldStyles.textInput,
            {
              backgroundColor: colors.inputBackground,
              color: colors.bodyText,
              borderColor: colors.surfaceBorder,
            },
          ]}
          value={testInput.value}
          onChangeText={(value) => onInputChange({ value })}
          placeholder={t('helpers.validatorHelper.inputPlaceholder')}
          placeholderTextColor={colors.placeholderText}
        />
      </View>

      <View style={validatorInputFieldStyles.inputRow}>
        <View style={validatorInputFieldStyles.inputGroup}>
          <ThemedText
            style={[validatorInputFieldStyles.label, { color: colors.bodyText }]}
          >
            {t('helpers.validatorHelper.minLength')}
          </ThemedText>
          <TextInput
            style={[
              validatorInputFieldStyles.numberInput,
              {
                backgroundColor: colors.inputBackground,
                color: colors.bodyText,
                borderColor: colors.surfaceBorder,
              },
            ]}
            value={testInput.minLength?.toString() || ''}
            onChangeText={(text) =>
              onInputChange({ minLength: text ? parseInt(text) : undefined })
            }
            placeholder={DEFAULT_MIN_LENGTH_PLACEHOLDER}
            placeholderTextColor={colors.placeholderText}
            keyboardType="numeric"
          />
        </View>

        <View style={validatorInputFieldStyles.inputGroup}>
          <ThemedText
            style={[validatorInputFieldStyles.label, { color: colors.bodyText }]}
          >
            {t('helpers.validatorHelper.maxLength')}
          </ThemedText>
          <TextInput
            style={[
              validatorInputFieldStyles.numberInput,
              {
                backgroundColor: colors.inputBackground,
                color: colors.bodyText,
                borderColor: colors.surfaceBorder,
              },
            ]}
            value={testInput.maxLength?.toString() || ''}
            onChangeText={(text) =>
              onInputChange({ maxLength: text ? parseInt(text) : undefined })
            }
            placeholder={DEFAULT_MAX_LENGTH_PLACEHOLDER}
            placeholderTextColor={colors.placeholderText}
            keyboardType="numeric"
          />
        </View>
      </View>

      <View style={validatorInputFieldStyles.inputGroup}>
        <View style={validatorInputFieldStyles.checkboxContainer}>
          <Switch
            value={testInput.trim !== false}
            onValueChange={(value) => onInputChange({ trim: value })}
            trackColor={{ false: colors.surfaceBorder, true: colors.primary }}
            thumbColor={colors.snackbarWhite}
          />
          <ThemedText
            style={[validatorInputFieldStyles.checkboxLabel, { color: colors.bodyText }]}
          >
            {t('helpers.validatorHelper.trimWhitespace')}
          </ThemedText>
        </View>

        <View style={validatorInputFieldStyles.checkboxContainer}>
          <Switch
            value={testInput.convertTurkishChars || false}
            onValueChange={(value) => onInputChange({ convertTurkishChars: value })}
            trackColor={{ false: colors.surfaceBorder, true: colors.primary }}
            thumbColor={colors.snackbarWhite}
          />
          <ThemedText
            style={[validatorInputFieldStyles.checkboxLabel, { color: colors.bodyText }]}
          >
            {t('helpers.validatorHelper.turkishCharacterSupport')}
          </ThemedText>
        </View>
      </View>

      <Button
        title={
          isLoading
            ? t('helpers.validatorHelper.runningTests')
            : t('helpers.validatorHelper.runAllTests')
        }
        onPress={onRunTests}
        disabled={isLoading}
        variant="primary"
        size="medium"
      />
    </ThemedView>
  );
}

