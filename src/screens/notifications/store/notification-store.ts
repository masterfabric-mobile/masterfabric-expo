import { create } from 'zustand';
import { NotificationItem, NotificationState } from '../models/notification-models';

interface NotificationStoreState extends NotificationState {
  // Actions
  setNotifications: (notifications: NotificationItem[]) => void;
  addNotification: (notification: NotificationItem) => void;
  markAsRead: (id: string) => void;
  markAllAsRead: () => void;
  removeNotification: (id: string) => void;
  clearAll: () => void;
  setLoading: (loading: boolean) => void;
  updateLastUpdated: () => void;
}

const initialState: NotificationState = {
  notifications: [],
  unreadCount: 0,
  isLoading: false,
  lastUpdated: null,
};

export const useNotificationStore = create<NotificationStoreState>((set, get) => ({
  ...initialState,
  
  setNotifications: (notifications: NotificationItem[]) => {
    const unreadCount = notifications.filter(n => !n.isRead).length;
    set({ 
      notifications, 
      unreadCount,
      lastUpdated: new Date()
    });
  },
  
  addNotification: (notification: NotificationItem) => {
    const { notifications } = get();
    const newNotifications = [notification, ...notifications];
    const unreadCount = newNotifications.filter(n => !n.isRead).length;
    
    set({ 
      notifications: newNotifications, 
      unreadCount,
      lastUpdated: new Date()
    });
  },
  
  markAsRead: (id: string) => {
    const { notifications } = get();
    const updatedNotifications = notifications.map(n =>
      n.id === id ? { ...n, isRead: true } : n
    );
    const unreadCount = updatedNotifications.filter(n => !n.isRead).length;
    
    set({ 
      notifications: updatedNotifications, 
      unreadCount 
    });
  },
  
  markAllAsRead: () => {
    const { notifications } = get();
    const updatedNotifications = notifications.map(n => ({ ...n, isRead: true }));
    
    set({ 
      notifications: updatedNotifications, 
      unreadCount: 0 
    });
  },
  
  removeNotification: (id: string) => {
    const { notifications } = get();
    const updatedNotifications = notifications.filter(n => n.id !== id);
    const unreadCount = updatedNotifications.filter(n => !n.isRead).length;
    
    set({ 
      notifications: updatedNotifications, 
      unreadCount 
    });
  },
  
  clearAll: () => {
    set({ 
      notifications: [], 
      unreadCount: 0,
      lastUpdated: new Date()
    });
  },
  
  setLoading: (loading: boolean) => {
    set({ isLoading: loading });
  },
  
  updateLastUpdated: () => {
    set({ lastUpdated: new Date() });
  },
}));
