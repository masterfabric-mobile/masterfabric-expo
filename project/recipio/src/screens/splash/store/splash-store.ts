import { SplashState } from '../models/splash-models';

// Simple state management for splash screen
// Can be extended with Zustand or Context API if needed in the future

let splashState: SplashState = {
  isLoading: true,
  isInitialized: false,
};

export const splashStore = {
  getState: (): SplashState => ({ ...splashState }),
  
  setLoading: (isLoading: boolean): void => {
    splashState = { ...splashState, isLoading };
  },
  
  setInitialized: (isInitialized: boolean): void => {
    splashState = { ...splashState, isInitialized };
  },
  
  reset: (): void => {
    splashState = {
      isLoading: true,
      isInitialized: false,
    };
  },
};

