import { ScreenHeader } from '@/src/shared/components/ScreenHeader';
import { t } from '@/src/shared/i18n';
import { getThemeColors, useTheme } from 'masterfabric-expo-core';
import React from 'react';
import { Platform, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useBleHelperViewModel } from '../hooks/use-ble-helper-view-model';
import { bleHelperScreenStyles } from '../styles/ble-helper-screen.styles';
import { BluetoothStatusCard } from './bluetooth-status-card';
import { ConnectedDeviceView } from './connected-device-view';
import { DeviceDetailModal } from './device-detail-modal';
import { DeviceList } from './device-list';
import { LogView } from './log-view';
import { PermissionsButton } from './permissions-button';
import { ScanControls } from './scan-controls';
import { StatusSection } from './status-section';

/**
 * BleHelperScreen Component
 * 
 * A comprehensive screen for testing and demonstrating BLE functionality.
 * Provides an interactive interface for developers to:
 * - Check Bluetooth adapter state and connection status
 * - Request necessary permissions
 * - Scan for nearby BLE devices
 * - Connect to and disconnect from devices
 * - Discover services and characteristics
 * - Read, write, and subscribe to characteristics
 * - View operation logs
 * 
 * Features:
 * - Real-time status monitoring
 * - Device discovery and connection management
 * - Service and characteristic interaction
 * - Comprehensive logging
 * - Theme-aware UI
 */
export function BleHelperScreen() {
  const { currentTheme } = useTheme();
  const isDark = currentTheme === 'dark';
  const colors = getThemeColors(isDark);

  const viewModel = useBleHelperViewModel();
  const [selectedDevice, setSelectedDevice] = React.useState<import('@/src/shared/helpers/ble-helper').BleDevice | null>(null);
  const [isDetailModalVisible, setIsDetailModalVisible] = React.useState(false);

  const isWeb = Platform.OS === 'web';
  const isBluetoothOff = viewModel.bluetoothState === 'PoweredOff' || 
                         viewModel.bluetoothState === 'Unsupported' || 
                         viewModel.bluetoothState === 'Unknown';

  return (
    <SafeAreaView 
      style={[bleHelperScreenStyles.container, { backgroundColor: colors.background }]}
      edges={['top']}
    >
      <ScreenHeader 
        title={t('helpers.bleHelper.title')}
        subtitle={t('helpers.bleHelper.description')}
        variant="minimal"
      />
      
      <ScrollView 
        style={bleHelperScreenStyles.scrollView}
        contentContainerStyle={bleHelperScreenStyles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Bluetooth Status Card - Show if Bluetooth is off or on web */}
        {(isBluetoothOff || isWeb) && (
          <BluetoothStatusCard 
            bluetoothState={viewModel.bluetoothState}
            isPassive={isWeb}
          />
        )}

        {/* Status Section */}
        <StatusSection 
          bluetoothState={viewModel.bluetoothState}
          connectionStatus={viewModel.connectionStatus}
          isInitialized={viewModel.isInitialized}
        />

        {/* Permissions Button */}
        <PermissionsButton 
          hasPermissions={viewModel.hasPermissions}
          onRequestPermissions={viewModel.requestPermissions}
        />

        {/* Scan Controls */}
        <ScanControls 
          isScanning={viewModel.isScanning}
          onStartScan={viewModel.startScan}
          onStopScan={viewModel.stopScan}
        />

        {/* Discovered Devices List */}
        {viewModel.discoveredDevices.length > 0 && (
          <DeviceList 
            devices={viewModel.discoveredDevices}
            onDevicePress={viewModel.connect}
            onDeviceDetailPress={(device) => {
              setSelectedDevice(device);
              setIsDetailModalVisible(true);
            }}
            connectedDeviceId={viewModel.connectedDevice?.id || null}
          />
        )}

        {/* Connected Device View */}
        {viewModel.connectedDevice && (
          <ConnectedDeviceView 
            device={viewModel.connectedDevice}
            onDisconnect={viewModel.disconnect}
            onDiscoverServices={viewModel.discoverServices}
            onReadCharacteristic={viewModel.readCharacteristic}
            onWriteCharacteristic={viewModel.writeCharacteristic}
            onSubscribeToCharacteristic={viewModel.subscribeToCharacteristic}
            onUnsubscribeFromCharacteristic={viewModel.unsubscribeFromCharacteristic}
          />
        )}

        {/* Log View */}
        <LogView 
          logs={viewModel.logs}
          onClearLogs={viewModel.clearLogs}
        />
      </ScrollView>

      {/* Device Detail Modal */}
      <DeviceDetailModal
        visible={isDetailModalVisible}
        device={selectedDevice}
        onClose={() => {
          setIsDetailModalVisible(false);
          setSelectedDevice(null);
        }}
        onConnect={viewModel.connect}
        isConnected={selectedDevice?.id === viewModel.connectedDevice?.id}
      />
    </SafeAreaView>
  );
}

