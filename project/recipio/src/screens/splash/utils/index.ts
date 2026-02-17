import { SplashConfig } from '../models/splash-models';

export const DEFAULT_SPLASH_CONFIG: SplashConfig = {
  minimumDisplayTime: 2000,
  navigationDelay: 2000,
};

export const SPLASH_CONSTANTS = {
  DEFAULT_DELAY: 2000,
  MIN_DISPLAY_TIME: 1500,
  MAX_DISPLAY_TIME: 5000,
} as const;

export const validateSplashConfig = (config: Partial<SplashConfig>): SplashConfig => {
  return {
    minimumDisplayTime: config.minimumDisplayTime ?? DEFAULT_SPLASH_CONFIG.minimumDisplayTime,
    navigationDelay: config.navigationDelay ?? DEFAULT_SPLASH_CONFIG.navigationDelay,
  };
};

export const delay = (ms: number): Promise<void> => {
  return new Promise((resolve) => setTimeout(resolve, ms));
};

