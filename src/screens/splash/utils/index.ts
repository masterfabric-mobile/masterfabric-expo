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
