import { useLocale } from '@/src/shared/hooks/use-locale';
import { t } from '@/src/shared/i18n';
import {
  ValidatorType,
  getValidatorHelper,
  validateEmail,
  validateFullName,
  validateNonEmpty,
  validateNumeric,
  validatePassword,
  validatePhoneNumber,
  validateSearch,
  validateUrl,
  validateUsername,
} from 'masterfabric-expo-core';
import { useCallback, useEffect } from 'react';
import { ValidatorTestResult } from '../models/validator-helper-models';
import { useValidatorHelperStore } from '../store/validator-helper-store';

export function useValidatorHelperViewModel() {
  const { locale } = useLocale(); // Track locale changes
  const {
    testInput,
    testResults,
    currentResult,
    isLoading,
    setTestInput,
    setTestResults,
    setCurrentResult,
    setIsLoading,
  } = useValidatorHelperStore();

  // Update default input value when locale changes (only if it's still the default value)
  useEffect(() => {
    const defaultValue = t('helpers.validatorHelper.defaultInputValue');
    const oldEnglishDefault = 'john_doe123';
    const oldTurkishDefault = 'kullanıcı_adı123';
    
    // Only update if current value is one of the old default values (to avoid overwriting user input)
    // This ensures default value changes with locale, but user-entered values are preserved
    setTestInput((prev) => {
      if (prev.value === oldEnglishDefault || prev.value === oldTurkishDefault || prev.value === '') {
        return { ...prev, value: defaultValue };
      }
      return prev;
    });
     
  }, [locale, setTestInput]); // Only depend on locale to avoid infinite loops - testInput is intentionally excluded

  const updateTestInput = useCallback(
    (updates: Partial<typeof testInput>) => {
      setTestInput((prev) => ({ ...prev, ...updates }));
    },
    [setTestInput]
  );

  // Test single validator (current selected type)
  const runSingleTest = useCallback(() => {
    const { value, validatorType, minLength, maxLength, trim, convertTurkishChars } = testInput;
    
    const options = {
      minLength,
      maxLength,
      trim,
      convertTurkishChars,
    };

    const validatorHelper = getValidatorHelper();
    const result = validatorHelper.validate(value, validatorType, options);

    const testResult: ValidatorTestResult = {
      id: 'current',
      validatorType: validatorType,
      input: value,
      result: result,
      description: t(`helpers.validatorHelper.validators.${validatorType}`),
    };

    setCurrentResult(testResult);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [testInput, setCurrentResult, locale]);

  // Auto-test when input or validator type changes
  useEffect(() => {
    if (testInput.value) {
      const { value, validatorType, minLength, maxLength, trim, convertTurkishChars } = testInput;
      
      const options = {
        minLength,
        maxLength,
        trim,
        convertTurkishChars,
      };

      const validatorHelper = getValidatorHelper();
      const result = validatorHelper.validate(value, validatorType, options);

      const testResult: ValidatorTestResult = {
        id: 'current',
        validatorType: validatorType,
        input: value,
        result: result,
        description: t(`helpers.validatorHelper.validators.${validatorType}`),
      };

      setCurrentResult(testResult);
    } else {
      // Clear result if value is empty
      setCurrentResult(null);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [testInput.value, testInput.validatorType, testInput.minLength, testInput.maxLength, testInput.trim, testInput.convertTurkishChars, setCurrentResult, locale]);

  const runAllTests = useCallback(() => {
    setIsLoading(true);

    const results: ValidatorTestResult[] = [];
    const { value, minLength, maxLength, trim, convertTurkishChars } = testInput;

    const options = {
      minLength,
      maxLength,
      trim,
      convertTurkishChars,
    };

    try {
      // Username validation
      results.push({
        id: 'username',
        validatorType: ValidatorType.USERNAME,
        input: value,
        result: validateUsername(value, options),
        description: t('helpers.validatorHelper.validators.username'),
      });

      // Password validation
      results.push({
        id: 'password',
        validatorType: ValidatorType.PASSWORD,
        input: value,
        result: validatePassword(value, options),
        description: t('helpers.validatorHelper.validators.password'),
      });

      // Email validation
      results.push({
        id: 'email',
        validatorType: ValidatorType.EMAIL,
        input: value,
        result: validateEmail(value, options),
        description: t('helpers.validatorHelper.validators.email'),
      });

      // Phone number validation
      results.push({
        id: 'phoneNumber',
        validatorType: ValidatorType.PHONE_NUMBER,
        input: value,
        result: validatePhoneNumber(value, options),
        description: t('helpers.validatorHelper.validators.phoneNumber'),
      });

      // URL validation
      results.push({
        id: 'url',
        validatorType: ValidatorType.URL,
        input: value,
        result: validateUrl(value, options),
        description: t('helpers.validatorHelper.validators.url'),
      });

      // Numeric validation
      results.push({
        id: 'numeric',
        validatorType: ValidatorType.NUMERIC,
        input: value,
        result: validateNumeric(value, options),
        description: t('helpers.validatorHelper.validators.numeric'),
      });

      // Non-empty validation
      results.push({
        id: 'nonEmpty',
        validatorType: ValidatorType.NON_EMPTY,
        input: value,
        result: validateNonEmpty(value, options),
        description: t('helpers.validatorHelper.validators.nonEmpty'),
      });

      // Full name validation
      results.push({
        id: 'fullName',
        validatorType: ValidatorType.FULL_NAME,
        input: value,
        result: validateFullName(value, options),
        description: t('helpers.validatorHelper.validators.fullName'),
      });

      // Search validation
      results.push({
        id: 'search',
        validatorType: ValidatorType.SEARCH,
        input: value,
        result: validateSearch(value, options),
        description: t('helpers.validatorHelper.validators.search'),
      });

      // Current selected type validation (only if not already in the list)
      const allValidatorTypes = [
        ValidatorType.USERNAME,
        ValidatorType.PASSWORD,
        ValidatorType.EMAIL,
        ValidatorType.PHONE_NUMBER,
        ValidatorType.URL,
        ValidatorType.NUMERIC,
        ValidatorType.NON_EMPTY,
        ValidatorType.FULL_NAME,
        ValidatorType.SEARCH,
      ];
      
      // Only add current type if it's not already in the standard list
      if (!allValidatorTypes.includes(testInput.validatorType)) {
        const validatorHelper = getValidatorHelper();
        results.push({
          id: 'currentType',
          validatorType: testInput.validatorType,
          input: value,
          result: validatorHelper.validate(value, testInput.validatorType, options),
          description: t(`helpers.validatorHelper.validators.${testInput.validatorType}`),
        });
      }
    } catch (error) {
      console.error('Error running validator tests:', error);
    } finally {
      setTestResults(results);
      setIsLoading(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [testInput, setTestResults, setIsLoading, locale]);

  return {
    testInput,
    testResults,
    currentResult,
    isLoading,
    updateTestInput,
    runSingleTest,
    runAllTests,
  };
}

