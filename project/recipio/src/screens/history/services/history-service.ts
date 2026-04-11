/**
 * History service — persist and query recipe history (viewed, started, completed, etc.)
 * Uses AsyncStorage; keyed by recipeId with latest status and lastUpdatedAt.
 */

import AsyncStorage from '@react-native-async-storage/async-storage';
import type { HistoryEntry, HistoryStatus } from '../models/history-models';

const STORAGE_KEY = '@recipio/history_entries';

async function loadEntries(): Promise<HistoryEntry[]> {
  try {
    const raw = await AsyncStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as unknown;
    if (!Array.isArray(parsed)) return [];
    return parsed.filter(
      (e): e is HistoryEntry =>
        e &&
        typeof e.recipeId === 'number' &&
        typeof e.status === 'string' &&
        typeof e.lastUpdatedAt === 'string'
    );
  } catch {
    return [];
  }
}

async function saveEntries(entries: HistoryEntry[]): Promise<void> {
  await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(entries));
}

/** Get all entries, most recent first */
export async function getAllHistoryEntries(): Promise<HistoryEntry[]> {
  const entries = await loadEntries();
  return entries.sort(
    (a, b) =>
      new Date(b.lastUpdatedAt).getTime() - new Date(a.lastUpdatedAt).getTime()
  );
}

/** Add or update one entry (by recipeId). Keeps single entry per recipe with latest status. */
export async function addOrUpdateHistoryEntry(
  recipeId: number,
  status: HistoryStatus
): Promise<HistoryEntry[]> {
  const entries = await loadEntries();
  const now = new Date().toISOString();
  const existing = entries.findIndex((e) => e.recipeId === recipeId);
  const newEntry: HistoryEntry = { recipeId, status, lastUpdatedAt: now };
  const next =
    existing >= 0
      ? entries.map((e, i) => (i === existing ? newEntry : e))
      : [newEntry, ...entries];
  await saveEntries(next);
  return next.sort(
    (a, b) =>
      new Date(b.lastUpdatedAt).getTime() - new Date(a.lastUpdatedAt).getTime()
  );
}

/** Clear all history */
export async function clearHistory(): Promise<void> {
  await AsyncStorage.removeItem(STORAGE_KEY);
}
