import { create } from 'zustand';
import type { NotificationItem } from '../models/notification-models';

interface NotificationsStore {
  items: NotificationItem[];
  isLoading: boolean;
  setItems: (items: NotificationItem[]) => void;
  setLoading: (value: boolean) => void;
  markAsRead: (id: string) => void;
  markAllAsRead: () => void;
  removeItem: (id: string) => void;
  clearAll: () => void;
}

export const useNotificationsStore = create<NotificationsStore>((set) => ({
  items: [],
  isLoading: false,
  setItems: (items) => set({ items }),
  setLoading: (isLoading) => set({ isLoading }),
  markAsRead: (id) =>
    set((state) => ({
      items: state.items.map((item) =>
        item.id === id ? { ...item, read: true } : item
      ),
    })),
  markAllAsRead: () =>
    set((state) => ({
      items: state.items.map((item) => ({ ...item, read: true })),
    })),
  removeItem: (id) =>
    set((state) => ({
      items: state.items.filter((item) => item.id !== id),
    })),
  clearAll: () => set({ items: [] }),
}));
