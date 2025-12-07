import { create } from 'zustand';
import { DEFAULT_TEST_VALUES, MAX_HISTORY_ITEMS } from '../constants';
import { QueryParameter, UrlLaunchResult, UrlTestInput } from '../models/url-launcher-helper-models';

interface UrlLauncherHelperStore {
  testInput: UrlTestInput;
  testResults: UrlLaunchResult[];
  isLoading: boolean;
  history: UrlLaunchResult[];
  setTestInput: (input: UrlTestInput) => void;
  updateTestInput: (updates: Partial<UrlTestInput>) => void;
  setTestResults: (results: UrlLaunchResult[]) => void;
  setIsLoading: (loading: boolean) => void;
  addToHistory: (result: UrlLaunchResult) => void;
  clearResults: () => void;
  clearHistory: () => void;
  addQueryParameter: () => void;
  updateQueryParameter: (index: number, param: QueryParameter) => void;
  removeQueryParameter: (index: number) => void;
}

// Store initialization - default values will be set from i18n in view-model
// Using English defaults as fallback, but view-model will override with i18n values
export const useUrlLauncherHelperStore = create<UrlLauncherHelperStore>((set, get) => ({
  testInput: {
    url: DEFAULT_TEST_VALUES.url,
    email: DEFAULT_TEST_VALUES.email,
    emailSubject: DEFAULT_TEST_VALUES.emailSubject || '',
    emailBody: DEFAULT_TEST_VALUES.emailBody || '',
    emailCc: '',
    emailBcc: '',
    phone: DEFAULT_TEST_VALUES.phone,
    smsRecipients: DEFAULT_TEST_VALUES.smsRecipients,
    smsBody: DEFAULT_TEST_VALUES.smsBody || '',
    mapAddress: DEFAULT_TEST_VALUES.mapAddress,
    mapLatitude: DEFAULT_TEST_VALUES.mapLatitude,
    mapLongitude: DEFAULT_TEST_VALUES.mapLongitude,
    mapLabel: DEFAULT_TEST_VALUES.mapLabel || '',
    appStoreId: DEFAULT_TEST_VALUES.appStoreId || '123456789',
    appStoreReview: false,
    settingsSection: 'general',
    deepLinkUrl: DEFAULT_TEST_VALUES.deepLinkUrl || 'myapp://screen/123',
    fallbackUrl: DEFAULT_TEST_VALUES.fallbackUrl || 'https://example.com',
    queryParameters: [],
  },
  testResults: [],
  isLoading: false,
  history: [],
  setTestInput: (input) => set({ testInput: input }),
  updateTestInput: (updates) => set((state) => ({ 
    testInput: { ...state.testInput, ...updates }
  })),
  setTestResults: (results) => set({ testResults: results }),
  setIsLoading: (loading) => set({ isLoading: loading }),
  addToHistory: (result) => set((state) => ({ 
    history: [result, ...state.history].slice(0, MAX_HISTORY_ITEMS)
  })),
  clearResults: () => set({ testResults: [] }),
  clearHistory: () => set({ history: [] }),
  addQueryParameter: () => set((state) => ({
    testInput: {
      ...state.testInput,
      queryParameters: [...(state.testInput.queryParameters || []), { key: '', value: '' }]
    }
  })),
  updateQueryParameter: (index, param) => set((state) => {
    const params = [...(state.testInput.queryParameters || [])];
    params[index] = param;
    return {
      testInput: {
        ...state.testInput,
        queryParameters: params
      }
    };
  }),
  removeQueryParameter: (index) => set((state) => {
    const params = [...(state.testInput.queryParameters || [])];
    params.splice(index, 1);
    return {
      testInput: {
        ...state.testInput,
        queryParameters: params
      }
    };
  }),
}));

