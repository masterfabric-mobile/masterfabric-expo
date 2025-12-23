import { Button, RefreshControl, ScrollView, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ScreenHeader } from '../ScreenHeader';
import { ThemedText } from '../ThemedText';
import { ThemedView } from '../ThemedView';
import { useTheme } from '../../contexts/ThemeContext';
import { getThemeColors } from '../../constants/Colors';
import { useBatteryHelper } from '../../hooks/useBatteryHelper';
import { BatteryStatusCard } from './BatteryStatusCard';
import { DeviceInfoCard } from './DeviceInfoCard';
import { LowPowerModeCard } from './LowPowerModeCard';

export function BatteryHelperView() {
  const { currentTheme } = useTheme();
  const isDark = currentTheme === 'dark';
  const colors = getThemeColors(isDark);

  const {
    batteryState,
    batteryPercentage,
    chargingStatusText,
    lowPowerModeStatusText,
    isLoading,
    error,
    handleRefresh,
    openLowPowerModeSettings,
    getDeviceInformation,
  } = useBatteryHelper();

  return (
    <SafeAreaView
      style={[{ flex: 1, backgroundColor: colors.background }]}
      edges={['top']}
    >
      <ScreenHeader
        title="Battery Helper"
        subtitle="Information about your device's battery"
      />

      <ScrollView
        style={{ flex: 1 }}
        contentContainerStyle={{ padding: 16 }}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={isLoading}
            onRefresh={handleRefresh}
            tintColor={colors.tint}
          />
        }
      >
        {error && (
          <ThemedView
            style={[
              {
                padding: 16,
                marginBottom: 16,
                borderRadius: 12,
                backgroundColor: colors.errorColor + '20',
                borderWidth: 1,
                borderColor: colors.errorColor + '40',
              },
            ]}
          >
            <ThemedText
              style={[
                {
                  color: colors.errorColor,
                  marginBottom: 12,
                  fontSize: 14,
                  lineHeight: 20,
                },
              ]}
            >
              {error}
            </ThemedText>
            <Button
              title="Retry"
              onPress={handleRefresh}
              color={colors.tint}
            />
          </ThemedView>
        )}

        <View style={{ marginBottom: 16 }}>
          <BatteryStatusCard
            batteryLevel={batteryState.batteryLevel}
            isCharging={batteryState.isCharging}
            chargingStatusText={chargingStatusText}
            batteryPercentage={batteryPercentage}
          />
        </View>

        <View style={{ marginBottom: 16 }}>
          <LowPowerModeCard
            lowPowerMode={batteryState.lowPowerMode}
            lowPowerModeStatusText={lowPowerModeStatusText}
            onOpenSettings={openLowPowerModeSettings}
          />
        </View>

        <View style={{ marginBottom: 16 }}>
          <DeviceInfoCard getDeviceInformation={getDeviceInformation} />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

