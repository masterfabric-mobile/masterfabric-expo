import { ThemedText } from '@/src/shared/components/ThemedText';
import { t } from '@/src/shared/i18n';
import { getThemeColors, useTheme } from 'masterfabric-expo-core';
import React from 'react';
import { View } from 'react-native';
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
  const { currentTheme } = useTheme();
  const isDark = currentTheme === 'dark';
  const colors = getThemeColors(isDark);

  return (
    <View style={deviceInfoStyles.section}>
      <ThemedText 
        type="subtitle" 
        style={[
          deviceInfoStyles.sectionTitle,
          { color: colors.sectionTitle }
        ]}
      >
        {t('deviceInfo.title')}
      </ThemedText>
      
      <View style={[
        deviceInfoStyles.infoCard,
        { 
          backgroundColor: colors.surfaceBackground,
          borderColor: colors.surfaceBorder,
          borderWidth: 1,
        }
      ]}>
        <ThemedText 
          style={[
            deviceInfoStyles.infoText,
            { color: colors.labelText }
          ]}
        >
          {`${t('deviceInfo.platform')}: ${deviceInfo.platform || t('common.unknown')}`}
        </ThemedText>
        <ThemedText 
          style={[
            deviceInfoStyles.infoText,
            { color: colors.labelText }
          ]}
        >
          {`${t('deviceInfo.device')}: ${deviceInfo.deviceName || t('common.unknown')}`}
        </ThemedText>
        <ThemedText 
          style={[
            deviceInfoStyles.infoText,
            { color: colors.labelText }
          ]}
        >
          {`${t('deviceInfo.os')}: ${deviceInfo.osName || t('common.unknown')} ${deviceInfo.osVersion || ''}`}
        </ThemedText>
        <ThemedText 
          style={[
            deviceInfoStyles.infoText,
            { color: colors.labelText }
          ]}
        >
          {`${t('deviceInfo.appVersion')}: ${deviceInfo.appVersion || t('common.unknown')}`}
        </ThemedText>
        <ThemedText 
          style={[
            deviceInfoStyles.infoText,
            { color: colors.labelText }
          ]}
        >
          {`${t('deviceInfo.screen')}: ${deviceInfo.screenWidth}x${deviceInfo.screenHeight}`}
        </ThemedText>
        <ThemedText 
          style={[
            deviceInfoStyles.infoText,
            { color: colors.labelText }
          ]}
        >
          {`${t('deviceInfo.isDevice')}: ${deviceInfo.isDevice ? t('common.yes') : t('common.no')}`}
        </ThemedText>
        {!compatibilityLoading && compatibility && (
          <>
            <ThemedText style={[
              deviceInfoStyles.infoText,
              { color: compatibility.isCompatible ? colors.successColor : colors.errorColor }
            ]}>
              {`${t('deviceInfo.compatible')}: ${compatibility.isCompatible ? t('common.yes') : t('common.no')}`}
            </ThemedText>
            {compatibility.warnings.length > 0 && (
              <ThemedText style={[
                deviceInfoStyles.infoText,
                { color: colors.warningColor }
              ]}>
                {`${t('deviceInfo.warnings')}: ${compatibility.warnings.length}`}
              </ThemedText>
            )}
          </>
        )}
      </View>
    </View>
  );
}
