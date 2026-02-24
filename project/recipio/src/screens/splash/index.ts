export { SplashScreen } from './components/splash-screen';
export { SplashRoute } from './components/splash-route';
export { useLoadingDotsAnimation } from './hooks/use-splash-screen';
export { splashStore } from './store/splash-store';
export type { SplashConfig, SplashState, NavigationConfig } from './models/splash-models';
export {
  DEFAULT_SPLASH_CONFIG,
  SPLASH_CONSTANTS,
  validateSplashConfig,
  delay,
} from './utils';
