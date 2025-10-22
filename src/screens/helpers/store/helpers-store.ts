import { create } from 'zustand';
import { HelperItem } from '../models/helpers-models';

interface HelpersStore {
  helpers: HelperItem[];
  isLoading: boolean;
  setHelpers: (helpers: HelperItem[]) => void;
  setIsLoading: (loading: boolean) => void;
}

export const useHelpersStore = create<HelpersStore>((set) => ({
  helpers: [],
  isLoading: false,
  setHelpers: (helpers) => set({ helpers }),
  setIsLoading: (loading) => set({ isLoading: loading }),
}));

