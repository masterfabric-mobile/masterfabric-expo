/**
 * Validator Helper Constants
 * 
 * Configuration constants for the validator helper
 */

/**
 * Map English error messages to translation keys
 * This mapping is used to translate error messages from the validator helper
 * to the appropriate i18n keys for localization.
 */
export const ERROR_MESSAGE_MAP: Record<string, string> = {
  'Username can only contain letters, numbers, and underscores.': 'helpers.validatorHelper.errors.username',
  'Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character.': 'helpers.validatorHelper.errors.password',
  'Password must not contain spaces.': 'helpers.validatorHelper.errors.passwordSpaces',
  'Please enter a valid email address.': 'helpers.validatorHelper.errors.email',
  'Please enter a valid phone number.': 'helpers.validatorHelper.errors.phoneNumber',
  'Please enter a valid URL.': 'helpers.validatorHelper.errors.url',
  'This field must contain only numbers.': 'helpers.validatorHelper.errors.numeric',
  'This field cannot be empty.': 'helpers.validatorHelper.errors.nonEmpty',
  'Full name can only contain letters and spaces.': 'helpers.validatorHelper.errors.fullName',
  'Full name must not contain consecutive spaces.': 'helpers.validatorHelper.errors.fullNameConsecutiveSpaces',
} as const;

/**
 * Auth Form Constants
 */
export const AUTH_COLORS = {
  dark: {
    background: '#000000',
    cardBackground: '#1A1A1A',
    text: '#FFFFFF',
    textSecondary: '#A0A0A0',
    border: '#2A2A2A',
    inputBackground: '#1F1F1F',
    primary: '#FFFFFF',
    primaryText: '#000000',
    link: '#007AFF',
    borderHover: '#3A3A3A',
  },
  light: {
    background: '#FFFFFF',
    cardBackground: '#FFFFFF',
    text: '#1A1A1A',
    textSecondary: '#6C757D',
    border: '#E1E4E8',
    inputBackground: '#FFFFFF',
    primary: '#000000',
    primaryText: '#FFFFFF',
    link: '#007AFF',
    borderHover: '#D1D5DB',
  },
} as const;

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

export type SocialLoginProvider = typeof SOCIAL_LOGIN_PROVIDERS[keyof typeof SOCIAL_LOGIN_PROVIDERS];

/**
 * Password field max length
 */
export const PASSWORD_MAX_LENGTH = 128;

/**
 * Header background colors
 */
export const HEADER_BACKGROUND_COLORS = {
  dark: '#000000',
  light: '#FFFFFF',
} as const;

/**
 * Button primary color (fallback)
 */
export const BUTTON_PRIMARY_COLOR = '#007AFF';

/**
 * White color constant
 */
export const WHITE_COLOR = '#FFFFFF';

/**
 * Transparent color constant
 */
export const TRANSPARENT_COLOR = 'transparent';

/**
 * Tab button inactive text color
 */
export const TAB_BUTTON_INACTIVE_COLOR = '#8E8E93';

/**
 * Default min length placeholder
 */
export const DEFAULT_MIN_LENGTH_PLACEHOLDER = '3';

/**
 * Default max length placeholder
 */
export const DEFAULT_MAX_LENGTH_PLACEHOLDER = '20';

/**
 * Border opacity suffix for semi-transparent borders
 */
export const BORDER_OPACITY_SUFFIX = '30';

/**
 * Icon sizes used in validator helper components
 */
export const ICON_SIZES = {
  small: 16,
  medium: 20,
  large: 24,
} as const;

/**
 * Font weights used in validator helper components
 */
export const FONT_WEIGHTS = {
  regular: '400',
  medium: '500',
  semiBold: '600',
  bold: '700',
} as const;

