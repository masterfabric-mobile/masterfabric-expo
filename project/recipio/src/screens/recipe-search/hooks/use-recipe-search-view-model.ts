import { useRouter } from 'expo-router';
import { useCallback, useEffect, useRef, useState } from 'react';
import { searchRecipes } from '@/shared/services/recipe-service';
import { DEBOUNCE_MS } from '../models/recipe-search-models';
import {
  clearRecentSearches,
  getRecentSearches,
  removeRecentSearch,
  saveRecentSearch,
} from '../utils/recent-searches';

export function useRecipeSearchViewModel() {
  const router = useRouter();
  const [query, setQuery] = useState('');
  const [recent, setRecent] = useState<string[]>([]);
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
        const list = await searchRecipes(q);
        setResults(list);
        if (q.trim()) await saveRecentSearch(q);
        loadRecent();
      } finally {
        setLoading(false);
      }
    },
    [loadRecent]
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
    (q: string) => {
      setQuery(q);
      runSearch(q);
    },
    [runSearch]
  );

  const handleRemoveRecent = useCallback(
    async (q: string) => {
      const next = await removeRecentSearch(recent, q);
      setRecent(next);
    },
    [recent]
  );

  const handleBack = useCallback(() => router.back(), [router]);

  const handleRecipePress = useCallback(
    (recipeId: number) => router.push(`/recipe-detail/${recipeId}`),
    [router]
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
