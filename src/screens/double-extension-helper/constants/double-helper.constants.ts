import type { DoubleTestInput } from '../models/double-helper-models';

export const BORDER_OPACITY_SUFFIX = '30';

export const INPUT_MAX_LENGTHS = {
  currency: 8,
  locale: 12,
  number: 15,
  decimals: 4,
} as const;

export const NUMERIC_INPUT_RANGE = {
  min: -1e12,
  max: 1e12,
} as const;

export const DEFAULT_TEST_INPUT: DoubleTestInput = {
  value: 19.999,
  decimals: 2,
  currency: 'USD',
  locale: 'en-US',
  clampMin: 0,
  clampMax: 100,
  safeA: 0.1,
  safeB: 0.2,
  percentageValue: 0.8567,
};
