export interface StringTestResult {
  id: string;
  functionName: string;
  input: string;
  output: string;
  description: string;
}

export interface StringTestInput {
  text: string;
  length?: number;
  suffix?: string;
  currency?: string;
  decimals?: number;
  count?: number;
}

export interface StringHelperState {
  testInput: StringTestInput;
  testResults: StringTestResult[];
  isLoading: boolean;
}

