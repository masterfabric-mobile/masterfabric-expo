import { ThemedText } from '@/src/shared/components/ThemedText';
import { ThemedView } from '@/src/shared/components/ThemedView';
import { t } from '@/src/shared/i18n';
import { Ionicons } from '@expo/vector-icons';
import { getThemeColors, useTheme } from 'masterfabric-expo-core';
import React from 'react';
import { View } from 'react-native';
import { BleConnectionStatus } from '@/src/shared/helpers/ble-helper';
import { statusSectionStyles } from '../styles/status-section.styles';

interface StatusSectionProps {
  bluetoothState: string;
  connectionStatus: BleConnectionStatus;
  isInitialized: boolean;
}

/**
 * StatusSection Component
 * 
 * Displays the current Bluetooth adapter state and connection status.
 * Shows visual indicators for different states.
 */
export function StatusSection({ 
  bluetoothState, 
  connectionStatus, 
  isInitialized 
}: StatusSectionProps) {
  const { currentTheme } = useTheme();
  const isDark = currentTheme === 'dark';
  const colors = getThemeColors(isDark);

  const getStatusColor = () => {
    if (!isInitialized) return colors.labelText;
    if (bluetoothState === 'PoweredOn') return '#34C759';
    if (bluetoothState === 'PoweredOff') return '#FF3B30';
    return '#FF9500';
  };

  const getConnectionColor = () => {
    switch (connectionStatus) {
      case BleConnectionStatus.Connected:
        return '#34C759';
      case BleConnectionStatus.Connecting:
      case BleConnectionStatus.Disconnecting:
        return '#FF9500';
      case BleConnectionStatus.Failed:
        return '#FF3B30';
      default:
        return colors.labelText;
    }
  };

  return (
    <ThemedView 
      style={[
        statusSectionStyles.container,
        {
          backgroundColor: colors.surfaceBackground,
          borderColor: colors.surfaceBorder + '30',
        }
      ]}
    >
      <ThemedText 
        type="subtitle" 
        style={[statusSectionStyles.title, { color: colors.sectionTitle }]}
      >
        {t('helpers.bleHelper.status.title')}
      </ThemedText>

      <View style={statusSectionStyles.statusRow}>
        <Ionicons 
          name="bluetooth" 
          size={20} 
          color={getStatusColor()} 
        />
        <View style={statusSectionStyles.statusContent}>
          <ThemedText style={[statusSectionStyles.label, { color: colors.labelText }]}>
            {t('helpers.bleHelper.status.bluetoothState')}
          </ThemedText>
          <ThemedText 
            style={[statusSectionStyles.value, { color: getStatusColor() }]}
          >
            {bluetoothState}
          </ThemedText>
        </View>
      </View>

      <View style={statusSectionStyles.statusRow}>
        <Ionicons 
          name={connectionStatus === BleConnectionStatus.Connected ? 'link' : 'link-outline'} 
          size={20} 
          color={getConnectionColor()} 
        />
        <View style={statusSectionStyles.statusContent}>
          <ThemedText style={[statusSectionStyles.label, { color: colors.labelText }]}>
            {t('helpers.bleHelper.status.connectionStatus')}
          </ThemedText>
          <ThemedText 
            style={[statusSectionStyles.value, { color: getConnectionColor() }]}
          >
            {connectionStatus}
          </ThemedText>
        </View>
      </View>

      <View style={statusSectionStyles.statusRow}>
        <Ionicons 
          name={isInitialized ? 'checkmark-circle' : 'close-circle'} 
          size={20} 
          color={isInitialized ? '#34C759' : colors.labelText} 
        />
        <View style={statusSectionStyles.statusContent}>
          <ThemedText style={[statusSectionStyles.label, { color: colors.labelText }]}>
            {t('helpers.bleHelper.status.initialized')}
          </ThemedText>
          <ThemedText 
            style={[statusSectionStyles.value, { color: isInitialized ? '#34C759' : colors.labelText }]}
          >
            {isInitialized ? t('common.yes') : t('common.no')}
          </ThemedText>
        </View>
      </View>
    </ThemedView>
  );
}

