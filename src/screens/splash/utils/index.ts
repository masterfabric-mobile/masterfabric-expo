import { SplashStep } from '../models/splash-models';

export const createSplashSteps = (): SplashStep[] => [
  {
    id: 'fonts',
    name: 'Loading fonts',
    description: 'Loading custom fonts and assets',
    duration: 300,
  },
  {
    id: 'services',
    name: 'Initializing services',
    description: 'Setting up core services',
    duration: 500,
  },
  {
    id: 'auth',
    name: 'Checking authentication',
    description: 'Verifying user authentication',
    duration: 400,
  },
  {
    id: 'preferences',
    name: 'Loading user preferences',
    description: 'Loading user settings and preferences',
    duration: 300,
  },
  {
    id: 'finalize',
    name: 'Finalizing setup',
    description: 'Completing app initialization',
    duration: 200,
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
