import { create } from 'zustand';
import { StringTestInput, StringTestResult } from '../models/string-helper-models';

interface StringHelperStore {
  testInput: StringTestInput;
  testResults: StringTestResult[];
  isLoading: boolean;
  setTestInput: (input: StringTestInput) => void;
  setTestResults: (results: StringTestResult[]) => void;
  setIsLoading: (loading: boolean) => void;
  clearResults: () => void;
}

export const useStringHelperStore = create<StringHelperStore>((set) => ({
  testInput: {
    text: 'Hello World!',
    length: 10,
    suffix: '...',
    currency: 'USD',
    decimals: 2,
    count: 1,
  },
  testResults: [],
  isLoading: false,
  setTestInput: (input) => set({ testInput: input }),
  setTestResults: (results) => set({ testResults: results }),
  setIsLoading: (loading) => set({ isLoading: loading }),
  clearResults: () => set({ testResults: [] }),
}));

