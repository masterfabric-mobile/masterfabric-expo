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
  saved: number;
  created: number;
  followers: number;
}

export type ThemeOption = 'light' | 'dark';
export type NotificationsOption = boolean;

export interface ProfileSettings {
  language: string;
  theme: ThemeOption;
  notifications: NotificationsOption;
}
