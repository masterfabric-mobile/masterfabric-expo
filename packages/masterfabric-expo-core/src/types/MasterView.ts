import { ReactNode } from 'react';
import { ViewStyle } from 'react-native';
import { BaseStoreState, LoadingState, ThemeColors } from './index';
import type { SentryConfig } from '../integrations/SentryIntegration';
import type { FirebaseConfig } from '../integrations/FirebaseIntegration';

// MasterView Abstract Base Interface
export interface IMasterView {
  // Core Properties
  readonly id: string;
  readonly name: string;
  readonly version: string;
  
  // Lifecycle Methods
  initialize(): Promise<void>;
  destroy(): void;
  
  // State Management
  getState(): BaseStoreState;
  setLoading(loading: boolean): void;
  setError(error: string | null): void;
  
  // Theme Management
  getThemeColors(): ThemeColors;
  isDarkMode(): boolean;
  
  // Activity Tracking
  trackActivity(action: string, details?: any): void;
  
  // Validation
  validateProps(): boolean;
}

// MasterView Props Interface
export interface MasterViewProps {
  id: string;
  name: string;
  children?: ReactNode;
  style?: ViewStyle | ViewStyle[];
  onMount?: () => void;
  onUnmount?: () => void;
  onError?: (error: Error) => void;
}

// MasterView Configuration
export interface MasterViewConfig {
  enableActivityTracking: boolean;
  enableErrorBoundary: boolean;
  enableThemeSupport: boolean;
  enableLocalization: boolean;
  enableLoadingStates: boolean;
  enableNavigationTracking: boolean;
  maxActivityItems: number;
  errorRetryAttempts: number;
  loadingTimeout: number;
  // Integrations (optional)
  enableSentry?: boolean;
  sentryConfig?: SentryConfig;
  enableFirebase?: boolean;
  firebaseConfig?: Partial<FirebaseConfig>;
}

// MasterView State Interface
export interface MasterViewState extends BaseStoreState, LoadingState {
  isInitialized: boolean;
  isDestroyed: boolean;
  lastActivity?: string;
  errorCount: number;
  retryCount: number;
}

// MasterView Hook Interface
export interface MasterViewHook<TState = any, TActions = any> {
  state: TState & MasterViewState;
  actions: TActions;
  isLoading: boolean;
  error: string | null;
  initialize: () => Promise<void>;
  destroy: () => void;
  reset: () => void;
  // Additional utilities
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  trackActivity: (action: string, details?: any) => void;
  updateState: (newState: Partial<TState & MasterViewState>) => void;
  updateActions: (newActions: Partial<TActions>) => void;
  addEventListener: (handler: MasterViewEventHandler) => () => void;
  // Theme utilities
  currentTheme: string;
  isDark: boolean;
  setTheme: (theme: any) => void;
}

// MasterView Store Interface
export interface MasterViewStore<TState = any> {
  state: TState & MasterViewState;
  setState: (state: Partial<TState & MasterViewState>) => void;
  getState: () => TState & MasterViewState;
  subscribe: (callback: (state: TState & MasterViewState) => void) => () => void;
  reset: () => void;
}

// MasterView Component Props
export interface MasterViewComponentProps extends MasterViewProps {
  config?: Partial<MasterViewConfig>;
  store?: MasterViewStore;
  onStateChange?: (state: MasterViewState) => void;
}

// MasterView Factory Interface
export interface MasterViewFactory<TProps extends MasterViewProps = MasterViewProps> {
  create(props: TProps): IMasterView;
  createWithConfig(props: TProps, config: MasterViewConfig): IMasterView;
  createStore<TState = any>(initialState?: TState): MasterViewStore<TState>;
}

// MasterView Registry Interface
export interface MasterViewRegistry {
  register(name: string, factory: MasterViewFactory): void;
  unregister(name: string): void;
  get(name: string): MasterViewFactory | undefined;
  list(): string[];
  clear(): void;
}

// MasterView Error Types
export interface MasterViewError extends Error {
  code: 'INITIALIZATION_ERROR' | 'VALIDATION_ERROR' | 'RUNTIME_ERROR' | 'DESTRUCTION_ERROR';
  viewId: string;
  viewName: string;
  timestamp: string;
  context?: any;
}

// MasterView Event Types
export interface MasterViewEvent {
  type: 'INITIALIZED' | 'DESTROYED' | 'ERROR' | 'STATE_CHANGED' | 'ACTIVITY_TRACKED';
  viewId: string;
  viewName: string;
  timestamp: string;
  data?: any;
}

// MasterView Event Handler
export type MasterViewEventHandler = (event: MasterViewEvent) => void;
