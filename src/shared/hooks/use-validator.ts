/**
 * useValidator Hook
 * 
 * React hook for easy form validation integration in components.
 * Provides real-time validation feedback and state management.
 * 
 * @example
 * ```typescript
 * import { useValidator } from '@/src/shared/hooks/use-validator';
 * import { ValidatorType } from 'masterfabric-expo-core';
 * 
 * function LoginForm() {
 *   const emailValidator = useValidator(ValidatorType.EMAIL);
 *   const passwordValidator = useValidator(ValidatorType.PASSWORD, {
 *     minLength: 8,
 *   });
 * 
 *   return (
 *     <View>
 *       <TextInput
 *         value={emailValidator.value}
 *         onChangeText={emailValidator.setValue}
 *       />
 *       {!emailValidator.isValid && (
 *         <Text>{emailValidator.error}</Text>
 *       )}
 * 
 *       <TextInput
 *         value={passwordValidator.value}
 *         onChangeText={passwordValidator.setValue}
 *         secureTextEntry
 *       />
 *       {!passwordValidator.isValid && (
 *         <Text>{passwordValidator.error}</Text>
 *       )}
 *     </View>
 *   );
 * }
 * ```
 */

import {
  ValidationResult,
  ValidatorOptions,
  ValidatorType,
  getValidatorHelper,
} from 'masterfabric-expo-core';
import { useCallback, useEffect, useRef, useState } from 'react';

export interface UseValidatorReturn {
  /**
   * Current input value
   */
  value: string;
  
  /**
   * Set the input value (triggers validation)
   */
  setValue: (value: string) => void;
  
  /**
   * Full validation result object
   */
  result: ValidationResult;
  
  /**
   * Manually trigger validation for a value
   * @param inputValue - Value to validate
   * @returns Validation result
   */
  validate: (inputValue: string) => ValidationResult;
  
  /**
   * Whether the current value is valid
   */
  isValid: boolean;
  
  /**
   * First error message (if any)
   */
  error?: string;
  
  /**
   * All error messages (if any)
   */
  errors?: string[];
  
  /**
   * Reset the validator state
   */
  reset: () => void;
}

/**
 * Hook for form validation
 * @param type - Validator type to use
 * @param options - Optional validation options
 * @returns Validator state and methods
 */
export function useValidator(
  type: ValidatorType,
  options?: ValidatorOptions
): UseValidatorReturn {
  const [value, setValue] = useState<string>('');
  const [result, setResult] = useState<ValidationResult>({ isValid: true });
  
  // Store options in ref to avoid dependency issues with object references
  const optionsRef = useRef(options);
  optionsRef.current = options;

  // Create a stable key from options to track changes
  // Using individual properties prevents infinite loops from new object references
  const minLength = options?.minLength;
  const maxLength = options?.maxLength;
  const trim = options?.trim;
  const convertTurkishChars = options?.convertTurkishChars;
  const customErrorMessage = options?.customErrorMessage;

  const validate = useCallback(
    (inputValue: string): ValidationResult => {
      const validatorHelper = getValidatorHelper();
      const validationResult = validatorHelper.validate(inputValue, type, optionsRef.current);
      setResult(validationResult);
      return validationResult;
    },
    [type]
  );

  // Auto-validate when value or options change
  useEffect(() => {
    if (value !== undefined && value !== null) {
      const validatorHelper = getValidatorHelper();
      const validationResult = validatorHelper.validate(value, type, optionsRef.current);
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

