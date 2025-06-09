export interface SplashStep {
  id: string;
  duration: number;
}

export interface SplashConfig {
  minimumDisplayTime: number;
  steps: SplashStep[];
}