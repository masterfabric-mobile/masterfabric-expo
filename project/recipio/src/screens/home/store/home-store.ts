import { create } from 'zustand';
import type { ActivityItem, CurrentPlan, RecipeCard } from '../models/home-models';

export interface HomeProfile {
  userName: string;
  greeting: string;
  avatarUrl: string;
}

export interface HomeState {
  isLoading: boolean;
  isRefreshing: boolean;
  profile: HomeProfile;
  currentPlan: CurrentPlan;
  cookTonightRecipes: RecipeCard[];
  recentActivities: ActivityItem[];
}

const initialProfile: HomeProfile = {
  userName: '',
  greeting: '',
  avatarUrl: '',
};

const initialPlan: CurrentPlan = {
  name: '',
  isActive: false,
  recipesSaved: 0,
  recipesLimit: 50,
};

interface HomeStore extends HomeState {
  setLoading: (loading: boolean) => void;
  setRefreshing: (value: boolean) => void;
  setHomeData: (data: Partial<Pick<HomeState, 'profile' | 'currentPlan' | 'cookTonightRecipes' | 'recentActivities'>>) => void;
  reset: () => void;
}

const initialState: HomeState = {
  isLoading: true,
  isRefreshing: false,
  profile: initialProfile,
  currentPlan: initialPlan,
  cookTonightRecipes: [],
  recentActivities: [],
};

export const useHomeStore = create<HomeStore>((set) => ({
  ...initialState,
  setLoading: (isLoading) => set({ isLoading }),
  setRefreshing: (isRefreshing) => set({ isRefreshing }),
  setHomeData: (data) =>
    set((state) => ({
      profile: data.profile ?? state.profile,
      currentPlan: data.currentPlan ?? state.currentPlan,
      cookTonightRecipes: data.cookTonightRecipes ?? state.cookTonightRecipes,
      recentActivities: data.recentActivities ?? state.recentActivities,
    })),
  reset: () => set(initialState),
}));
