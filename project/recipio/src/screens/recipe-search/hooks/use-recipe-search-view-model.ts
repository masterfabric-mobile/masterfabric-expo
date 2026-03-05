import { useRouter } from 'expo-router';
import { useCallback, useEffect, useRef, useState } from 'react';
import type { RecipeCard } from '@/shared/services/recipe-service';
import { getRecipesByIds, searchRecipes } from '@/shared/services/recipe-service';
import { useI18n } from '@/shared/i18n';
import { useProfileStore } from '@/screens/profile/store/profile-store';
import { DEBOUNCE_MS } from '../models/recipe-search-models';
import {
  clearRecentSearches,
  getRecentSearches,
  removeRecentSearch,
  saveRecentRecipe,
} from '../utils/recent-searches';

export function useRecipeSearchViewModel() {
  const router = useRouter();
  const { locale } = useI18n();
  const dietaryPreferences = useProfileStore((s) => s.settings.dietaryPreferences);
  const [query, setQuery] = useState('');
  const [recent, setRecent] = useState<RecipeCard[]>([]);
  const [results, setResults] = useState<Awaited<ReturnType<typeof searchRecipes>>>([]);
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const loadRecent = useCallback(async () => {
    const stored = await getRecentSearches();
    if (stored.length === 0) {
      setRecent([]);
      return;
    }
    const ids = stored.map((r) => r.id);
    const cards = await getRecipesByIds(ids, { locale, dietaryPreferences: dietaryPreferences ?? undefined });
    const ordered = ids.map((id) => cards.find((c) => c.id === id)).filter(Boolean) as RecipeCard[];
    setRecent(ordered);
  }, [locale, dietaryPreferences]);

  useEffect(() => {
    loadRecent();
  }, [loadRecent]);

  const runSearch = useCallback(
    async (q: string) => {
      setLoading(true);
      setSearched(true);
      try {
        const list = await searchRecipes(q, {
          locale,
          dietaryPreferences: dietaryPreferences ?? undefined,
        });
        setResults(list);
      } finally {
        setLoading(false);
      }
    },
    [locale, dietaryPreferences]
  );

  const clearRecent = useCallback(async () => {
    await clearRecentSearches();
    setRecent([]);
  }, []);

  const handleSearch = useCallback(() => runSearch(query), [runSearch, query]);

  const handleQueryChange = useCallback(
    (text: string) => {
      setQuery(text);
      if (debounceRef.current) clearTimeout(debounceRef.current);
      const trimmed = text.trim();
      if (trimmed.length === 0) {
        setResults([]);
        setSearched(false);
        return;
      }
      debounceRef.current = setTimeout(() => runSearch(trimmed), DEBOUNCE_MS);
    },
    [runSearch]
  );

  const handleRecentSelect = useCallback(
    (recipeId: number) => {
      router.push(`/recipe-detail/${recipeId}`);
    },
    [router]
  );

  const handleRemoveRecent = useCallback(
    async (recipeId: number) => {
      const asRecent = recent.map((r) => ({ id: r.id, title: r.title, imageUrl: r.imageUrl }));
      await removeRecentSearch(asRecent, recipeId);
      loadRecent();
    },
    [recent, loadRecent]
  );

  const handleBack = useCallback(() => {
    if (router.canGoBack()) {
      router.back();
    } else {
      router.replace('/(tabs)');
    }
  }, [router]);

  const handleRecipePress = useCallback(
    async (recipe: RecipeCard) => {
      await saveRecentRecipe({ id: recipe.id, title: recipe.title, imageUrl: recipe.imageUrl });
      loadRecent();
      router.push(`/recipe-detail/${recipe.id}`);
    },
    [router, loadRecent]
  );

  useEffect(
    () => () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
    },
    []
  );

  return {
    query,
    recent,
    results,
    loading,
    searched,
    handleQueryChange,
    handleSearch,
    clearRecent,
    handleRecentSelect,
    handleRemoveRecent,
    handleBack,
    handleRecipePress,
  };
}
