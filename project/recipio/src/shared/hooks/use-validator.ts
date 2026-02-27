/**
 * useValidator — form validation hook (aligned with validator-helper).
 * Uses masterfabric-expo-core ValidatorType and getValidatorHelper.
 */

import {
  ValidationResult,
  ValidatorOptions,
  ValidatorType,
  getValidatorHelper,
} from '@masterfabric-expo/core';
import { useCallback, useEffect, useRef, useState } from 'react';

export interface UseValidatorReturn {
  value: string;
  setValue: (value: string) => void;
  result: ValidationResult;
  validate: (inputValue: string) => ValidationResult;
  isValid: boolean;
  error?: string;
  errors?: string[];
  reset: () => void;
}

export function useValidator(
  type: ValidatorType,
  options?: ValidatorOptions
): UseValidatorReturn {
  const [value, setValue] = useState<string>('');
  const [result, setResult] = useState<ValidationResult>({ isValid: true });
  const optionsRef = useRef(options);
  optionsRef.current = options;

  const minLength = options?.minLength;
  const maxLength = options?.maxLength;
  const trim = options?.trim;
  const convertTurkishChars = options?.convertTurkishChars;
  const customErrorMessage = options?.customErrorMessage;

  const validate = useCallback(
    (inputValue: string): ValidationResult => {
      const validatorHelper = getValidatorHelper();
      const validationResult = validatorHelper.validate(
        inputValue,
        type,
        optionsRef.current
      );
      setResult(validationResult);
      return validationResult;
    },
    [type]
  );

  useEffect(() => {
    if (value !== undefined && value !== null) {
      const validatorHelper = getValidatorHelper();
      const validationResult = validatorHelper.validate(
        value,
        type,
        optionsRef.current
      );
      setResult(validationResult);
    }
  }, [value, type, minLength, maxLength, trim, convertTurkishChars, customErrorMessage]);

  const handleSetValue = useCallback((newValue: string) => {
    setValue(newValue);
  }, []);

  const reset = useCallback(() => {
    setValue('');
    setResult({ isValid: true });
  }, []);

  return {
    value,
    setValue: handleSetValue,
    result,
    validate,
    isValid: result.isValid,
    error: result.error,
    errors: result.errors,
    reset,
  };
}
