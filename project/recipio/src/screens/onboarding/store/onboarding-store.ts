import { create } from 'zustand';
import { storage } from '@/shared/utils/storage';

interface OnboardingStore {
  currentStep: number;
  isCompleted: boolean;
  setCurrentStep: (step: number) => void;
  setCompleted: (value: boolean) => Promise<void>;
  loadOnboardingStatus: () => Promise<void>;
  reset: () => Promise<void>;
}

export const useOnboardingStore = create<OnboardingStore>((set) => ({
  currentStep: 0,
  isCompleted: false,

  setCurrentStep: (step: number) => set({ currentStep: step }),

  setCompleted: async (value: boolean) => {
    set({ isCompleted: value });
    await storage.setOnboardingCompleted(value);
  },

  loadOnboardingStatus: async () => {
    const isCompleted = await storage.getOnboardingCompleted();
    set({ isCompleted });
  },

  reset: async () => {
    set({ currentStep: 0, isCompleted: false });
    await storage.clearOnboardingStatus();
  },
}));
