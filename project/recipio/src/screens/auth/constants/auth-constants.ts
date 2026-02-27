/**
 * Auth screen constants (aligned with validator-helper pattern).
 */

export const EMAIL_MAX_LENGTH = 254;
export const PASSWORD_MAX_LENGTH = 128;
export const FULL_NAME_MAX_LENGTH = 100;
export const USERNAME_MAX_LENGTH = 20;
export const PHONE_MAX_LENGTH = 20;

export const AUTH_ERROR_COLORS = {
  error: '#FF3B30',
  success: '#34C759',
} as const;

export const SOCIAL_LOGIN_ICON_COLORS = {
  google: '#4285F4',
} as const;

export const SOCIAL_LOGIN_PROVIDERS = {
  GOOGLE: 'google',
  GITHUB: 'github',
  APPLE: 'apple',
} as const;

export type SocialLoginProvider =
  (typeof SOCIAL_LOGIN_PROVIDERS)[keyof typeof SOCIAL_LOGIN_PROVIDERS];

export const ICON_SIZES = {
  small: 16,
  medium: 20,
  large: 24,
} as const;
