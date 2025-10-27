import { create } from 'zustand';
import { ToastInput, ToastResult } from '../models/toast-helper.models';

interface ToastHelperStore {
  input: ToastInput;
  results: ToastResult[];
  isLoading: boolean;
  setInput: (input: ToastInput) => void;
  setResults: (results: ToastResult[]) => void;
  setIsLoading: (loading: boolean) => void;
  clearResults: () => void;
}

export const useToastHelperStore = create<ToastHelperStore>((set) => ({
  input: {
    message: 'Profile updated successfully!',
    duration: 3000,
    position: 'top',
    type: 'success',
    animation: 'medium',
  },
  results: [],
  isLoading: false,
  setInput: (input) => set({ input }),
  setResults: (results) => set({ results }),
  setIsLoading: (loading) => set({ isLoading: loading }),
  clearResults: () => set({ results: [] }),
}));