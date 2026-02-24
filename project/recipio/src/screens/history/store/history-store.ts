import { create } from 'zustand';

interface HistoryStore {
  isLoading: boolean;
  setLoading: (value: boolean) => void;
}

export const useHistoryStore = create<HistoryStore>((set) => ({
  isLoading: false,
  setLoading: (isLoading) => set({ isLoading }),
}));
