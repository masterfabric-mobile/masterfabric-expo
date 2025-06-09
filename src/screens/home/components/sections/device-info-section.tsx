import React from 'react';
import { useColorScheme } from 'react-native';
import { ThemedText } from '@/src/shared/components/ThemedText';
import { ThemedView } from '@/src/shared/components/ThemedView';
import { deviceInfoStyles } from '../../styles/device-info.styles';

interface DeviceInfo {
  platform?: string;
  deviceName?: string;
  osName?: string;
  osVersion?: string;
  appVersion?: string;
  screenWidth?: number;
  screenHeight?: number;
  isDevice?: boolean;
}

interface Compatibility {
  isCompatible: boolean;
  warnings: string[];
}

interface DeviceInfoSectionProps {
  deviceInfo: DeviceInfo;
  compatibility?: Compatibility;
  compatibilityLoading: boolean;
}

export function DeviceInfoSection({ 
  deviceInfo, 
  compatibility, 
  compatibilityLoading 
}: DeviceInfoSectionProps) {
  const isDark = useColorScheme() === 'dark';

  return (
    <ThemedView style={deviceInfoStyles.section}>
      <ThemedText type="subtitle" style={deviceInfoStyles.sectionTitle}>
        Device Information
      </ThemedText>
      
      <ThemedView style={[
        deviceInfoStyles.infoCard,
        { backgroundColor: isDark ? '#1C1C1E' : '#F2F2F7' }
      ]}>
        <ThemedText style={deviceInfoStyles.infoText}>
          {`Platform: ${deviceInfo.platform || 'Unknown'}`}
        </ThemedText>
        <ThemedText style={deviceInfoStyles.infoText}>
          {`Device: ${deviceInfo.deviceName || 'Unknown'}`}
        </ThemedText>
        <ThemedText style={deviceInfoStyles.infoText}>
          {`OS: ${deviceInfo.osName || 'Unknown'} ${deviceInfo.osVersion || ''}`}
        </ThemedText>
        <ThemedText style={deviceInfoStyles.infoText}>
          {`App Version: ${deviceInfo.appVersion || 'Unknown'}`}
        </ThemedText>
        <ThemedText style={deviceInfoStyles.infoText}>
          {`Screen: ${deviceInfo.screenWidth}x${deviceInfo.screenHeight}`}
        </ThemedText>
        <ThemedText style={deviceInfoStyles.infoText}>
          {`Is Device: ${deviceInfo.isDevice ? 'Yes' : 'No'}`}
        </ThemedText>
        {!compatibilityLoading && compatibility && (
          <>
            <ThemedText style={[
              deviceInfoStyles.infoText,
              { color: compatibility.isCompatible ? '#34C759' : '#FF3B30' }
            ]}>
              {`Compatible: ${compatibility.isCompatible ? 'Yes' : 'No'}`}
            </ThemedText>
            {compatibility.warnings.length > 0 && (
              <ThemedText style={[deviceInfoStyles.infoText, { color: '#FF9500' }]}>
                {`Warnings: ${compatibility.warnings.length}`}
              </ThemedText>
            )}
          </>
        )}
      </ThemedView>
    </ThemedView>
  );
}
