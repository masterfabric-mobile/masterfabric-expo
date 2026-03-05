import { useRouter } from 'expo-router';
import { useEnterIngredientsStore } from '../store/enter-ingredients-store';
import { joinIngredientsParam } from '../utils/enter-ingredients-utils';

export function useEnterIngredientsViewModel() {
  const router = useRouter();
  const {
    inputValue,
    ingredients,
    setInputValue,
    addIngredient,
    removeIngredient,
    clearAll,
  } = useEnterIngredientsStore();

  const handleAddIngredient = () => addIngredient(inputValue);

  const handleAddSuggestion = (name: string) => addIngredient(name);

  const handleFindRecipes = () => {
    router.push({
      pathname: '/recipe-results',
      params: { ingredients: joinIngredientsParam(ingredients) },
    });
  };

  const handleBack = () => {
    if (router.canGoBack()) {
      router.back();
    } else {
      router.replace('/(tabs)');
    }
  };

  return {
    inputValue,
    ingredients,
    setInputValue,
    handleAddIngredient,
    handleAddSuggestion,
    removeIngredient,
    clearAll,
    handleFindRecipes,
    handleBack,
    canSubmit: ingredients.length > 0,
  };
}
