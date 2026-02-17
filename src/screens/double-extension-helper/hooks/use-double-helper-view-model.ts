import { useCallback } from 'react';
import {
  CurrencyLocaleValidationError,
  doubleHelper,
  snackbarHelper,
} from 'masterfabric-expo-core';
import { t } from '@/src/shared/i18n';
import { DEFAULT_TEST_INPUT } from '../constants/double-helper.constants';
import type {
  DoubleTestInput,
  DoubleTestResult,
  NormalizedDoubleTestInput,
} from '../models/double-helper-models';
import { useDoubleHelperStore } from '../store/double-helper-store';

function hasEmptyFields(input: DoubleTestInput): boolean {
  return (
    input.value == null ||
    input.decimals == null ||
    (input.currency ?? '').trim() === '' ||
    (input.locale ?? '').trim() === '' ||
    input.clampMin == null ||
    input.clampMax == null ||
    input.safeA == null ||
    input.safeB == null ||
    input.percentageValue == null
  );
}

const DEFAULT_NUMBERS = {
  value: 19.999,
  decimals: 2,
  clampMin: 0,
  clampMax: 100,
  safeA: 0.1,
  safeB: 0.2,
  percentageValue: 0.8567,
} as const;

function normalizeTestInput(input: DoubleTestInput): NormalizedDoubleTestInput {
  const d = DEFAULT_TEST_INPUT;
  const n = DEFAULT_NUMBERS;
  return {
    value: input.value != null && Number.isFinite(input.value) ? input.value : n.value,
    decimals:
      input.decimals != null &&
      Number.isFinite(input.decimals) &&
      input.decimals >= 0 &&
      input.decimals <= 20
        ? Math.floor(input.decimals)
        : n.decimals,
    currency: typeof input.currency === 'string' && input.currency.trim() !== '' ? input.currency.trim() : d.currency,
    locale: typeof input.locale === 'string' && input.locale.trim() !== '' ? input.locale.trim() : d.locale,
    clampMin: input.clampMin != null && Number.isFinite(input.clampMin) ? input.clampMin : n.clampMin,
    clampMax: input.clampMax != null && Number.isFinite(input.clampMax) ? input.clampMax : n.clampMax,
    safeA: input.safeA != null && Number.isFinite(input.safeA) ? input.safeA : n.safeA,
    safeB: input.safeB != null && Number.isFinite(input.safeB) ? input.safeB : n.safeB,
    percentageValue:
      input.percentageValue != null && Number.isFinite(input.percentageValue)
        ? input.percentageValue
        : n.percentageValue,
  };
}

function didNormalize(input: DoubleTestInput, normalized: NormalizedDoubleTestInput): boolean {
  const n = DEFAULT_NUMBERS;
  return (
    (input.value != null ? input.value : n.value) !== normalized.value ||
    (input.decimals != null ? input.decimals : n.decimals) !== normalized.decimals ||
    (input.currency?.trim() || DEFAULT_TEST_INPUT.currency) !== normalized.currency ||
    (input.locale?.trim() || DEFAULT_TEST_INPUT.locale) !== normalized.locale ||
    (input.clampMin != null ? input.clampMin : n.clampMin) !== normalized.clampMin ||
    (input.clampMax != null ? input.clampMax : n.clampMax) !== normalized.clampMax ||
    (input.safeA != null ? input.safeA : n.safeA) !== normalized.safeA ||
    (input.safeB != null ? input.safeB : n.safeB) !== normalized.safeB ||
    (input.percentageValue != null ? input.percentageValue : n.percentageValue) !== normalized.percentageValue
  );
}

export function useDoubleHelperViewModel() {
  const {
    testInput,
    testResults,
    isLoading,
    setTestInput,
    setTestResults,
    setIsLoading,
  } = useDoubleHelperStore();

  const runAllTests = useCallback(() => {
    if (hasEmptyFields(testInput)) {
      snackbarHelper.warning(t('helpers.doubleExtensionHelper.fieldsCannotBeEmpty'));
      return;
    }
    const normalized = normalizeTestInput(testInput);
    if (didNormalize(testInput, normalized)) {
      setTestInput({ ...normalized });
      snackbarHelper.warning(t('helpers.doubleExtensionHelper.defaultsApplied'));
    }
    setIsLoading(true);
    const results: DoubleTestResult[] = [];
    const {
      value,
      decimals,
      currency,
      locale,
      clampMin,
      clampMax,
      safeA,
      safeB,
      percentageValue,
    } = normalized;

    const descKey = (key: string) => `helpers.doubleExtensionHelper.${key}`;

    function runTest(
      id: string,
      functionName: string,
      input: string,
      descriptionKey: string,
      fn: () => string | number
    ): void {
      try {
        const output = fn();
        results.push({
          id,
          functionName,
          input,
          output: typeof output === 'string' ? output : String(output),
          description: t(descriptionKey),
          descriptionKey,
        });
      } catch (e) {
        const message = e instanceof Error ? e.message : String(e);
        results.push({
          id,
          functionName,
          input,
          output: '',
          description: t(descriptionKey),
          descriptionKey,
          success: false,
          errorMessage: message,
        });
      }
    }

    try {
      runTest(
        'toPrecision',
        'toPrecision',
        `${value} (${t('helpers.doubleExtensionHelper.decimalsInParam')}: ${decimals})`,
        descKey('toPrecision'),
        () => doubleHelper.toPrecision(value, decimals)
      );
      runTest(
        'round',
        'round',
        `${value} (${t('helpers.doubleExtensionHelper.decimalsInParam')}: ${decimals})`,
        descKey('round'),
        () => String(doubleHelper.round(value, decimals))
      );
      runTest(
        'truncate',
        'truncate',
        `${value} (${t('helpers.doubleExtensionHelper.decimalsInParam')}: ${decimals})`,
        descKey('truncate'),
        () => String(doubleHelper.truncate(value, decimals))
      );
      runTest(
        'ceil',
        'ceil',
        `${value} (${t('helpers.doubleExtensionHelper.decimalsInParam')}: ${decimals})`,
        descKey('ceil'),
        () => String(doubleHelper.ceil(value, decimals))
      );
      runTest(
        'floor',
        'floor',
        `${value} (${t('helpers.doubleExtensionHelper.decimalsInParam')}: ${decimals})`,
        descKey('floor'),
        () => String(doubleHelper.floor(value, decimals))
      );

      (() => {
        try {
          const output = doubleHelper.toCurrencyStrict(value, { currency, locale });
          results.push({
            id: 'toCurrency',
            functionName: 'toCurrency',
            input: `${value} (${currency}, ${locale})`,
            output,
            description: t(descKey('toCurrency')),
            descriptionKey: descKey('toCurrency'),
            success: true,
          });
        } catch (err) {
          const message =
            err instanceof CurrencyLocaleValidationError
              ? err.code === 'INVALID_LOCALE'
                ? t('helpers.doubleExtensionHelper.invalidLocale', { code: err.value })
                : t('helpers.doubleExtensionHelper.invalidCurrency', { code: err.value })
              : err instanceof Error
                ? err.message
                : t('helpers.doubleExtensionHelper.invalidCurrencyOrLocale');
          results.push({
            id: 'toCurrency',
            functionName: 'toCurrency',
            input: `${value} (${currency}, ${locale})`,
            output: '',
            description: t(descKey('toCurrency')),
            descriptionKey: descKey('toCurrency'),
            success: false,
            errorMessage: message,
          });
        }
      })();

      runTest(
        'toPercentage',
        'toPercentage',
        `${percentageValue} (${t('helpers.doubleExtensionHelper.decimalsInParam')}: ${decimals})`,
        descKey('toPercentage'),
        () => doubleHelper.toPercentage(percentageValue, { decimals })
      );
      runTest(
        'toCompact',
        'toCompact',
        String(1234567),
        descKey('toCompact'),
        () => doubleHelper.toCompact(1234567, { decimals })
      );
      runTest(
        'toClean',
        'toClean',
        String(value),
        descKey('toClean'),
        () => doubleHelper.toClean(value)
      );
      runTest(
        'toCleanExamples',
        'toClean',
        '19, 19.5',
        descKey('toClean'),
        () => `${doubleHelper.toClean(19)}, ${doubleHelper.toClean(19.5)}`
      );
      runTest(
        'toCompactNegative',
        'toCompact',
        '-1234567',
        descKey('toCompact'),
        () => doubleHelper.toCompact(-1234567, { decimals })
      );
      runTest(
        'safeAdd',
        'safeAdd',
        `${safeA} + ${safeB}`,
        descKey('safeAdd'),
        () => String(doubleHelper.safeAdd(safeA, safeB))
      );
      runTest(
        'safeSubtract',
        'safeSubtract',
        '1.0 - 0.9',
        descKey('safeSubtract'),
        () => String(doubleHelper.safeSubtract(1.0, 0.9))
      );
      runTest(
        'safeMultiply',
        'safeMultiply',
        `${safeA} × 3`,
        descKey('safeMultiply'),
        () => String(doubleHelper.safeMultiply(safeA, 3))
      );
      runTest(
        'safeDivide',
        'safeDivide',
        '1 / 3',
        descKey('safeDivide'),
        () => String(doubleHelper.safeDivide(1, 3))
      );
      runTest(
        'clamp',
        'clamp',
        `150 → [${clampMin}, ${clampMax}]`,
        descKey('clamp'),
        () => String(doubleHelper.clamp(150, clampMin, clampMax))
      );
      runTest(
        'isApproximatelyEqual',
        'isApproximatelyEqual',
        '0.1 + 0.2 ≈ 0.3',
        descKey('isApproximatelyEqual'),
        () => (doubleHelper.isApproximatelyEqual(0.1 + 0.2, 0.3) ? t('helpers.doubleExtensionHelper.outputTrue') : t('helpers.doubleExtensionHelper.outputFalse'))
      );
      runTest(
        'isZero',
        'isZero',
        '1e-12',
        descKey('isZero'),
        () => (doubleHelper.isZero(1e-12) ? t('helpers.doubleExtensionHelper.outputTrue') : t('helpers.doubleExtensionHelper.outputFalse'))
      );
    } finally {
      setTestResults(results);
      setIsLoading(false);
    }
  }, [testInput, setTestInput, setTestResults, setIsLoading]);

  const updateTestInput = useCallback(
    (updates: Partial<DoubleTestInput>) => {
      setTestInput({ ...testInput, ...updates });
    },
    [testInput, setTestInput]
  );

  return {
    testInput,
    testResults,
    isLoading,
    runAllTests,
    updateTestInput,
  };
}
