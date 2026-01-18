/**
 * Web Viewer Helper Store
 * 
 * Zustand store for managing Web Viewer Helper state
 */

import { create } from 'zustand';
import { WebViewTestInput, WebViewTestResult } from '../models/models';

interface WebViewerHelperStore {
  testInput: WebViewTestInput;
  testResults: WebViewTestResult[];
  isLoading: boolean;
  currentSource?: {
    uri?: string;
    html?: string;
    baseUrl?: string;
    headers?: Record<string, string>;
    method?: 'GET' | 'POST';
    body?: string;
  };
  setTestInput: (input: WebViewTestInput) => void;
  updateTestInput: (updates: Partial<WebViewTestInput>) => void;
  setTestResults: (results: WebViewTestResult[]) => void;
  setIsLoading: (loading: boolean) => void;
  setCurrentSource: (source?: {
    uri?: string;
    html?: string;
    baseUrl?: string;
    headers?: Record<string, string>;
    method?: 'GET' | 'POST';
    body?: string;
  }) => void;
  clearResults: () => void;
}

export const useWebViewerHelperStore = create<WebViewerHelperStore>((set) => ({
  testInput: {
    contentType: 'auto',
    htmlContent: '<html><body><h1>Hello World!</h1></body></html>',
    urlContent: 'https://example.com',
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
