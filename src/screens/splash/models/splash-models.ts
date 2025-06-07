export interface SplashStep {
  id: string;
  name: string;
  description: string;
  duration: number;
}

export interface SplashConfig {
  minimumDisplayTime: number;
  steps: SplashStep[];
}