import { networkHelper } from 'masterfabric-expo-core';
import { useCallback, useEffect, useRef } from 'react';
import type { NetworkInfo } from 'masterfabric-expo-core';
import { useNetworkHelperStore } from '../store/network-helper-store';

export function useNetworkHelperViewModel() {
  const {
    networkInfo,
    isMonitoring,
    isLoading,
    lastCheckTime,
    monitoringInterval,
    setNetworkInfo,
    setIsMonitoring,
    setIsLoading,
    setLastCheckTime,
    setMonitoringInterval,
  } = useNetworkHelperStore();

  const unsubscribeRef = useRef<(() => void) | null>(null);

  // Start monitoring
  const startMonitoring = useCallback(() => {
    if (isMonitoring) return;
    
    setIsMonitoring(true);
    networkHelper.start(monitoringInterval);
    
    // Subscribe to network changes
    unsubscribeRef.current = networkHelper.onChange((isOnline, info) => {
      setNetworkInfo(info);
      setLastCheckTime(new Date());
    });
    
    // Initial check
    checkNetwork();
  }, [isMonitoring, monitoringInterval, setIsMonitoring, setNetworkInfo, setLastCheckTime]);

  // Stop monitoring
  const stopMonitoring = useCallback(() => {
    if (!isMonitoring) return;
    
    networkHelper.stop();
    if (unsubscribeRef.current) {
      unsubscribeRef.current();
      unsubscribeRef.current = null;
    }
    setIsMonitoring(false);
  }, [isMonitoring, setIsMonitoring]);

  // Manual network check
  const checkNetwork = useCallback(async () => {
    setIsLoading(true);
    try {
      const isOnline = await networkHelper.checkNow();
      const info = networkHelper.getNetworkInfo();
      setNetworkInfo(info);
      setLastCheckTime(new Date());
      return isOnline;
    } catch (error) {
      console.error('Network check error:', error);
      return false;
    } finally {
      setIsLoading(false);
    }
  }, [setIsLoading, setNetworkInfo, setLastCheckTime]);

  // Update monitoring interval
  const updateInterval = useCallback((interval: number) => {
    setMonitoringInterval(interval);
    if (isMonitoring) {
      stopMonitoring();
      startMonitoring();
    }
  }, [isMonitoring, setMonitoringInterval, stopMonitoring, startMonitoring]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (unsubscribeRef.current) {
        unsubscribeRef.current();
      }
      if (isMonitoring) {
        networkHelper.stop();
      }
    };
  }, [isMonitoring]);

  return {
    networkInfo,
    isMonitoring,
    isLoading,
    lastCheckTime,
    monitoringInterval,
    startMonitoring,
    stopMonitoring,
    checkNetwork,
    updateInterval,
  };
}

