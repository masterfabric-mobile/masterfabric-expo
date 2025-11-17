import * as Battery from 'expo-battery';
import { create } from 'zustand';
import { BatteryState as BatteryStateModel } from '../types/battery';

interface BatteryHelperStore {
  batteryState: BatteryStateModel;
  isLoading: boolean;
  error: string | null;
  updateBatteryState: (state: Partial<BatteryStateModel>) => void;
  refreshBatteryInfo: () => Promise<void>;
  updateBatteryLevel: (level: number) => void;
  updateBatteryChargingState: (isCharging: boolean) => void;
  updateLowPowerMode: (lowPowerMode: boolean) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
}

const initialBatteryState: BatteryStateModel = {
  batteryLevel: 0,
  isCharging: false,
  lowPowerMode: null,
  lastUpdated: Date.now(),
};

export const useBatteryHelperStore = create<BatteryHelperStore>((set) => ({
  batteryState: initialBatteryState,
  isLoading: false,
  error: null,
  updateBatteryState: (state) =>
    set((current) => ({
      batteryState: {
        ...current.batteryState,
        ...state,
        lastUpdated: Date.now(),
      },
    })),
  refreshBatteryInfo: async () => {
    set({ isLoading: true, error: null });

    try {
      // Get power state which includes battery level, charging status, and low power mode
      const powerState = await Battery.getPowerStateAsync();
      
      // Extract battery level (0-1, or -1 if unknown)
      const batteryLevel = powerState.batteryLevel >= 0 ? powerState.batteryLevel : 0;
      
      // Determine if charging based on battery state
      // BatteryState.CHARGING = 2, BatteryState.FULL = 3
      const isCharging = powerState.batteryState === Battery.BatteryState.CHARGING || 
                         powerState.batteryState === Battery.BatteryState.FULL;
      
      // Get low power mode status (boolean, but we store as boolean | null)
      const lowPowerMode: boolean | null = powerState.lowPowerMode ?? null;

      set({
        batteryState: {
          batteryLevel,
          isCharging,
          lowPowerMode,
          lastUpdated: Date.now(),
        },
        isLoading: false,
        error: null,
      });
    } catch (error) {
      set({
        isLoading: false,
        error: error instanceof Error 
          ? error.message 
          : 'Failed to get battery info. Battery API may not be available in this environment.',
      });
    }
  },
  updateBatteryLevel: (level) =>
    set((current) => ({
      batteryState: {
        ...current.batteryState,
        batteryLevel: level >= 0 ? level : 0,
        lastUpdated: Date.now(),
      },
    })),
  updateBatteryChargingState: (isCharging) =>
    set((current) => ({
      batteryState: {
        ...current.batteryState,
        isCharging,
        lastUpdated: Date.now(),
      },
    })),
  updateLowPowerMode: (lowPowerMode) =>
    set((current) => ({
      batteryState: {
        ...current.batteryState,
        lowPowerMode,
        lastUpdated: Date.now(),
      },
    })),
  setLoading: (loading) => set({ isLoading: loading }),
  setError: (error) => set({ error }),
}));

