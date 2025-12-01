import { SplashStep } from '../models/splash-models';

export const createSplashSteps = (): SplashStep[] => [
  {
    id: 'fonts',
    duration: 200,
  },
  {
    id: 'services', 
    duration: 300,
  },
  {
    id: 'auth',
    duration: 440,
  },
  {
    id: 'preferences',
    duration: 580,
  },
  {
    id: 'finalize',
    duration: 730,
  },
];

export const calculateTotalDuration = (steps: SplashStep[]): number => {
  return steps.reduce((total, step) => total + step.duration, 0);
};

export const getProgressPercentage = (
  completedSteps: SplashStep[],
  totalSteps: SplashStep[]
): number => {
  const completedDuration = calculateTotalDuration(completedSteps);
  const totalDuration = calculateTotalDuration(totalSteps);
  return Math.round((completedDuration / totalDuration) * 100);
};

// Splash step validation
export const isValidSplashStep = (step: SplashStep): boolean => {
  return step && typeof step.id === 'string' && typeof step.duration === 'number' && step.duration > 0;
};

// Get step by ID
export const getStepById = (steps: SplashStep[], id: string): SplashStep | undefined => {
  return steps.find(step => step.id === id);
};

// Loading message utilities
export const getLoadingMessage = (stepId: string): string => {
  switch (stepId) {
    case 'fonts':
      return 'Loading fonts...';
    case 'services':
      return 'Initializing services...';
    case 'auth':
      return 'Checking authentication...';
    case 'preferences':
      return 'Loading preferences...';
    case 'finalize':
      return 'Finalizing setup...';
    default:
      return 'Loading...';
  }
};
