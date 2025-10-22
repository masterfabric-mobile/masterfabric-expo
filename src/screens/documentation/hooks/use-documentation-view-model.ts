import { router } from 'expo-router';
import { useCallback } from 'react';
import { createDocumentationSections } from '../utils';

export function useDocumentationViewModel() {
  const documentationSections = createDocumentationSections();

  const navigateBack = useCallback(() => {
    if (router.canGoBack()) {
      router.back();
    } else {
      router.replace('/(tabs)');
    }
  }, []);

  return {
    documentationSections,
    navigateBack,
  };
}
