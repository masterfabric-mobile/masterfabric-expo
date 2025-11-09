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
import { BatteryInfoItem } from './battery-info-item';
import { BatteryBar } from './battery-bar';

export function BatteryHelperScreen() {
  const { currentTheme } = useTheme();
  const isDark = currentTheme === 'dark';
  const colors = getThemeColors(isDark);
  
  const { batteryInfo, isLoading } = useBatteryHelperViewModel();

  const getBatteryStateText = (state: BatteryState) => {
    switch (state) {
      case BatteryState.UNKNOWN:
        return t('common.unknown');
      case BatteryState.UNPLUGGED:
        return t('helpers.batteryHelper.unplugged');
      case BatteryState.CHARGING:
        return t('helpers.batteryHelper.charging');
      case BatteryState.FULL:
        return t('helpers.batteryHelper.full');
      default:
        return t('common.unknown');
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
          <View style={batteryHelperScreenStyles.infoCard}>
            <ThemedText type="subtitle" style={[batteryHelperScreenStyles.resultsTitle, { color: colors.sectionTitle }]}>
              {t('helpers.batteryHelper.batteryInfo')}
            </ThemedText>
            {batteryInfo && (
              <View>
                <BatteryBar level={batteryInfo.batteryLevel} />
                <BatteryInfoItem 
                  iconName="battery-half-outline" 
                  label={t('helpers.batteryHelper.level')} 
                  value={batteryInfo.batteryLevel !== null ? `${batteryInfo.batteryLevel}%` : t('helpers.batteryHelper.notAvailable')} 
                  color={batteryInfo.batteryLevel !== null && batteryInfo.batteryLevel <= 20 ? colors.error : colors.text}
                />
                <BatteryInfoItem 
                  iconName="flash-outline" 
                  label={t('helpers.batteryHelper.state')} 
                  value={getBatteryStateText(batteryInfo.batteryState)} 
                  color={batteryInfo.batteryState === BatteryState.CHARGING ? colors.success : colors.text}
                />
                <BatteryInfoItem 
                  iconName="power-outline" 
                  label={t('helpers.batteryHelper.lowPowerMode')} 
                  value={batteryInfo.lowPowerMode ? t('common.enabled') : t('common.disabled')} 
                  color={batteryInfo.lowPowerMode ? colors.warning : colors.text}
                />
              </View>
            )}
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}
