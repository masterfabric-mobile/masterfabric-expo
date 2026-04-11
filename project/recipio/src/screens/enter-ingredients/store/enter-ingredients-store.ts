import { create } from 'zustand';

export interface EnterIngredientsStore {
  inputValue: string;
  ingredients: string[];
  setInputValue: (value: string) => void;
  setIngredients: (ingredients: string[]) => void;
  addIngredient: (item: string) => void;
  removeIngredient: (item: string) => void;
  clearAll: () => void;
  reset: () => void;
}

const initialState = {
  inputValue: '',
  ingredients: [] as string[],
};

export const useEnterIngredientsStore = create<EnterIngredientsStore>((set) => ({
  ...initialState,

  setInputValue: (value) => set({ inputValue: value }),

  setIngredients: (ingredients) => set({ ingredients }),

  addIngredient: (item) =>
    set((state) => {
      const trimmed = item.trim();
      if (!trimmed || state.ingredients.includes(trimmed)) return state;
      return {
        ingredients: [...state.ingredients, trimmed],
        inputValue: '',
      };
    }),

  removeIngredient: (item) =>
    set((state) => ({
      ingredients: state.ingredients.filter((i) => i !== item),
    })),

  clearAll: () => set({ ingredients: [] }),

  reset: () => set(initialState),
}));
