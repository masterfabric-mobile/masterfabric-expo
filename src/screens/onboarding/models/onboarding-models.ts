export interface OnboardingStep {
  id: string;
  icon: string;
  title: string;
  subtitle: string;
  description: string[];
}

export interface OnboardingConfig {
  steps: OnboardingStep[];
  autoAdvanceDelay?: number;
}

export interface OnboardingState {
  currentStepIndex: number;
  isCompleted: boolean;
  hasSeenOnboarding: boolean;
}
