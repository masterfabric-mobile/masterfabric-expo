import { ThemedText } from '@/src/shared/components/ThemedText';
import { ThemedView } from '@/src/shared/components/ThemedView';
import { t } from '@/src/shared/i18n';
import { Ionicons } from '@expo/vector-icons';
import { getThemeColors, useTheme } from 'masterfabric-expo-core';
import React, { useState } from 'react';
import { ActivityIndicator, TextInput, TouchableOpacity, View } from 'react-native';
import { BleDevice } from '@/src/shared/helpers/ble-helper';
import { connectedDeviceViewStyles } from '../styles/connected-device-view.styles';

interface ConnectedDeviceViewProps {
  device: BleDevice;
  onDisconnect: () => void;
  onDiscoverServices: () => void;
  onReadCharacteristic: (serviceUUID: string, characteristicUUID: string) => Promise<string>;
  onWriteCharacteristic: (serviceUUID: string, characteristicUUID: string, valueBase64: string) => Promise<void>;
  onSubscribeToCharacteristic: (serviceUUID: string, characteristicUUID: string) => Promise<void>;
  onUnsubscribeFromCharacteristic: (serviceUUID: string, characteristicUUID: string) => void;
}

/**
 * ConnectedDeviceView Component
 * 
 * Displays connected device details and provides controls for:
 * - Disconnecting from the device
 * - Discovering services and characteristics
 * - Reading characteristic values
 * - Writing values to characteristics
 * - Subscribing/unsubscribing to characteristic notifications
 */
export function ConnectedDeviceView({
  device,
  onDisconnect,
  onDiscoverServices,
  onReadCharacteristic,
  onWriteCharacteristic,
  onSubscribeToCharacteristic,
  onUnsubscribeFromCharacteristic,
}: ConnectedDeviceViewProps) {
  const { currentTheme } = useTheme();
  const isDark = currentTheme === 'dark';
  const colors = getThemeColors(isDark);

  const [serviceUUID, setServiceUUID] = useState('');
  const [characteristicUUID, setCharacteristicUUID] = useState('');
  const [writeValue, setWriteValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [readValue, setReadValue] = useState<string | null>(null);

  const handleRead = async () => {
    if (!serviceUUID.trim() || !characteristicUUID.trim()) {
      // Validation error will be handled by view model
      return;
    }

    setIsLoading(true);
    try {
      const value = await onReadCharacteristic(serviceUUID.trim(), characteristicUUID.trim());
      setReadValue(value);
    } catch (error) {
      // Error is already logged in view model
    } finally {
      setIsLoading(false);
    }
  };

  const handleWrite = async () => {
    if (!serviceUUID.trim() || !characteristicUUID.trim() || !writeValue.trim()) {
      // Validation error will be handled by view model
      return;
    }

    setIsLoading(true);
    try {
      await onWriteCharacteristic(serviceUUID.trim(), characteristicUUID.trim(), writeValue.trim());
      setWriteValue('');
    } catch (error) {
      // Error is already logged in view model
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubscribe = async () => {
    if (!serviceUUID.trim() || !characteristicUUID.trim()) {
      // Validation error will be handled by view model
      return;
    }

    setIsLoading(true);
    try {
      await onSubscribeToCharacteristic(serviceUUID.trim(), characteristicUUID.trim());
    } catch (error) {
      // Error is already logged in view model
    } finally {
      setIsLoading(false);
    }
  };

  const handleUnsubscribe = () => {
    if (!serviceUUID.trim() || !characteristicUUID.trim()) {
      // Validation error will be handled by view model
      return;
    }

    onUnsubscribeFromCharacteristic(serviceUUID.trim(), characteristicUUID.trim());
  };

  return (
    <ThemedView 
      style={[
        connectedDeviceViewStyles.container,
        {
          backgroundColor: colors.surfaceBackground,
          borderColor: colors.surfaceBorder + '30',
        }
      ]}
    >
      <View style={connectedDeviceViewStyles.header}>
        <Ionicons name="bluetooth" size={24} color="#34C759" />
        <View style={connectedDeviceViewStyles.headerContent}>
          <ThemedText 
            type="subtitle" 
            style={[connectedDeviceViewStyles.title, { color: colors.sectionTitle }]}
          >
            {t('helpers.bleHelper.connectedDevice.title')}
          </ThemedText>
          <ThemedText 
            style={[connectedDeviceViewStyles.deviceName, { color: colors.bodyText }]}
          >
            {device.name || device.id}
          </ThemedText>
        </View>
      </View>

      {/* Disconnect Button */}
      <TouchableOpacity
        style={[
          connectedDeviceViewStyles.button,
          connectedDeviceViewStyles.disconnectButton,
          { backgroundColor: '#FF3B30' }
        ]}
        onPress={onDisconnect}
      >
        <Ionicons name="close-circle" size={20} color="#FFFFFF" />
        <ThemedText style={connectedDeviceViewStyles.buttonText}>
          {t('helpers.bleHelper.connectedDevice.disconnect')}
        </ThemedText>
      </TouchableOpacity>

      {/* Discover Services Button */}
      <TouchableOpacity
        style={[
          connectedDeviceViewStyles.button,
          { backgroundColor: '#007AFF', opacity: isLoading ? 0.6 : 1 }
        ]}
        onPress={onDiscoverServices}
        disabled={isLoading}
      >
        {isLoading ? (
          <ActivityIndicator color="#FFFFFF" />
        ) : (
          <>
            <Ionicons name="search" size={20} color="#FFFFFF" />
            <ThemedText style={connectedDeviceViewStyles.buttonText}>
              {t('helpers.bleHelper.connectedDevice.discoverServices')}
            </ThemedText>
          </>
        )}
      </TouchableOpacity>

      {/* Service UUID Input */}
      <ThemedText 
        style={[connectedDeviceViewStyles.label, { color: colors.labelText }]}
      >
        {t('helpers.bleHelper.connectedDevice.serviceUUID')}
      </ThemedText>
      <TextInput
        style={[
          connectedDeviceViewStyles.input,
          {
            color: colors.bodyText,
            backgroundColor: colors.background,
            borderColor: colors.surfaceBorder,
          }
        ]}
        value={serviceUUID}
        onChangeText={setServiceUUID}
        placeholder="0000180F-0000-1000-8000-00805F9B34FB"
        placeholderTextColor={colors.labelText}
        autoCapitalize="none"
      />

      {/* Characteristic UUID Input */}
      <ThemedText 
        style={[connectedDeviceViewStyles.label, { color: colors.labelText }]}
      >
        {t('helpers.bleHelper.connectedDevice.characteristicUUID')}
      </ThemedText>
      <TextInput
        style={[
          connectedDeviceViewStyles.input,
          {
            color: colors.bodyText,
            backgroundColor: colors.background,
            borderColor: colors.surfaceBorder,
          }
        ]}
        value={characteristicUUID}
        onChangeText={setCharacteristicUUID}
        placeholder="00002A19-0000-1000-8000-00805F9B34FB"
        placeholderTextColor={colors.labelText}
        autoCapitalize="none"
      />

      {/* Read Characteristic */}
      <View style={connectedDeviceViewStyles.actionRow}>
        <TouchableOpacity
          style={[
            connectedDeviceViewStyles.actionButton,
            { backgroundColor: '#34C759', opacity: isLoading ? 0.6 : 1 }
          ]}
          onPress={handleRead}
          disabled={isLoading}
        >
          {isLoading ? (
            <ActivityIndicator color="#FFFFFF" />
          ) : (
            <>
              <Ionicons name="download" size={18} color="#FFFFFF" />
              <ThemedText style={connectedDeviceViewStyles.actionButtonText}>
                {t('helpers.bleHelper.connectedDevice.read')}
              </ThemedText>
            </>
          )}
        </TouchableOpacity>

        {readValue !== null && (
          <View style={connectedDeviceViewStyles.valueContainer}>
            <ThemedText 
              style={[connectedDeviceViewStyles.valueLabel, { color: colors.labelText }]}
            >
              {t('helpers.bleHelper.connectedDevice.value')}:
            </ThemedText>
            <ThemedText 
              style={[connectedDeviceViewStyles.valueText, { color: colors.bodyText }]}
              numberOfLines={3}
            >
              {readValue}
            </ThemedText>
          </View>
        )}
      </View>

      {/* Write Value Input */}
      <ThemedText 
        style={[connectedDeviceViewStyles.label, { color: colors.labelText }]}
      >
        {t('helpers.bleHelper.connectedDevice.writeValue')} (Base64)
      </ThemedText>
      <TextInput
        style={[
          connectedDeviceViewStyles.input,
          {
            color: colors.bodyText,
            backgroundColor: colors.background,
            borderColor: colors.surfaceBorder,
          }
        ]}
        value={writeValue}
        onChangeText={setWriteValue}
        placeholder="Enter Base64 value"
        placeholderTextColor={colors.labelText}
        autoCapitalize="none"
      />

      {/* Write and Subscribe/Unsubscribe Buttons */}
      <View style={connectedDeviceViewStyles.actionRow}>
        <TouchableOpacity
          style={[
            connectedDeviceViewStyles.actionButton,
            { backgroundColor: '#FF9500', opacity: isLoading ? 0.6 : 1 }
          ]}
          onPress={handleWrite}
          disabled={isLoading}
        >
          {isLoading ? (
            <ActivityIndicator color="#FFFFFF" />
          ) : (
            <>
              <Ionicons name="create" size={18} color="#FFFFFF" />
              <ThemedText style={connectedDeviceViewStyles.actionButtonText}>
                {t('helpers.bleHelper.connectedDevice.write')}
              </ThemedText>
            </>
          )}
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            connectedDeviceViewStyles.actionButton,
            { backgroundColor: '#5856D6', opacity: isLoading ? 0.6 : 1 }
          ]}
          onPress={handleSubscribe}
          disabled={isLoading}
        >
          {isLoading ? (
            <ActivityIndicator color="#FFFFFF" />
          ) : (
            <>
              <Ionicons name="notifications" size={18} color="#FFFFFF" />
              <ThemedText style={connectedDeviceViewStyles.actionButtonText}>
                {t('helpers.bleHelper.connectedDevice.subscribe')}
              </ThemedText>
            </>
          )}
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            connectedDeviceViewStyles.actionButton,
            { backgroundColor: '#8E8E93', opacity: isLoading ? 0.6 : 1 }
          ]}
          onPress={handleUnsubscribe}
          disabled={isLoading}
        >
          <Ionicons name="notifications-off" size={18} color="#FFFFFF" />
          <ThemedText style={connectedDeviceViewStyles.actionButtonText}>
            {t('helpers.bleHelper.connectedDevice.unsubscribe')}
          </ThemedText>
        </TouchableOpacity>
      </View>
    </ThemedView>
  );
}

