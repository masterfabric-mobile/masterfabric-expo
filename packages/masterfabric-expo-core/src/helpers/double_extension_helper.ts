/**
 * Double Extension Helper
 *
 * Centralized utilities for precision, formatting, and mathematical operations
 * on number (double) values.
 *
 * Implementation Pattern (following string_helper.ts, ui_size_helper.ts):
 * - Export individual functions for simple utilities (like string_helper.ts)
 * - Include comprehensive JSDoc comments with examples
 * - Type-safe with TypeScript
 * - Use native APIs where possible (Intl.NumberFormat for currency formatting)
 * - Export from helpers/index.ts for easy importing
 * - Handle edge cases: NaN, Infinity, negative numbers, zero
 *
 * Related Helpers (integrate in app layer):
 * - string_helper: use truncate/capitalize on formatted strings (e.g. string_helper.truncate(doubleHelper.toCurrency(x), 10))
 * - logger_helper: log numeric operations or validation failures (e.g. loggerHelper.warning('Invalid value', { value }))
 * - toast_helper: show validation errors to users (e.g. toastHelper.showError('Invalid number'))
 * - snackbar_helper: show calculation status (e.g. snackbarHelper.show({ message: 'Calculating…', type: 'info' }))
 *
 * @example
 * ```typescript
 * import { doubleHelper, toPrecision, toCurrency } from 'masterfabric-expo-core';
 *
 * toPrecision(19.999, 2);           // "20.00"
 * doubleHelper.toCurrency(19.999);  // "$20.00"
 * doubleHelper.safeAdd(0.1, 0.2);  // 0.3
 * ```
 */

// ---------------------------------------------------------------------------
// Type definitions
// ---------------------------------------------------------------------------

export interface CurrencyOptions {
  currency?: string;
  locale?: string;
  symbol?: string;
  minimumFractionDigits?: number;
  maximumFractionDigits?: number;
  showSymbol?: boolean;
}

export interface PercentageOptions {
  decimals?: number;
  showSymbol?: boolean;
  multiplier?: number;
}

export interface CompactOptions {
  decimals?: number;
  notation?: 'standard' | 'compact';
  compactDisplay?: 'short' | 'long';
}

export interface PrecisionOptions {
  decimals: number;
  roundingMode?: 'round' | 'floor' | 'ceil' | 'truncate';
}

/** Options for validateTextInput. */
export interface TextValidationOptions {
  /** Maximum allowed length (after trim). */
  maxLength?: number;
  /** Minimum required length (after trim). */
  minLength?: number;
  /** If true, allow string that is only whitespace (still trimmed). Default false. */
  allowWhitespaceOnly?: boolean;
}

const DEFAULT_TOLERANCE = 1e-10;
const MAX_DECIMALS = 20;
const CLEAN_PRECISION = 14;

/** Regex: valid numeric string (optional sign, digits, optional decimal, optional exponent). */
const NUMERIC_STRING_REGEX = /^[+-]?\d*\.?\d*(e[+-]?\d+)?$/i;

// ---------------------------------------------------------------------------
// Validation error classes (no fallback; clear messages for UI FAIL)
// ---------------------------------------------------------------------------

/** Thrown when currency or locale fails strict validation (toCurrencyStrict). */
export class CurrencyLocaleValidationError extends Error {
  constructor(
    message: string,
    public readonly code: 'INVALID_CURRENCY' | 'INVALID_LOCALE',
    public readonly value: string
  ) {
    super(message);
    this.name = 'CurrencyLocaleValidationError';
    Object.setPrototypeOf(this, CurrencyLocaleValidationError.prototype);
  }
}

/** Thrown when numeric input fails strict validation (validateNumberInput). */
export class NumericInputValidationError extends Error {
  constructor(message: string, public readonly value: unknown) {
    super(message);
    this.name = 'NumericInputValidationError';
    Object.setPrototypeOf(this, NumericInputValidationError.prototype);
  }
}

/** Thrown when text input fails strict validation (validateTextInput). */
export class TextInputValidationError extends Error {
  constructor(message: string, public readonly value: unknown) {
    super(message);
    this.name = 'TextInputValidationError';
    Object.setPrototypeOf(this, TextInputValidationError.prototype);
  }
}

// ---------------------------------------------------------------------------
// Currency & locale validation (ISO 4217 / BCP 47)
// ---------------------------------------------------------------------------

/** ISO 3166-1 alpha-2 region codes (2-letter). Used to reject invalid locale region parts (e.g. nn-ff). */
const ISO_3166_1_ALPHA2_REGIONS = new Set<string>([
  'AD', 'AE', 'AF', 'AG', 'AI', 'AL', 'AM', 'AO', 'AQ', 'AR', 'AS', 'AT', 'AU', 'AW', 'AX', 'AZ', 'BA', 'BB', 'BD',
  'BE', 'BF', 'BG', 'BH', 'BI', 'BJ', 'BL', 'BM', 'BN', 'BO', 'BQ', 'BR', 'BS', 'BT', 'BV', 'BW', 'BY', 'BZ', 'CA',
  'CC', 'CD', 'CF', 'CG', 'CH', 'CI', 'CK', 'CL', 'CM', 'CN', 'CO', 'CR', 'CU', 'CV', 'CW', 'CX', 'CY', 'CZ', 'DE',
  'DJ', 'DK', 'DM', 'DO', 'DZ', 'EC', 'EE', 'EG', 'EH', 'ER', 'ES', 'ET', 'FI', 'FJ', 'FK', 'FM', 'FO', 'FR', 'GA',
  'GB', 'GD', 'GE', 'GF', 'GG', 'GH', 'GI', 'GL', 'GM', 'GN', 'GP', 'GQ', 'GR', 'GS', 'GT', 'GU', 'GW', 'GY', 'HK',
  'HM', 'HN', 'HR', 'HT', 'HU', 'ID', 'IE', 'IL', 'IM', 'IN', 'IO', 'IQ', 'IR', 'IS', 'IT', 'JE', 'JM', 'JO', 'JP',
  'KE', 'KG', 'KH', 'KI', 'KM', 'KN', 'KP', 'KR', 'KW', 'KY', 'KZ', 'LA', 'LB', 'LC', 'LI', 'LK', 'LR', 'LS', 'LT',
  'LU', 'LV', 'LY', 'MA', 'MC', 'MD', 'ME', 'MF', 'MG', 'MH', 'MK', 'ML', 'MM', 'MN', 'MO', 'MP', 'MQ', 'MR', 'MS',
  'MT', 'MU', 'MV', 'MW', 'MX', 'MY', 'MZ', 'NA', 'NC', 'NE', 'NF', 'NG', 'NI', 'NL', 'NO', 'NP', 'NR', 'NU', 'NZ',
  'OM', 'PA', 'PE', 'PF', 'PG', 'PH', 'PK', 'PL', 'PM', 'PN', 'PR', 'PS', 'PT', 'PW', 'PY', 'QA', 'RE', 'RO', 'RS',
  'RU', 'RW', 'SA', 'SB', 'SC', 'SD', 'SE', 'SG', 'SH', 'SI', 'SJ', 'SK', 'SL', 'SM', 'SN', 'SO', 'SR', 'SS', 'ST',
  'SV', 'SX', 'SY', 'SZ', 'TC', 'TD', 'TF', 'TG', 'TH', 'TJ', 'TK', 'TL', 'TM', 'TN', 'TO', 'TR', 'TT', 'TV', 'TW',
  'TZ', 'UA', 'UG', 'UM', 'US', 'UY', 'UZ', 'VA', 'VC', 'VE', 'VG', 'VI', 'VN', 'VU', 'WF', 'WS', 'YE', 'YT', 'ZA',
  'ZM', 'ZW',
]);

/** ISO 4217 alphabetic codes (fallback when Intl.supportedValuesOf is unavailable, e.g. RN). */
const ISO_4217_ALPHA_CODES = new Set<string>([
  'AED', 'AFN', 'ALL', 'AMD', 'ANG', 'AOA', 'ARS', 'AUD', 'AWG', 'AZN', 'BAM', 'BBD', 'BDT', 'BGN', 'BHD', 'BIF',
  'BMD', 'BND', 'BOB', 'BRL', 'BSD', 'BTN', 'BWP', 'BYN', 'BZD', 'CAD', 'CDF', 'CHF', 'CLP', 'CNY', 'COP', 'CRC',
  'CUP', 'CVE', 'CZK', 'DJF', 'DKK', 'DOP', 'DZD', 'EGP', 'ERN', 'ETB', 'EUR', 'FJD', 'FKP', 'FOK', 'GBP', 'GEL',
  'GGP', 'GHS', 'GIP', 'GMD', 'GNF', 'GTQ', 'GYD', 'HKD', 'HNL', 'HRK', 'HTG', 'HUF', 'IDR', 'ILS', 'IMP', 'INR',
  'IQD', 'IRR', 'ISK', 'JEP', 'JMD', 'JOD', 'JPY', 'KES', 'KGS', 'KHR', 'KID', 'KMF', 'KRW', 'KWD', 'KYD', 'KZT',
  'LAK', 'LBP', 'LKR', 'LRD', 'LSL', 'LYD', 'MAD', 'MDL', 'MGA', 'MKD', 'MMK', 'MNT', 'MOP', 'MRU', 'MUR', 'MVR',
  'MWK', 'MXN', 'MYR', 'MZN', 'NAD', 'NGN', 'NIO', 'NOK', 'NPR', 'NZD', 'OMR', 'PAB', 'PEN', 'PGK', 'PHP', 'PKR',
  'PLN', 'PYG', 'QAR', 'RON', 'RSD', 'RUB', 'RWF', 'SAR', 'SBD', 'SCR', 'SDG', 'SEK', 'SGD', 'SHP', 'SLE', 'SOS',
  'SRD', 'SSP', 'STN', 'SYP', 'SZL', 'THB', 'TJS', 'TMT', 'TND', 'TOP', 'TRY', 'TTD', 'TVD', 'TWD', 'TZS', 'UAH',
  'UGX', 'USD', 'UYU', 'UZS', 'VES', 'VND', 'VUV', 'WST', 'XAF', 'XCD', 'XOF', 'XPF', 'YER', 'ZAR', 'ZMW', 'ZWL',
  'XAU', 'XAG', 'XPT', 'XPD', // Precious metals
]);

function getSupportedCurrenciesSet(): Set<string> {
  if (typeof Intl !== 'undefined' && 'supportedValuesOf' in Intl) {
    try {
      const list = (Intl as any).supportedValuesOf('currency') as string[];
      return new Set(list.map((c: string) => String(c).toUpperCase()));
    } catch {
      return ISO_4217_ALPHA_CODES;
    }
  }
  return ISO_4217_ALPHA_CODES;
}

let cachedCurrencySet: Set<string> | null = null;

function getValidCurrencySet(): Set<string> {
  if (cachedCurrencySet === null) {
    cachedCurrencySet = getSupportedCurrenciesSet();
  }
  return cachedCurrencySet;
}

/**
 * Returns true if the given string is a valid ISO 4217 alphabetic currency code.
 * Uses Intl.supportedValuesOf('currency') when available, otherwise a built-in ISO 4217 set.
 *
 * @param currency - 3-letter currency code (e.g. 'USD', 'EUR'). Trimmed and uppercased.
 * @returns true if valid
 * @example
 * isValidCurrency('USD')   // true
 * isValidCurrency('USDD')  // false
 * isValidCurrency('eur')   // true (case-insensitive)
 */
export function isValidCurrency(currency: string): boolean {
  if (typeof currency !== 'string') return false;
  const code = currency.trim().toUpperCase();
  if (code.length !== 3) return false;
  return getValidCurrencySet().has(code);
}

/**
 * Returns true if the given string is a valid BCP 47 locale for Intl.
 * Validates region part (e.g. in "en-US") against ISO 3166-1 alpha-2 so that
 * invalid combinations like "nn-ff" are rejected even if Intl accepts them.
 *
 * @param locale - Locale string (e.g. 'en-US', 'tr-TR'). Empty/whitespace is invalid.
 * @returns true if valid
 * @example
 * isValidLocale('en-US')   // true
 * isValidLocale('nn-ff')   // false (ff is not a valid region code)
 */
export function isValidLocale(locale: string): boolean {
  if (typeof locale !== 'string') return false;
  const trimmed = locale.trim();
  if (trimmed.length === 0) return false;
  const parts = trimmed.split('-');
  if (parts.length >= 2) {
    const lastPart = parts[parts.length - 1];
    if (lastPart.length === 2 && /^[a-zA-Z]{2}$/.test(lastPart)) {
      if (!ISO_3166_1_ALPHA2_REGIONS.has(lastPart.toUpperCase())) return false;
    }
  }
  try {
    new Intl.NumberFormat(trimmed);
    return true;
  } catch (e) {
    return e instanceof RangeError ? false : false;
  }
}

// ---------------------------------------------------------------------------
// Numeric and text input validation (strict; throw on invalid, no fallback)
// ---------------------------------------------------------------------------

/**
 * Type guard: true only when value is a finite number (not NaN, not Infinity).
 * Pure function.
 *
 * @param value - Any value
 * @returns true if value is number and is finite
 * @example
 * isFiniteNumber(42)     // true
 * isFiniteNumber(NaN)    // false
 * isFiniteNumber('42')  // false
 */
export function isFiniteNumber(value: unknown): value is number {
  return typeof value === 'number' && Number.isFinite(value);
}

/**
 * Returns true if value is a finite positive number (> 0).
 * Pure function.
 *
 * @param value - Number to check
 * @returns true if value is number, finite, and > 0
 * @example
 * isPositiveNumber(1)   // true
 * isPositiveNumber(0)   // false
 * isPositiveNumber(-1)  // false
 */
export function isPositiveNumber(value: number): boolean {
  return isFiniteNumber(value) && value > 0;
}

/**
 * Validates and parses numeric input. Throws on any invalid value; no fallback.
 * Use for user input (string or number) before passing to strict helpers.
 * Pure function.
 *
 * @param value - String or number from input
 * @returns Parsed finite number
 * @throws {NumericInputValidationError} If null, undefined, empty, whitespace-only, contains letters, NaN, or Infinity
 * @example
 * validateNumberInput('19.5')   // 19.5
 * validateNumberInput('  -2 ') // -2
 * validateNumberInput(null)    // throws
 * validateNumberInput('12a3')   // throws (letter)
 * validateNumberInput('')       // throws (empty)
 */
export function validateNumberInput(value: unknown): number {
  if (value === null || value === undefined) {
    throw new NumericInputValidationError('Number input is required (null or undefined not allowed).', value);
  }
  if (typeof value === 'number') {
    if (value !== value) {
      throw new NumericInputValidationError('Number input cannot be NaN.', value);
    }
    if (!Number.isFinite(value)) {
      throw new NumericInputValidationError(
        value === Infinity ? 'Number input cannot be Infinity.' : 'Number input cannot be -Infinity.',
        value
      );
    }
    return value;
  }
  if (typeof value !== 'string') {
    throw new NumericInputValidationError('Number input must be a string or number.', value);
  }
  const trimmed = value.trim();
  if (trimmed.length === 0) {
    throw new NumericInputValidationError('Number input cannot be empty or whitespace only.', value);
  }
  if (!NUMERIC_STRING_REGEX.test(trimmed)) {
    throw new NumericInputValidationError(
      'Number input contains invalid characters (only digits, optional sign, decimal point, and exponent allowed).',
      value
    );
  }
  const parsed = parseFloat(trimmed);
  if (parsed !== parsed) {
    throw new NumericInputValidationError('Number input could not be parsed (invalid format).', value);
  }
  if (!Number.isFinite(parsed)) {
    throw new NumericInputValidationError('Number input cannot be Infinity.', value);
  }
  return parsed;
}

/**
 * Validates text input. Trims and enforces min/max length. Throws on invalid; no fallback.
 * Pure function.
 *
 * @param value - String input
 * @param options - Optional minLength, maxLength, allowWhitespaceOnly
 * @returns Trimmed string
 * @throws {TextInputValidationError} If null, undefined, not string, empty/whitespace (unless allowed), or length out of range
 * @example
 * validateTextInput(' USD ')           // 'USD'
 * validateTextInput('', { maxLength: 8 })  // throws (empty)
 * validateTextInput('ab', { minLength: 3 }) // throws (too short)
 */
export function validateTextInput(value: unknown, options?: TextValidationOptions): string {
  if (value === null || value === undefined) {
    throw new TextInputValidationError('Text input is required (null or undefined not allowed).', value);
  }
  if (typeof value !== 'string') {
    throw new TextInputValidationError('Text input must be a string.', value);
  }
  const trimmed = value.trim();
  const allowWhitespaceOnly = options?.allowWhitespaceOnly === true;
  if (trimmed.length === 0) {
    throw new TextInputValidationError(
      allowWhitespaceOnly ? 'Text input is required.' : 'Text input cannot be empty or whitespace only.',
      value
    );
  }
  const minLength = options?.minLength;
  if (minLength != null && trimmed.length < minLength) {
    throw new TextInputValidationError(
      `Text input must be at least ${minLength} character(s).`,
      value
    );
  }
  const maxLength = options?.maxLength;
  if (maxLength != null && trimmed.length > maxLength) {
    throw new TextInputValidationError(
      `Text input must be at most ${maxLength} character(s).`,
      value
    );
  }
  return trimmed;
}

/**
 * Returns true if value is a finite number (rejects NaN, Infinity, -Infinity).
 * Used internally for edge-case handling across all functions.
 */
function isValidNumber(value: number): boolean {
  return typeof value === 'number' && !isNaN(value) && isFinite(value);
}

function clampDecimals(decimals: number): number {
  return Math.max(0, Math.min(MAX_DECIMALS, Math.floor(decimals)));
}

function getDecimalPlaces(num: number): number {
  if (!isValidNumber(num)) return 0;
  if (Math.floor(num) === num && num < 1e15) return 0;
  const str = num.toString();
  if (str.indexOf('.') !== -1 && str.indexOf('e-') === -1) {
    return str.split('.')[1].length;
  }
  if (str.indexOf('e-') !== -1) {
    const parts = str.split('e-');
    return parseInt(parts[1], 10) + (parts[0].split('.')[1] || '').length;
  }
  return 0;
}

// ---------------------------------------------------------------------------
// Precision handling
// ---------------------------------------------------------------------------

/**
 * Format number with specific decimal places. Handles rounding and floating-point precision.
 *
 * @param value - The number to format
 * @param decimals - Number of decimal places (0–20); clamped if out of range
 * @returns Formatted string. Returns String(value) for NaN/Infinity
 * @example
 * toPrecision(19.999, 2)   // "20.00"
 * toPrecision(0.1 + 0.2, 2) // "0.30"
 * toPrecision(0, 2)         // "0.00"
 * toPrecision(-1.234, 2)    // "-1.23"
 */
export function toPrecision(value: number, decimals: number): string {
  if (!isValidNumber(value)) return String(value);
  const d = clampDecimals(decimals);
  const mult = Math.pow(10, d);
  const rounded = Math.round(value * mult) / mult;
  return rounded.toFixed(d);
}

/**
 * Round number to specified decimal places.
 *
 * @param value - The number to round
 * @param decimals - Number of decimal places (0–20)
 * @returns Rounded number. Returns value unchanged for NaN/Infinity
 * @example
 * round(19.999, 2)  // 20
 * round(-1.234, 2)  // -1.23
 */
export function round(value: number, decimals: number): number {
  if (!isValidNumber(value)) return value;
  const d = clampDecimals(decimals);
  const mult = Math.pow(10, d);
  return Math.round(value * mult) / mult;
}

/**
 * Truncate number to specified decimal places (no rounding).
 *
 * @param value - The number to truncate
 * @param decimals - Number of decimal places (0–20)
 * @returns Truncated number. Returns value unchanged for NaN/Infinity
 * @example
 * truncate(19.999, 2)  // 19.99
 * truncate(-1.239, 2)  // -1.23
 */
export function truncate(value: number, decimals: number): number {
  if (!isValidNumber(value)) return value;
  const d = clampDecimals(decimals);
  const mult = Math.pow(10, d);
  return Math.trunc(value * mult) / mult;
}

/**
 * Ceil number to specified decimal places.
 *
 * @param value - The number to round up
 * @param decimals - Number of decimal places (0–20)
 * @returns Ceiled number. Returns value unchanged for NaN/Infinity
 * @example
 * ceil(19.001, 2)  // 19.01
 * ceil(-19.999, 2) // -19.99
 */
export function ceil(value: number, decimals: number): number {
  if (!isValidNumber(value)) return value;
  const d = clampDecimals(decimals);
  const mult = Math.pow(10, d);
  return Math.ceil(value * mult) / mult;
}

/**
 * Floor number to specified decimal places.
 *
 * @param value - The number to round down
 * @param decimals - Number of decimal places (0–20)
 * @returns Floored number. Returns value unchanged for NaN/Infinity
 * @example
 * floor(19.999, 2)  // 19.99
 * floor(-19.001, 2) // -19.01
 */
export function floor(value: number, decimals: number): number {
  if (!isValidNumber(value)) return value;
  const d = clampDecimals(decimals);
  const mult = Math.pow(10, d);
  return Math.floor(value * mult) / mult;
}

// ---------------------------------------------------------------------------
// Currency formatting
// ---------------------------------------------------------------------------

/**
 * Format number as currency. Uses native Intl.NumberFormat for locale support.
 *
 * @param value - The number to format
 * @param options - Currency and locale options (currency, locale, min/max fraction digits)
 * @returns Formatted currency string. Returns String(value) for NaN/Infinity; fallback for invalid locale
 * @example
 * toCurrency(19.999)                      // "$20.00"
 * toCurrency(19.999, { symbol: '$' })     // "$20.00" (custom symbol, issue #26)
 * toCurrency(19.999, { currency: 'EUR' }) // "€20.00"
 * toCurrency(19.999, { minimumFractionDigits: 0, maximumFractionDigits: 0 }) // "$20"
 */
export function toCurrency(value: number, options?: CurrencyOptions): string {
  if (!isValidNumber(value)) return String(value);
  const {
    currency = 'USD',
    locale = 'en-US',
    symbol,
    minimumFractionDigits = 2,
    maximumFractionDigits = 2,
  } = options ?? {};
  // Issue #26: support custom symbol (e.g. toCurrency(price, { symbol: '$' }) → "$20.00")
  if (symbol !== undefined && symbol !== '') {
    return `${symbol}${toPrecision(value, maximumFractionDigits)}`;
  }
  try {
    return new Intl.NumberFormat(locale, {
      style: 'currency',
      currency,
      minimumFractionDigits,
      maximumFractionDigits,
    }).format(value);
  } catch {
    return `${currency} ${toPrecision(value, maximumFractionDigits)}`;
  }
}

/**
 * Format number as currency with strict validation. Uses the shared validation system:
 * value → validateNumberInput; currency/locale → isValidCurrency, isValidLocale.
 * No fallback on invalid input; throws with clear message for UI FAIL.
 *
 * @param value - The number to format (string or number; validated via validateNumberInput).
 * @param options - Currency and locale options (currency, locale, min/max fraction digits). Symbol is ignored; Intl is always used.
 * @returns Formatted currency string
 * @throws {NumericInputValidationError} If value is not a valid finite number
 * @throws {CurrencyLocaleValidationError} If currency is not valid ISO 4217 or locale is not valid BCP 47
 * @example
 * toCurrencyStrict(19.999, { currency: 'USD', locale: 'en-US' })  // "$20.00"
 * toCurrencyStrict('19.999', { currency: 'USD', locale: 'en-US' }) // "$20.00"
 * toCurrencyStrict(19.999, { currency: 'USDD', locale: 'en-US' })  // throws (INVALID_CURRENCY)
 * toCurrencyStrict(19.999, { currency: 'USD', locale: 'xyz' })     // throws (INVALID_LOCALE)
 */
export function toCurrencyStrict(value: unknown, options?: CurrencyOptions): string {
  const num = validateNumberInput(value);
  const {
    currency = 'USD',
    locale = 'en-US',
    minimumFractionDigits = 2,
    maximumFractionDigits = 2,
  } = options ?? {};
  const currencyTrimmed = (typeof currency === 'string' ? currency.trim() : '') || 'USD';
  const localeTrimmed = (typeof locale === 'string' ? locale.trim() : '') || 'en-US';
  if (!isValidCurrency(currencyTrimmed)) {
    throw new CurrencyLocaleValidationError(
      `Invalid ISO 4217 currency code: "${currencyTrimmed}". Must be 3 letters and supported by Intl.`,
      'INVALID_CURRENCY',
      currencyTrimmed
    );
  }
  if (!isValidLocale(localeTrimmed)) {
    throw new CurrencyLocaleValidationError(
      `Invalid locale: "${localeTrimmed}". Must be a valid BCP 47 locale supported by Intl.`,
      'INVALID_LOCALE',
      localeTrimmed
    );
  }
  return new Intl.NumberFormat(localeTrimmed, {
    style: 'currency',
    currency: currencyTrimmed.toUpperCase(),
    minimumFractionDigits,
    maximumFractionDigits,
  }).format(num);
}

/**
 * Format number as currency with currency code and optional locale.
 *
 * @param value - The number to format
 * @param currency - Currency code (e.g. 'USD', 'EUR')
 * @param locale - Optional locale (default 'en-US')
 * @returns Formatted currency string
 * @example
 * formatCurrency(19.999)        // "$20.00"
 * formatCurrency(100, 'EUR', 'de-DE') // "100,00 €"
 */
export function formatCurrency(
  value: number,
  currency: string = 'USD',
  locale?: string
): string {
  return toCurrency(value, {
    currency,
    locale: locale ?? 'en-US',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
}

// ---------------------------------------------------------------------------
// Percentage formatting
// ---------------------------------------------------------------------------

/**
 * Format decimal (0–1) as percentage string.
 *
 * @param value - Decimal value (e.g. 0.8567 for 85.67%). Handles zero and negative
 * @param options - decimals, showSymbol, multiplier (default 100)
 * @returns Formatted percentage string. Returns String(value) for NaN/Infinity
 * @example
 * toPercentage(0.8567)       // "85.7%"
 * toPercentage(0.8567, { decimals: 2 }) // "85.67%"
 * toPercentage(0)            // "0.0%"
 */
export function toPercentage(value: number, options?: PercentageOptions): string {
  if (!isValidNumber(value)) return String(value);
  const { decimals = 1, showSymbol = true, multiplier = 100 } = options ?? {};
  const pct = value * multiplier;
  const formatted = toPrecision(pct, decimals);
  return showSymbol ? `${formatted}%` : formatted;
}

/**
 * Format number as percentage with specific decimal places.
 *
 * @param value - Decimal value (0–1)
 * @param decimals - Decimal places (default 1)
 * @returns Formatted percentage string with % symbol
 * @example
 * formatPercentage(0.8567)    // "85.7%"
 * formatPercentage(0.8567, 2) // "85.67%"
 */
export function formatPercentage(value: number, decimals: number = 1): string {
  return toPercentage(value, { decimals, showSymbol: true });
}

// ---------------------------------------------------------------------------
// Compact number formatting
// ---------------------------------------------------------------------------

/**
 * Format large numbers compactly (K, M, B). Handles zero and negative numbers.
 *
 * @param value - The number to format
 * @param options - Optional decimals and notation
 * @returns Compact string (e.g. "1.23M", "1.23K", "-1.23M"). Returns toClean(value) for |value| < 1000
 * @example
 * toCompact(1234567)    // "1.23M"
 * toCompact(1234)       // "1.23K"
 * toCompact(-1234567)   // "-1.23M"
 * toCompact(0)          // "0"
 */
export function toCompact(value: number, options?: CompactOptions): string {
  if (!isValidNumber(value)) return String(value);
  const { decimals = 2 } = options ?? {};
  const abs = Math.abs(value);
  const sign = value < 0 ? '-' : '';
  if (abs >= 1e9) return `${sign}${toPrecision(abs / 1e9, decimals)}B`;
  if (abs >= 1e6) return `${sign}${toPrecision(abs / 1e6, decimals)}M`;
  if (abs >= 1e3) return `${sign}${toPrecision(abs / 1e3, decimals)}K`;
  return toClean(value);
}

/**
 * Format number in compact form with specific precision.
 *
 * @param value - The number to format
 * @param decimals - Decimal places (default 2)
 * @returns Compact string
 * @example
 * formatCompact(1234567)   // "1.23M"
 */
export function formatCompact(value: number, decimals: number = 2): string {
  return toCompact(value, { decimals });
}

// ---------------------------------------------------------------------------
// Clean display
// ---------------------------------------------------------------------------

/**
 * Remove unnecessary trailing zeros for clean display. Handles zero and negative.
 *
 * @param value - The number to format
 * @returns Clean string (e.g. "19", "19.5", "0.3"). Returns String(value) for NaN/Infinity
 * @example
 * toClean(19)       // "19"
 * toClean(19.5)     // "19.5"
 * toClean(19.00)    // "19"
 * toClean(0.1 + 0.2) // "0.3"
 * toClean(0)        // "0"
 */
export function toClean(value: number): string {
  if (!isValidNumber(value)) return String(value);
  const rounded = round(value, CLEAN_PRECISION);
  const str = rounded.toString();
  if (str.includes('.')) {
    return str.replace(/\.?0+$/, '');
  }
  return str;
}

/**
 * Format with max decimal places, then strip trailing zeros.
 *
 * @param value - The number to format
 * @param maxDecimals - Maximum decimal places (default 14)
 * @returns Clean string
 * @example
 * formatClean(19.5, 2)  // "19.5"
 * formatClean(19.00, 2) // "19"
 */
export function formatClean(value: number, maxDecimals: number = CLEAN_PRECISION): string {
  if (!isValidNumber(value)) return String(value);
  const d = clampDecimals(maxDecimals);
  const fixed = round(value, d).toFixed(d);
  return fixed.replace(/\.?0+$/, '');
}

// ---------------------------------------------------------------------------
// Mathematical operations (safe / with precision)
// ---------------------------------------------------------------------------

/**
 * Safe addition with precision handling (avoids floating-point errors).
 *
 * @param a - First operand
 * @param b - Second operand
 * @returns a + b with precision handling. Returns a + b for NaN/Infinity inputs
 * @example
 * safeAdd(0.1, 0.2) // 0.3 (not 0.30000000000000004)
 */
export function safeAdd(a: number, b: number): number {
  if (!isValidNumber(a) || !isValidNumber(b)) return a + b;
  const prec = Math.max(getDecimalPlaces(a), getDecimalPlaces(b));
  const mult = Math.pow(10, prec);
  return Math.round(a * mult + b * mult) / mult;
}

/**
 * Safe subtraction with precision handling.
 *
 * @param a - First operand
 * @param b - Second operand
 * @returns a - b with precision handling
 * @example
 * safeSubtract(1.0, 0.9) // 0.1
 */
export function safeSubtract(a: number, b: number): number {
  if (!isValidNumber(a) || !isValidNumber(b)) return a - b;
  const prec = Math.max(getDecimalPlaces(a), getDecimalPlaces(b));
  const mult = Math.pow(10, prec);
  return Math.round((a * mult - b * mult) / mult);
}

/**
 * Safe multiplication with precision handling.
 *
 * @param a - First operand
 * @param b - Second operand
 * @returns a * b with precision handling
 */
export function safeMultiply(a: number, b: number): number {
  if (!isValidNumber(a) || !isValidNumber(b)) return a * b;
  const prec = Math.min(getDecimalPlaces(a) + getDecimalPlaces(b), CLEAN_PRECISION);
  return round(a * b, prec);
}

/**
 * Safe division with controlled precision. Division by zero returns NaN.
 *
 * @param a - Numerator
 * @param b - Denominator
 * @returns a / b with precision handling; NaN if b === 0
 * @example
 * safeDivide(1, 3)   // ~0.33333333333333
 * safeDivide(1, 0)   // NaN
 */
export function safeDivide(a: number, b: number): number {
  if (!isValidNumber(a) || !isValidNumber(b)) return a / b;
  if (b === 0) return Number.NaN;
  const result = a / b;
  return round(result, CLEAN_PRECISION);
}

/**
 * Clamp value to range [min, max].
 *
 * @param value - The value to clamp
 * @param min - Minimum (inclusive)
 * @param max - Maximum (inclusive). If min > max, returns min
 * @returns Clamped number. Returns value unchanged for NaN/Infinity
 * @example
 * clamp(150, 0, 100)  // 100
 * clamp(-10, 0, 100)  // 0
 */
export function clamp(value: number, min: number, max: number): number {
  if (!isValidNumber(value)) return value;
  if (min > max) return min;
  return Math.max(min, Math.min(max, value));
}

/**
 * Check if two numbers are approximately equal within tolerance.
 *
 * @param a - First number
 * @param b - Second number
 * @param tolerance - Allowed difference (default 1e-10). NaN/Infinity compared by reference
 * @returns true if |a - b| <= tolerance
 * @example
 * isApproximatelyEqual(0.1 + 0.2, 0.3) // true
 */
export function isApproximatelyEqual(
  a: number,
  b: number,
  tolerance: number = DEFAULT_TOLERANCE
): boolean {
  if (!isValidNumber(a) || !isValidNumber(b)) return a === b;
  return Math.abs(a - b) <= tolerance;
}

/**
 * Check if number is approximately zero within tolerance.
 *
 * @param value - The number to check
 * @param tolerance - Allowed distance from zero (default 1e-10)
 * @returns true if |value| <= tolerance
 * @example
 * isZero(1e-12)  // true
 */
export function isZero(value: number, tolerance: number = DEFAULT_TOLERANCE): boolean {
  return isApproximatelyEqual(value, 0, tolerance);
}

// ---------------------------------------------------------------------------
// Singleton helper object (doubleHelper)
// ---------------------------------------------------------------------------

class DoubleExtensionHelper {
  toPrecision = toPrecision;
  round = round;
  truncate = truncate;
  ceil = ceil;
  floor = floor;
  toCurrency = toCurrency;
  toCurrencyStrict = toCurrencyStrict;
  formatCurrency = formatCurrency;
  isValidCurrency = isValidCurrency;
  isValidLocale = isValidLocale;
  validateNumberInput = validateNumberInput;
  validateTextInput = validateTextInput;
  isFiniteNumber = isFiniteNumber;
  isPositiveNumber = isPositiveNumber;
  toPercentage = toPercentage;
  formatPercentage = formatPercentage;
  toCompact = toCompact;
  formatCompact = formatCompact;
  toClean = toClean;
  formatClean = formatClean;
  safeAdd = safeAdd;
  safeSubtract = safeSubtract;
  safeMultiply = safeMultiply;
  safeDivide = safeDivide;
  clamp = clamp;
  isApproximatelyEqual = isApproximatelyEqual;
  isZero = isZero;
}

export const doubleHelper = new DoubleExtensionHelper();
export { DoubleExtensionHelper };
