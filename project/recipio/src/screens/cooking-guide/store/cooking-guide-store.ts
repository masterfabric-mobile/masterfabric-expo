import { create } from 'zustand';
import type { RecipeDetail } from '@/shared/services/recipe-service';
import type { CookingGuideState } from '../models/cooking-guide-models';

interface CookingGuideStore extends CookingGuideState {
  recipe: RecipeDetail | null;
  loading: boolean;
  /** True after user taps Complete on last step */
  showCompletion: boolean;
  setRecipe: (recipe: RecipeDetail | null) => void;
  setLoading: (value: boolean) => void;
  setCurrentStep: (step: number) => void;
  setStepNote: (stepIndex: number, note: string) => void;
  setShowCompletion: (value: boolean) => void;
  goNext: () => void;
  goPrevious: () => void;
  reset: () => void;
}

const initialGuideState: CookingGuideState = {
  currentStep: 1,
  totalSteps: 0,
  stepNotes: {},
};

const initialState = {
  recipe: null as RecipeDetail | null,
  loading: true,
  showCompletion: false,
  ...initialGuideState,
};

export const useCookingGuideStore = create<CookingGuideStore>((set, get) => ({
  ...initialState,

  setRecipe: (recipe) => {
    const totalSteps = recipe?.steps?.length ?? 0;
    set({
      recipe,
      totalSteps,
      currentStep: totalSteps > 0 ? 1 : 0,
      stepNotes: {},
    });
  },

  setLoading: (loading) => set({ loading }),

  setCurrentStep: (currentStep) => {
    const { totalSteps } = get();
    const clamped = Math.max(1, Math.min(currentStep, totalSteps));
    set({ currentStep: clamped });
  },

  setStepNote: (stepIndex, note) =>
    set((state) => ({
      stepNotes: { ...state.stepNotes, [stepIndex]: note },
    })),

  setShowCompletion: (showCompletion) => set({ showCompletion }),

  goNext: () => {
    const { currentStep, totalSteps } = get();
    if (currentStep < totalSteps) set({ currentStep: currentStep + 1 });
  },

  goPrevious: () => {
    const { currentStep } = get();
    if (currentStep > 1) set({ currentStep: currentStep - 1 });
  },

  reset: () =>
    set({
      recipe: null,
      loading: true,
      showCompletion: false,
      ...initialGuideState,
    }),
}));
