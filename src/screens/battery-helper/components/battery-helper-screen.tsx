import { ScreenHeader } from '@/src/shared/components/ScreenHeader';
import { ThemedText } from '@/src/shared/components/ThemedText';
import { t } from '@/src/shared/i18n';
import { getThemeColors, useTheme } from 'masterfabric-expo-core';
import React from 'react';
import { ScrollView, View, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useBatteryHelperViewModel } from '../hooks/use-battery-helper-view-model';
import { batteryHelperScreenStyles } from '../styles/battery-helper-screen.styles';
import { BatteryState } from 'expo-battery';

export function BatteryHelperScreen() {
  const { currentTheme } = useTheme();
  const isDark = currentTheme === 'dark';
  const colors = getThemeColors(isDark);
  
  const { batteryInfo, isLoading } = useBatteryHelperViewModel();

  const getBatteryStateText = (state: BatteryState) => {
    switch (state) {
      case BatteryState.UNKNOWN:
        return 'Unknown';
      case BatteryState.UNPLUGGED:
        return 'Unplugged';
      case BatteryState.CHARGING:
        return 'Charging';
      case BatteryState.FULL:
        return 'Full';
      default:
        return 'Unknown';
    }
  };

  return (
    <SafeAreaView 
      style={[batteryHelperScreenStyles.container, { backgroundColor: colors.background }]}
      edges={['top']}
    >
      <ScreenHeader 
        title={t('helpers.batteryHelper.title')}
        subtitle={t('helpers.batteryHelper.description')}
        variant="minimal"
      />
      
      <ScrollView 
        style={batteryHelperScreenStyles.scrollView}
        contentContainerStyle={batteryHelperScreenStyles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {isLoading ? (
          <ActivityIndicator size="large" color={colors.primary} />
        ) : (
          <View>
            <ThemedText type="subtitle" style={[batteryHelperScreenStyles.resultsTitle, { color: colors.sectionTitle }]}>
              {t('helpers.batteryHelper.batteryInfo')}
            </ThemedText>
            {batteryInfo && (
              <View>
                <ThemedText>Battery Level: {batteryInfo.batteryLevel}%</ThemedText>
                <ThemedText>Battery State: {getBatteryStateText(batteryInfo.batteryState)}</ThemedText>
                <ThemedText>Low Power Mode: {batteryInfo.lowPowerMode ? 'Enabled' : 'Disabled'}</ThemedText>
              </View>
            )}
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}
