import { useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import {
  getCookTonightRecipes,
  getCurrentUserProfile,
  getGreeting,
  getMonthlyRecipesCount,
} from '@/shared/services';
import type {
  ActivityItem,
  CurrentPlan,
  RecipeCard,
} from '../models/home-models';

interface HomeState {
  isLoading: boolean;
  userName: string;
  greeting: string;
  currentPlan: CurrentPlan;
  cookTonightRecipes: RecipeCard[];
  recentActivities: ActivityItem[];
}

export function useHomeViewModel() {
  const router = useRouter();
  const [state, setState] = useState<HomeState>({
    isLoading: true,
    userName: 'Alex',
    greeting: getGreeting(),
    currentPlan: {
      name: 'Pro Chef',
      isActive: true,
      recipesSaved: 45,
      recipesLimit: 50,
    },
    cookTonightRecipes: [],
    recentActivities: [],
  });

  useEffect(() => {
    const loadData = async () => {
      try {
        setState((prev) => ({ ...prev, isLoading: true }));

        const [userProfile, recipes, monthlyCount] = await Promise.all([
          getCurrentUserProfile(),
          getCookTonightRecipes({ limit: 5 }),
          getMonthlyRecipesCount(),
        ]);

        setState({
          isLoading: false,
          userName: userProfile.name,
          greeting: getGreeting(),
          currentPlan: {
            name: userProfile.currentPlan.name,
            isActive: userProfile.currentPlan.isActive,
            recipesSaved: monthlyCount.saved,
            recipesLimit: monthlyCount.limit,
          },
          cookTonightRecipes: recipes,
          recentActivities: [], // Supabase saved_recipes/tried_recipes'tan gelecek
        });
      } catch (error) {
        console.error('Error loading home data:', error);
        setState((prev) => ({ ...prev, isLoading: false }));
      }
    };

    loadData();
  }, []);

  const handleFindRecipes = () => {
    router.push('/enter-ingredients');
  };

  const handleSearch = () => {
    router.push('/recipe-search');
  };

  const handleRecipePress = (recipeId: number) => {
    router.push(`/recipe-detail/${recipeId}`);
  };

  return {
    ...state,
    handleFindRecipes,
    handleSearch,
    handleRecipePress,
  };
}
