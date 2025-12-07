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
  EMAIL_MAX_LENGTH,
  MIN_MAX_LENGTH_MAX_VALUE,
  PHONE_MAX_LENGTH,
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

  // Get keyboard type and max length based on validator type
  const getInputKeyboardType = (): 'default' | 'email-address' | 'phone-pad' | 'numeric' => {
    switch (testInput.validatorType) {
      case ValidatorType.EMAIL:
        return 'email-address';
      case ValidatorType.PHONE_NUMBER:
        return 'phone-pad';
      case ValidatorType.NUMERIC:
        return 'numeric';
      default:
        return 'default';
    }
  };

  const getInputMaxLength = (): number | undefined => {
    switch (testInput.validatorType) {
      case ValidatorType.EMAIL:
        return EMAIL_MAX_LENGTH;
      case ValidatorType.PHONE_NUMBER:
        return PHONE_MAX_LENGTH;
      default:
        return undefined;
    }
  };

  const handleInputValueChange = (text: string) => {
    // For numeric validator, only allow numbers
    if (testInput.validatorType === ValidatorType.NUMERIC) {
      const numericText = text.replace(/[^0-9]/g, '');
      onInputChange({ value: numericText });
    } else if (testInput.validatorType === ValidatorType.PHONE_NUMBER) {
      // For phone, allow numbers and phone characters
      const phoneRegex = /^[\d+\-\s()]*$/;
      if (phoneRegex.test(text) && text.length <= PHONE_MAX_LENGTH) {
        onInputChange({ value: text });
      }
    } else {
      // For other types, allow all but check max length
      const maxLength = getInputMaxLength();
      if (!maxLength || text.length <= maxLength) {
        onInputChange({ value: text });
      }
    }
  };

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
          onChangeText={handleInputValueChange}
          placeholder={t('helpers.validatorHelper.inputPlaceholder')}
          placeholderTextColor={colors.placeholderText}
          keyboardType={getInputKeyboardType()}
          maxLength={getInputMaxLength()}
          autoCapitalize={testInput.validatorType === ValidatorType.EMAIL ? 'none' : 'sentences'}
        />
      </View>

      <View style={validatorInputFieldStyles.inputRow}>
        <View style={[validatorInputFieldStyles.inputGroup, validatorInputFieldStyles.inputGroupFlex]}>
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
            onChangeText={(text) => {
              // Only allow numeric input
              const numericText = text.replace(/[^0-9]/g, '');
              if (numericText === '') {
                onInputChange({ minLength: undefined });
              } else {
                const numValue = parseInt(numericText);
                // Enforce min value (at least 1) and max value
                if (numValue >= 1 && numValue <= MIN_MAX_LENGTH_MAX_VALUE) {
                  onInputChange({ minLength: numValue });
                } else if (numValue > MIN_MAX_LENGTH_MAX_VALUE) {
                  // If exceeds max, set to max value
                  onInputChange({ minLength: MIN_MAX_LENGTH_MAX_VALUE });
                }
              }
            }}
            placeholder={DEFAULT_MIN_LENGTH_PLACEHOLDER}
            placeholderTextColor={colors.placeholderText}
            keyboardType="numeric"
            maxLength={4}
          />
        </View>

        <View style={[validatorInputFieldStyles.inputGroup, validatorInputFieldStyles.inputGroupFlex]}>
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
            onChangeText={(text) => {
              // Only allow numeric input
              const numericText = text.replace(/[^0-9]/g, '');
              if (numericText === '') {
                onInputChange({ maxLength: undefined });
              } else {
                const numValue = parseInt(numericText);
                // Enforce min value (at least 1) and max value
                if (numValue >= 1 && numValue <= MIN_MAX_LENGTH_MAX_VALUE) {
                  onInputChange({ maxLength: numValue });
                } else if (numValue > MIN_MAX_LENGTH_MAX_VALUE) {
                  // If exceeds max, set to max value
                  onInputChange({ maxLength: MIN_MAX_LENGTH_MAX_VALUE });
                }
              }
            }}
            placeholder={DEFAULT_MAX_LENGTH_PLACEHOLDER}
            placeholderTextColor={colors.placeholderText}
            keyboardType="numeric"
            maxLength={4}
          />
        </View>
      </View>

      <View style={validatorInputFieldStyles.inputGroup}>
        <View style={validatorInputFieldStyles.checkboxContainer}>
          <Switch
            value={testInput.trim !== false}
            onValueChange={(value) => onInputChange({ trim: value })}
            trackColor={{ false: colors.surfaceBorder, true: colors.primary }}
            thumbColor="#FFFFFF"
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
            thumbColor="#FFFFFF"
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

