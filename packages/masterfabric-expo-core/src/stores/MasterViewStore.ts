import AsyncStorage from '@react-native-async-storage/async-storage';
import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';
import {
    MasterViewStore as IMasterViewStore,
    MasterViewConfig,
    MasterViewState
} from '../types/MasterView';

export function createMasterViewStore<TState = any>(
  initialState?: TState,
  config?: Partial<MasterViewConfig>
) {
  const defaultState: MasterViewState & TState = {
    isInitialized: false,
    isDestroyed: false,
    isLoading: false,
    error: null,
    errorCount: 0,
    retryCount: 0,
    ...initialState,
  } as MasterViewState & TState;

  return create<IMasterViewStore<TState>>()(
    persist(
      (set, get) => ({
        state: defaultState,
        
        setState: (newState) => {
          set((store) => ({
            state: { ...store.state, ...newState }
          }));
        },
        
        getState: () => get().state,
        
        subscribe: (callback) => {
          // Simple subscription mechanism
          const unsubscribe = () => {
            // Implementation would depend on the specific use case
            console.log('Unsubscribed from store');
          };
          return unsubscribe;
        },
        
        reset: () => {
          set({ state: defaultState });
        },
      }),
      {
        name: 'masterview-store',
        storage: createJSONStorage(() => AsyncStorage),
        partialize: (state) => ({
          // Only persist certain parts of the state
          state: {
            isInitialized: state.state.isInitialized,
            // Add other fields you want to persist
          }
        }),
      }
    )
  );
}

// Pre-configured stores for common use cases
export const createActivityStore = () => createMasterViewStore({
  activities: [],
  lastActivity: null,
});

export const createThemeStore = () => createMasterViewStore({
  currentTheme: 'system' as const,
  isDark: false,
  colors: {},
});

export const createNavigationStore = () => createMasterViewStore({
  currentRoute: null,
  navigationHistory: [],
  previousRoute: null,
});

export const createUserStore = () => createMasterViewStore({
  user: null,
  isAuthenticated: false,
  preferences: {},
});

// Store factory for creating typed stores
export class MasterViewStoreFactory {
  static create<TState = any>(initialState?: TState, config?: Partial<MasterViewConfig>) {
    return createMasterViewStore<TState>(initialState, config);
  }
  
  static createActivityStore() {
    return createActivityStore();
  }
  
  static createThemeStore() {
    return createThemeStore();
  }
  
  static createNavigationStore() {
    return createNavigationStore();
  }
  
  static createUserStore() {
    return createUserStore();
  }
}
