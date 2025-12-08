import { create } from 'zustand';
import { UISizePreview, UISizeTestInput, UISizeTestResult } from '../models/ui-size-helper-models';

interface UISizeHelperStore {
  testInput: UISizeTestInput;
  testResults: UISizeTestResult[];
  isLoading: boolean;
  preview: UISizePreview;
  deviceInfo: {
    deviceType: 'phone' | 'tablet' | 'desktop';
    screenWidth: number;
    screenHeight: number;
    columns: number;
    baseUnit: number;
  };
  setTestInput: (input: UISizeTestInput | ((prev: UISizeTestInput) => UISizeTestInput)) => void;
  setTestResults: (results: UISizeTestResult[]) => void;
  setIsLoading: (loading: boolean) => void;
  setPreview: (preview: UISizePreview) => void;
  setDeviceInfo: (info: {
    deviceType: 'phone' | 'tablet' | 'desktop';
    screenWidth: number;
    screenHeight: number;
    columns: number;
    baseUnit: number;
  }) => void;
  clearResults: () => void;
}

export const useUISizeHelperStore = create<UISizeHelperStore>((set) => ({
  testInput: {
    spacingSize: 'm',
    paddingSize: 'm',
    marginSize: 'm',
    gapSize: 'm',
    borderRadius: 'large',
    borderWidth: 's',
    buttonHeight: 'medium',
    inputHeight: 'medium',
    cardPadding: 'medium',
    scrollPadding: 'm',
    scrollMargin: 'm',
  },
  testResults: [],
  isLoading: false,
  preview: {
    spacing: 12,
    padding: 12,
    margin: 12,
    gap: 12,
    borderRadius: 13,
    borderWidth: 1,
    buttonHeight: 44,
    inputHeight: 44,
    cardPadding: 16,
    scrollPadding: 12,
    scrollMargin: 12,
    deviceType: 'phone',
    columns: 4,
    baseUnit: 8,
  },
  deviceInfo: {
    deviceType: 'phone',
    screenWidth: 375,
    screenHeight: 812,
    columns: 4,
    baseUnit: 8,
  },
  setTestInput: (input) => set((state) => ({ 
    testInput: typeof input === 'function' ? input(state.testInput) : input 
  })),
  setTestResults: (results) => set({ testResults: results }),
  setIsLoading: (loading) => set({ isLoading: loading }),
  setPreview: (preview) => set({ preview }),
  setDeviceInfo: (info) => set({ deviceInfo: info }),
  clearResults: () => set({ testResults: [] }),
}));

