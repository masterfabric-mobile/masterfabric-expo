import AsyncStorage from '@react-native-async-storage/async-storage';
import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';
import { QuickAction } from '../utils';

export type ActivityActionType = 
  'theme_change' | 
  'language_change' | 
  'notification_settings' | 
  'general_settings' | 
  'device_info' | 
  'dev_tool' | 
  'app_start' |
  'new_project' |
  'templates' |
  'documentation' |
  'settings';

export type ActivityType = 
  'project' | 
  'template' | 
  'documentation' | 
  'settings' | 
  'device_info' | 
  'dev_tool';

export interface ActivityItem {
  id: string;
  title: string;
  description?: string;
  timestamp: string;
  type: ActivityType;
  details?: {
    action: ActivityActionType;
    from?: string;
    to?: string;
    tool?: string;
    actionId?: string;
  };
}

interface HomeStore {
  quickActions: QuickAction[];
  recentActivity: ActivityItem[];
  setQuickActions: (quickActions: QuickAction[]) => void;
  addActivity: (activity: ActivityItem) => void;
  clearActivity: () => void;
}

export const useHomeStore = create<HomeStore>()(
  persist(
    (set) => ({
      quickActions: [],
      recentActivity: [],
      setQuickActions: (quickActions) => set({ quickActions }),
      addActivity: (activity) => set((state) => ({
        recentActivity: [activity, ...state.recentActivity].slice(0, 50),
      })),
      clearActivity: () => set({ recentActivity: [] }),
    }),
    {
      name: 'home-store',
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);
