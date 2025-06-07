import { create } from 'zustand';

interface SplashState {
  isLoading: boolean;
  progress: number;
  loadingMessage: string;
  
  // Actions
  setLoading: (loading: boolean) => void;
  setProgress: (progress: number) => void;
  setLoadingMessage: (message: string) => void;
  reset: () => void;
}

const initialState = {
  isLoading: true,
  progress: 0,
  loadingMessage: 'Initializing...',
};

export const useSplashStore = create<SplashState>((set) => ({
  ...initialState,
  
  setLoading: (loading: boolean) => 
    set({ isLoading: loading }),
    
  setProgress: (progress: number) => 
    set({ progress }),
    
  setLoadingMessage: (message: string) => 
    set({ loadingMessage: message }),
    
  reset: () => 
    set(initialState),
}));