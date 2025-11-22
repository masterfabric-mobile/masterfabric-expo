import { create } from 'zustand';
import { RichTextTestInput, RichTextTestResult } from '../models/rich-text-helper-models';

interface RichTextHelperStore {
  testInput: RichTextTestInput;
  testResults: RichTextTestResult[];
  isLoading: boolean;
  setTestInput: (input: RichTextTestInput) => void;
  setTestResults: (results: RichTextTestResult[]) => void;
  setIsLoading: (loading: boolean) => void;
  clearResults: () => void;
}

export const useRichTextHelperStore = create<RichTextHelperStore>((set) => ({
  testInput: {
    htmlInput: '<p>Merhaba <b>Dünya</b></p>',
    markdownInput: '# Başlık',
    textInput: 'https://example.com adresini ziyaret edin @john #masterfabric veya info@test.com e-posta gönderin veya +1-555-123-4567 numarayı arayın',
  },
  testResults: [],
  isLoading: false,
  setTestInput: (input) => set({ testInput: input }),
  setTestResults: (results) => set({ testResults: results }),
  setIsLoading: (loading) => set({ isLoading: loading }),
  clearResults: () => set({ testResults: [] }),
}));

