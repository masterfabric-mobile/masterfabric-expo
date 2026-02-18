import React from 'react';
import { TextInput, View } from 'react-native';
import {
  doubleExtensionHelper,
  getThemeColors,
  snackbarHelper,
  ThemedText,
  ThemedView,
  useTheme,
} from 'masterfabric-expo-core';

const { isValidCurrency, isValidLocale } = doubleExtensionHelper;
import { Button } from '@/src/shared/components/button';
import { t } from '@/src/shared/i18n';
import { BORDER_OPACITY_SUFFIX, DEFAULT_TEST_INPUT, NUMERIC_INPUT_RANGE } from '../constants/double-helper.constants';
import type { DoubleTestInput } from '../models/double-helper-models';
import { doubleInputFieldStyles } from '../styles/double-input-field.styles';

interface DoubleInputFieldProps {
  testInput: DoubleTestInput;
  onInputChange: (updates: Partial<DoubleTestInput>) => void;
  onRunTests: () => void;
  isLoading: boolean;
}

function isInvalidNumberInput(text: string): boolean {
  const trimmed = text.trim();
  if (trimmed === '' || trimmed === '-' || trimmed === '.') return false;
  const n = parseFloat(trimmed);
  return !Number.isFinite(n);
}

function parseNum(text: string, fallback: number): number {
  const trimmed = text.trim();
  if (trimmed === '' || trimmed === '-' || trimmed === '.') return fallback;
  const n = parseFloat(trimmed);
  if (!Number.isFinite(n)) return fallback;
  const clamped = Math.max(NUMERIC_INPUT_RANGE.min, Math.min(NUMERIC_INPUT_RANGE.max, n));
  return clamped;
}

/** Decimals field: 0–20 only */
function parseDecimals(text: string, fallback: number): number {
  const n = Math.floor(parseNum(text, fallback));
  return Math.max(0, Math.min(20, n));
}

function isInvalidDecimalsInput(text: string): boolean {
  if (isInvalidNumberInput(text)) return true;
  const n = Math.floor(parseFloat(text.trim()));
  return n < 0 || n > 20;
}

export function DoubleInputField({
  testInput,
  onInputChange,
  onRunTests,
  isLoading,
}: DoubleInputFieldProps) {
  const { isDark } = useTheme();
  const colors = getThemeColors(isDark);

  const inputStyle = {
    backgroundColor: colors.inputBackground,
    color: colors.bodyText,
    borderColor: colors.surfaceBorder,
  };

  return (
    <ThemedView
      style={
        [
          doubleInputFieldStyles.container,
          {
            backgroundColor: colors.surfaceBackground,
            borderColor: colors.surfaceBorder + BORDER_OPACITY_SUFFIX,
          },
        ] as any
      }
    >
      <ThemedText
        type="subtitle"
        style={[doubleInputFieldStyles.title, { color: colors.sectionTitle }] as any}
      >
        {t('helpers.doubleExtensionHelper.testInput')}
      </ThemedText>

      <View style={[doubleInputFieldStyles.inputRow, doubleInputFieldStyles.sectionGap]}>
        <View style={doubleInputFieldStyles.inputGroup}>
          <ThemedText style={[doubleInputFieldStyles.label, { color: colors.labelText }] as any}>
            {t('helpers.doubleExtensionHelper.value')}
          </ThemedText>
          <TextInput
            style={[doubleInputFieldStyles.numberInput, inputStyle]}
            value={testInput.value === null ? '' : testInput.value.toString()}
            onChangeText={(text) => {
              const trimmed = text.trim();
              if (trimmed === '' || trimmed === '-' || trimmed === '.') {
                onInputChange({ value: null });
                return;
              }
              if (isInvalidNumberInput(text)) snackbarHelper.warning(t('helpers.doubleExtensionHelper.validation.invalidNumber'));
              onInputChange({ value: parseNum(text, DEFAULT_TEST_INPUT.value ?? 19.999) });
            }}
            placeholder="19.999"
            placeholderTextColor={colors.placeholderText}
            keyboardType="decimal-pad"
          />
        </View>
        <View style={doubleInputFieldStyles.inputGroup}>
          <ThemedText style={[doubleInputFieldStyles.label, { color: colors.labelText }] as any}>
            {t('helpers.doubleExtensionHelper.decimals')}
          </ThemedText>
          <TextInput
            style={[doubleInputFieldStyles.numberInput, inputStyle]}
            value={testInput.decimals === null ? '' : testInput.decimals.toString()}
            onChangeText={(text) => {
              const trimmed = text.trim();
              if (trimmed === '' || trimmed === '-' || trimmed === '.') {
                onInputChange({ decimals: null });
                return;
              }
              if (isInvalidDecimalsInput(text)) snackbarHelper.warning(t('helpers.doubleExtensionHelper.validation.invalidDecimals'));
              onInputChange({ decimals: parseDecimals(text, DEFAULT_TEST_INPUT.decimals ?? 2) });
            }}
            placeholder="2"
            placeholderTextColor={colors.placeholderText}
            keyboardType="number-pad"
          />
        </View>
      </View>

      <View style={[doubleInputFieldStyles.inputRow, doubleInputFieldStyles.sectionGap]}>
        <View style={doubleInputFieldStyles.inputGroup}>
          <ThemedText style={[doubleInputFieldStyles.label, { color: colors.labelText }] as any}>
            {t('helpers.doubleExtensionHelper.currency')}
          </ThemedText>
          <TextInput
            style={[doubleInputFieldStyles.textInput, inputStyle]}
            value={testInput.currency}
            onChangeText={(currency) => onInputChange({ currency })}
            onBlur={() => {
              const c = (testInput.currency ?? '').trim();
              if (c && !isValidCurrency(c)) {
                snackbarHelper.warning(t('helpers.doubleExtensionHelper.validation.currencyInvalid'));
              }
            }}
            placeholder="USD"
            placeholderTextColor={colors.placeholderText}
          />
        </View>
        <View style={doubleInputFieldStyles.inputGroup}>
          <ThemedText style={[doubleInputFieldStyles.label, { color: colors.labelText }] as any}>
            {t('helpers.doubleExtensionHelper.locale')}
          </ThemedText>
          <TextInput
            style={[doubleInputFieldStyles.textInput, inputStyle]}
            value={testInput.locale}
            onChangeText={(locale) => onInputChange({ locale })}
            onBlur={() => {
              const l = (testInput.locale ?? '').trim();
              if (l && !isValidLocale(l)) {
                snackbarHelper.warning(t('helpers.doubleExtensionHelper.validation.localeInvalid'));
              }
            }}
            placeholder="en-US"
            placeholderTextColor={colors.placeholderText}
          />
        </View>
      </View>

      <View style={[doubleInputFieldStyles.inputRow, doubleInputFieldStyles.sectionGap]}>
        <View style={doubleInputFieldStyles.inputGroup}>
          <ThemedText style={[doubleInputFieldStyles.label, { color: colors.labelText }] as any}>
            {t('helpers.doubleExtensionHelper.clampMin')}
          </ThemedText>
          <TextInput
            style={[doubleInputFieldStyles.numberInput, inputStyle]}
            value={testInput.clampMin === null ? '' : testInput.clampMin.toString()}
            onChangeText={(text) => {
              const trimmed = text.trim();
              if (trimmed === '' || trimmed === '-' || trimmed === '.') {
                onInputChange({ clampMin: null });
                return;
              }
              if (isInvalidNumberInput(text)) snackbarHelper.warning(t('helpers.doubleExtensionHelper.validation.invalidNumber'));
              const newMin = parseNum(text, DEFAULT_TEST_INPUT.clampMin ?? 0);
              onInputChange({ clampMin: newMin });
            }}
            onBlur={() => {
              const min = testInput.clampMin ?? DEFAULT_TEST_INPUT.clampMin ?? 0;
              const max = testInput.clampMax ?? DEFAULT_TEST_INPUT.clampMax ?? 100;
              if (min > max) snackbarHelper.warning(t('helpers.doubleExtensionHelper.validation.clampMinGreaterThanMax'));
            }}
            placeholder="0"
            placeholderTextColor={colors.placeholderText}
            keyboardType="number-pad"
          />
        </View>
        <View style={doubleInputFieldStyles.inputGroup}>
          <ThemedText style={[doubleInputFieldStyles.label, { color: colors.labelText }] as any}>
            {t('helpers.doubleExtensionHelper.clampMax')}
          </ThemedText>
          <TextInput
            style={[doubleInputFieldStyles.numberInput, inputStyle]}
            value={testInput.clampMax === null ? '' : testInput.clampMax.toString()}
            onChangeText={(text) => {
              const trimmed = text.trim();
              if (trimmed === '' || trimmed === '-' || trimmed === '.') {
                onInputChange({ clampMax: null });
                return;
              }
              if (isInvalidNumberInput(text)) snackbarHelper.warning(t('helpers.doubleExtensionHelper.validation.invalidNumber'));
              const newMax = parseNum(text, DEFAULT_TEST_INPUT.clampMax ?? 100);
              onInputChange({ clampMax: newMax });
            }}
            onBlur={() => {
              const min = testInput.clampMin ?? DEFAULT_TEST_INPUT.clampMin ?? 0;
              const max = testInput.clampMax ?? DEFAULT_TEST_INPUT.clampMax ?? 100;
              if (min > max) snackbarHelper.warning(t('helpers.doubleExtensionHelper.validation.clampMinGreaterThanMax'));
            }}
            placeholder="100"
            placeholderTextColor={colors.placeholderText}
            keyboardType="number-pad"
          />
        </View>
      </View>

      <View style={[doubleInputFieldStyles.inputRow, doubleInputFieldStyles.sectionGap]}>
        <View style={doubleInputFieldStyles.inputGroup}>
          <ThemedText style={[doubleInputFieldStyles.label, { color: colors.labelText }] as any}>
            {t('helpers.doubleExtensionHelper.safeA')}
          </ThemedText>
          <TextInput
            style={[doubleInputFieldStyles.numberInput, inputStyle]}
            value={testInput.safeA === null ? '' : testInput.safeA.toString()}
            onChangeText={(text) => {
              const trimmed = text.trim();
              if (trimmed === '' || trimmed === '-' || trimmed === '.') {
                onInputChange({ safeA: null });
                return;
              }
              if (isInvalidNumberInput(text)) snackbarHelper.warning(t('helpers.doubleExtensionHelper.validation.invalidNumber'));
              onInputChange({ safeA: parseNum(text, DEFAULT_TEST_INPUT.safeA ?? 0.1) });
            }}
            placeholder="0.1"
            placeholderTextColor={colors.placeholderText}
            keyboardType="decimal-pad"
          />
        </View>
        <View style={doubleInputFieldStyles.inputGroup}>
          <ThemedText style={[doubleInputFieldStyles.label, { color: colors.labelText }] as any}>
            {t('helpers.doubleExtensionHelper.safeB')}
          </ThemedText>
          <TextInput
            style={[doubleInputFieldStyles.numberInput, inputStyle]}
            value={testInput.safeB === null ? '' : testInput.safeB.toString()}
            onChangeText={(text) => {
              const trimmed = text.trim();
              if (trimmed === '' || trimmed === '-' || trimmed === '.') {
                onInputChange({ safeB: null });
                return;
              }
              if (isInvalidNumberInput(text)) snackbarHelper.warning(t('helpers.doubleExtensionHelper.validation.invalidNumber'));
              onInputChange({ safeB: parseNum(text, DEFAULT_TEST_INPUT.safeB ?? 0.2) });
            }}
            placeholder="0.2"
            placeholderTextColor={colors.placeholderText}
            keyboardType="decimal-pad"
          />
        </View>
      </View>

      <View style={doubleInputFieldStyles.inputGroup}>
        <ThemedText style={[doubleInputFieldStyles.label, { color: colors.labelText }] as any}>
          {t('helpers.doubleExtensionHelper.percentageValue')}
        </ThemedText>
        <TextInput
          style={[doubleInputFieldStyles.numberInput, inputStyle]}
          value={testInput.percentageValue === null ? '' : testInput.percentageValue.toString()}
          onChangeText={(text) => {
            const trimmed = text.trim();
            if (trimmed === '' || trimmed === '-' || trimmed === '.') {
              onInputChange({ percentageValue: null });
              return;
            }
            if (isInvalidNumberInput(text)) snackbarHelper.warning(t('helpers.doubleExtensionHelper.validation.invalidNumber'));
            onInputChange({ percentageValue: parseNum(text, DEFAULT_TEST_INPUT.percentageValue ?? 0.8567) });
          }}
          placeholder="0.8567"
          placeholderTextColor={colors.placeholderText}
          keyboardType="decimal-pad"
        />
      </View>

      <View style={doubleInputFieldStyles.runButtonWrap}>
        <Button
          title={
            isLoading
              ? t('helpers.doubleExtensionHelper.runningTests')
              : t('helpers.doubleExtensionHelper.runTests')
          }
          onPress={onRunTests}
          disabled={isLoading}
          variant="primary"
          size="large"
        />
      </View>
    </ThemedView>
  );
}
