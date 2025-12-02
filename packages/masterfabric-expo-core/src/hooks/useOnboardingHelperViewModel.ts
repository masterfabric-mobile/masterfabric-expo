
import { useCallback, useEffect, useMemo } from 'react';
import { useOnboardingHelperStore } from '../stores/onboardingStore';

export const useOnboardingHelperViewModel = () => {
  const {
    hasCompleted,
    isLoading,
    error,
    loadStatus,
    completeOnboarding,
    resetOnboarding,
  } = useOnboardingHelperStore();

  // Initial load of the status
  useEffect(() => {
    loadStatus();
  }, [loadStatus]);

  // Memoized status text
  const statusText = useMemo(
    () => hasCompleted ? 'Completed' : 'Not Completed',
    [hasCompleted]
  );

  const statusDescription = useMemo(
    () => hasCompleted
      ? 'The app will skip the onboarding flow on the next launch.'
      : 'The onboarding flow will be shown on the next app launch.',
    [hasCompleted]
  );

  // Handlers for the view to call
  const handleComplete = useCallback(async () => {
    await completeOnboarding();
  }, [completeOnboarding]);

  const handleReset = useCallback(async () => {
    await resetOnboarding();
  }, [resetOnboarding]);

  const handleRefresh = useCallback(async () => {
    await loadStatus();
  }, [loadStatus]);

  return {
    hasCompleted,
    isLoading,
    error,
    statusText,
    statusDescription,
    handleComplete,
    handleReset,
    handleRefresh,
  };
};
