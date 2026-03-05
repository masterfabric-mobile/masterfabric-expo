import type { NotificationItem } from '../models/notification-models';

const now = new Date();
const oneHourAgo = new Date(now.getTime() - 60 * 60 * 1000);
const yesterday = new Date(now.getTime() - 24 * 60 * 60 * 1000);
const twoDaysAgo = new Date(now.getTime() - 2 * 24 * 60 * 60 * 1000);

export const MOCK_NOTIFICATIONS: NotificationItem[] = [
  {
    id: '1',
    type: 'recipe_suggestion',
    title: 'New recipe for you',
    body: 'Based on your ingredients, try "Mediterranean Chicken Bowl" — 85% match.',
    createdAt: oneHourAgo.toISOString(),
    read: false,
    recipeId: 101,
  },
  {
    id: '2',
    type: 'cooking_reminder',
    title: 'Cooking in progress',
    body: "You started \"Pasta Carbonara\" — don't forget to check the timer.",
    createdAt: oneHourAgo.toISOString(),
    read: true,
    recipeId: 102,
  },
  {
    id: '3',
    type: 'favorite_updated',
    title: 'Recipe saved',
    body: '"Spicy Thai Basil Stir-Fry" has been added to your favorites.',
    createdAt: yesterday.toISOString(),
    read: false,
    recipeId: 103,
  },
  {
    id: '4',
    type: 'tip',
    title: "Chef's tip",
    body: 'Let meat rest for 5 minutes after cooking for juicier results.',
    createdAt: yesterday.toISOString(),
    read: true,
  },
  {
    id: '5',
    type: 'general',
    title: 'Welcome to Recipio',
    body: 'Tap the heart on any recipe to save it. Your favorites sync across devices when you sign in.',
    createdAt: twoDaysAgo.toISOString(),
    read: true,
  },
];
