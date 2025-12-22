import type { NetworkInfo, SpeedTestResult } from 'masterfabric-expo-core';

export interface NetworkHelperState {
  networkInfo: NetworkInfo | null;
  isMonitoring: boolean;
  isLoading: boolean;
  lastCheckTime: Date | null;
  monitoringInterval: number; // milliseconds
}

export interface NetworkInfoCard {
  title: string;
  value: string | number | null;
  icon: string;
  color: string;
  unit?: string;
}

