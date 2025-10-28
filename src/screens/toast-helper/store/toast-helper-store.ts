import { create } from 'zustand';
import { ToastInput, ToastResult } from '../models/toast-helper.models';

/**
 * Toast Helper Store Interface
 * 
 * Defines the state and actions for the toast helper functionality.
 * Manages the input configuration, results, and loading state.
 */
interface ToastHelperStore {
  // State properties
  input: ToastInput;
  results: ToastResult[];
  isLoading: boolean;
  
  // Action methods
  setInput: (input: ToastInput) => void;
  setResults: (results: ToastResult[]) => void;
  setIsLoading: (loading: boolean) => void;
  clearResults: () => void;
}

/**
 * Toast Helper Store
 * 
 * A Zustand store that manages the state for the Toast Helper screen.
 * Provides centralized state management for:
 * - Toast input configuration
 * - Example execution results
 * - Loading states
 * - State update actions
 * 
 * Features:
 * - Immutable state updates
 * - Type-safe actions
 * - Default configuration values
 * - Result management
 */
export const useToastHelperStore = create<ToastHelperStore>((set) => ({
  // Default input configuration
  input: {
    message: 'Profile updated successfully!',
    duration: 3000,
    position: 'top',
    type: 'success',
    animation: 'medium',
  },
  // Initial empty results array
  results: [],
  // Initial loading state
  isLoading: false,
  
  // Action implementations
  setInput: (input) => set({ input }),
  setResults: (results) => set({ results }),
  setIsLoading: (loading) => set({ isLoading: loading }),
  clearResults: () => set({ results: [] }),
}));