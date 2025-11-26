import { ThemedText } from '@/src/shared/components/ThemedText';
import { ThemedView } from '@/src/shared/components/ThemedView';
import { BleDevice } from '@/src/shared/helpers/ble-helper';
import { t } from '@/src/shared/i18n';
import { Ionicons } from '@expo/vector-icons';
import { getThemeColors, useTheme } from 'masterfabric-expo-core';
import React from 'react';
import { TouchableOpacity, View } from 'react-native';
import { deviceListStyles } from '../styles/device-list.styles';

interface DeviceListProps {
  devices: BleDevice[];
  onDevicePress: (deviceId: string) => void;
  onDeviceDetailPress?: (device: BleDevice) => void;
  connectedDeviceId: string | null;
}

/**
 * DeviceList Component
 * 
 * Displays a list of discovered BLE devices.
 * Each device is pressable to initiate a connection.
 * Shows device name, RSSI, and service UUIDs.
 */
export function DeviceList({ 
  devices, 
  onDevicePress,
  onDeviceDetailPress,
  connectedDeviceId 
}: DeviceListProps) {
  const { currentTheme } = useTheme();
  const isDark = currentTheme === 'dark';
  const colors = getThemeColors(isDark);

  if (devices.length === 0) {
    return null;
  }

  return (
    <ThemedView 
      style={[
        deviceListStyles.container,
        {
          backgroundColor: colors.surfaceBackground,
          borderColor: colors.surfaceBorder + '30',
        }
      ]}
    >
      <ThemedText 
        type="subtitle" 
        style={[deviceListStyles.title, { color: colors.sectionTitle }]}
      >
        {t('helpers.bleHelper.devices.title')} ({devices.length})
      </ThemedText>

      {devices.map((device) => {
        const isConnected = device.id === connectedDeviceId;
        
        return (
          <TouchableOpacity
            key={device.id}
            style={[
              deviceListStyles.deviceCard,
              {
                backgroundColor: isConnected 
                  ? colors.surfaceBackground 
                  : colors.background,
                borderColor: isConnected ? '#34C759' : colors.surfaceBorder + '20',
                borderWidth: isConnected ? 2 : 1,
              }
            ]}
            onPress={() => {
              if (onDeviceDetailPress) {
                onDeviceDetailPress(device);
              } else if (!isConnected) {
                onDevicePress(device.id);
              }
            }}
            disabled={isConnected && !onDeviceDetailPress}
          >
            <View style={deviceListStyles.deviceContent}>
              <View style={deviceListStyles.deviceHeader}>
                <Ionicons 
                  name={isConnected ? 'bluetooth' : 'bluetooth-outline'} 
                  size={24} 
                  color={isConnected ? '#34C759' : colors.icon} 
                />
                <View style={deviceListStyles.deviceInfo}>
                  <ThemedText 
                    type="defaultSemiBold" 
                    style={[deviceListStyles.deviceName, { color: colors.bodyText }]}
                  >
                    {device.name || t('helpers.bleHelper.devices.unknownDevice')}
                  </ThemedText>
                  <ThemedText 
                    style={[deviceListStyles.deviceId, { color: colors.labelText }]}
                    numberOfLines={1}
                  >
                    {device.id}
                  </ThemedText>
                </View>
                <View style={deviceListStyles.deviceActions}>
                  {onDeviceDetailPress && (
                    <TouchableOpacity
                      onPress={(e) => {
                        e.stopPropagation();
                        onDeviceDetailPress(device);
                      }}
                      style={deviceListStyles.detailButton}
                    >
                      <Ionicons name="information-circle-outline" size={20} color={colors.icon} />
                    </TouchableOpacity>
                  )}
                  {isConnected && (
                    <Ionicons name="checkmark-circle" size={20} color="#34C759" />
                  )}
                </View>
              </View>

              <View style={deviceListStyles.deviceDetails}>
                {device.rssi !== null && (
                  <View style={deviceListStyles.detailRow}>
                    <Ionicons name="pulse" size={16} color={colors.labelText} />
                    <ThemedText 
                      style={[deviceListStyles.detailText, { color: colors.labelText }]}
                    >
                      RSSI: {device.rssi} dBm
                    </ThemedText>
                  </View>
                )}

                {device.serviceUUIDs && device.serviceUUIDs.length > 0 && (
                  <View style={deviceListStyles.detailRow}>
                    <Ionicons name="list" size={16} color={colors.labelText} />
                    <ThemedText 
                      style={[deviceListStyles.detailText, { color: colors.labelText }]}
                      numberOfLines={1}
                    >
                      {device.serviceUUIDs.length} service(s)
                    </ThemedText>
                  </View>
                )}
              </View>
            </View>
          </TouchableOpacity>
        );
      })}
    </ThemedView>
  );
}

