const RECENT_KEY = 'recipio_recent_searches';
const MAX_RECENT = 8;

export interface RecentRecipe {
  id: number;
  title: string;
  /** Optional; stored when user opens recipe from search so recent list can show card with image. */
  imageUrl?: string;
}

export async function getRecentSearches(): Promise<RecentRecipe[]> {
  try {
    const AsyncStorage = (
      await import('@react-native-async-storage/async-storage')
    ).default;
    const raw = await AsyncStorage.getItem(RECENT_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export async function saveRecentRecipe(recipe: RecentRecipe): Promise<void> {
  if (!recipe.title?.trim()) return;
  const recent = await getRecentSearches();
  const next = [
    { id: recipe.id, title: recipe.title.trim(), imageUrl: recipe.imageUrl ?? undefined },
    ...recent.filter((r) => r.id !== recipe.id),
  ].slice(0, MAX_RECENT);
  const AsyncStorage = (
    await import('@react-native-async-storage/async-storage')
  ).default;
  await AsyncStorage.setItem(RECENT_KEY, JSON.stringify(next));
}

export async function clearRecentSearches(): Promise<void> {
  const AsyncStorage = (
    await import('@react-native-async-storage/async-storage')
  ).default;
  await AsyncStorage.setItem(RECENT_KEY, JSON.stringify([]));
}

export async function removeRecentSearch(
  current: RecentRecipe[],
  recipeId: number
): Promise<RecentRecipe[]> {
  const next = current.filter((r) => r.id !== recipeId);
  const AsyncStorage = (
    await import('@react-native-async-storage/async-storage')
  ).default;
  await AsyncStorage.setItem(RECENT_KEY, JSON.stringify(next));
  return next;
}
