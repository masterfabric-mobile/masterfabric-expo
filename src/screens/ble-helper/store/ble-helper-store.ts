import { BleConnectionStatus, BleDevice, BleSubscription } from '@/src/shared/helpers/ble-helper';
import { create } from 'zustand';
import { BleCharacteristic, BleLogEntry, BleService } from '../models/ble-helper-models';

/**
 * BLE Helper Store Interface
 * 
 * Defines the state and actions for the BLE helper functionality.
 * Manages discovered devices, connection state, services, characteristics, and logs.
 */
interface BleHelperStore {
  // State properties
  discoveredDevices: BleDevice[];
  connectedDevice: BleDevice | null;
  connectionStatus: BleConnectionStatus;
  bluetoothState: string;
  isScanning: boolean;
  isInitialized: boolean;
  hasPermissions: boolean;
  services: BleService[];
  characteristics: BleCharacteristic[];
  logs: BleLogEntry[];
  subscriptions: Map<string, BleSubscription>;

  // Action methods
  setDiscoveredDevices: (devices: BleDevice[]) => void;
  addDiscoveredDevice: (device: BleDevice) => void;
  clearDiscoveredDevices: () => void;
  setConnectedDevice: (device: BleDevice | null) => void;
  setConnectionStatus: (status: BleConnectionStatus) => void;
  setBluetoothState: (state: string) => void;
  setIsScanning: (scanning: boolean) => void;
  setIsInitialized: (initialized: boolean) => void;
  setHasPermissions: (hasPermissions: boolean) => void;
  setServices: (services: BleService[]) => void;
  setCharacteristics: (characteristics: BleCharacteristic[]) => void;
  addLog: (log: Omit<BleLogEntry, 'id' | 'timestamp'>) => void;
  clearLogs: () => void;
  addSubscription: (key: string, subscription: BleSubscription) => void;
  removeSubscription: (key: string) => void;
  clearSubscriptions: () => void;
  reset: () => void;
}

const initialState = {
  discoveredDevices: [],
  connectedDevice: null,
  connectionStatus: BleConnectionStatus.Disconnected,
  bluetoothState: 'Unknown',
  isScanning: false,
  isInitialized: false,
  hasPermissions: false,
  services: [],
  characteristics: [],
  logs: [],
  subscriptions: new Map<string, BleSubscription>(),
};

/**
 * BLE Helper Store
 * 
 * A Zustand store that manages the state for the BLE Helper screen.
 * Provides centralized state management for:
 * - Discovered BLE devices
 * - Connection state and status
 * - Bluetooth adapter state
 * - Services and characteristics
 * - Operation logs
 * - Characteristic subscriptions
 * 
 * Features:
 * - Immutable state updates
 * - Type-safe actions
 * - Log management with timestamps
 * - Subscription tracking
 */
export const useBleHelperStore = create<BleHelperStore>((set, get) => ({
  ...initialState,

  // Action implementations
  setDiscoveredDevices: (devices) => set({ discoveredDevices: devices }),
  
  addDiscoveredDevice: (device) => {
    const currentDevices = get().discoveredDevices;
    // Find existing device index
    const existingIndex = currentDevices.findIndex((d) => d.id === device.id);
    
    if (existingIndex >= 0) {
      // Update existing device with latest RSSI and other info
      const updatedDevices = [...currentDevices];
      updatedDevices[existingIndex] = {
        ...updatedDevices[existingIndex],
        ...device,
        // Keep the better RSSI value (higher is better)
        rssi: device.rssi !== null && updatedDevices[existingIndex].rssi !== null
          ? Math.max(device.rssi, updatedDevices[existingIndex].rssi)
          : device.rssi || updatedDevices[existingIndex].rssi,
      };
      
      // Sort by RSSI (higher is better, nulls go to end)
      updatedDevices.sort((a, b) => {
        if (a.rssi === null && b.rssi === null) return 0;
        if (a.rssi === null) return 1;
        if (b.rssi === null) return -1;
        return b.rssi - a.rssi; // Descending order
      });
      
      set({ discoveredDevices: updatedDevices });
    } else {
      // Add new device and sort
      const newDevices = [...currentDevices, device];
      newDevices.sort((a, b) => {
        if (a.rssi === null && b.rssi === null) return 0;
        if (a.rssi === null) return 1;
        if (b.rssi === null) return -1;
        return b.rssi - a.rssi; // Descending order
      });
      set({ discoveredDevices: newDevices });
    }
  },
  
  clearDiscoveredDevices: () => set({ discoveredDevices: [] }),
  
  setConnectedDevice: (device) => set({ connectedDevice: device }),
  
  setConnectionStatus: (status) => set({ connectionStatus: status }),
  
  setBluetoothState: (state) => set({ bluetoothState: state }),
  
  setIsScanning: (scanning) => set({ isScanning: scanning }),
  
  setIsInitialized: (initialized) => set({ isInitialized: initialized }),
  
  setHasPermissions: (hasPermissions) => set({ hasPermissions }),
  
  setServices: (services) => set({ services }),
  
  setCharacteristics: (characteristics) => set({ characteristics }),
  
  addLog: (log) => {
    const newLog: BleLogEntry = {
      ...log,
      id: `log-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      timestamp: Date.now(),
    };
    set((state) => ({ logs: [...state.logs, newLog] }));
  },
  
  clearLogs: () => set({ logs: [] }),
  
  addSubscription: (key, subscription) => {
    const subscriptions = new Map(get().subscriptions);
    subscriptions.set(key, subscription);
    set({ subscriptions });
  },
  
  removeSubscription: (key) => {
    const subscriptions = new Map(get().subscriptions);
    const subscription = subscriptions.get(key);
    if (subscription) {
      subscription.remove();
      subscriptions.delete(key);
      set({ subscriptions });
    }
  },
  
  clearSubscriptions: () => {
    const subscriptions = get().subscriptions;
    subscriptions.forEach((subscription) => {
      subscription.remove();
    });
    set({ subscriptions: new Map() });
  },
  
  reset: () => {
    // Clean up subscriptions before reset
    const subscriptions = get().subscriptions;
    subscriptions.forEach((subscription) => {
      subscription.remove();
    });
    set({ ...initialState, subscriptions: new Map() });
  },
}));

