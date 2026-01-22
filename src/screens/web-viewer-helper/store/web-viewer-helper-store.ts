/**
 * Web Viewer Helper Store
 * 
 * Zustand store for managing Web Viewer Helper state
 */

import { create } from 'zustand';
import { WebViewSource, WebViewTestInput, WebViewTestResult } from '../models/models';

interface WebViewerHelperStore {
  testInput: WebViewTestInput;
  testResults: WebViewTestResult[];
  isLoading: boolean;
  currentSource?: WebViewSource;
  setTestInput: (input: WebViewTestInput) => void;
  updateTestInput: (updates: Partial<WebViewTestInput>) => void;
  setTestResults: (results: WebViewTestResult[]) => void;
  setIsLoading: (loading: boolean) => void;
  setCurrentSource: (source?: WebViewSource) => void;
  clearResults: () => void;
}

// Default values will be set with i18n in component
export const useWebViewerHelperStore = create<WebViewerHelperStore>((set) => ({
  testInput: {
    contentType: 'auto',
    htmlContent: '',
    urlContent: '',
    baseUrl: '',
    headers: '',
    method: 'GET',
    body: '',
  },
  testResults: [],
  isLoading: false,
  currentSource: undefined,
  setTestInput: (input) => set({ testInput: input }),
  updateTestInput: (updates) => set((state) => ({
    testInput: { ...state.testInput, ...updates },
  })),
  setTestResults: (results) => set({ testResults: results }),
  setIsLoading: (loading) => set({ isLoading: loading }),
  setCurrentSource: (source) => set({ currentSource: source }),
  clearResults: () => set({ testResults: [], currentSource: undefined }),
}));
