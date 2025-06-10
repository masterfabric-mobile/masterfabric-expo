export interface SplashStep {
  id: string;
  duration: number;
}

export interface SplashConfig {
  minimumDisplayTime: number;
  steps: SplashStep[];
}

export interface SplashState {
  isLoading: boolean;
  progress: number;
  currentStep: string;
  completedSteps: string[];
}

export interface NavigationState {
  hasSeenOnboarding: boolean;
  isCompleted: boolean;
  shouldNavigateToOnboarding: boolean;
}