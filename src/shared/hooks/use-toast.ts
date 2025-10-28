import { useToast as useCoreToast } from 'masterfabric-expo-core';

// Re-export core toast hook for backward compatibility
export function useToast() {
  return useCoreToast();
}
