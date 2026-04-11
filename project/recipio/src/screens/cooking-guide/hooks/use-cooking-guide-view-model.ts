import { useLocalSearchParams, useRouter } from 'expo-router';
import { useCallback, useEffect, useRef } from 'react';
import { getRecipeDetail } from '@/shared/services/recipe-service';
import { addOrUpdateHistoryEntry } from '@/screens/history/services/history-service';
import { useI18n } from '@/shared/i18n';
import { useCookingGuideStore } from '../store/cooking-guide-store';
import { parseRecipeId } from '@/screens/recipe-detail/utils/recipe-detail-utils';

export function useCookingGuideViewModel() {
  const router = useRouter();
  const { locale } = useI18n();
  const { id } = useLocalSearchParams<{ id: string }>();
  const recipeId = parseRecipeId(id);
  const hasRecordedStarted = useRef(false);
  const hasCompleted = useRef(false);

  const {
    recipe,
    loading,
    currentStep,
    totalSteps,
    stepNotes,
    setRecipe,
    setLoading,
    setCurrentStep,
    setStepNote,
    setShowCompletion,
    showCompletion,
    goNext,
    goPrevious,
    reset,
  } = useCookingGuideStore();

  const loadRecipe = useCallback(async () => {
    if (recipeId == null) {
      setRecipe(null);
      setLoading(false);
      return;
    }
    setLoading(true);
    try {
      const data = await getRecipeDetail(recipeId, { locale, servings: 2 });
      setRecipe(data ?? null);
      if (data) {
        addOrUpdateHistoryEntry(recipeId, 'started').catch(() => {});
        hasRecordedStarted.current = true;
      }
    } catch {
      setRecipe(null);
    } finally {
      setLoading(false);
    }
  }, [recipeId, locale, setRecipe, setLoading]);

  useEffect(() => {
    if (recipeId == null) {
      setRecipe(null);
      setLoading(false);
      return;
    }
    const alreadyMatch = recipe?.id === recipeId;
    if (!alreadyMatch) {
      setRecipe(null);
      setLoading(true);
    }
    loadRecipe();
  }, [recipeId, locale]);

  useEffect(() => {
    if (recipe && totalSteps > 0 && currentStep > 0) {
      addOrUpdateHistoryEntry(recipe.id, 'in_progress').catch(() => {});
    }
  }, [recipe?.id, currentStep, totalSteps]);

  const handleBack = useCallback(() => {
    if (recipe && !hasCompleted.current) {
      addOrUpdateHistoryEntry(recipe.id, 'abandoned').catch(() => {});
    }
    reset();
    if (router.canGoBack()) {
      router.back();
    } else {
      router.replace('/(tabs)');
    }
  }, [router, recipe, reset]);

  const handleNext = useCallback(() => {
    if (currentStep > totalSteps) return;
    if (currentStep === totalSteps) {
      if (recipe) {
        addOrUpdateHistoryEntry(recipe.id, 'completed').catch(() => {});
        hasCompleted.current = true;
      }
      setShowCompletion(true);
      return;
    }
    goNext();
  }, [currentStep, totalSteps, recipe, goNext, setShowCompletion]);

  const handlePrevious = useCallback(() => {
    goPrevious();
  }, [goPrevious]);

  const handleCompleteAndBack = useCallback(() => {
    reset();
    if (router.canGoBack()) {
      router.back();
    } else {
      router.replace('/(tabs)');
    }
  }, [router, reset]);

  const isLastStep = totalSteps > 0 && currentStep === totalSteps;

  return {
    recipe,
    loading,
    currentStep,
    totalSteps,
    stepNotes,
    showCompletion,
    isLastStep,
    setStepNote,
    handleBack,
    handleNext,
    handlePrevious,
    handleCompleteAndBack,
  };
}
