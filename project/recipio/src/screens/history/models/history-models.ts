/**
 * History entry: one recipe interaction with a status and timestamp.
 * Status reflects: viewed, started, in progress, completed, or abandoned.
 */
export type HistoryStatus =
  | 'viewed'
  | 'started'
  | 'in_progress'
  | 'completed'
  | 'abandoned';

export interface HistoryEntry {
  recipeId: number;
  status: HistoryStatus;
  /** ISO date string; used for date filtering and ordering */
  lastUpdatedAt: string;
}

export type DateFilterType = 'today' | 'thisWeek' | 'thisMonth';

export interface HistoryState {
  isLoading: boolean;
  /** Entries after date filter, ordered by lastUpdatedAt desc */
  items: HistoryEntry[];
  dateFilter: DateFilterType;
}

/** Display item: history entry merged with recipe card data */
export interface HistoryItemDisplay {
  entry: HistoryEntry;
  recipeId: number;
  title: string;
  description: string;
  imageUrl: string;
  time: string;
  difficulty: string;
}
