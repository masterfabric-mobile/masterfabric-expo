import { useCallback, useEffect } from 'react';
import { bleHelper, BleConnectionStatus, BleDevice } from '@/src/shared/helpers/ble-helper';
import { useBleHelperStore } from '../store/ble-helper-store';
import { BleService, BleCharacteristic } from '../models/ble-helper-models';

/**
 * useBleHelperViewModel Hook
 * 
 * A view model hook that manages the state and business logic for the BLE Helper screen.
 * This hook coordinates between the UI components and the BLE helper, providing:
 * - BLE initialization and permission management
 * - Device scanning and discovery
 * - Connection management
 * - Service and characteristic discovery
 * - Characteristic read/write/subscribe operations
 * - Logging and error handling
 * 
 * Features:
 * - Automatic initialization on mount
 * - Connection state monitoring
 * - Device discovery handling
 * - Comprehensive error logging
 */
export function useBleHelperViewModel() {
  const {
    discoveredDevices,
    connectedDevice,
    connectionStatus,
    bluetoothState,
    isScanning,
    isInitialized,
    hasPermissions,
    services,
    characteristics,
    logs,
    setDiscoveredDevices,
    addDiscoveredDevice,
    clearDiscoveredDevices,
    setConnectedDevice,
    setConnectionStatus,
    setBluetoothState,
    setIsScanning,
    setIsInitialized,
    setHasPermissions,
    setServices,
    setCharacteristics,
    addLog,
    clearLogs,
    addSubscription,
    removeSubscription,
    clearSubscriptions,
    reset,
  } = useBleHelperStore();

  /**
   * Initialize BLE helper and check Bluetooth state
   */
  const initialize = useCallback(async () => {
    try {
      await bleHelper.initialize();
      const state = await bleHelper.getBluetoothState();
      setBluetoothState(state);
      setIsInitialized(true);
      addLog({
        message: `BLE initialized. Bluetooth state: ${state}`,
        type: 'success',
      });
    } catch (error) {
      setIsInitialized(false);
      addLog({
        message: `Failed to initialize BLE: ${error instanceof Error ? error.message : 'Unknown error'}`,
        type: 'error',
      });
    }
  }, [setBluetoothState, setIsInitialized, addLog]);

  /**
   * Request Bluetooth and Location permissions
   */
  const requestPermissions = useCallback(async () => {
    try {
      const granted = await bleHelper.requestPermissions();
      setHasPermissions(granted);
      if (granted) {
        addLog({
          message: 'Permissions granted',
          type: 'success',
        });
      } else {
        addLog({
          message: 'Permissions denied',
          type: 'warning',
        });
      }
      return granted;
    } catch (error) {
      setHasPermissions(false);
      addLog({
        message: `Failed to request permissions: ${error instanceof Error ? error.message : 'Unknown error'}`,
        type: 'error',
      });
      return false;
    }
  }, [setHasPermissions, addLog]);

  /**
   * Start scanning for BLE devices
   */
  const startScan = useCallback(
    (serviceUUIDs?: string[]) => {
      if (isScanning) {
        return;
      }

      try {
        clearDiscoveredDevices();
        setIsScanning(true);
        addLog({
          message: `Starting scan${serviceUUIDs ? ` for services: ${serviceUUIDs.join(', ')}` : ''}`,
          type: 'info',
        });

        bleHelper.startDeviceScan(
          (device: BleDevice) => {
            addDiscoveredDevice(device);
            addLog({
              message: `Device found: ${device.name || device.id}`,
              type: 'info',
            });
          },
          serviceUUIDs
        );
      } catch (error) {
        setIsScanning(false);
        addLog({
          message: `Failed to start scan: ${error instanceof Error ? error.message : 'Unknown error'}`,
          type: 'error',
        });
      }
    },
    [isScanning, clearDiscoveredDevices, setIsScanning, addDiscoveredDevice, addLog]
  );

  /**
   * Stop scanning for devices
   */
  const stopScan = useCallback(() => {
    try {
      bleHelper.stopDeviceScan();
      setIsScanning(false);
      addLog({
        message: 'Scan stopped',
        type: 'info',
      });
    } catch (error) {
      addLog({
        message: `Failed to stop scan: ${error instanceof Error ? error.message : 'Unknown error'}`,
        type: 'error',
      });
    }
  }, [setIsScanning, addLog]);

  /**
   * Connect to a BLE device
   */
  const connect = useCallback(
    async (deviceId: string) => {
      try {
        setConnectionStatus(BleConnectionStatus.Connecting);
        addLog({
          message: `Connecting to device: ${deviceId}`,
          type: 'info',
        });

        const device = discoveredDevices.find((d) => d.id === deviceId);
        if (!device) {
          throw new Error('Device not found in discovered devices');
        }

        await bleHelper.connectToDevice(deviceId);
        setConnectedDevice(device);
        setConnectionStatus(BleConnectionStatus.Connected);
        addLog({
          message: `Connected to device: ${device.name || deviceId}`,
          type: 'success',
        });
      } catch (error) {
        setConnectionStatus(BleConnectionStatus.Failed);
        addLog({
          message: `Failed to connect: ${error instanceof Error ? error.message : 'Unknown error'}`,
          type: 'error',
        });
      }
    },
    [discoveredDevices, setConnectionStatus, setConnectedDevice, addLog]
  );

  /**
   * Disconnect from the connected device
   */
  const disconnect = useCallback(async () => {
    if (!connectedDevice) {
      return;
    }

    try {
      setConnectionStatus(BleConnectionStatus.Disconnecting);
      addLog({
        message: `Disconnecting from device: ${connectedDevice.name || connectedDevice.id}`,
        type: 'info',
      });

      await bleHelper.disconnectFromDevice(connectedDevice.id);
      clearSubscriptions();
      setConnectedDevice(null);
      setConnectionStatus(BleConnectionStatus.Disconnected);
      setServices([]);
      setCharacteristics([]);
      addLog({
        message: 'Disconnected from device',
        type: 'info',
      });
    } catch (error) {
      setConnectionStatus(BleConnectionStatus.Failed);
      addLog({
        message: `Failed to disconnect: ${error instanceof Error ? error.message : 'Unknown error'}`,
        type: 'error',
      });
    }
  }, [connectedDevice, setConnectionStatus, setConnectedDevice, setServices, setCharacteristics, clearSubscriptions, addLog]);

  /**
   * Discover services and characteristics for the connected device
   */
  const discoverServices = useCallback(async () => {
    if (!connectedDevice) {
      addLog({
        message: 'No device connected',
        type: 'warning',
      });
      return;
    }

    try {
      addLog({
        message: 'Discovering services and characteristics...',
        type: 'info',
      });

      await bleHelper.discoverServicesAndCharacteristics(connectedDevice.id);

      // Note: react-native-ble-plx doesn't directly expose services/characteristics list
      // In a real implementation, you would need to query them individually
      // For now, we'll log success
      addLog({
        message: 'Services and characteristics discovered',
        type: 'success',
      });
    } catch (error) {
      addLog({
        message: `Failed to discover services: ${error instanceof Error ? error.message : 'Unknown error'}`,
        type: 'error',
      });
    }
  }, [connectedDevice, addLog]);

  /**
   * Read a characteristic value
   */
  const readCharacteristic = useCallback(
    async (serviceUUID: string, characteristicUUID: string) => {
      if (!connectedDevice) {
        addLog({
          message: 'No device connected',
          type: 'warning',
        });
        return;
      }

      if (!serviceUUID.trim() || !characteristicUUID.trim()) {
        addLog({
          message: 'Please enter service UUID and characteristic UUID',
          type: 'warning',
        });
        return;
      }

      try {
        addLog({
          message: `Reading characteristic: ${characteristicUUID}`,
          type: 'info',
        });

        const value = await bleHelper.readCharacteristic(
          connectedDevice.id,
          serviceUUID,
          characteristicUUID
        );

        addLog({
          message: `Characteristic value: ${value}`,
          type: 'success',
        });

        return value;
      } catch (error) {
        addLog({
          message: `Failed to read characteristic: ${error instanceof Error ? error.message : 'Unknown error'}`,
          type: 'error',
        });
        throw error;
      }
    },
    [connectedDevice, addLog]
  );

  /**
   * Write a value to a characteristic
   */
  const writeCharacteristic = useCallback(
    async (serviceUUID: string, characteristicUUID: string, valueBase64: string) => {
      if (!connectedDevice) {
        addLog({
          message: 'No device connected',
          type: 'warning',
        });
        return;
      }

      if (!serviceUUID.trim() || !characteristicUUID.trim() || !valueBase64.trim()) {
        addLog({
          message: 'Please enter service UUID, characteristic UUID, and value',
          type: 'warning',
        });
        return;
      }

      try {
        addLog({
          message: `Writing to characteristic: ${characteristicUUID}`,
          type: 'info',
        });

        await bleHelper.writeCharacteristic(
          connectedDevice.id,
          serviceUUID,
          characteristicUUID,
          valueBase64
        );

        addLog({
          message: `Successfully wrote to characteristic`,
          type: 'success',
        });
      } catch (error) {
        addLog({
          message: `Failed to write characteristic: ${error instanceof Error ? error.message : 'Unknown error'}`,
          type: 'error',
        });
        throw error;
      }
    },
    [connectedDevice, addLog]
  );

  /**
   * Subscribe to characteristic notifications
   */
  const subscribeToCharacteristic = useCallback(
    async (serviceUUID: string, characteristicUUID: string) => {
      if (!connectedDevice) {
        addLog({
          message: 'No device connected',
          type: 'warning',
        });
        return;
      }

      if (!serviceUUID.trim() || !characteristicUUID.trim()) {
        addLog({
          message: 'Please enter service UUID and characteristic UUID',
          type: 'warning',
        });
        return;
      }

      const subscriptionKey = `${connectedDevice.id}-${serviceUUID.trim()}-${characteristicUUID.trim()}`;

      // Check if already subscribed
      const currentSubscriptions = useBleHelperStore.getState().subscriptions;
      if (currentSubscriptions.has(subscriptionKey)) {
        addLog({
          message: 'Already subscribed to this characteristic',
          type: 'warning',
        });
        return;
      }

      try {
        addLog({
          message: `Subscribing to characteristic: ${characteristicUUID}`,
          type: 'info',
        });

        const subscription = await bleHelper.subscribeToCharacteristic(
          connectedDevice.id,
          serviceUUID,
          characteristicUUID,
          (data: string) => {
            addLog({
              message: `Received notification: ${data}`,
              type: 'success',
            });
          }
        );

        addSubscription(subscriptionKey, subscription);
        addLog({
          message: 'Subscribed to characteristic notifications',
          type: 'success',
        });
      } catch (error) {
        addLog({
          message: `Failed to subscribe: ${error instanceof Error ? error.message : 'Unknown error'}`,
          type: 'error',
        });
        throw error;
      }
    },
    [connectedDevice, addSubscription, addLog]
  );

  /**
   * Unsubscribe from characteristic notifications
   */
  const unsubscribeFromCharacteristic = useCallback(
    (serviceUUID: string, characteristicUUID: string) => {
      if (!connectedDevice) {
        return;
      }

      if (!serviceUUID.trim() || !characteristicUUID.trim()) {
        addLog({
          message: 'Please enter service UUID and characteristic UUID',
          type: 'warning',
        });
        return;
      }

      const subscriptionKey = `${connectedDevice.id}-${serviceUUID.trim()}-${characteristicUUID.trim()}`;
      removeSubscription(subscriptionKey);
      addLog({
        message: 'Unsubscribed from characteristic',
        type: 'info',
      });
    },
    [connectedDevice, removeSubscription, addLog]
  );

  /**
   * Clear all logs
   */
  const clearLogsHandler = useCallback(() => {
    clearLogs();
  }, [clearLogs]);

  // Initialize on mount
  useEffect(() => {
    initialize();

    // Set up connection state monitoring
    const subscription = bleHelper.onConnectionStateChange((status, deviceId) => {
      setConnectionStatus(status);
      if (status === BleConnectionStatus.Disconnected && connectedDevice) {
        setConnectedDevice(null);
        setServices([]);
        setCharacteristics([]);
        clearSubscriptions();
      }
    });

    return () => {
      subscription.remove();
      stopScan();
      if (connectedDevice) {
        disconnect();
      }
      clearSubscriptions();
    };
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  return {
    // State
    discoveredDevices,
    connectedDevice,
    connectionStatus,
    bluetoothState,
    isScanning,
    isInitialized,
    hasPermissions,
    services,
    characteristics,
    logs,

    // Actions
    initialize,
    requestPermissions,
    startScan,
    stopScan,
    connect,
    disconnect,
    discoverServices,
    readCharacteristic,
    writeCharacteristic,
    subscribeToCharacteristic,
    unsubscribeFromCharacteristic,
    clearLogs: clearLogsHandler,
    reset,
  };
}

