import * as Location from 'expo-location';
import { BleManager, Device } from 'react-native-ble-plx';

/**
 * Represents a discovered BLE device
 */
export interface BleDevice {
  id: string; // Platform-specific device identifier
  name: string | null;
  rssi: number | null; // Received Signal Strength Indicator
  serviceUUIDs: string[] | null;
  manufacturerData: string | null; // Base64 encoded string
}

/**
 * Enum for connection status
 */
export enum BleConnectionStatus {
  Connecting = 'connecting',
  Connected = 'connected',
  Disconnecting = 'disconnecting',
  Disconnected = 'disconnected',
  Failed = 'failed',
}

/**
 * Represents a characteristic's notification subscription
 */
export interface BleSubscription {
  remove: () => void; // Function to unsubscribe
}

/**
 * BLE Helper Class
 * 
 * Provides a simple and consistent API for Bluetooth Low Energy operations.
 * Abstracts the complexities of BLE communication using react-native-ble-plx.
 */
class BleHelper {
  private manager: BleManager | null = null;
  private connectionStateSubscription: any = null;
  private isInitialized = false;
  private connectedDevices: Map<string, Device> = new Map();

  /**
   * Initialize the BLE Manager and check Bluetooth state
   */
  async initialize(): Promise<void> {
    if (this.isInitialized && this.manager) {
      return;
    }

    try {
      this.manager = new BleManager();
      this.isInitialized = true;

      // Monitor Bluetooth state changes
      this.manager.onStateChange((state) => {
        if (state === 'PoweredOn') {
          console.log('Bluetooth is powered on');
        } else {
          console.log('Bluetooth state changed:', state);
        }
      });
    } catch (error) {
      console.error('Failed to initialize BLE Manager:', error);
      throw new Error(`Failed to initialize BLE: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  /**
   * Request necessary permissions (Bluetooth and Location)
   * Returns true if all permissions are granted
   */
  async requestPermissions(): Promise<boolean> {
    try {
      // Request location permission (required for BLE scanning on Android)
      const { status: locationStatus } = await Location.requestForegroundPermissionsAsync();
      
      if (locationStatus !== 'granted') {
        console.warn('Location permission not granted');
        return false;
      }

      // Check Bluetooth state
      if (!this.manager) {
        await this.initialize();
      }

      const state = await this.manager.state();
      if (state !== 'PoweredOn') {
        console.warn('Bluetooth is not powered on. Current state:', state);
        return false;
      }

      return true;
    } catch (error) {
      console.error('Failed to request permissions:', error);
      return false;
    }
  }

  /**
   * Start scanning for BLE devices
   * @param onDeviceFound - Callback invoked for each discovered device
   * @param serviceUUIDs - Optional array of service UUIDs to filter by
   */
  startDeviceScan(
    onDeviceFound: (device: BleDevice) => void,
    serviceUUIDs?: string[]
  ): void {
    if (!this.manager) {
      throw new Error('BLE Manager not initialized. Call initialize() first.');
    }

    try {
      this.manager.startDeviceScan(
        serviceUUIDs || null,
        { allowDuplicates: false },
        (error, device) => {
          if (error) {
            console.error('Scan error:', error);
            return;
          }

          if (device) {
            const bleDevice: BleDevice = {
              id: device.id,
              name: device.name,
              rssi: device.rssi,
              serviceUUIDs: device.serviceUUIDs || null,
              manufacturerData: device.manufacturerData ? device.manufacturerData.base64 : null,
            };
            onDeviceFound(bleDevice);
          }
        }
      );
    } catch (error) {
      console.error('Failed to start device scan:', error);
      throw new Error(`Failed to start scan: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  /**
   * Stop scanning for devices
   */
  stopDeviceScan(): void {
    if (!this.manager) {
      return;
    }

    try {
      this.manager.stopDeviceScan();
    } catch (error) {
      console.error('Failed to stop device scan:', error);
    }
  }

  /**
   * Connect to a BLE device by its ID
   */
  async connectToDevice(deviceId: string): Promise<void> {
    if (!this.manager) {
      throw new Error('BLE Manager not initialized. Call initialize() first.');
    }

    try {
      const device = await this.manager.connectToDevice(deviceId);
      await device.discoverAllServicesAndCharacteristics();
      // Store the connected device for later disconnection
      this.connectedDevices.set(deviceId, device);
    } catch (error) {
      console.error('Failed to connect to device:', error);
      throw new Error(`Failed to connect: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  /**
   * Disconnect from a BLE device
   */
  async disconnectFromDevice(deviceId: string): Promise<void> {
    if (!this.manager) {
      return;
    }

    try {
      // Try to get the device from our tracked connected devices
      let device = this.connectedDevices.get(deviceId);
      
      // If not found, try to get it from manager's devices list
      if (!device) {
        const devices = await this.manager.devices([deviceId]);
        device = devices.length > 0 ? devices[0] : null;
      }
      
      if (device) {
        await device.cancelConnection();
        // Remove from tracked devices
        this.connectedDevices.delete(deviceId);
      }
    } catch (error) {
      console.error('Failed to disconnect from device:', error);
      // Remove from tracked devices even if disconnection failed
      this.connectedDevices.delete(deviceId);
      throw new Error(`Failed to disconnect: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  /**
   * Subscribe to connection state changes for any device
   * @param callback - Callback invoked when connection state changes
   * @returns Subscription object with remove method
   */
  onConnectionStateChange(
    callback: (status: BleConnectionStatus, deviceId: string) => void
  ): BleSubscription {
    if (!this.manager) {
      throw new Error('BLE Manager not initialized. Call initialize() first.');
    }

    const subscription = this.manager.onStateChange((state) => {
      // Map BleManager state to our connection status
      let status: BleConnectionStatus;
      switch (state) {
        case 'PoweredOn':
          status = BleConnectionStatus.Connected;
          break;
        case 'PoweredOff':
          status = BleConnectionStatus.Disconnected;
          break;
        case 'Unauthorized':
        case 'Unsupported':
          status = BleConnectionStatus.Failed;
          break;
        default:
          status = BleConnectionStatus.Disconnected;
      }
      callback(status, '');
    });

    return {
      remove: () => {
        subscription.remove();
      },
    };
  }

  /**
   * Discover all services and characteristics for a connected device
   * This is a necessary step before reading/writing characteristics
   */
  async discoverServicesAndCharacteristics(deviceId: string): Promise<void> {
    if (!this.manager) {
      throw new Error('BLE Manager not initialized. Call initialize() first.');
    }

    try {
      // Try to get the device from our tracked connected devices
      let device = this.connectedDevices.get(deviceId);
      
      // If not found, try to get it from manager's devices list
      if (!device) {
        const devices = await this.manager.devices([deviceId]);
        device = devices.length > 0 ? devices[0] : null;
      }
      
      if (!device) {
        throw new Error('Device not found');
      }
      await device.discoverAllServicesAndCharacteristics();
    } catch (error) {
      console.error('Failed to discover services and characteristics:', error);
      throw new Error(`Failed to discover: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  /**
   * Read the value of a characteristic
   * @param deviceId - Device identifier
   * @param serviceUUID - Service UUID
   * @param characteristicUUID - Characteristic UUID
   * @returns Base64 encoded string value
   */
  async readCharacteristic(
    deviceId: string,
    serviceUUID: string,
    characteristicUUID: string
  ): Promise<string> {
    if (!this.manager) {
      throw new Error('BLE Manager not initialized. Call initialize() first.');
    }

    try {
      // Try to get the device from our tracked connected devices
      let device = this.connectedDevices.get(deviceId);
      
      // If not found, try to get it from manager's devices list
      if (!device) {
        const devices = await this.manager.devices([deviceId]);
        device = devices.length > 0 ? devices[0] : null;
      }
      
      if (!device) {
        throw new Error('Device not found');
      }

      const characteristic = await device.readCharacteristicForService(
        serviceUUID,
        characteristicUUID
      );

      return characteristic.value || '';
    } catch (error) {
      console.error('Failed to read characteristic:', error);
      throw new Error(`Failed to read: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  /**
   * Write a value to a characteristic
   * @param deviceId - Device identifier
   * @param serviceUUID - Service UUID
   * @param characteristicUUID - Characteristic UUID
   * @param valueBase64 - Base64 encoded value to write
   */
  async writeCharacteristic(
    deviceId: string,
    serviceUUID: string,
    characteristicUUID: string,
    valueBase64: string
  ): Promise<void> {
    if (!this.manager) {
      throw new Error('BLE Manager not initialized. Call initialize() first.');
    }

    try {
      // Try to get the device from our tracked connected devices
      let device = this.connectedDevices.get(deviceId);
      
      // If not found, try to get it from manager's devices list
      if (!device) {
        const devices = await this.manager.devices([deviceId]);
        device = devices.length > 0 ? devices[0] : null;
      }
      
      if (!device) {
        throw new Error('Device not found');
      }

      await device.writeCharacteristicWithResponseForService(
        serviceUUID,
        characteristicUUID,
        valueBase64
      );
    } catch (error) {
      console.error('Failed to write characteristic:', error);
      throw new Error(`Failed to write: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  /**
   * Subscribe to notifications from a characteristic
   * @param deviceId - Device identifier
   * @param serviceUUID - Service UUID
   * @param characteristicUUID - Characteristic UUID
   * @param onData - Callback invoked when data is received (receives Base64 encoded data)
   * @returns Subscription object with remove method
   */
  async subscribeToCharacteristic(
    deviceId: string,
    serviceUUID: string,
    characteristicUUID: string,
    onData: (data: string) => void
  ): Promise<BleSubscription> {
    if (!this.manager) {
      throw new Error('BLE Manager not initialized. Call initialize() first.');
    }

    try {
      // Try to get the device from our tracked connected devices
      let device = this.connectedDevices.get(deviceId);
      
      // If not found, try to get it from manager's devices list
      if (!device) {
        const devices = await this.manager.devices([deviceId]);
        device = devices.length > 0 ? devices[0] : null;
      }
      
      if (!device) {
        throw new Error('Device not found');
      }

      const subscription = device.monitorCharacteristicForService(
        serviceUUID,
        characteristicUUID,
        (error, characteristic) => {
          if (error) {
            console.error('Characteristic monitoring error:', error);
            return;
          }

          if (characteristic?.value) {
            onData(characteristic.value);
          }
        }
      );

      return {
        remove: () => {
          subscription.remove();
        },
      };
    } catch (error) {
      console.error('Failed to subscribe to characteristic:', error);
      throw new Error(`Failed to subscribe: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  /**
   * Get the current Bluetooth state
   */
  async getBluetoothState(): Promise<string> {
    if (!this.manager) {
      await this.initialize();
    }

    if (!this.manager) {
      return 'Unknown';
    }

    return this.manager.state();
  }

  /**
   * Cleanup and destroy the BLE Manager
   */
  destroy(): void {
    if (this.connectionStateSubscription) {
      this.connectionStateSubscription.remove();
      this.connectionStateSubscription = null;
    }

    // Disconnect all tracked devices
    this.connectedDevices.forEach(async (device, deviceId) => {
      try {
        await device.cancelConnection();
      } catch (error) {
        console.error(`Failed to disconnect device ${deviceId}:`, error);
      }
    });
    this.connectedDevices.clear();

    if (this.manager) {
      this.manager.destroy();
      this.manager = null;
    }

    this.isInitialized = false;
  }
}

// Export singleton instance
export const bleHelper = new BleHelper();

