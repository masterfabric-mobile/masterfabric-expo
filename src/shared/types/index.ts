// Shared types for the application
export interface User {
  id: string;
  email: string;
  name: string;
  avatar?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface ApiResponse<T> {
  data: T;
  message: string;
  success: boolean;
}

export interface PaginatedResponse<T> extends ApiResponse<T[]> {
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export type LoadingState = 'idle' | 'loading' | 'success' | 'error';

export interface BaseStore {
  isLoading: boolean;
  error: string | null;
  lastUpdated: Date | null;
}

export interface NavigationRoute {
  name: string;
  params?: Record<string, any>;
}

export interface AppConfig {
  apiUrl: string;
  version: string;
  environment: 'development' | 'staging' | 'production';
  features: {
    analytics: boolean;
    crashReporting: boolean;
    pushNotifications: boolean;
  };
}

export * from './battery';
