import { ThemedText } from '@/src/shared/components/ThemedText';
import { ThemedView } from '@/src/shared/components/ThemedView';
import { t } from '@/src/shared/i18n';
import { Ionicons } from '@expo/vector-icons';
import { getThemeColors, useTheme } from 'masterfabric-expo-core';
import React from 'react';
import { ActivityIndicator, TouchableOpacity, View } from 'react-native';
import { scanControlsStyles } from '../styles/scan-controls.styles';

interface ScanControlsProps {
  isScanning: boolean;
  onStartScan: (serviceUUIDs?: string[]) => void;
  onStopScan: () => void;
}

/**
 * ScanControls Component
 * 
 * Controls for starting and stopping BLE device scanning.
 * Shows scanning state and provides start/stop buttons.
 */
export function ScanControls({ 
  isScanning, 
  onStartScan, 
  onStopScan 
}: ScanControlsProps) {
  const { currentTheme } = useTheme();
  const isDark = currentTheme === 'dark';
  const colors = getThemeColors(isDark);

  return (
    <ThemedView 
      style={[
        scanControlsStyles.container,
        {
          backgroundColor: colors.surfaceBackground,
          borderColor: colors.surfaceBorder + '30',
        }
      ]}
    >
      <ThemedText 
        type="subtitle" 
        style={[scanControlsStyles.title, { color: colors.sectionTitle }]}
      >
        {t('helpers.bleHelper.scan.title')}
      </ThemedText>

      <View style={scanControlsStyles.buttonContainer}>
        {isScanning ? (
          <TouchableOpacity
            style={[
              scanControlsStyles.button,
              scanControlsStyles.stopButton,
              { backgroundColor: '#FF3B30' }
            ]}
            onPress={onStopScan}
          >
            <Ionicons name="stop-circle" size={20} color="#FFFFFF" />
            <ThemedText style={scanControlsStyles.buttonText}>
              {t('helpers.bleHelper.scan.stop')}
            </ThemedText>
          </TouchableOpacity>
        ) : (
          <TouchableOpacity
            style={[
              scanControlsStyles.button,
              scanControlsStyles.startButton,
              { backgroundColor: '#34C759' }
            ]}
            onPress={() => onStartScan()}
          >
            <Ionicons name="search" size={20} color="#FFFFFF" />
            <ThemedText style={scanControlsStyles.buttonText}>
              {t('helpers.bleHelper.scan.start')}
            </ThemedText>
          </TouchableOpacity>
        )}

        {isScanning && (
          <View style={scanControlsStyles.scanningIndicator}>
            <ActivityIndicator size="small" color="#007AFF" />
            <ThemedText 
              style={[scanControlsStyles.scanningText, { color: colors.labelText }]}
            >
              {t('helpers.bleHelper.scan.scanning')}
            </ThemedText>
          </View>
        )}
      </View>
    </ThemedView>
  );
}

