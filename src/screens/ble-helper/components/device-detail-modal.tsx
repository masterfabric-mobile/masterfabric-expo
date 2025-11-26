import { ThemedText } from '@/src/shared/components/ThemedText';
import { ThemedView } from '@/src/shared/components/ThemedView';
import { BleDevice } from '@/src/shared/helpers/ble-helper';
import { t } from '@/src/shared/i18n';
import { Ionicons } from '@expo/vector-icons';
import { getThemeColors, useTheme } from 'masterfabric-expo-core';
import React from 'react';
import { Modal, ScrollView, TouchableOpacity, View } from 'react-native';
import { deviceDetailModalStyles } from '../styles/device-detail-modal.styles';

interface DeviceDetailModalProps {
  visible: boolean;
  device: BleDevice | null;
  onClose: () => void;
  onConnect?: (deviceId: string) => void;
  isConnected?: boolean;
}

/**
 * DeviceDetailModal Component
 * 
 * Displays detailed information about a BLE device in a modal.
 * Shows device ID, name, RSSI, service UUIDs, and manufacturer data.
 */
export function DeviceDetailModal({
  visible,
  device,
  onClose,
  onConnect,
  isConnected = false,
}: DeviceDetailModalProps) {
  const { currentTheme } = useTheme();
  const isDark = currentTheme === 'dark';
  const colors = getThemeColors(isDark);

  if (!device) {
    return null;
  }

  const handleConnect = () => {
    if (onConnect && !isConnected) {
      onConnect(device.id);
      onClose();
    }
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <TouchableOpacity
        style={deviceDetailModalStyles.overlay}
        activeOpacity={1}
        onPress={onClose}
      >
        <ThemedView
          style={[
            deviceDetailModalStyles.modalContainer,
            {
              backgroundColor: colors.surfaceBackground,
              borderColor: colors.surfaceBorder,
            }
          ]}
          onStartShouldSetResponder={() => true}
        >
          {/* Header */}
          <View style={[
            deviceDetailModalStyles.header,
            { borderBottomColor: colors.surfaceBorder }
          ]}>
            <ThemedText 
              type="subtitle" 
              style={[deviceDetailModalStyles.headerTitle, { color: colors.sectionTitle }]}
            >
              {device.name || t('helpers.bleHelper.devices.unknownDevice')}
            </ThemedText>
            <TouchableOpacity onPress={onClose}>
              <Ionicons name="close" size={24} color={colors.icon} />
            </TouchableOpacity>
          </View>

          <ScrollView 
            style={deviceDetailModalStyles.scrollView}
            contentContainerStyle={deviceDetailModalStyles.content}
            showsVerticalScrollIndicator={true}
          >
          {/* Device ID */}
          <View style={deviceDetailModalStyles.section}>
            <View style={deviceDetailModalStyles.sectionHeader}>
              <Ionicons name="finger-print" size={20} color={colors.icon} />
              <ThemedText 
                type="defaultSemiBold" 
                style={[deviceDetailModalStyles.sectionTitle, { color: colors.sectionTitle }]}
              >
                {t('helpers.bleHelper.deviceDetail.deviceId')}
              </ThemedText>
            </View>
            <ThemedText 
              style={[deviceDetailModalStyles.value, { color: colors.bodyText }]}
              selectable
            >
              {device.id}
            </ThemedText>
          </View>

          {/* RSSI */}
          {device.rssi !== null && (
            <View style={deviceDetailModalStyles.section}>
              <View style={deviceDetailModalStyles.sectionHeader}>
                <Ionicons name="pulse" size={20} color={colors.icon} />
                <ThemedText 
                  type="defaultSemiBold" 
                  style={[deviceDetailModalStyles.sectionTitle, { color: colors.sectionTitle }]}
                >
                  {t('helpers.bleHelper.deviceDetail.rssi')}
                </ThemedText>
              </View>
              <ThemedText 
                style={[
                  deviceDetailModalStyles.value, 
                  { 
                    color: device.rssi > -70 ? '#34C759' : device.rssi > -85 ? '#FF9500' : '#FF3B30'
                  }
                ]}
              >
                {device.rssi} dBm
                {device.rssi > -70 && ` (${t('helpers.bleHelper.deviceDetail.excellent')})`}
                {device.rssi <= -70 && device.rssi > -85 && ` (${t('helpers.bleHelper.deviceDetail.good')})`}
                {device.rssi <= -85 && ` (${t('helpers.bleHelper.deviceDetail.weak')})`}
              </ThemedText>
            </View>
          )}

          {/* Service UUIDs */}
          {device.serviceUUIDs && device.serviceUUIDs.length > 0 && (
            <View style={deviceDetailModalStyles.section}>
              <View style={deviceDetailModalStyles.sectionHeader}>
                <Ionicons name="list" size={20} color={colors.icon} />
                <ThemedText 
                  type="defaultSemiBold" 
                  style={[deviceDetailModalStyles.sectionTitle, { color: colors.sectionTitle }]}
                >
                  {t('helpers.bleHelper.deviceDetail.services')} ({device.serviceUUIDs.length})
                </ThemedText>
              </View>
              {device.serviceUUIDs.map((uuid, index) => (
                <ThemedText 
                  key={index}
                  style={[deviceDetailModalStyles.value, { color: colors.bodyText }]}
                  selectable
                >
                  {uuid}
                </ThemedText>
              ))}
            </View>
          )}

          {/* Manufacturer Data */}
          {device.manufacturerData && (
            <View style={deviceDetailModalStyles.section}>
              <View style={deviceDetailModalStyles.sectionHeader}>
                <Ionicons name="code" size={20} color={colors.icon} />
                <ThemedText 
                  type="defaultSemiBold" 
                  style={[deviceDetailModalStyles.sectionTitle, { color: colors.sectionTitle }]}
                >
                  {t('helpers.bleHelper.deviceDetail.manufacturerData')}
                </ThemedText>
              </View>
              <ThemedText 
                style={[deviceDetailModalStyles.value, { color: colors.bodyText }]}
                selectable
              >
                {device.manufacturerData}
              </ThemedText>
            </View>
          )}

          {/* Connect Button */}
          {onConnect && (
            <TouchableOpacity
              style={[
                deviceDetailModalStyles.connectButton,
                {
                  backgroundColor: isConnected ? '#8E8E93' : '#34C759',
                  opacity: isConnected ? 0.6 : 1,
                }
              ]}
              onPress={handleConnect}
              disabled={isConnected}
            >
              <Ionicons 
                name={isConnected ? 'checkmark-circle' : 'bluetooth'} 
                size={20} 
                color="#FFFFFF" 
              />
              <ThemedText style={deviceDetailModalStyles.connectButtonText}>
                {isConnected 
                  ? t('helpers.bleHelper.deviceDetail.connected')
                  : t('helpers.bleHelper.deviceDetail.connect')
                }
              </ThemedText>
            </TouchableOpacity>
          )}
          </ScrollView>
        </ThemedView>
      </TouchableOpacity>
    </Modal>
  );
}

