import { create } from 'zustand';
import { createOnboardingSteps } from '../utils';
import { 
  markOnboardingCompleted, 
  resetOnboarding as resetOnboardingHelper,
  hasCompletedOnboarding 
} from 'masterfabric-expo-core';

interface OnboardingState {
  currentStepIndex: number;
  isCompleted: boolean;
  hasSeenOnboarding: boolean;
  
  // Actions
  setCurrentStepIndex: (index: number) => void;
  nextStep: () => void;
  previousStep: () => void;
  completeOnboarding: () => void;
  resetOnboarding: () => void;
  loadOnboardingStatus: () => Promise<void>;
  setHasSeenOnboarding: (hasSeen: boolean) => void;
}

const initialState = {
  currentStepIndex: 0,
  isCompleted: false,
  hasSeenOnboarding: false,
};

export interface StepControlsProps {
  currentIndex: number;
  totalSteps: number;
  onNext: () => void;
  onBack: () => void;
  isFirstStep: boolean;
  isLastStep: boolean;
}

export const useOnboardingStore = create<OnboardingState>((set, get) => ({
  ...initialState,
  
  setCurrentStepIndex: (index: number) => {
    const totalSteps = createOnboardingSteps().length;
    const validIndex = Math.max(0, Math.min(index, totalSteps - 1));
    set({ currentStepIndex: validIndex });
  },
    
  nextStep: () => {
    const totalSteps = createOnboardingSteps().length;
    set((state) => ({ 
      currentStepIndex: Math.min(state.currentStepIndex + 1, totalSteps - 1)
    }));
  },
    
  previousStep: () => 
    set((state) => ({ 
      currentStepIndex: Math.max(0, state.currentStepIndex - 1) 
    })),
    
  completeOnboarding: async () => {
    try {
      await markOnboardingCompleted();
      set({ isCompleted: true, hasSeenOnboarding: true });
    } catch (error) {
      console.error('Error saving onboarding completion:', error);
    }
  },
    
  resetOnboarding: async () => {
    try {
      await resetOnboardingHelper();
      set(initialState);
    } catch (error) {
      console.error('Error resetting onboarding:', error);
    }
  },
    
  loadOnboardingStatus: async () => {
    try {
      const hasCompleted = await hasCompletedOnboarding();
      set({ 
        hasSeenOnboarding: hasCompleted,
        isCompleted: hasCompleted
      });
    } catch (error) {
      console.error('Error loading onboarding status:', error);
    }
  },
    
  setHasSeenOnboarding: (hasSeen: boolean) => 
    set({ hasSeenOnboarding: hasSeen }),
}));
