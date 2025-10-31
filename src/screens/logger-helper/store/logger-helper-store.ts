import { create } from 'zustand';
import { LoggerTestInput, LoggerTestResult } from '../models/logger-helper-models';

interface LoggerHelperStore {
  input: LoggerTestInput;
  results: LoggerTestResult[];
  isLoading: boolean;
  setInput: (input: LoggerTestInput) => void;
  setResults: (results: LoggerTestResult[]) => void;
  setIsLoading: (loading: boolean) => void;
  clearResults: () => void;
}

export const useLoggerHelperStore = create<LoggerHelperStore>((set) => ({
  input: {
    message: 'Kullanıcı giriş yaptı',
    level: 'info',
    component: 'AuthService',
    includeStackTrace: false,
    showTimestamp: true,
  },
  results: [],
  isLoading: false,
  setInput: (input) => set({ input }),
  setResults: (results) => set({ results }),
  setIsLoading: (loading) => set({ isLoading: loading }),
  clearResults: () => set({ results: [] }),
}));

