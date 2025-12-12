/**
 * Validator Helper for MasterFabric Expo Core
 * Comprehensive validation system for form inputs and user data
 */

import { isEmail, isUrl } from './string_helper';

// Import validator helper's email validation if available
// This allows validator helper to use its own email validation
let validatorHelperIsValidEmail: ((str: string) => boolean) | null = null;

/**
 * Set custom email validation function from validator helper
 * This allows validator helper to override the default email validation
 */
export function setValidatorHelperEmailValidator(validator: (str: string) => boolean) {
  validatorHelperIsValidEmail = validator;
}

/**
 * Validator types supported by the Validator Helper
 */
export enum ValidatorType {
  USERNAME = 'username',
  PASSWORD = 'password',
  EMAIL = 'email',
  PHONE_NUMBER = 'phoneNumber',
  URL = 'url',
  NUMERIC = 'numeric',
  NON_EMPTY = 'nonEmpty',
  FULL_NAME = 'fullName',
  SEARCH = 'search',
  CUSTOM = 'custom',
}

/**
 * Options for validation
 */
export interface ValidatorOptions {
  /** Minimum length constraint */
  minLength?: number;
  /** Maximum length constraint */
  maxLength?: number;
  /** Whether to trim whitespace (default: true) */
  trim?: boolean;
  /** Whether to convert Turkish characters (default: false) */
  convertTurkishChars?: boolean;
  /** Custom error message */
  customErrorMessage?: string;
  /** Custom validator function for CUSTOM type */
  customValidator?: (value: string) => string | null;
}

/**
 * Validation result
 */
export interface ValidationResult {
  /** Whether the value is valid */
  isValid: boolean;
  /** First error message (if any) */
  error?: string;
  /** All error messages (if any) */
  errors?: string[];
}

/**
 * Regex patterns for validation
 */
const RegexPatterns = {
  username: /^[a-zA-Z0-9_]+$/,
  password: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?])[A-Za-z\d!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]+$/,
  email: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
  phoneNumber: /^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$/,
  url: /^(https?:\/\/)?([\da-z\.-]+)\.([a-z\.]{2,6})([\/\w \.-]*)*\/?$/,
  numeric: /^\d+$/,
  fullName: /^[a-zA-ZğüşıöçĞÜŞİÖÇ\s]+$/,
};

/**
 * Error messages for validation
 */
const ErrorMessages = {
  username: 'Username can only contain letters, numbers, and underscores.',
  password: 'Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character.',
  passwordSpaces: 'Password must not contain spaces.',
  passwordMinLength: 'Password must be at least 8 characters long.',
  email: 'Please enter a valid email address.',
  phoneNumber: 'Please enter a valid phone number.',
  url: 'Please enter a valid URL.',
  numeric: 'This field must contain only numbers.',
  nonEmpty: 'This field cannot be empty.',
  fullName: 'Full name can only contain letters and spaces.',
  fullNameConsecutiveSpaces: 'Full name must not contain consecutive spaces.',
  minLength: (fieldName: string, min: number) => `${fieldName} must be at least ${min} characters long.`,
  maxLength: (fieldName: string, max: number) => `${fieldName} cannot exceed ${max} characters.`,
};

/**
 * Turkish character mapping
 */
const TurkishCharMap: { [key: string]: string } = {
  ı: 'i',
  İ: 'I',
  ş: 's',
  Ş: 'S',
  ğ: 'g',
  Ğ: 'G',
  ü: 'u',
  Ü: 'U',
  ö: 'o',
  Ö: 'O',
  ç: 'c',
  Ç: 'C',
};

/**
 * Validator Helper class
 * Singleton pattern for centralized validation management
 */
class ValidatorHelper {
  private static instance: ValidatorHelper;

  private constructor() {}

  /**
   * Get the singleton instance
   */
  static getInstance(): ValidatorHelper {
    if (!ValidatorHelper.instance) {
      ValidatorHelper.instance = new ValidatorHelper();
    }
    return ValidatorHelper.instance;
  }

  /**
   * Validate a value based on type and options
   * @param value The value to validate
   * @param type The validator type to use
   * @param options Optional validation options (minLength, maxLength, trim, etc.)
   * @returns ValidationResult with isValid flag and error messages
   * @example
   * ```typescript
   * const helper = getValidatorHelper();
   * const result = helper.validate('john_doe123', ValidatorType.USERNAME, {
   *   minLength: 3,
   *   maxLength: 20
   * });
   * if (result.isValid) {
   *   console.log('Username is valid!');
   * } else {
   *   console.error(result.error);
   * }
   * ```
   */
  validate(
    value: string,
    type: ValidatorType,
    options?: ValidatorOptions
  ): ValidationResult {
    const processedValue = this.processValue(value, options);
    const errors: string[] = [];

    // Length validation
    if (options?.minLength !== undefined && processedValue.length < options.minLength) {
      errors.push(
        options.customErrorMessage ||
          ErrorMessages.minLength(this.getFieldName(type), options.minLength)
      );
    }

    if (options?.maxLength !== undefined && processedValue.length > options.maxLength) {
      errors.push(
        options.customErrorMessage ||
          ErrorMessages.maxLength(this.getFieldName(type), options.maxLength)
      );
    }

    // Type-specific validation
    const typeError = this.validateByType(processedValue, type, options);
    if (typeError) {
      errors.push(typeError);
    }

    return {
      isValid: errors.length === 0,
      error: errors[0],
      errors: errors.length > 0 ? errors : undefined,
    };
  }

  /**
   * Process value based on options (trim, convert Turkish chars)
   */
  private processValue(value: string, options?: ValidatorOptions): string {
    let processed = value || '';
    if (options?.trim !== false) {
      // Trim removes leading and trailing whitespace only
      processed = processed.trim();
    }
    if (options?.convertTurkishChars) {
      processed = this.convertTurkishCharacters(processed);
    }
    return processed;
  }

  /**
   * Convert Turkish characters to their ASCII equivalents
   */
  private convertTurkishCharacters(value: string): string {
    return value.replace(/[ıİşŞğĞüÜöÖçÇ]/g, (char) => TurkishCharMap[char] || char);
  }

  /**
   * Validate by type
   */
  private validateByType(
    value: string,
    type: ValidatorType,
    options?: ValidatorOptions
  ): string | null {
    switch (type) {
      case ValidatorType.USERNAME:
        return this.validateUsername(value);
      case ValidatorType.PASSWORD:
        return this.validatePassword(value, options);
      case ValidatorType.EMAIL:
        return this.validateEmail(value);
      case ValidatorType.PHONE_NUMBER:
        return this.validatePhoneNumber(value);
      case ValidatorType.URL:
        return this.validateUrl(value);
      case ValidatorType.NUMERIC:
        return this.validateNumeric(value);
      case ValidatorType.NON_EMPTY:
        return this.validateNonEmpty(value);
      case ValidatorType.FULL_NAME:
        return this.validateFullName(value);
      case ValidatorType.SEARCH:
        return this.validateSearch(value);
      case ValidatorType.CUSTOM:
        return options?.customValidator
          ? options.customValidator(value)
          : this.validateNonEmpty(value);
      default:
        return null;
    }
  }

  /**
   * Validate username
   */
  private validateUsername(value: string): string | null {
    if (!value) return ErrorMessages.nonEmpty;
    if (!RegexPatterns.username.test(value)) {
      return ErrorMessages.username;
    }
    return null;
  }

  /**
   * Validate password
   */
  private validatePassword(value: string, options?: ValidatorOptions): string | null {
    if (!value) return ErrorMessages.nonEmpty;
    
    // Passwords should not contain spaces (regardless of trim setting)
    // Note: value here is already processed by processValue (trimmed if trim is enabled)
    // Trim only removes leading/trailing spaces, so we still need to check for internal spaces
    if (value.includes(' ')) {
      return ErrorMessages.passwordSpaces;
    }

    // Check minimum length (default 8)
    const minLength = options?.minLength || 8;
    if (value.length < minLength) {
      return ErrorMessages.passwordMinLength;
    }

    // Check password strength pattern
    if (!RegexPatterns.password.test(value)) {
      return ErrorMessages.password;
    }

    return null;
  }

  /**
   * Validate email
   */
  private validateEmail(value: string): string | null {
    if (!value) return ErrorMessages.nonEmpty;
    // Use validator helper's email validation if available, otherwise use default
    const emailValidator = validatorHelperIsValidEmail || isEmail;
    if (!emailValidator(value)) {
      return ErrorMessages.email;
    }
    return null;
  }

  /**
   * Validate phone number
   */
  private validatePhoneNumber(value: string): string | null {
    if (!value) return ErrorMessages.nonEmpty;
    if (!RegexPatterns.phoneNumber.test(value)) {
      return ErrorMessages.phoneNumber;
    }
    return null;
  }

  /**
   * Validate URL
   */
  private validateUrl(value: string): string | null {
    if (!value) return ErrorMessages.nonEmpty;
    if (!isUrl(value)) {
      return ErrorMessages.url;
    }
    return null;
  }

  /**
   * Validate numeric
   */
  private validateNumeric(value: string): string | null {
    if (!value) return ErrorMessages.nonEmpty;
    if (!RegexPatterns.numeric.test(value)) {
      return ErrorMessages.numeric;
    }
    return null;
  }

  /**
   * Validate non-empty
   */
  private validateNonEmpty(value: string): string | null {
    if (!value || value.length === 0) {
      return ErrorMessages.nonEmpty;
    }
    return null;
  }

  /**
   * Validate full name
   */
  private validateFullName(value: string): string | null {
    if (!value) return ErrorMessages.nonEmpty;
    
    // Check for consecutive spaces
    if (value.includes('  ')) {
      return ErrorMessages.fullNameConsecutiveSpaces;
    }

    if (!RegexPatterns.fullName.test(value)) {
      return ErrorMessages.fullName;
    }

    return null;
  }

  /**
   * Validate search (no validation, always valid)
   */
  private validateSearch(_value: string): string | null {
    return null;
  }

  /**
   * Get field name for error messages
   */
  private getFieldName(type: ValidatorType): string {
    const fieldNames: { [key in ValidatorType]: string } = {
      [ValidatorType.USERNAME]: 'Username',
      [ValidatorType.PASSWORD]: 'Password',
      [ValidatorType.EMAIL]: 'Email',
      [ValidatorType.PHONE_NUMBER]: 'Phone number',
      [ValidatorType.URL]: 'URL',
      [ValidatorType.NUMERIC]: 'Number',
      [ValidatorType.NON_EMPTY]: 'Field',
      [ValidatorType.FULL_NAME]: 'Full name',
      [ValidatorType.SEARCH]: 'Search',
      [ValidatorType.CUSTOM]: 'Field',
    };
    return fieldNames[type] || 'Field';
  }
}

/**
 * Get the singleton instance of ValidatorHelper
 * @returns The singleton ValidatorHelper instance
 * @example
 * ```typescript
 * const helper = getValidatorHelper();
 * const result = helper.validate('test@example.com', ValidatorType.EMAIL);
 * ```
 */
export function getValidatorHelper(): ValidatorHelper {
  return ValidatorHelper.getInstance();
}

/**
 * Convenience function: Validate username
 * Validates that username contains only letters, numbers, and underscores
 * @param value The username string to validate
 * @param options Optional validation options
 * @returns ValidationResult with isValid flag and error messages
 * @example
 * ```typescript
 * // Basic usage
 * const result = validateUsername('john_doe123');
 * if (result.isValid) {
 *   console.log('Valid username');
 * }
 * 
 * // With length constraints
 * const result2 = validateUsername('john', { minLength: 5, maxLength: 20 });
 * // result2.isValid will be false if username is less than 5 characters
 * 
 * // With Turkish character support
 * const result3 = validateUsername('ışık', { convertTurkishChars: true });
 * // Turkish characters will be converted before validation
 * ```
 */
export function validateUsername(
  value: string,
  options?: ValidatorOptions
): ValidationResult {
  return ValidatorHelper.getInstance().validate(value, ValidatorType.USERNAME, options);
}

/**
 * Convenience function: Validate password
 * Validates password strength: must contain uppercase, lowercase, number, and special character
 * @param value The password string to validate
 * @param options Optional validation options (minLength defaults to 8)
 * @returns ValidationResult with isValid flag and error messages
 * @example
 * ```typescript
 * // Basic usage (minimum 8 characters required)
 * const result = validatePassword('MyP@ss123');
 * if (result.isValid) {
 *   console.log('Strong password');
 * } else {
 *   console.error(result.error); // e.g., "Password must contain at least..."
 * }
 * 
 * // Custom minimum length
 * const result2 = validatePassword('Pass1!', { minLength: 10 });
 * // Will fail because password is only 6 characters
 * 
 * // Password with spaces (will fail)
 * const result3 = validatePassword('My P@ss123');
 * // result3.isValid will be false, error: "Password must not contain spaces"
 * ```
 */
export function validatePassword(
  value: string,
  options?: ValidatorOptions
): ValidationResult {
  return ValidatorHelper.getInstance().validate(value, ValidatorType.PASSWORD, options);
}

/**
 * Convenience function: Validate email
 * Validates email address format using regex pattern
 * @param value The email string to validate
 * @param options Optional validation options
 * @returns ValidationResult with isValid flag and error messages
 * @example
 * ```typescript
 * // Basic usage
 * const result = validateEmail('user@example.com');
 * if (result.isValid) {
 *   console.log('Valid email');
 * }
 * 
 * // Invalid email
 * const result2 = validateEmail('invalid-email');
 * // result2.isValid will be false
 * 
 * // With length constraints
 * const result3 = validateEmail('test@example.com', { maxLength: 10 });
 * // Will fail if email exceeds 10 characters
 * ```
 */
export function validateEmail(
  value: string,
  options?: ValidatorOptions
): ValidationResult {
  return ValidatorHelper.getInstance().validate(value, ValidatorType.EMAIL, options);
}

/**
 * Convenience function: Validate phone number
 * Validates phone number format (supports various international formats)
 * @param value The phone number string to validate
 * @param options Optional validation options
 * @returns ValidationResult with isValid flag and error messages
 * @example
 * ```typescript
 * // Valid phone numbers
 * validatePhoneNumber('+905551234567'); // Turkish format
 * validatePhoneNumber('(555) 123-4567'); // US format
 * validatePhoneNumber('555-123-4567'); // US format with dashes
 * 
 * // Invalid phone number
 * const result = validatePhoneNumber('123');
 * // result.isValid will be false
 * 
 * // With custom error message
 * const result2 = validatePhoneNumber('123', {
 *   customErrorMessage: 'Please enter a valid Turkish phone number'
 * });
 * ```
 */
export function validatePhoneNumber(
  value: string,
  options?: ValidatorOptions
): ValidationResult {
  return ValidatorHelper.getInstance().validate(
    value,
    ValidatorType.PHONE_NUMBER,
    options
  );
}

/**
 * Convenience function: Validate URL
 * Validates URL format (supports http, https, and protocol-relative URLs)
 * @param value The URL string to validate
 * @param options Optional validation options
 * @returns ValidationResult with isValid flag and error messages
 * @example
 * ```typescript
 * // Valid URLs
 * validateUrl('https://example.com');
 * validateUrl('http://www.example.com/path');
 * validateUrl('example.com'); // Protocol-relative
 * 
 * // Invalid URL
 * const result = validateUrl('not-a-url');
 * // result.isValid will be false
 * 
 * // With length constraints
 * const result2 = validateUrl('https://example.com', { maxLength: 10 });
 * // Will fail if URL exceeds 10 characters
 * ```
 */
export function validateUrl(
  value: string,
  options?: ValidatorOptions
): ValidationResult {
  return ValidatorHelper.getInstance().validate(value, ValidatorType.URL, options);
}

/**
 * Convenience function: Validate numeric
 * Validates that the value contains only numeric digits
 * @param value The string to validate as numeric
 * @param options Optional validation options
 * @returns ValidationResult with isValid flag and error messages
 * @example
 * ```typescript
 * // Valid numeric values
 * validateNumeric('12345');
 * validateNumeric('0');
 * 
 * // Invalid (contains non-numeric characters)
 * const result = validateNumeric('123abc');
 * // result.isValid will be false
 * 
 * // With length constraints
 * const result2 = validateNumeric('123', { minLength: 4 });
 * // Will fail because value is only 3 digits
 * 
 * // Empty value
 * const result3 = validateNumeric('');
 * // result3.isValid will be false, error: "This field cannot be empty"
 * ```
 */
export function validateNumeric(
  value: string,
  options?: ValidatorOptions
): ValidationResult {
  return ValidatorHelper.getInstance().validate(value, ValidatorType.NUMERIC, options);
}

/**
 * Convenience function: Validate non-empty
 * Validates that the value is not empty (after optional trimming)
 * @param value The string to validate
 * @param options Optional validation options
 * @returns ValidationResult with isValid flag and error messages
 * @example
 * ```typescript
 * // Valid (non-empty)
 * validateNonEmpty('Hello');
 * validateNonEmpty('   text   '); // Will be trimmed, then validated
 * 
 * // Invalid (empty)
 * const result = validateNonEmpty('');
 * // result.isValid will be false
 * 
 * // With trim disabled
 * const result2 = validateNonEmpty('   ', { trim: false });
 * // Will pass because spaces are not trimmed
 * 
 * // Common use case: form field validation
 * const username = formData.username;
 * const result = validateNonEmpty(username);
 * if (!result.isValid) {
 *   showError(result.error);
 * }
 * ```
 */
export function validateNonEmpty(
  value: string,
  options?: ValidatorOptions
): ValidationResult {
  return ValidatorHelper.getInstance().validate(value, ValidatorType.NON_EMPTY, options);
}

/**
 * Convenience function: Validate full name
 * Validates that the value contains only letters and spaces (supports Turkish characters)
 * @param value The full name string to validate
 * @param options Optional validation options
 * @returns ValidationResult with isValid flag and error messages
 * @example
 * ```typescript
 * // Valid full names
 * validateFullName('John Doe');
 * validateFullName('Ahmet Yılmaz'); // Turkish characters supported
 * validateFullName('Mary Jane Smith');
 * 
 * // Invalid (contains numbers)
 * const result = validateFullName('John123');
 * // result.isValid will be false
 * 
 * // Invalid (consecutive spaces)
 * const result2 = validateFullName('John  Doe');
 * // result2.isValid will be false, error: "Full name must not contain consecutive spaces"
 * 
 * // With length constraints
 * const result3 = validateFullName('John', { minLength: 5 });
 * // Will fail if name is less than 5 characters
 * ```
 */
export function validateFullName(
  value: string,
  options?: ValidatorOptions
): ValidationResult {
  return ValidatorHelper.getInstance().validate(value, ValidatorType.FULL_NAME, options);
}

/**
 * Convenience function: Validate search
 * No validation is performed - always returns valid (useful for search queries)
 * @param value The search query string
 * @param options Optional validation options (only length constraints apply)
 * @returns ValidationResult with isValid flag (always true unless length constraints fail)
 * @example
 * ```typescript
 * // Always valid (no format validation)
 * validateSearch('any search query');
 * validateSearch('123 !@#$%'); // Even special characters are allowed
 * 
 * // Length constraints still apply
 * const result = validateSearch('ab', { minLength: 3 });
 * // result.isValid will be false if query is less than 3 characters
 * 
 * // Common use case: search input validation
 * const query = searchInput.value;
 * const result = validateSearch(query, { minLength: 2 });
 * if (result.isValid) {
 *   performSearch(query);
 * }
 * ```
 */
export function validateSearch(
  value: string,
  options?: ValidatorOptions
): ValidationResult {
  return ValidatorHelper.getInstance().validate(value, ValidatorType.SEARCH, options);
}

