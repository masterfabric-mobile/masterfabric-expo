
import { create } from 'zustand';
import { hasCompletedOnboarding, markOnboardingCompleted, resetOnboarding } from '../helpers/onboarding_helper';

interface OnboardingHelperState {
  hasCompleted: boolean;
  isLoading: boolean;
  error: string | null;
  loadStatus: () => Promise<void>;
  completeOnboarding: () => Promise<void>;
  resetOnboarding: () => Promise<void>;
  setLoading: (loading: boolean) => void;
}

export const useOnboardingHelperStore = create<OnboardingHelperState>((set) => ({
  hasCompleted: false,
  isLoading: false,
  error: null,
  setLoading: (loading) => set({ isLoading: loading }),
  loadStatus: async () => {
    set({ isLoading: true, error: null });
    try {
      const status = await hasCompletedOnboarding();
      set({ hasCompleted: status, isLoading: false });
    } catch (e) {
      const error = e instanceof Error ? e.message : 'Failed to load onboarding status.';
      set({ error, isLoading: false });
    }
  },
  completeOnboarding: async () => {
    set({ isLoading: true, error: null });
    try {
      await markOnboardingCompleted();
      set({ hasCompleted: true, isLoading: false });
    } catch (e) {
      const error = e instanceof Error ? e.message : 'Failed to mark onboarding as completed.';
      set({ error, isLoading: false });
    }
  },
  resetOnboarding: async () => {
    set({ isLoading: true, error: null });
    try {
      await resetOnboarding();
      set({ hasCompleted: false, isLoading: false });
    } catch (e) {
      const error = e instanceof Error ? e.message : 'Failed to reset onboarding status.';
      set({ error, isLoading: false });
    }
  },
}));
