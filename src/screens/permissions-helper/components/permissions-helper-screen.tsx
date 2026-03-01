import { t } from '@/src/shared/i18n';
import { useFocusEffect } from '@react-navigation/native';
import {
  getThemeColors,
  ScreenHeader,
  ThemedText,
  useTheme,
} from 'masterfabric-expo-core';
import React, { useCallback } from 'react';
import { ScrollView, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { PERMISSION_LABEL_KEYS } from '../constants/permissions-helper.constants';
import { usePermissionsHelperViewModel } from '../hooks/use-permissions-helper-view-model';
import {
  getPermissionsHelperScreenDynamicStyles,
  locationDetailStyles,
  permissionCardStyles,
  permissionsHelperScreenStyles as styles,
} from '../styles/permissions-helper-screen.styles';
import { getPermissionStatusDisplay } from '../utils';
import { LocationPermissionDetail } from './location-permission-detail';
import { PermissionCard } from './permission-card';

type ThemedTextStyle = React.ComponentProps<typeof ThemedText>['style'];

export function PermissionsHelperScreen() {
  const { isDark } = useTheme();
  const colors = getThemeColors(isDark);
  const dynamicStyles = getPermissionsHelperScreenDynamicStyles(colors);

  const {
    statuses,
    loading,
    requestPermission,
    openSettings,
    refreshStatuses,
    refreshStatusesSilent,
    permissionKeys,
    requestAttempted,
    isAnyRequestInProgress,
    locationPermissionInfo,
  } = usePermissionsHelperViewModel();

  useFocusEffect(
    useCallback(() => {
      refreshStatusesSilent();
    }, [refreshStatusesSilent])
  );

  return (
    <SafeAreaView
      style={[styles.container, dynamicStyles.container]}
      edges={['top']}
    >
      <ScreenHeader
        title={t('helpers.permissionsHelper.title')}
        subtitle={t('helpers.permissionsHelper.description')}
      />
      <ScrollView
        style={[styles.scrollView, dynamicStyles.scrollView]}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.topButtonsRow}>
          <TouchableOpacity
            onPress={openSettings}
            disabled={isAnyRequestInProgress}
            style={[
              styles.settingsBtn,
              {
                backgroundColor: colors.buttonBackground,
                opacity: isAnyRequestInProgress ? 0.6 : 1,
              },
            ]}
            activeOpacity={0.8}
          >
            <ThemedText
              style={
                [
                  styles.settingsBtnText,
                  { color: colors.text },
                ] as ThemedTextStyle
              }
            >
              {t('helpers.permissionsHelper.openSettings')}
            </ThemedText>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => refreshStatuses()}
            disabled={isAnyRequestInProgress}
            style={[
              styles.settingsBtn,
              {
                backgroundColor: colors.buttonBackground,
                opacity: isAnyRequestInProgress ? 0.6 : 1,
              },
            ]}
            activeOpacity={0.8}
          >
            <ThemedText
              style={
                [
                  styles.settingsBtnText,
                  { color: colors.text },
                ] as ThemedTextStyle
              }
            >
              {t('helpers.permissionsHelper.refreshStatuses')}
            </ThemedText>
          </TouchableOpacity>
        </View>

        <ThemedText
          style={
            [styles.hintText, { color: colors.inactiveText }] as ThemedTextStyle
          }
        >
          {t('helpers.permissionsHelper.changePermissionHint')}{' · '}
          {t('helpers.permissionsHelper.platformHint')}
        </ThemedText>

        {permissionKeys.map(key => {
          const status = statuses[key];
          const isLoad = loading[key];
          const isAnyLoading = Object.values(loading).some(Boolean);
          const labelKey = PERMISSION_LABEL_KEYS[key] ?? key;
          const label = t(labelKey);
          const statusDisplay = getPermissionStatusDisplay(status, t, colors);

          const statusContent =
            key === 'location' && locationPermissionInfo ? (
              <LocationPermissionDetail
                info={locationPermissionInfo}
                labels={{
                  foregroundLabel: `${t('helpers.permissionsHelper.locationInfoForeground')}: `,
                  backgroundLabel: `${t('helpers.permissionsHelper.locationInfoBackground')}: `,
                  preciseLabel: `${t('helpers.permissionsHelper.locationInfoPrecise')}: `,
                  foregroundStatus: t(
                    locationPermissionInfo.foreground === 'granted'
                      ? 'helpers.permissionsHelper.statusGranted'
                      : locationPermissionInfo.foreground === 'denied'
                        ? 'helpers.permissionsHelper.statusDenied'
                        : 'helpers.permissionsHelper.statusUnavailable'
                  ),
                  backgroundStatus: t(
                    locationPermissionInfo.background === 'granted'
                      ? 'helpers.permissionsHelper.statusGranted'
                      : locationPermissionInfo.background === 'denied'
                        ? 'helpers.permissionsHelper.statusDenied'
                        : 'helpers.permissionsHelper.statusUnavailable'
                  ),
                  preciseStatus: t(
                    locationPermissionInfo.precise
                      ? 'helpers.permissionsHelper.statusGranted'
                      : 'helpers.permissionsHelper.statusDenied'
                  ),
                }}
                styles={locationDetailStyles}
                labelStyle={{ color: colors.inactiveText }}
                foregroundStatusStyle={{
                  color:
                    locationPermissionInfo.foreground === 'granted'
                      ? colors.successColor
                      : locationPermissionInfo.foreground === 'denied'
                        ? colors.warningColor
                        : colors.inactiveText,
                }}
                backgroundStatusStyle={{
                  color:
                    locationPermissionInfo.background === 'granted'
                      ? colors.successColor
                      : locationPermissionInfo.background === 'denied'
                        ? colors.warningColor
                        : colors.inactiveText,
                }}
                preciseStatusStyle={{
                  color: locationPermissionInfo.precise
                    ? colors.successColor
                    : colors.warningColor,
                }}
              />
            ) : (
              <View style={styles.statusColumn}>
                <View style={styles.statusRow}>
                  <View
                    style={[
                      styles.statusDot,
                      { backgroundColor: statusDisplay.color },
                    ]}
                  />
                  <ThemedText
                    style={
                      [
                        styles.statusText,
                        { color: statusDisplay.color },
                      ] as ThemedTextStyle
                    }
                  >
                    {statusDisplay.label}
                  </ThemedText>
                </View>
                {status?.status === 'unavailable' &&
                (statusDisplay.unavailableExplanation ?? status?.message) ? (
                  <ThemedText
                    style={
                      [
                        styles.statusSubtext,
                        { color: colors.inactiveText },
                      ] as ThemedTextStyle
                    }
                    numberOfLines={3}
                  >
                    {statusDisplay.unavailableExplanation ?? status?.message}
                  </ThemedText>
                ) : null}
              </View>
            );

          return (
            <PermissionCard
              key={key}
              label={label}
              labelStyle={{ color: colors.sectionTitle }}
              statusContent={statusContent}
              requestButtonLabel={t('helpers.permissionsHelper.request')}
              isLoad={isLoad}
              isAnyLoading={isAnyLoading}
              onRequest={() => requestPermission(key)}
              cardStyle={dynamicStyles.card}
              requestBtnStyle={dynamicStyles.requestBtn}
              primaryBtnTextColor={dynamicStyles.primaryBtnTextColor}
              styles={permissionCardStyles}
            />
          );
        })}
      </ScrollView>
    </SafeAreaView>
  );
}
