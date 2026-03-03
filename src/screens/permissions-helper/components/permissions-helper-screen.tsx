import { t } from '@/src/shared/i18n';
import { useFocusEffect } from '@react-navigation/native';
import {
  getThemeColors,
  permissionsHandler,
  ScreenHeader,
  ThemedText,
  useTheme,
} from 'masterfabric-expo-core';
import type { PermissionType } from 'masterfabric-expo-core';
import React, { useCallback, useMemo } from 'react';
import { ScrollView, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import {
  PERMISSION_LABEL_KEYS,
  PERMISSION_KEYS,
  PERMISSIONS_AVAILABLE_IN_EXPO_GO,
  IOS_KEY_TO_I18N,
  ANDROID_PERMISSION_TO_I18N,
} from '../constants/permissions-helper.constants';
import { usePermissionsHelperViewModel } from '../hooks/use-permissions-helper-view-model';
import {
  configPreviewSectionStyles,
  getPermissionsHelperScreenDynamicStyles,
  locationDetailStyles,
  permissionCardStyles,
  permissionsHelperScreenStyles as styles,
} from '../styles/permissions-helper-screen.styles';
import { getPermissionStatusDisplay } from '../utils';
import { ConfigPreviewSection } from './config-preview-section';
import { LocationPermissionDetail } from './location-permission-detail';
import { PermissionCard } from './permission-card';

type ThemedTextStyle = React.ComponentProps<typeof ThemedText>['style'];

const permissionKeysForConfig = PERMISSION_KEYS as unknown as PermissionType[];

function formatIOSConfigContent(): string {
  const entries = permissionsHandler.getIOSInfoPlistEntries(permissionKeysForConfig);
  return entries
    .map(
      (e) => {
        const i18nKey = IOS_KEY_TO_I18N[e.key];
        const localizedValue = i18nKey ? t(i18nKey) : e.value;
        const commentText = i18nKey ? localizedValue : e.description;
        return `<key>${e.key}</key>\n<string>${localizedValue}</string>\n<!-- ${commentText} -->`;
      }
    )
    .join('\n\n');
}

function formatAndroidConfigContent(): string {
  const entries =
    permissionsHandler.getAndroidManifestEntries(permissionKeysForConfig);
  return entries
    .map((e) => {
      const name = `android:name="${e.permission}"`;
      const maxSdk =
        e.maxSdkVersion != null
          ? ` android:maxSdkVersion="${e.maxSdkVersion}"`
          : '';
      const flags =
        e.usesPermissionFlags != null
          ? ` android:usesPermissionFlags="${e.usesPermissionFlags}"`
          : '';
      const suffix = e.permission.split('.').pop() ?? e.permission;
      const i18nKey = ANDROID_PERMISSION_TO_I18N[suffix];
      const commentText = i18nKey ? t(i18nKey) : e.description;
      return `<uses-permission ${name}${maxSdk}${flags} />\n<!-- ${commentText} -->`;
    })
    .join('\n');
}

export function PermissionsHelperScreen() {
  const { isDark } = useTheme();
  const colors = getThemeColors(isDark);
  const dynamicStyles = getPermissionsHelperScreenDynamicStyles(colors);

  const iosConfigContent = useMemo(() => formatIOSConfigContent(), []);
  const androidConfigContent = useMemo(() => formatAndroidConfigContent(), []);

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
          // Face ID / biyometri: sadece kullanıcı "İstek"e basıp onayladıktan sonra "Verildi" göster
          const mustRequestFirst = key === 'biometrics';
          const displayStatus =
            mustRequestFirst &&
            !requestAttempted[key] &&
            status?.status === 'granted'
              ? { status: 'denied' as const, granted: false, canAskAgain: true }
              : status;
          const statusDisplay = getPermissionStatusDisplay(displayStatus, t, colors, {
            permissionKey: key,
          });

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
                !PERMISSIONS_AVAILABLE_IN_EXPO_GO.includes(key) &&
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

        <ConfigPreviewSection
          title={t('helpers.permissionsHelper.iosConfig')}
          content={iosConfigContent}
          titleStyle={{ color: colors.sectionTitle }}
          blockStyle={dynamicStyles.configBlock}
          codeStyle={{ color: colors.text }}
          styles={configPreviewSectionStyles}
        />
        <ConfigPreviewSection
          title={t('helpers.permissionsHelper.androidConfig')}
          content={androidConfigContent}
          titleStyle={{ color: colors.sectionTitle }}
          blockStyle={dynamicStyles.configBlock}
          codeStyle={{ color: colors.text }}
          styles={configPreviewSectionStyles}
        />
      </ScrollView>
    </SafeAreaView>
  );
}
