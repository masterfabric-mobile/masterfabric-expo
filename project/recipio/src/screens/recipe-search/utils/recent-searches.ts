const RECENT_KEY = 'recipio_recent_searches';
const MAX_RECENT = 8;

export async function getRecentSearches(): Promise<string[]> {
  try {
    const AsyncStorage = (
      await import('@react-native-async-storage/async-storage')
    ).default;
    const raw = await AsyncStorage.getItem(RECENT_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export async function saveRecentSearch(query: string): Promise<void> {
  if (!query.trim()) return;
  const recent = await getRecentSearches();
  const next = [query.trim(), ...recent.filter((q) => q !== query.trim())].slice(
    0,
    MAX_RECENT
  );
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
  current: string[],
  query: string
): Promise<string[]> {
  const next = current.filter((x) => x !== query);
  const AsyncStorage = (
    await import('@react-native-async-storage/async-storage')
  ).default;
  await AsyncStorage.setItem(RECENT_KEY, JSON.stringify(next));
  return next;
}
