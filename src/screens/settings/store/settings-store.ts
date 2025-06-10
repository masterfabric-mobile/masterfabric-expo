import { create } from 'zustand';
import { SettingsActions, SettingsState, Theme } from '../models/settings-models';

const initialState: Pick<SettingsState, 'isLoading' | 'selectedTheme' | 'currentLanguage'> = {
  isLoading: false,
  selectedTheme: 'system' as Theme,
  currentLanguage: 'en',
};

export const useSettingsStore = create<SettingsState & SettingsActions>((set) => ({
  ...initialState,

  setLoading: (loading: boolean) =>
    set({ isLoading: loading }),

  setTheme: (theme: Theme) =>
    set({ selectedTheme: theme }),

  setLanguage: (language: string) =>
    set({ currentLanguage: language }),

  updateSettings: (settings: Partial<Pick<SettingsState, 'selectedTheme' | 'currentLanguage'>>) =>
    set((state) => ({ ...state, ...settings })),

  reset: () =>
    set(initialState),
}));
