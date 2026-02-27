import { useRouter } from 'expo-router';
import { useCallback, useEffect, useRef, useState } from 'react';
import type { RecipeCard } from '@/shared/services/recipe-service';
import { searchRecipes } from '@/shared/services/recipe-service';
import { useI18n } from '@/shared/i18n';
import { DEBOUNCE_MS } from '../models/recipe-search-models';
import type { RecentRecipe } from '../utils/recent-searches';
import {
  clearRecentSearches,
  getRecentSearches,
  removeRecentSearch,
  saveRecentRecipe,
} from '../utils/recent-searches';

export function useRecipeSearchViewModel() {
  const router = useRouter();
  const { locale } = useI18n();
  const [query, setQuery] = useState('');
  const [recent, setRecent] = useState<RecentRecipe[]>([]);
  const [results, setResults] = useState<Awaited<ReturnType<typeof searchRecipes>>>([]);
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const loadRecent = useCallback(async () => {
    const r = await getRecentSearches();
    setRecent(r);
  }, []);

  useEffect(() => {
    loadRecent();
  }, [loadRecent]);

  const runSearch = useCallback(
    async (q: string) => {
      setLoading(true);
      setSearched(true);
      try {
        const list = await searchRecipes(q, { locale });
        setResults(list);
      } finally {
        setLoading(false);
      }
    },
    [locale]
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
      const next = await removeRecentSearch(recent, recipeId);
      setRecent(next);
    },
    [recent]
  );

  const handleBack = useCallback(() => router.back(), [router]);

  const handleRecipePress = useCallback(
    async (recipe: RecipeCard) => {
      await saveRecentRecipe({ id: recipe.id, title: recipe.title });
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
