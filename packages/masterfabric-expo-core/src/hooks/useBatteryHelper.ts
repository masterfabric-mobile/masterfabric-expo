import * as Battery from 'expo-battery';
import { getDeviceInfo } from '../helpers/device-info';
import { useCallback, useEffect, useMemo } from 'react';
import { Platform, Linking } from 'react-native';
import { useBatteryHelperStore } from '../stores/batteryStore';
import {
  formatBatteryPercentage,
  getChargingStatusText,
  getLowPowerModeStatusText,
} from '../helpers/batteryHelper';

export const useBatteryHelper = () => {
  const {
    batteryState,
    isLoading,
    error,
    refreshBatteryInfo,
    updateBatteryLevel,
    updateBatteryChargingState,
    updateLowPowerMode,
    setLoading,
  } = useBatteryHelperStore();

  // Set up battery listeners and initial refresh
  useEffect(() => {
    // Initial refresh
    refreshBatteryInfo();

    // Set up battery level listener
    const batteryLevelSubscription = Battery.addBatteryLevelListener((event) => {
      const level = event.batteryLevel >= 0 ? event.batteryLevel : 0;
      updateBatteryLevel(level);
    });

    // Set up battery state listener (charging/unplugged)
    const batteryStateSubscription = Battery.addBatteryStateListener((event) => {
      const isCharging =
        event.batteryState === Battery.BatteryState.CHARGING ||
        event.batteryState === Battery.BatteryState.FULL;
      updateBatteryChargingState(isCharging);
    });

    // Set up low power mode listener
    const lowPowerModeSubscription = Battery.addLowPowerModeListener((event) => {
      updateLowPowerMode(event.lowPowerMode);
    });

    // Cleanup listeners on unmount
    return () => {
      batteryLevelSubscription.remove();
      batteryStateSubscription.remove();
      lowPowerModeSubscription.remove();
    };
  }, [refreshBatteryInfo, updateBatteryLevel, updateBatteryChargingState, updateLowPowerMode]);

  // Format battery percentage (reactive - updates when batteryLevel changes)
  const batteryPercentage = useMemo(
    () => formatBatteryPercentage(batteryState.batteryLevel),
    [batteryState.batteryLevel]
  );

  // Get charging status text (reactive - updates when isCharging changes)
  const chargingStatusText = useMemo(
    () => getChargingStatusText(batteryState.isCharging),
    [batteryState.isCharging]
  );

  // Get low power mode status text (reactive - updates when lowPowerMode changes)
  const lowPowerModeStatusText = useMemo(
    () => getLowPowerModeStatusText(
      batteryState.lowPowerMode,
      Platform.OS as 'ios' | 'android' | 'web'
    ),
    [batteryState.lowPowerMode]
  );

  // Handle manual refresh
  const handleRefresh = useCallback(async () => {
    setLoading(true);
    await refreshBatteryInfo();
  }, [refreshBatteryInfo, setLoading]);

  // Open system settings for low power mode
  const openLowPowerModeSettings = useCallback(async () => {
    try {
      if (Platform.OS === 'ios') {
        await Linking.openURL('app-settings:');
      } else if (Platform.OS === 'android') {
        await Linking.openSettings();
      }
    } catch (error) {
      console.error('Failed to open settings:', error);
    }
  }, []);

  // Get device information
  const getDeviceInformation = useCallback(async () => {
    try {
      return await getDeviceInfo({
        includeHardwareInfo: true,
        includeScreenInfo: true,
        includeNetworkInfo: false,
        generateSessionId: false,
      });
    } catch (error) {
      console.error('Failed to get device info:', error);
      return null;
    }
  }, []);

  return {
    batteryState,
    batteryPercentage,
    chargingStatusText,
    lowPowerModeStatusText,
    isLoading,
    error,
    handleRefresh,
    openLowPowerModeSettings,
    getDeviceInformation,
  };
};

