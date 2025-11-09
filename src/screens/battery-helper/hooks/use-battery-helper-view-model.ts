import * as Battery from 'expo-battery';
import { useCallback, useEffect, useState } from 'react';

export function useBatteryHelperViewModel() {
  const [batteryInfo, setBatteryInfo] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  const getBatteryInfo = useCallback(async () => {
    setIsLoading(true);
    try {
      const [
        batteryLevel,
        batteryState,
        lowPowerMode,
      ] = await Promise.all([
        Battery.getBatteryLevelAsync(),
        Battery.getBatteryStateAsync(),
        Battery.isLowPowerModeEnabledAsync(),
      ]);

      setBatteryInfo({
        batteryLevel: batteryLevel === -1 ? null : Math.round(batteryLevel * 100),
        batteryState,
        lowPowerMode,
      });
    } catch (error) {
      console.error('Error getting battery info:', error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    getBatteryInfo();

    const batteryLevelListener = Battery.addBatteryLevelListener(({ batteryLevel }) => {
      setBatteryInfo((prev: any) => ({ ...prev, batteryLevel: batteryLevel === -1 ? null : Math.round(batteryLevel * 100) }));
    });

    const batteryStateListener = Battery.addBatteryStateListener(({ batteryState }) => {
      setBatteryInfo((prev: any) => ({ ...prev, batteryState }));
    });

    const lowPowerModeListener = Battery.addLowPowerModeListener(({ lowPowerMode }) => {
      setBatteryInfo((prev: any) => ({ ...prev, lowPowerMode }));
    });

    return () => {
      batteryLevelListener.remove();
      batteryStateListener.remove();
      lowPowerModeListener.remove();
    };
  }, [getBatteryInfo]);

  return {
    batteryInfo,
    isLoading,
    getBatteryInfo,
  };
}
