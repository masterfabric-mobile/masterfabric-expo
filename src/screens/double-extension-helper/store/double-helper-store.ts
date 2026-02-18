import { create } from 'zustand';
import { DEFAULT_TEST_INPUT } from '../constants/double-helper.constants';
import type { DoubleTestInput, DoubleTestResult } from '../models/double-helper-models';

interface DoubleHelperStore {
  testInput: DoubleTestInput;
  testResults: DoubleTestResult[];
  isLoading: boolean;
  setTestInput: (input: DoubleTestInput) => void;
  setTestResults: (results: DoubleTestResult[]) => void;
  setIsLoading: (loading: boolean) => void;
  clearResults: () => void;
}

export const useDoubleHelperStore = create<DoubleHelperStore>((set) => ({
  testInput: DEFAULT_TEST_INPUT,
  testResults: [],
  isLoading: false,
  setTestInput: (input) => set({ testInput: input }),
  setTestResults: (results) => set({ testResults: results }),
  setIsLoading: (loading) => set({ isLoading: loading }),
  clearResults: () => set({ testResults: [] }),
}));
