import { BluetoothStatusCard } from '@/src/screens/ble-helper/components/bluetooth-status-card';
import { ScreenHeader } from '@/src/shared/components/ScreenHeader';
import { bleHelper } from '@/src/shared/helpers/ble-helper';
import { t } from '@/src/shared/i18n';
import { getThemeColors, useTheme } from 'masterfabric-expo-core';
import React, { useEffect, useState } from 'react';
import { Platform, ScrollView, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useHelpersViewModel } from '../hooks/use-helpers-view-model';
import { helpersScreenStyles } from '../styles/helpers-screen.styles';
import { HelperItemCard } from './helper-item-card';

export function HelpersScreen() {
  const { currentTheme } = useTheme();
  const isDark = currentTheme === 'dark';
  const colors = getThemeColors(isDark);
  
  const { helpers, isLoading, loadHelpers } = useHelpersViewModel();
  const [bluetoothState, setBluetoothState] = useState<string>('Unknown');
  const [isCheckingBluetooth, setIsCheckingBluetooth] = useState(false);

  const isWeb = Platform.OS === 'web';
  const hasBleHelper = helpers.some(h => h.id === 'ble-helper');
  const isBluetoothOff = bluetoothState === 'PoweredOff' || 
                         bluetoothState === 'Unsupported' || 
                         bluetoothState === 'Unknown';

  useEffect(() => {
    loadHelpers();
  }, [loadHelpers]);

  // Check Bluetooth state if BLE helper is available
  useEffect(() => {
    if (hasBleHelper && !isCheckingBluetooth) {
      setIsCheckingBluetooth(true);
      bleHelper.initialize()
        .then(() => bleHelper.getBluetoothState())
        .then((state) => {
          setBluetoothState(state);
          setIsCheckingBluetooth(false);
        })
        .catch(() => {
          setBluetoothState('Unknown');
          setIsCheckingBluetooth(false);
        });
    }
  }, [hasBleHelper, isCheckingBluetooth]);

  return (
    <SafeAreaView 
      style={[helpersScreenStyles.container, { backgroundColor: colors.background }]}
      edges={['top']}
    >
      <ScreenHeader 
        title={t('helpers.title')}
        subtitle={t('helpers.subtitle')}
        variant="minimal"
      />
      <ScrollView 
        style={helpersScreenStyles.scrollView}
        contentContainerStyle={helpersScreenStyles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Bluetooth Status Card - Show if BLE helper exists and Bluetooth is off or on web */}
        {hasBleHelper && (isBluetoothOff || isWeb) && (
          <BluetoothStatusCard 
            bluetoothState={bluetoothState}
            isPassive={isWeb}
          />
        )}

        <View style={helpersScreenStyles.categoriesContainer}>
          {helpers.map((helper) => (
            <HelperItemCard 
              key={helper.id}
              helper={helper}
            />
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
