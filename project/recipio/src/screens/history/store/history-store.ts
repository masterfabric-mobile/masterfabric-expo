import { create } from 'zustand';
import type { HistoryEntry, HistoryItemDisplay, DateFilterType } from '../models/history-models';

interface HistoryStore {
  isLoading: boolean;
  items: HistoryEntry[];
  /** Filtered + enriched for list (recipe cards); set by view model */
  displayList: HistoryItemDisplay[];
  dateFilter: DateFilterType;
  setLoading: (value: boolean) => void;
  setItems: (items: HistoryEntry[]) => void;
  setDisplayList: (list: HistoryItemDisplay[]) => void;
  setDateFilter: (filter: DateFilterType) => void;
  clear: () => void;
}

export const useHistoryStore = create<HistoryStore>((set) => ({
  isLoading: false,
  items: [],
  displayList: [],
  dateFilter: 'thisWeek',
  setLoading: (isLoading) => set({ isLoading }),
  setItems: (items) => set({ items }),
  setDisplayList: (displayList) => set({ displayList }),
  setDateFilter: (dateFilter) => set({ dateFilter }),
  clear: () => set({ items: [], displayList: [] }),
}));
