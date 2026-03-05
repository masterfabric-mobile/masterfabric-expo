export type NotificationType =
  | 'recipe_suggestion'
  | 'cooking_reminder'
  | 'favorite_updated'
  | 'tip'
  | 'general';

export interface NotificationItem {
  id: string;
  type: NotificationType;
  title: string;
  body: string;
  createdAt: string; // ISO date
  read: boolean;
  recipeId?: number;
}

export interface NotificationsState {
  items: NotificationItem[];
  isLoading: boolean;
}
