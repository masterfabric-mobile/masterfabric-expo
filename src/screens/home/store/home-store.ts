import { create } from 'zustand';

interface QuickAction {
  id: string;
  title: string;
  description: string;
  icon: string;
  color: string;
}

interface HomeState {
  quickActions: QuickAction[];
  recentActivity: any[];
  
  // Actions
  setQuickActions: (actions: QuickAction[]) => void;
  addQuickAction: (action: QuickAction) => void;
  removeQuickAction: (id: string) => void;
  setRecentActivity: (activity: any[]) => void;
  reset: () => void;
}

const initialState = {
  quickActions: [],
  recentActivity: [],
};

export const useHomeStore = create<HomeState>((set, get) => ({
  ...initialState,
  
  setQuickActions: (actions: QuickAction[]) => 
    set({ quickActions: actions }),
    
  addQuickAction: (action: QuickAction) => 
    set((state) => ({ 
      quickActions: [...state.quickActions, action] 
    })),
    
  removeQuickAction: (id: string) => 
    set((state) => ({ 
      quickActions: state.quickActions.filter(action => action.id !== id) 
    })),
    
  setRecentActivity: (activity: any[]) => 
    set({ recentActivity: activity }),
    
  reset: () => 
    set(initialState),
}));
