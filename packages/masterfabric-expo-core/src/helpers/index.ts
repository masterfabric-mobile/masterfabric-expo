// Device Information Helpers
export * from './connectivity';

// Platform Helpers
export * from './platform';

// Permission Helpers
export * from './permissions';

// Accessibility Helpers
export * from './accessibility';

// String Helpers
export * from './string_helper';

// Logger Helper    
export * from './logger_helper';

// Snackbar Helper
export * from './snackbar_helper';

// Toast Helper
export * from './toast_helper';

// Rich Text Helper
export * from './rich_text_helper';

// Validator Helper
export * from './validator_helper';

// Onboarding Helper
export * from './onboarding_helper';

// Device Info Helpers
export * from './device-info';

// UI Size Helper
export * from './ui_size_helper';

// Re-export types with different names to avoid conflicts
export type { DeviceInfo as DeviceInfoHelper, DeviceInfoOptions } from './device-info';

// Typography Helpers
export * from './typography_helper';

// Time Helpers
export * from './time_helper';

// URL Launcher Helper
export * from './url_launcher_helper';

// Battery Helper
export * from './batteryHelper';

// App Icon Helper
export * from './app_icon_helper';

// Video Player & Haptic Helper
export * from './videoPlayerHapticHelper';

// Double Extension Helper — Implementation Pattern: individual exports, JSDoc, type-safe, Intl, edge cases (NaN/Infinity/zero/negative)
export {
  ceil, clamp, CurrencyLocaleValidationError, DoubleExtensionHelper, doubleHelper, floor, formatClean, formatCompact, formatCurrency, formatPercentage, isApproximatelyEqual, isFiniteNumber,
  isPositiveNumber, isValidCurrency,
  isValidLocale, isZero, NumericInputValidationError, round, safeAdd, safeDivide, safeMultiply, safeSubtract, TextInputValidationError, toClean, toCompact, toCurrency,
  toCurrencyStrict, toPercentage, toPrecision, truncate, validateNumberInput,
  validateTextInput
} from './double_extension_helper';
export type {
  CompactOptions, CurrencyOptions,
  PercentageOptions, PrecisionOptions,
  TextValidationOptions
} from './double_extension_helper';

