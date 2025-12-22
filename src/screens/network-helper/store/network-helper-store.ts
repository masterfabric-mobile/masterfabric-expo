import { create } from 'zustand';
import type { NetworkHelperState } from '../models/network-helper-models';

interface NetworkHelperStore extends NetworkHelperState {
  setNetworkInfo: (info: NetworkHelperState['networkInfo']) => void;
  setIsMonitoring: (isMonitoring: boolean) => void;
  setIsLoading: (isLoading: boolean) => void;
  setLastCheckTime: (time: Date | null) => void;
  setMonitoringInterval: (interval: number) => void;
  reset: () => void;
}

const initialState: NetworkHelperState = {
  networkInfo: null,
  isMonitoring: false,
  isLoading: false,
  lastCheckTime: null,
  monitoringInterval: 30000, // 30 seconds default
};

export const useNetworkHelperStore = create<NetworkHelperStore>((set) => ({
  ...initialState,
  setNetworkInfo: (info) => set({ networkInfo: info }),
  setIsMonitoring: (isMonitoring) => set({ isMonitoring }),
  setIsLoading: (isLoading) => set({ isLoading }),
  setLastCheckTime: (time) => set({ lastCheckTime: time }),
  setMonitoringInterval: (interval) => set({ monitoringInterval: interval }),
  reset: () => set(initialState),
}));

