import { BleConnectionStatus, BleDevice, BleSubscription } from '@/src/shared/helpers/ble-helper';

/**
 * BLE Service representation
 */
export interface BleService {
  uuid: string;
  isPrimary: boolean;
  characteristics?: BleCharacteristic[];
}

/**
 * BLE Characteristic representation
 */
export interface BleCharacteristic {
  uuid: string;
  serviceUUID: string;
  properties: string[];
  value?: string; // Base64 encoded
}

/**
 * Log entry for BLE operations
 */
export interface BleLogEntry {
  id: string;
  timestamp: number;
  message: string;
  type: 'info' | 'success' | 'error' | 'warning';
}

/**
 * BLE Helper State interface
 */
export interface BleHelperState {
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
  subscriptions: Map<string, BleSubscription>; // Key: deviceId-serviceUUID-characteristicUUID
}

/**
 * Re-export types from ble-helper for convenience
 */
export type { BleDevice, BleConnectionStatus, BleSubscription };

