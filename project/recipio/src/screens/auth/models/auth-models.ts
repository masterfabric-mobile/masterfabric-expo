/**
 * Auth screen models (aligned with validator-helper AuthForm types).
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
  registerPhone: boolean;
  registerPassword: boolean;
  registerConfirmPassword: boolean;
}
