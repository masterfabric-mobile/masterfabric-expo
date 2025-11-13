import { create } from 'zustand';
import { TimeTestInput, TimeTestResult } from '../models/time-helper-models';

interface TimeHelperStore {
  testInput: TimeTestInput;
  testResults: TimeTestResult[];
  isLoading: boolean;
  setTestInput: (input: TimeTestInput) => void;
  updateTestInput: (input: Partial<TimeTestInput>) => void;
  setTestResults: (results: TimeTestResult[]) => void;
  setIsLoading: (loading: boolean) => void;
  clearResults: () => void;
  resetInput: () => void;
}

const defaultTestInput: TimeTestInput = {
  dateTime: new Date().toISOString(),
  timezone: 'UTC',
  locale: 'en-US',
  operation: 'format',
  format: 'long',
  amount: 1,
  unit: 'days',
};

export const useTimeHelperStore = create<TimeHelperStore>((set) => ({
  testInput: defaultTestInput,
  testResults: [],
  isLoading: false,
  setTestInput: (input) => set({ testInput: input }),
  updateTestInput: (input) => 
    set((state) => ({ 
      testInput: { ...state.testInput, ...input } 
    })),
  setTestResults: (results) => set({ testResults: results }),
  setIsLoading: (loading) => set({ isLoading: loading }),
  clearResults: () => set({ testResults: [] }),
  resetInput: () => set({ 
    testInput: {
      ...defaultTestInput,
      dateTime: new Date().toISOString(), // Always use current time
    },
    testResults: []
  }),
}));
