import { Button, RefreshControl, ScrollView, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ScreenHeader } from '../../../shared/components/ScreenHeader';
import { ThemedText } from '../../../shared/components/ThemedText';
import { ThemedView } from '../../../shared/components/ThemedView';
import { getThemeColors } from '../../../shared/constants/Colors';
import { useTheme } from '../../../shared/contexts/theme-context';
import { useBatteryHelperViewModel } from '../hooks/use-battery-helper-view-model';
import { batteryHelperScreenStyles } from '../styles/battery-helper-screen.styles';
import { BatteryStatusCard } from './battery-status-card';
import { DeviceInfoCard } from './device-info-card';
import { LowPowerModeCard } from './low-power-mode-card';

export function BatteryHelperScreen() {
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
  } = useBatteryHelperViewModel();

  return (
    <SafeAreaView
      style={[batteryHelperScreenStyles.container, { backgroundColor: colors.background }]}
      edges={['top']}
    >
      <ScreenHeader
        title="Battery Helper"
        subtitle="Information about your device's battery"
      />

      <ScrollView
        style={batteryHelperScreenStyles.scrollView}
        contentContainerStyle={batteryHelperScreenStyles.scrollContent}
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

        <View style={batteryHelperScreenStyles.cardContainer}>
          <BatteryStatusCard
            batteryLevel={batteryState.batteryLevel}
            isCharging={batteryState.isCharging}
            chargingStatusText={chargingStatusText}
            batteryPercentage={batteryPercentage}
          />
        </View>

        <View style={batteryHelperScreenStyles.cardContainer}>
          <LowPowerModeCard
            lowPowerMode={batteryState.lowPowerMode}
            lowPowerModeStatusText={lowPowerModeStatusText}
            onOpenSettings={openLowPowerModeSettings}
          />
        </View>

        <View style={batteryHelperScreenStyles.cardContainer}>
          <DeviceInfoCard getDeviceInformation={getDeviceInformation} />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

