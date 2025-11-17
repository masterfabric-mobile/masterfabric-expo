export interface BatteryState {
  batteryLevel: number; // 0-1
  isCharging: boolean;
  lowPowerMode: boolean | null; // null for Android (not available)
  lastUpdated: number; // timestamp
}

export interface BatteryHelperState {
  batteryState: BatteryState;
  isLoading: boolean;
  error: string | null;
}

