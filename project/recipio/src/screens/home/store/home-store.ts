import { create } from 'zustand';

interface HomeStore {
  isRefreshing: boolean;
  setRefreshing: (value: boolean) => void;
}

export const useHomeStore = create<HomeStore>((set) => ({
  isRefreshing: false,
  setRefreshing: (isRefreshing) => set({ isRefreshing }),
}));
