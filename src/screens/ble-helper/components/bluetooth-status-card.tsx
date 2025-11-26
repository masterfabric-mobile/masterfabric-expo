import { ThemedText } from '@/src/shared/components/ThemedText';
import { ThemedView } from '@/src/shared/components/ThemedView';
import { t } from '@/src/shared/i18n';
import { Ionicons } from '@expo/vector-icons';
import { getThemeColors, useTheme } from 'masterfabric-expo-core';
import React from 'react';
import { Linking, Platform, TouchableOpacity, View } from 'react-native';
import { bluetoothStatusCardStyles } from '../styles/bluetooth-status-card.styles';

interface BluetoothStatusCardProps {
  bluetoothState: string;
  isPassive?: boolean; // For web/Expo Go where BLE is not available
}

/**
 * BluetoothStatusCard Component
 * 
 * Displays a warning card when Bluetooth is not available or powered off.
 * Provides a button to open device settings.
 * Can be passive (non-interactive) for platforms where BLE is not supported.
 */
export function BluetoothStatusCard({ 
  bluetoothState, 
  isPassive = false 
}: BluetoothStatusCardProps) {
  const { currentTheme } = useTheme();
  const isDark = currentTheme === 'dark';
  const colors = getThemeColors(isDark);

  const isBluetoothOff = bluetoothState === 'PoweredOff' || bluetoothState === 'Unsupported' || bluetoothState === 'Unknown';
  const isWebOrExpoGo = Platform.OS === 'web' || __DEV__;

  // Don't show if Bluetooth is on and not passive mode
  if (!isBluetoothOff && !isPassive) {
    return null;
  }

  const handleOpenSettings = async () => {
    if (isPassive) {
      return; // Don't open settings in passive mode
    }

    try {
      if (Platform.OS === 'ios') {
        await Linking.openURL('app-settings:');
      } else if (Platform.OS === 'android') {
        await Linking.openSettings();
      }
    } catch (error) {
      console.error('Failed to open settings:', error);
    }
  };

  return (
    <ThemedView 
      style={[
        bluetoothStatusCardStyles.container,
        {
          backgroundColor: colors.surfaceBackground,
          borderColor: isPassive ? colors.surfaceBorder + '30' : '#FF9500',
          borderWidth: isPassive ? 1 : 2,
          opacity: isPassive ? 0.6 : 1,
        }
      ]}
    >
      <View style={bluetoothStatusCardStyles.content}>
        <Ionicons 
          name={isPassive ? 'information-circle-outline' : 'warning'} 
          size={24} 
          color={isPassive ? colors.labelText : '#FF9500'} 
        />
        <View style={bluetoothStatusCardStyles.textContainer}>
          <ThemedText 
            type="defaultSemiBold" 
            style={[bluetoothStatusCardStyles.title, { color: colors.bodyText }]}
          >
            {isPassive 
              ? t('helpers.bleHelper.bluetoothStatus.notAvailable')
              : t('helpers.bleHelper.bluetoothStatus.poweredOff')
            }
          </ThemedText>
          <ThemedText 
            style={[bluetoothStatusCardStyles.description, { color: colors.actionDescription }]}
          >
            {isPassive
              ? t('helpers.bleHelper.bluetoothStatus.notAvailableDescription')
              : t('helpers.bleHelper.bluetoothStatus.poweredOffDescription')
            }
          </ThemedText>
        </View>
      </View>

      {!isPassive && (
        <TouchableOpacity
          style={[
            bluetoothStatusCardStyles.button,
            { backgroundColor: '#007AFF' }
          ]}
          onPress={handleOpenSettings}
        >
          <Ionicons name="settings-outline" size={18} color="#FFFFFF" />
          <ThemedText style={bluetoothStatusCardStyles.buttonText}>
            {t('helpers.bleHelper.bluetoothStatus.openSettings')}
          </ThemedText>
        </TouchableOpacity>
      )}
    </ThemedView>
  );
}

