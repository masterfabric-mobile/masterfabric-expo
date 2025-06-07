export interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  preferences?: UserPreferences;
}

export interface UserPreferences {
  theme: 'light' | 'dark' | 'system';
  language: string;
  notifications: NotificationSettings;
}

export interface NotificationSettings {
  push: boolean;
  email: boolean;
  updates: boolean;
}

export interface QuickAction {
  id: string;
  title: string;
  icon: string;
  action: () => void;
  enabled?: boolean;
}
