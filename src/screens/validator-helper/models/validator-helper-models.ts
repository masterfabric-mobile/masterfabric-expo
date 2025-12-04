import { ValidationResult, ValidatorType } from 'masterfabric-expo-core';

export interface ValidatorTestResult {
  id: string;
  validatorType: ValidatorType;
  input: string;
  result: ValidationResult;
  description: string;
}

export interface ValidatorTestInput {
  value: string;
  validatorType: ValidatorType;
  minLength?: number;
  maxLength?: number;
  trim?: boolean;
  convertTurkishChars?: boolean;
}

export interface ValidatorHelperState {
  testInput: ValidatorTestInput;
  testResults: ValidatorTestResult[];
  isLoading: boolean;
}

/**
 * Auth form related types and interfaces
 */
export type AuthTab = 'login' | 'register';

export interface PasswordRequirement {
  label: string;
  check: (password: string) => boolean;
}

export interface AuthFormTouchedState {
  loginEmail: boolean;
  loginPassword: boolean;
  registerFullName: boolean;
  registerEmail: boolean;
  registerUsername: boolean;
  registerPassword: boolean;
  registerConfirmPassword: boolean;
}

