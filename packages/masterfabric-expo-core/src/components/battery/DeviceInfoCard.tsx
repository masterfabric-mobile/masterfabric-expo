import { useEffect, useState } from 'react';
import { ActivityIndicator, View } from 'react-native';
import { getThemeColors } from '../../constants/Colors';
import { useTheme } from '../../contexts/ThemeContext';
import { DeviceInfo as DeviceInfoHelper } from '../../helpers/device-info';
import { deviceInfoCardStyles } from '../../styles/device_info_card.styles';
import { ThemedText } from '../ThemedText';
import { ThemedView } from '../ThemedView';

interface DeviceInfoCardProps {
  getDeviceInformation: () => Promise<DeviceInfoHelper | null>;
}

export function DeviceInfoCard({ getDeviceInformation }: DeviceInfoCardProps) {
  const { currentTheme } = useTheme();
  const isDark = currentTheme === 'dark';
  const colors = getThemeColors(isDark);
  const [deviceInfo, setDeviceInfo] = useState<DeviceInfoHelper | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadDeviceInfo = async () => {
      setIsLoading(true);
      const info = await getDeviceInformation();
      setDeviceInfo(info);
      setIsLoading(false);
    };

    loadDeviceInfo();
  }, [getDeviceInformation]);

  if (isLoading) {
    return (
      <ThemedView
        style={[
          deviceInfoCardStyles.container,
          {
            backgroundColor: colors.surfaceBackground,
            borderColor: colors.surfaceBorder + '30',
          },
        ]}
      >
        <View style={deviceInfoCardStyles.header}>
          <ThemedText
            type="subtitle"
            style={[deviceInfoCardStyles.title, { color: colors.sectionTitle }]}
          >
            Device Information
          </ThemedText>
        </View>
        <ActivityIndicator size="small" color={colors.primary} />
      </ThemedView>
    );
  }

  if (!deviceInfo) {
    return (
      <ThemedView
        style={[
          deviceInfoCardStyles.container,
          {
            backgroundColor: colors.surfaceBackground,
            borderColor: colors.surfaceBorder + '30',
          },
        ]}
      >
        <View style={deviceInfoCardStyles.header}>
          <ThemedText
            type="subtitle"
            style={[deviceInfoCardStyles.title, { color: colors.sectionTitle }]}
          >
            Device Information
          </ThemedText>
        </View>
        <ThemedText style={{ color: colors.text }}>
          Device information is unavailable.
        </ThemedText>
      </ThemedView>
    );
  }

  const infoRows = [
    {
      label: 'Device Model',
      value: deviceInfo.modelName || deviceInfo.deviceName || 'Unknown',
    },
    {
      label: 'Device Type',
      value: String(deviceInfo.deviceType) || 'Unknown',
    },
    {
      label: 'OS Version',
      value: `${deviceInfo.osName} ${deviceInfo.osVersion || ''}`.trim() || 'Unknown',
    },
    {
      label: 'Platform',
      value: deviceInfo.platform.toUpperCase(),
    },
    {
      label: 'Brand',
      value: deviceInfo.brand || deviceInfo.manufacturer || 'Unknown',
    },
    {
      label: 'App Version',
      value: `${deviceInfo.appVersion} (${deviceInfo.appBuildVersion})`,
    },
  ];

  return (
    <ThemedView
      style={[
        deviceInfoCardStyles.container,
        {
          backgroundColor: colors.surfaceBackground,
          borderColor: colors.surfaceBorder + '30',
        },
      ]}
    >
      <View style={deviceInfoCardStyles.header}>
        <ThemedText
          type="subtitle"
          style={[deviceInfoCardStyles.title, { color: colors.sectionTitle }]}
        >
          Device Information
        </ThemedText>
      </View>

      {infoRows.map((row, index) => (
        <View
          key={index}
          style={[
            deviceInfoCardStyles.infoRow,
            index === infoRows.length - 1 && deviceInfoCardStyles.infoRowLast,
            { borderBottomColor: colors.surfaceBorder + '30' },
          ]}
        >
          <ThemedText
            style={[deviceInfoCardStyles.infoLabel, { color: colors.text }]}
          >
            {row.label}
          </ThemedText>
          <ThemedText
            style={[deviceInfoCardStyles.infoValue, { color: colors.text }]}
          >
            {row.value}
          </ThemedText>
        </View>
      ))}
    </ThemedView>
  );
}

