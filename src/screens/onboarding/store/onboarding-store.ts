import AsyncStorage from '@react-native-async-storage/async-storage';
import { create } from 'zustand';

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

const ONBOARDING_STORAGE_KEY = '@masterfabric_onboarding_completed';

const initialState = {
  currentStepIndex: 0,
  isCompleted: false,
  hasSeenOnboarding: false,
};

export const useOnboardingStore = create<OnboardingState>((set, get) => ({
  ...initialState,
  
  setCurrentStepIndex: (index: number) => 
    set({ currentStepIndex: index }),
    
  nextStep: () => 
    set((state) => ({ currentStepIndex: state.currentStepIndex + 1 })),
    
  previousStep: () => 
    set((state) => ({ 
      currentStepIndex: Math.max(0, state.currentStepIndex - 1) 
    })),
    
  completeOnboarding: async () => {
    try {
      await AsyncStorage.setItem(ONBOARDING_STORAGE_KEY, 'true');
      set({ isCompleted: true, hasSeenOnboarding: true });
    } catch (error) {
      console.error('Error saving onboarding completion:', error);
    }
  },
    
  resetOnboarding: async () => {
    try {
      await AsyncStorage.removeItem(ONBOARDING_STORAGE_KEY);
      set(initialState);
    } catch (error) {
      console.error('Error resetting onboarding:', error);
    }
  },
    
  loadOnboardingStatus: async () => {
    try {
      const hasCompleted = await AsyncStorage.getItem(ONBOARDING_STORAGE_KEY);
      set({ 
        hasSeenOnboarding: hasCompleted === 'true',
        isCompleted: hasCompleted === 'true'
      });
    } catch (error) {
      console.error('Error loading onboarding status:', error);
    }
  },
    
  setHasSeenOnboarding: (hasSeen: boolean) => 
    set({ hasSeenOnboarding: hasSeen }),
}));
