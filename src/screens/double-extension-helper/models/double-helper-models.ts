export interface DoubleTestResult {
  id: string;
  functionName: string;
  input: string;
  output: string;
  description: string;
  descriptionKey?: string;
  success?: boolean;
  errorMessage?: string;
}

export interface DoubleTestInput {
  value: number | null;
  decimals: number | null;
  currency: string;
  locale: string;
  clampMin: number | null;
  clampMax: number | null;
  safeA: number | null;
  safeB: number | null;
  percentageValue: number | null;
}

export interface NormalizedDoubleTestInput {
  value: number;
  decimals: number;
  currency: string;
  locale: string;
  clampMin: number;
  clampMax: number;
  safeA: number;
  safeB: number;
  percentageValue: number;
}

export interface DoubleHelperState {
  testInput: DoubleTestInput;
  testResults: DoubleTestResult[];
  isLoading: boolean;
}
