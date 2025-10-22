import { create } from 'zustand';
import { SettingsActions, SettingsState } from '../models/settings-models';

const initialState: Pick<SettingsState, 'isLoading' | 'currentLanguage'> = {
  isLoading: false,
  currentLanguage: 'en',
};

export const useSettingsStore = create<SettingsState & SettingsActions>((set) => ({
  ...initialState,

  setLoading: (loading: boolean) =>
    set({ isLoading: loading }),

  setLanguage: (language: string) =>
    set({ currentLanguage: language }),

  updateSettings: (settings: Partial<Pick<SettingsState, 'currentLanguage'>>) =>
    set((state) => ({ ...state, ...settings })),

  reset: () =>
    set(initialState),
}));
