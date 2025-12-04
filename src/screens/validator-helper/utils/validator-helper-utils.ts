/**
 * Validator Helper Utilities
 * 
 * Utility functions for the validator helper
 */

import { DropdownOption } from '@/src/shared/components/Dropdown';
import { t } from '@/src/shared/i18n';
import { ValidatorType } from 'masterfabric-expo-core';
import {
  AUTH_COLORS,
  BORDER_OPACITY_SUFFIX,
  BUTTON_PRIMARY_COLOR,
  ERROR_MESSAGE_MAP,
  HEADER_BACKGROUND_COLORS,
} from '../constants/validator-helper-constants';
import { type PasswordRequirement } from '../models/validator-helper-models';

/**
 * Translate error messages from English to the current locale
 * Handles both direct mappings and dynamic error messages with parameters
 * 
 * @param error - The English error message to translate
 * @returns The translated error message in the current locale
 * 
 * @example
 * ```typescript
 * const translated = translateErrorMessage('Username can only contain letters, numbers, and underscores.');
 * // Returns: "Kullanıcı adı yalnızca harf, rakam ve alt çizgi içerebilir." (if locale is 'tr')
 * ```
 */
export const translateErrorMessage = (error: string): string => {
  // Check if it's a password min length error
  const passwordMinLengthMatch = error.match(/Password must be at least (\d+) characters long\./);
  if (passwordMinLengthMatch) {
    const min = passwordMinLengthMatch[1];
    return t('helpers.validatorHelper.errors.passwordMinLength', { min });
  }

  // Check if it's a min length error with field name
  const minLengthMatch = error.match(/(.+) must be at least (\d+) characters long\./);
  if (minLengthMatch) {
    const fieldName = minLengthMatch[1];
    const min = minLengthMatch[2];
    return t('helpers.validatorHelper.errors.minLength', { fieldName, min });
  }

  // Check if it's a max length error with field name
  const maxLengthMatch = error.match(/(.+) cannot exceed (\d+) characters\./);
  if (maxLengthMatch) {
    const fieldName = maxLengthMatch[1];
    const max = maxLengthMatch[2];
    return t('helpers.validatorHelper.errors.maxLength', { fieldName, max });
  }

  // Check direct mapping
  const translationKey = ERROR_MESSAGE_MAP[error];
  if (translationKey) {
    return t(translationKey);
  }

  // Fallback to original error message if no translation found
  return error;
};

/**
 * Get password requirements configuration
 * @returns Array of password requirements with labels and check functions
 */
export const getPasswordRequirements = (): PasswordRequirement[] => {
  return [
    {
      label: t('validation.passwordRequirements.minLength'),
      check: (password) => password.length >= 8,
    },
    {
      label: t('validation.passwordRequirements.uppercase'),
      check: (password) => /[A-Z]/.test(password),
    },
    {
      label: t('validation.passwordRequirements.lowercase'),
      check: (password) => /[a-z]/.test(password),
    },
    {
      label: t('validation.passwordRequirements.number'),
      check: (password) => /\d/.test(password),
    },
    {
      label: t('validation.passwordRequirements.specialChar'),
      check: (password) => /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password),
    },
  ];
};

/**
 * Check password requirements and return results with met status
 * @param password - The password to check
 * @returns Array of requirements with met status
 */
export const checkPasswordRequirements = (password: string) => {
  const passwordRequirements = getPasswordRequirements();
  return passwordRequirements.map((req) => ({
    ...req,
    met: req.check(password),
  }));
};

/**
 * Get auth colors based on theme
 * @param isDark - Whether dark theme is active
 * @returns Auth colors object for the current theme
 */
export const getAuthColors = (isDark: boolean) => {
  return isDark ? AUTH_COLORS.dark : AUTH_COLORS.light;
};

/**
 * Get header background color based on theme
 * @param isDark - Whether dark theme is active
 * @returns Header background color
 */
export const getHeaderBackgroundColor = (isDark: boolean) => {
  return isDark ? HEADER_BACKGROUND_COLORS.dark : HEADER_BACKGROUND_COLORS.light;
};

/**
 * Get button primary color with fallback
 * @param themeTint - Theme tint color from useTheme
 * @returns Button primary color
 */
export const getButtonPrimaryColor = (themeTint?: string) => {
  return themeTint || BUTTON_PRIMARY_COLOR;
};

/**
 * Get validator type options for dropdown
 * Dynamically generates options with translations
 * @returns Array of dropdown options for validator types
 */
export const getValidatorTypeOptions = (): DropdownOption[] => {
  return [
    { label: t('helpers.validatorHelper.validatorTypes.username'), value: ValidatorType.USERNAME },
    { label: t('helpers.validatorHelper.validatorTypes.password'), value: ValidatorType.PASSWORD },
    { label: t('helpers.validatorHelper.validatorTypes.email'), value: ValidatorType.EMAIL },
    { label: t('helpers.validatorHelper.validatorTypes.phoneNumber'), value: ValidatorType.PHONE_NUMBER },
    { label: t('helpers.validatorHelper.validatorTypes.url'), value: ValidatorType.URL },
    { label: t('helpers.validatorHelper.validatorTypes.numeric'), value: ValidatorType.NUMERIC },
    { label: t('helpers.validatorHelper.validatorTypes.nonEmpty'), value: ValidatorType.NON_EMPTY },
    { label: t('helpers.validatorHelper.validatorTypes.fullName'), value: ValidatorType.FULL_NAME },
    { label: t('helpers.validatorHelper.validatorTypes.search'), value: ValidatorType.SEARCH },
  ];
};

/**
 * Add opacity suffix to color string (for semi-transparent borders)
 * @param color - Color string (hex format)
 * @returns Color string with opacity suffix
 */
export const addBorderOpacity = (color: string): string => {
  return color + BORDER_OPACITY_SUFFIX;
};

/**
 * Checks if a string is a valid email address.
 * Uses RFC 5322 compliant email regex (simplified but comprehensive).
 * This is a validator helper specific implementation.
 * 
 * @param str - The input string to validate
 * @returns True if the string is a valid email address, false otherwise
 * 
 * @example
 * ```typescript
 * isValidEmail('user@example.com'); // Returns: true
 * isValidEmail('invalid-email'); // Returns: false
 * ```
 */
export const isValidEmail = (str: string): boolean => {
  if (!str) return false;
  // RFC 5322 compliant email regex (simplified but comprehensive)
  const emailRegex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;
  return emailRegex.test(str);
};

