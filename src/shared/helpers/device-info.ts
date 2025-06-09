import Constants from 'expo-constants';
import * as Device from 'expo-device';
import { Dimensions, Platform } from 'react-native';

export interface DeviceInfo {
  // Basic device information
  platform: 'ios' | 'android' | 'web';
  deviceName: string | null;
  deviceType: string | null;
  brand: string | null;
  manufacturer: string | null;
  modelName: string | null;
  modelId: string | null;
  
  // System information
  osName: string;
  osVersion: string | null;
  osBuildId: string | null;
  platformApiLevel: number | null;
  
  // App information
  appName: string;
  appVersion: string;
  appBuildVersion: string;
  expoVersion: string;
  
  // Hardware information
  totalMemory: number | null;
  supportedCpuArchitectures: string[] | null;
  
  // Screen information
  screenWidth: number;
  screenHeight: number;
  screenScale: number;
  fontScale: number;
  
  // Network and connectivity
  isDevice: boolean;
  isRootedExperimentalAsync?: boolean;
  
  // Additional metadata
  sessionId: string;
  timestamp: string;
}

export interface DeviceInfoOptions {
  includeHardwareInfo?: boolean;
  includeScreenInfo?: boolean;
  includeNetworkInfo?: boolean;
  generateSessionId?: boolean;
}

/**
 * Get comprehensive device information
 */
export async function getDeviceInfo(options: DeviceInfoOptions = {}): Promise<DeviceInfo> {
  const {
    includeHardwareInfo = true,
    includeScreenInfo = true,
    includeNetworkInfo = true,
    generateSessionId = true,
  } = options;

  const screen = Dimensions.get('screen');
  const window = Dimensions.get('window');

  let totalMemory: number | null = null;
  let supportedCpuArchitectures: string[] | null = null;
  let isRootedExperimentalAsync: boolean | undefined;

  // Get hardware info if requested
  if (includeHardwareInfo) {
    try {
      // totalMemory = await Device.getTotalMemoryAsync();
      // supportedCpuArchitectures = await Device.getSupportedCpuArchitecturesAsync();
      totalMemory = null; // Temporarily disabled
      supportedCpuArchitectures = null; // Temporarily disabled
    } catch (error) {
      console.warn('Failed to get hardware info:', error);
    }
  }

  // Get security info if requested
  if (includeNetworkInfo && Platform.OS === 'android') {
    try {
      // isRootedExperimentalAsync = await Device.isRootedExperimentalAsync();
      isRootedExperimentalAsync = undefined; // Temporarily disabled
    } catch (error) {
      console.warn('Failed to get rooting info:', error);
    }
  }

  const deviceInfo: DeviceInfo = {
    // Basic device information
    platform: Platform.OS as 'ios' | 'android' | 'web',
    deviceName: Device.deviceName,
    deviceType: Device.deviceType,
    brand: Device.brand,
    manufacturer: Device.manufacturer,
    modelName: Device.modelName,
    modelId: Device.modelId,
    
    // System information
    osName: Device.osName || Platform.OS,
    osVersion: Device.osVersion,
    osBuildId: Device.osBuildId,
    platformApiLevel: Device.platformApiLevel,
    
    // App information
    appName: Constants.expoConfig?.name || 'MasterFabric',
    appVersion: Constants.expoConfig?.version || '1.0.0',
    appBuildVersion: Constants.expoConfig?.ios?.buildNumber || Constants.expoConfig?.android?.versionCode?.toString() || '1',
    expoVersion: Constants.expoVersion || 'unknown',
    
    // Hardware information
    totalMemory: includeHardwareInfo ? totalMemory : null,
    supportedCpuArchitectures: includeHardwareInfo ? supportedCpuArchitectures : null,
    
    // Screen information
    screenWidth: includeScreenInfo ? screen.width : 0,
    screenHeight: includeScreenInfo ? screen.height : 0,
    screenScale: includeScreenInfo ? screen.scale : 0,
    fontScale: includeScreenInfo ? screen.fontScale : 0,
    
    // Network and connectivity
    isDevice: Device.isDevice,
    isRootedExperimentalAsync,
    
    // Additional metadata
    sessionId: generateSessionId ? generateUniqueSessionId() : '',
    timestamp: new Date().toISOString(),
  };

  return deviceInfo;
}

/**
 * Get basic device information (lightweight version)
 */
export function getBasicDeviceInfo(): Partial<DeviceInfo> {
  const screen = Dimensions.get('screen');
  
  return {
    platform: Platform.OS as 'ios' | 'android' | 'web',
    deviceName: Device.deviceName,
    osName: Device.osName || Platform.OS,
    osVersion: Device.osVersion,
    appName: Constants.expoConfig?.name || 'MasterFabric',
    appVersion: Constants.expoConfig?.version || '1.0.0',
    screenWidth: screen.width,
    screenHeight: screen.height,
    isDevice: Device.isDevice,
    timestamp: new Date().toISOString(),
  };
}

/**
 * Get device information formatted for API requests
 */
export async function getDeviceInfoForAPI(): Promise<Record<string, any>> {
  const deviceInfo = await getDeviceInfo({
    includeHardwareInfo: false,
    includeScreenInfo: true,
    includeNetworkInfo: false,
    generateSessionId: true,
  });

  return {
    device: {
      platform: deviceInfo.platform,
      name: deviceInfo.deviceName,
      model: deviceInfo.modelName,
      brand: deviceInfo.brand,
      os: {
        name: deviceInfo.osName,
        version: deviceInfo.osVersion,
      },
    },
    app: {
      name: deviceInfo.appName,
      version: deviceInfo.appVersion,
      build: deviceInfo.appBuildVersion,
    },
    screen: {
      width: deviceInfo.screenWidth,
      height: deviceInfo.screenHeight,
      scale: deviceInfo.screenScale,
    },
    session: {
      id: deviceInfo.sessionId,
      timestamp: deviceInfo.timestamp,
    },
  };
}

/**
 * Check if the device meets minimum requirements
 */
export async function checkDeviceCompatibility(): Promise<{
  isCompatible: boolean;
  issues: string[];
  warnings: string[];
}> {
  const deviceInfo = await getDeviceInfo();
  const issues: string[] = [];
  const warnings: string[] = [];

  // Check minimum OS versions
  if (deviceInfo.platform === 'ios') {
    const version = parseFloat(deviceInfo.osVersion || '0');
    if (version < 12.0) {
      issues.push('iOS version must be 12.0 or higher');
    } else if (version < 14.0) {
      warnings.push('iOS version below 14.0 may have limited functionality');
    }
  }

  if (deviceInfo.platform === 'android') {
    const apiLevel = deviceInfo.platformApiLevel || 0;
    if (apiLevel < 21) {
      issues.push('Android API level must be 21 or higher');
    } else if (apiLevel < 23) {
      warnings.push('Android API level below 23 may have limited functionality');
    }
  }

  // Check memory if available
  if (deviceInfo.totalMemory && deviceInfo.totalMemory < 2 * 1024 * 1024 * 1024) { // 2GB
    warnings.push('Low device memory may affect performance');
  }

  // Check if it's a real device vs simulator/emulator
  if (!deviceInfo.isDevice) {
    warnings.push('Running on simulator/emulator - some features may not work');
  }

  return {
    isCompatible: issues.length === 0,
    issues,
    warnings,
  };
}

/**
 * Get device information formatted for logging/debugging
 */
export async function getDeviceInfoForLogging(): Promise<string> {
  const deviceInfo = await getDeviceInfo();
  
  return `
Device Information:
------------------
Platform: ${deviceInfo.platform}
Device: ${deviceInfo.deviceName || 'Unknown'} (${deviceInfo.modelName || 'Unknown'})
Brand: ${deviceInfo.brand || 'Unknown'}
OS: ${deviceInfo.osName} ${deviceInfo.osVersion || 'Unknown'}
App: ${deviceInfo.appName} v${deviceInfo.appVersion} (${deviceInfo.appBuildVersion})
Screen: ${deviceInfo.screenWidth}x${deviceInfo.screenHeight}@${deviceInfo.screenScale}x
Memory: ${deviceInfo.totalMemory ? `${Math.round(deviceInfo.totalMemory / 1024 / 1024 / 1024 * 100) / 100}GB` : 'Unknown'}
Is Device: ${deviceInfo.isDevice}
Session: ${deviceInfo.sessionId}
Timestamp: ${deviceInfo.timestamp}
  `.trim();
}

/**
 * Generate a unique session ID
 */
function generateUniqueSessionId(): string {
  const timestamp = Date.now().toString(36);
  const randomStr = Math.random().toString(36).substring(2, 15);
  return `${timestamp}-${randomStr}`;
}

/**
 * Check if device is in debug mode
 */
export function isDebugMode(): boolean {
  return __DEV__ || Constants.expoConfig?.extra?.debugMode === true;
}

/**
 * Get device orientation
 */
export function getDeviceOrientation(): 'portrait' | 'landscape' {
  const { width, height } = Dimensions.get('screen');
  return width > height ? 'landscape' : 'portrait';
}

/**
 * Subscribe to orientation changes
 */
export function subscribeToOrientationChanges(callback: (orientation: 'portrait' | 'landscape') => void) {
  const subscription = Dimensions.addEventListener('change', ({ screen }) => {
    const orientation = screen.width > screen.height ? 'landscape' : 'portrait';
    callback(orientation);
  });

  return () => subscription?.remove();
}
