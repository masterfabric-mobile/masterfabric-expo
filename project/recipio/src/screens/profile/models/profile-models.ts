export interface ProfileState {
  isLoading: boolean;
}

export interface ProfileUser {
  id: string;
  name: string;
  email: string;
  photoUrl?: string | null;
}

export interface ProfileStats {
  favorites: number;
  recipesCooked: number;
  dayStreak: number;
}

export type ThemeOption = 'light' | 'dark';
export type NotificationsOption = boolean;

/** User dietary preferences (synced from profiles); used to filter recipes by allergies/diets */
export interface DietaryPreferencesInProfile {
  dietSlugs: string[];
  allergySlugs: string[];
  customAllergies: string[];
}

export interface ProfileSettings {
  language: string;
  theme: ThemeOption;
  notifications: NotificationsOption;
  /** Loaded from Supabase profiles; null until synced. Used to hide recipes with allergens and optionally filter by diet. */
  dietaryPreferences: DietaryPreferencesInProfile | null;
}
