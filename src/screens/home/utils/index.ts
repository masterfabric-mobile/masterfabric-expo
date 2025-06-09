import { User } from '../models/home-models';

export interface QuickAction {
  id: string;
  title: string;
  description: string;
  icon: string;
  color: string;
}

export const validateHomeAction = (action: QuickAction): boolean => {
  if (!action) return false;
  if (!action.id || typeof action.id !== 'string') return false;
  if (!action.title || typeof action.title !== 'string') return false;
  if (!action.description || typeof action.description !== 'string') return false;
  if (!action.icon || typeof action.icon !== 'string') return false;
  if (!action.color || typeof action.color !== 'string') return false;
  return true;
};

export const formatGreeting = (user: User | null): string => {
  const hour = new Date().getHours();
  const timeGreeting = 
    hour < 12 ? 'Good Morning' :
    hour < 18 ? 'Good Afternoon' :
    'Good Evening';
  
  return user ? `${timeGreeting}, ${user.name}!` : timeGreeting;
};

export const getInitials = (name: string): string => {
  return name
    .split(' ')
    .map(word => word.charAt(0).toUpperCase())
    .join('')
    .slice(0, 2);
};

export const formatLastSeen = (date: Date): string => {
  const now = new Date();
  const diff = now.getTime() - date.getTime();
  const minutes = Math.floor(diff / 60000);
  const hours = Math.floor(diff / 3600000);
  const days = Math.floor(diff / 86400000);

  if (minutes < 1) return 'Just now';
  if (minutes < 60) return `${minutes}m ago`;
  if (hours < 24) return `${hours}h ago`;
  return `${days}d ago`;
};
