import { create } from 'zustand';
import { TypographyPreview, TypographyTestInput, TypographyTestResult } from '../models/typography-helper-models';

interface TypographyHelperStore {
  testInput: TypographyTestInput;
  testResults: TypographyTestResult[];
  isLoading: boolean;
  preview: TypographyPreview;
  deviceInfo: {
    fontScale: number;
    screenWidth: number;
    screenHeight: number;
  };
  setTestInput: (input: TypographyTestInput) => void;
  setTestResults: (results: TypographyTestResult[]) => void;
  setIsLoading: (loading: boolean) => void;
  setPreview: (preview: TypographyPreview) => void;
  setDeviceInfo: (info: { fontScale: number; screenWidth: number; screenHeight: number }) => void;
  clearResults: () => void;
}

export const useTypographyHelperStore = create<TypographyHelperStore>((set) => ({
  testInput: {
    fontSize: 16,
    fontScale: 1.0,
    lineHeightMultiplier: 1.5,
    letterSpacing: 0,
    fontWeight: 400,
    fontStyle: 'normal',
    fontFamily: 'System',
    textDecoration: [],
    textTransform: 'none',
    containerWidth: 300,
    containerHeight: 100,
    text: 'The quick brown fox jumps over the lazy dog',
    textColor: '#000000',
    stylePreset: 'custom',
  },
  testResults: [],
  isLoading: false,
  preview: {
    fontSize: 16,
    lineHeight: 24,
    letterSpacing: 0,
    fontWeight: 400,
    fontStyle: 'normal',
    fontFamily: 'System',
    textDecoration: 'none',
    textTransform: 'none',
    previewText: 'The quick brown fox jumps over the lazy dog',
    textColor: '#000000',
    completeStyle: {},
  },
  deviceInfo: {
    fontScale: 1.0,
    screenWidth: 375,
    screenHeight: 812,
  },
  setTestInput: (input) => set({ testInput: input }),
  setTestResults: (results) => set({ testResults: results }),
  setIsLoading: (loading) => set({ isLoading: loading }),
  setPreview: (preview) => set({ preview }),
  setDeviceInfo: (info) => set({ deviceInfo: info }),
  clearResults: () => set({ testResults: [] }),
}));

