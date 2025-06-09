import { useEffect, useState } from 'react';
import { Dimensions } from 'react-native';
import {
    checkDeviceCompatibility,
    DeviceInfo,
    DeviceInfoOptions,
    getBasicDeviceInfo,
    getDeviceInfo,
    getDeviceOrientation
} from '../helpers/device-info';

export interface UseDeviceInfoOptions extends DeviceInfoOptions {
  autoRefresh?: boolean;
  refreshInterval?: number;
}

/**
 * Hook for getting device information
 */
export function useDeviceInfo(options: UseDeviceInfoOptions = {}) {
  const [deviceInfo, setDeviceInfo] = useState<DeviceInfo | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const { autoRefresh = false, refreshInterval = 30000, ...deviceInfoOptions } = options;

  const fetchDeviceInfo = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const info = await getDeviceInfo(deviceInfoOptions);
      setDeviceInfo(info);
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to get device info'));
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchDeviceInfo();

    if (autoRefresh) {
      const interval = setInterval(fetchDeviceInfo, refreshInterval);
      return () => clearInterval(interval);
    }
  }, [autoRefresh, refreshInterval]);

  return {
    deviceInfo,
    isLoading,
    error,
    refetch: fetchDeviceInfo,
  };
}

/**
 * Hook for getting basic device information (synchronous)
 */
export function useBasicDeviceInfo() {
  const [deviceInfo, setDeviceInfo] = useState(() => getBasicDeviceInfo());

  useEffect(() => {
    // Update device info if screen dimensions change
    const subscription = Dimensions.addEventListener('change', () => {
      setDeviceInfo(getBasicDeviceInfo());
    });

    return () => subscription?.remove();
  }, []);

  return deviceInfo;
}

/**
 * Hook for device compatibility checking
 */
export function useDeviceCompatibility() {
  const [compatibility, setCompatibility] = useState<{
    isCompatible: boolean;
    issues: string[];
    warnings: string[];
  } | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const checkCompatibility = async () => {
      try {
        setIsLoading(true);
        const result = await checkDeviceCompatibility();
        setCompatibility(result);
      } catch (error) {
        console.error('Failed to check device compatibility:', error);
        setCompatibility({
          isCompatible: false,
          issues: ['Failed to check device compatibility'],
          warnings: [],
        });
      } finally {
        setIsLoading(false);
      }
    };

    checkCompatibility();
  }, []);

  return {
    compatibility,
    isLoading,
    isCompatible: compatibility?.isCompatible ?? true,
    issues: compatibility?.issues ?? [],
    warnings: compatibility?.warnings ?? [],
  };
}

/**
 * Hook for device orientation
 */
export function useDeviceOrientation() {
  const [orientation, setOrientation] = useState(() => getDeviceOrientation());

  useEffect(() => {
    const subscription = Dimensions.addEventListener('change', ({ screen }) => {
      const newOrientation = screen.width > screen.height ? 'landscape' : 'portrait';
      setOrientation(newOrientation);
    });

    return () => subscription?.remove();
  }, []);

  return orientation;
}

/**
 * Hook for screen dimensions with orientation updates
 */
export function useScreenDimensions() {
  const [dimensions, setDimensions] = useState(() => {
    const screen = Dimensions.get('screen');
    const window = Dimensions.get('window');
    return {
      screen,
      window,
      orientation: getDeviceOrientation(),
    };
  });

  useEffect(() => {
    const subscription = Dimensions.addEventListener('change', ({ screen, window }) => {
      setDimensions({
        screen,
        window,
        orientation: screen.width > screen.height ? 'landscape' : 'portrait',
      });
    });

    return () => subscription?.remove();
  }, []);

  return dimensions;
}
