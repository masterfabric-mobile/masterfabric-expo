export interface SplashConfig {
  minimumDisplayTime: number;
  navigationDelay: number;
}

export interface SplashState {
  isLoading: boolean;
  isInitialized: boolean;
}

export interface NavigationConfig {
  targetRoute: string;
  shouldReplace: boolean;
}

