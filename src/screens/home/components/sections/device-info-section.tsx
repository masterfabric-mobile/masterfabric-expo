import { ThemedText } from '@/src/shared/components/ThemedText';
import { ThemedView } from '@/src/shared/components/ThemedView';
import { t } from '@/src/shared/i18n';
import React from 'react';
import { useColorScheme } from 'react-native';
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
        {t('deviceInfo.title')}
      </ThemedText>
      
      <ThemedView style={[
        deviceInfoStyles.infoCard,
        { backgroundColor: isDark ? '#1C1C1E' : '#F2F2F7' }
      ]}>
        <ThemedText style={deviceInfoStyles.infoText}>
          {`${t('deviceInfo.platform')}: ${deviceInfo.platform || t('common.unknown')}`}
        </ThemedText>
        <ThemedText style={deviceInfoStyles.infoText}>
          {`${t('deviceInfo.device')}: ${deviceInfo.deviceName || t('common.unknown')}`}
        </ThemedText>
        <ThemedText style={deviceInfoStyles.infoText}>
          {`${t('deviceInfo.os')}: ${deviceInfo.osName || t('common.unknown')} ${deviceInfo.osVersion || ''}`}
        </ThemedText>
        <ThemedText style={deviceInfoStyles.infoText}>
          {`${t('deviceInfo.appVersion')}: ${deviceInfo.appVersion || t('common.unknown')}`}
        </ThemedText>
        <ThemedText style={deviceInfoStyles.infoText}>
          {`${t('deviceInfo.screen')}: ${deviceInfo.screenWidth}x${deviceInfo.screenHeight}`}
        </ThemedText>
        <ThemedText style={deviceInfoStyles.infoText}>
          {`${t('deviceInfo.isDevice')}: ${deviceInfo.isDevice ? t('common.yes') : t('common.no')}`}
        </ThemedText>
        {!compatibilityLoading && compatibility && (
          <>
            <ThemedText style={[
              deviceInfoStyles.infoText,
              { color: compatibility.isCompatible ? '#34C759' : '#FF3B30' }
            ]}>
              {`${t('deviceInfo.compatible')}: ${compatibility.isCompatible ? t('common.yes') : t('common.no')}`}
            </ThemedText>
            {compatibility.warnings.length > 0 && (
              <ThemedText style={[deviceInfoStyles.infoText, { color: '#FF9500' }]}>
                {`${t('deviceInfo.warnings')}: ${compatibility.warnings.length}`}
              </ThemedText>
            )}
          </>
        )}
      </ThemedView>
    </ThemedView>
  );
}
