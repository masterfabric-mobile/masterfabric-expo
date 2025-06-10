import { create } from 'zustand';

interface SplashState {
  isLoading: boolean;
  progress: number;
  loadingMessage: string;
  currentStep: string;
  completedSteps: string[];
  
  // Actions
  setLoading: (loading: boolean) => void;
  setProgress: (progress: number) => void;
  setLoadingMessage: (message: string) => void;
  setCurrentStep: (step: string) => void;
  addCompletedStep: (step: string) => void;
  reset: () => void;
}

const initialState = {
  isLoading: true,
  progress: 0,
  loadingMessage: 'Initializing...',
  currentStep: '',
  completedSteps: [],
};

export const useSplashStore = create<SplashState>((set) => ({
  ...initialState,
  
  setLoading: (loading: boolean) => 
    set({ isLoading: loading }),
    
  setProgress: (progress: number) => 
    set({ progress }),
    
  setLoadingMessage: (message: string) => 
    set({ loadingMessage: message }),

  setCurrentStep: (step: string) =>
    set({ currentStep: step }),

  addCompletedStep: (step: string) =>
    set((state) => ({
      completedSteps: [...state.completedSteps, step]
    })),
    
  reset: () => 
    set(initialState),
}));