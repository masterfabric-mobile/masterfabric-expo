# MasterFabric Expo: BLE Helper Analysis & Design

This document outlines the analysis and proposed design for a new `ble-helper` module. Its purpose is to abstract the complexities of Bluetooth Low Energy (BLE) communication, providing a simple and consistent API for the rest of the application.

## 1. Overview

The `ble-helper` will be responsible for the entire BLE workflow:
- Managing device permissions.
- Scanning for nearby peripheral devices.
- Connecting to, and disconnecting from, devices.
- Discovering services and characteristics.
- Reading, writing, and subscribing to characteristic values.
- Managing and reporting connection state.

## 2. Recommended Library: `react-native-ble-plx`

After reviewing available options, `react-native-ble-plx` is the recommended library.

- **Why:** It is a mature, well-maintained library with strong community support and a rich feature set. Most importantly, it officially supports Expo through a [config plugin](https://github.com/dotintent/react-native-ble-plx/tree/master/expo-plugin), which simplifies integration.
- **Features:** It supports scanning, connection management, service discovery, characteristic communication, and background modes.

### Expo Compatibility Explained: Expo Go vs. Development Builds

The `react-native-ble-plx` library involves custom native code, which requires a special setup in the Expo ecosystem. It's important to understand the distinction between the standard **Expo Go** app and an **Expo Development Build**.

- **Expo Go:** This is the standard client from the App Store or Play Store. It's a pre-built application that includes a large number of common native libraries from the Expo SDK. However, you **cannot** add new custom native modules to it. Since `react-native-ble-plx` is not included in Expo Go's pre-built runtime, it will not work in that environment.

- **Expo Development Build (via EAS):** This is a **custom version of your app** that you build yourself using Expo Application Services (EAS). The key difference is that it bundles only the native dependencies your project *actually uses*. This is the standard, recommended workflow for any Expo project that needs to go beyond the limits of Expo Go.

#### How it Works:

1.  **Config Plugin:** The `react-native-ble-plx` library provides an **Expo Config Plugin**. This plugin automatically handles the native project configuration for you. When you run `npx expo prebuild` or `eas build`, it will modify the native files (like Android's `build.gradle` and iOS's `Info.plist`) to correctly link the library and add necessary permissions.
2.  **EAS Build:** You use the `eas build` command to create a development build of your app. This build process compiles the native code from `react-native-ble-plx` directly into your application.
3.  **Result:** The result is an app that looks and feels like Expo Go but is tailored specifically for your project, with full support for the BLE helper.

In summary, while this feature is not supported in the basic Expo Go client, it is **fully supported by Expo** through the standard and modern workflow of custom development builds. This approach gives you the power of custom native code without ever having to leave the Expo ecosystem or manage native project files manually.

## 3. Core Interfaces

To ensure type safety and a clear API, the helper will use the following interfaces.

```typescript
// Represents a discovered BLE device
export interface BleDevice {
  id: string; // Platform-specific device identifier
  name: string | null;
  rssi: number | null; // Received Signal Strength Indicator
  serviceUUIDs: string[] | null;
  manufacturerData: string | null; // Base64 encoded string
}

// Enum for connection status
export enum BleConnectionStatus {
  Connecting = 'connecting',
  Connected = 'connected',
  Disconnecting = 'disconnecting',
  Disconnected = 'disconnected',
  Failed = 'failed',
}

// Represents a characteristic's notification subscription
export interface BleSubscription {
  remove: () => void; // Function to unsubscribe
}
```

## 4. Proposed Helper API

The `ble-helper` will be a class-based or object-based module that manages the underlying `BleManager` instance from `react-native-ble-plx`.

### Initialization & Permissions
- `initialize(): Promise<void>`: Initializes the `BleManager` and checks Bluetooth state.
- `requestPermissions(): Promise<boolean>`: Prompts the user for necessary permissions (Bluetooth and Location). Returns `true` if granted.

### Scanning
- `startDeviceScan(onDeviceFound: (device: BleDevice) => void, serviceUUIDs?: string[]): void`: Starts scanning for devices. The callback is invoked for each discovered device. Can filter by service UUIDs.
- `stopDeviceScan(): void`: Stops the device scan.

### Connection Management
- `connectToDevice(deviceId: string): Promise<void>`: Connects to a device by its ID.
- `disconnectFromDevice(deviceId: string): Promise<void>`: Disconnects from a device.
- `onConnectionStateChange(callback: (status: BleConnectionStatus, deviceId: string) => void): BleSubscription`: Subscribes to connection state changes for any device.

### Device Interaction
- `discoverServicesAndCharacteristics(deviceId: string): Promise<void>`: Discovers all services and characteristics for a connected device. This is a necessary step before reading/writing.
- `readCharacteristic(deviceId: string, serviceUUID: string, characteristicUUID: string): Promise<string>`: Reads the value of a characteristic. The value is returned as a Base64 encoded string.
- `writeCharacteristic(deviceId: string, serviceUUID: string, characteristicUUID: string, valueBase64: string): Promise<void>`: Writes a Base64 encoded value to a characteristic.
- `subscribeToCharacteristic(deviceId: string, serviceUUID: string, characteristicUUID: string, onData: (data: string) => void): Promise<BleSubscription>`: Subscribes to notifications from a characteristic. The `onData` callback receives Base64 encoded data.

## 5. State Management

Managing BLE state (e.g., list of discovered devices, connection status) is crucial. A centralized approach is recommended. We can create a custom hook or use a state management library like Zustand.

**Proposal: `useBleStore` (with Zustand)**
A Zustand store can hold the BLE state, making it accessible to any component in the app.

```typescript
// Example store structure
interface BleState {
  discoveredDevices: BleDevice[];
  connectedDevice: BleDevice | null;
  connectionStatus: BleConnectionStatus;
  // Actions to interact with the helper
  startScan: () => void;
  connect: (deviceId: string) => void;
  // ...
}
```
This approach separates the low-level helper logic from the application's state management.

## 6. Error Handling

The helper will use `try...catch` blocks for all async operations. Errors from `react-native-ble-plx` will be caught, logged, and re-thrown as custom, more descriptive errors to be handled by the UI.

## 7. Integration

1.  A new file, `src/shared/helpers/ble-helper.ts`, will be created.
2.  The `react-native-ble-plx` and its Expo plugin will be added as dependencies.
3.  The `ble-helper`'s exports will be added to `src/shared/helpers/index.ts`.
4.  The necessary iOS (`NSBluetoothAlwaysUsageDescription`) and Android (`BLUETOOTH_SCAN`, `BLUETOOTH_CONNECT`, etc.) permissions will be added to the project configuration.

This design provides a robust and scalable foundation for integrating BLE functionality into the MasterFabric Expo application.

## 8. Developer Interface Screen

To facilitate testing and provide a live demonstration of the `ble-helper`, a new developer-facing screen will be created. This screen will serve as a control panel for all BLE operations.

### Implementation Plan

1.  **Create a new screen component** at `src/screens/ble-helper/index.tsx`. This component will contain the UI and logic for the developer interface.
2.  **Create a new route file** at `app/ble-helper.tsx` that simply renders the screen component, following the existing project pattern:
    ```typescript
    import { BleHelperScreen } from '@/src/screens/ble-helper';

    export default function BleHelperPage() {
      return <BleHelperScreen />;
    }
    ```
3.  **Add the screen to the navigation.** A link to the "BLE Helper" screen will be added to the main documentation screen (`src/screens/documentation/index.tsx`) so it is easily accessible to developers.

### UI and Functionality

The `BleHelperScreen` will use the proposed `useBleStore` to display live data and trigger actions. It will feature:

- **Status Section:** Displays the current Bluetooth adapter state (e.g., "PoweredOn", "PoweredOff") and the current connection status.
- **Permissions Button:** A button to call `requestPermissions()` from the helper.
- **Scan Controls:**
    - A "Start Scan" button to initiate device scanning.
    - A "Stop Scan" button to halt the scan.
- **Discovered Devices List:** A list of `BleDevice` items discovered during the scan. Each item will be pressable to initiate a connection.
- **Connected Device View:** Once connected, this section will show details of the connected device, including its services and characteristics. Buttons will be available to:
    - "Disconnect".
    - "Read" a characteristic's value.
    - "Write" a value to a characteristic.
    - "Subscribe/Unsubscribe" to a characteristic's notifications.
- **Log View:** A simple, scrollable text area to display logs of events, data received, and errors.