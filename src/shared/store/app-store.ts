import AsyncStorage from '@react-native-async-storage/async-storage';
import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';
import type { LoadingState, User } from '../types';

interface AppState {
  // App state
  isFirstLaunch: boolean;
  isAppReady: boolean;
  
  // User state
  user: User | null;
  isAuthenticated: boolean;
  authToken: string | null;
  
  // UI state
  loadingState: LoadingState;
  error: string | null;
  
  // Actions
  setFirstLaunch: (isFirst: boolean) => void;
  setAppReady: (ready: boolean) => void;
  setUser: (user: User | null) => void;
  setAuthToken: (token: string | null) => void;
  setLoadingState: (state: LoadingState) => void;
  setError: (error: string | null) => void;
  logout: () => void;
  reset: () => void;
}

const initialState = {
  isFirstLaunch: true,
  isAppReady: false,
  user: null,
  isAuthenticated: false,
  authToken: null,
  loadingState: 'idle' as LoadingState,
  error: null,
};

export const useAppStore = create<AppState>()(
  persist(
    (set, get) => ({
      ...initialState,
      
      setFirstLaunch: (isFirst: boolean) => 
        set({ isFirstLaunch: isFirst }),
      
      setAppReady: (ready: boolean) => 
        set({ isAppReady: ready }),
      
      setUser: (user: User | null) => 
        set({ 
          user, 
          isAuthenticated: !!user 
        }),
      
      setAuthToken: (token: string | null) => 
        set({ 
          authToken: token,
          isAuthenticated: !!token 
        }),
      
      setLoadingState: (loadingState: LoadingState) => 
        set({ loadingState }),
      
      setError: (error: string | null) => 
        set({ error }),
      
      logout: () => 
        set({
          user: null,
          authToken: null,
          isAuthenticated: false,
          error: null,
        }),
      
      reset: () => 
        set({ ...initialState }),
    }),
    {
      name: 'app-store',
      storage: createJSONStorage(() => AsyncStorage),
      partialize: (state) => ({
        isFirstLaunch: state.isFirstLaunch,
        authToken: state.authToken,
      }),
    }
  )
);
