import { create } from 'zustand';
import { ValidatorType } from 'masterfabric-expo-core';
import { getCurrentLocale } from '@/src/shared/i18n';
import { ValidatorTestInput, ValidatorTestResult } from '../models/validator-helper-models';

// Get default input value based on current locale
const getDefaultInputValue = (): string => {
  const locale = getCurrentLocale();
  // We'll use a simple approach: if locale is 'tr', use Turkish default, otherwise English
  // The actual translation will be handled in the component
  return locale === 'tr' ? 'kullanıcı_adı123' : 'john_doe123';
};

interface ValidatorHelperStore {
  testInput: ValidatorTestInput;
  testResults: ValidatorTestResult[];
  currentResult: ValidatorTestResult | null;
  isLoading: boolean;
  setTestInput: (input: ValidatorTestInput | ((prev: ValidatorTestInput) => ValidatorTestInput)) => void;
  setTestResults: (results: ValidatorTestResult[]) => void;
  setCurrentResult: (result: ValidatorTestResult | null) => void;
  setIsLoading: (loading: boolean) => void;
  clearResults: () => void;
}

export const useValidatorHelperStore = create<ValidatorHelperStore>((set) => ({
  testInput: {
    value: getDefaultInputValue(),
    validatorType: ValidatorType.USERNAME,
    minLength: 3,
    maxLength: 20,
    trim: true,
    convertTurkishChars: false,
  },
  testResults: [],
  currentResult: null,
  isLoading: false,
  setTestInput: (input) => set((state) => ({ 
    testInput: typeof input === 'function' ? input(state.testInput) : input 
  })),
  setTestResults: (results) => set({ testResults: results }),
  setCurrentResult: (result) => set({ currentResult: result }),
  setIsLoading: (loading) => set({ isLoading: loading }),
  clearResults: () => set({ testResults: [], currentResult: null }),
}));

