import { t } from '@/src/shared/i18n';
import {
  ActivityIndicator,
  ScrollView,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTheme } from 'masterfabric-expo-core';
import { ScreenHeader } from '@/src/shared/components/ScreenHeader';
import { ThemedText } from '@/src/shared/components/ThemedText';
import { usePermissionsHelperViewModel } from '../hooks/use-permissions-helper-view-model';
import { permissionsHelperScreenStyles as styles } from '../styles/permissions-helper-screen.styles';

const STATUS_I18N: Record<string, string> = {
  granted: 'helpers.permissionsHelper.statusGranted',
  denied: 'helpers.permissionsHelper.statusDenied',
  blocked: 'helpers.permissionsHelper.statusBlocked',
  unavailable: 'helpers.permissionsHelper.statusUnavailable',
  limited: 'helpers.permissionsHelper.statusLimited',
};

const STATUS_BADGES: Record<string, { emoji: string; color: string }> = {
  granted: { emoji: '🟢', color: '#22C55E' },
  denied: { emoji: '🟡', color: '#EAB308' },
  blocked: { emoji: '🔴', color: '#EF4444' },
  unavailable: { emoji: '⚪', color: '#94A3B8' },
  limited: { emoji: '🟡', color: '#EAB308' },
};

function getPermissionStatusDisplay(
  status: { status: string; granted: boolean; canAskAgain?: boolean } | null,
  t: (key: string) => string
): { label: string; color: string } {
  if (!status) return { label: '—', color: '#6B6B6B' };
  const s = status.status;
  const key = STATUS_I18N[s] || s;
  const statusLabel = t(key);
  const badge = STATUS_BADGES[s] ?? { emoji: '⚪', color: '#94A3B8' };
  return { label: statusLabel, color: badge.color };
}

const PERMISSION_LABEL_KEYS: Record<string, string> = {
  camera: 'helpers.permissionsHelper.permissionCamera',
  microphone: 'helpers.permissionsHelper.permissionMicrophone',
  photoLibrary: 'helpers.permissionsHelper.permissionPhotoLibrary',
  location: 'helpers.permissionsHelper.permissionLocation',
  notifications: 'helpers.permissionsHelper.permissionNotifications',
  calendar: 'helpers.permissionsHelper.permissionCalendar',
  contacts: 'helpers.permissionsHelper.permissionContacts',
  phone: 'helpers.permissionsHelper.permissionPhone',
};

const IOS_KEY_TO_I18N: Record<string, string> = {
  NSCameraUsageDescription: 'helpers.permissionsHelper.config.ios.camera',
  NSMicrophoneUsageDescription: 'helpers.permissionsHelper.config.ios.microphone',
  NSPhotoLibraryUsageDescription: 'helpers.permissionsHelper.config.ios.photoLibrary',
  NSPhotoLibraryAddUsageDescription: 'helpers.permissionsHelper.config.ios.photoLibraryAdd',
  NSLocationWhenInUseUsageDescription: 'helpers.permissionsHelper.config.ios.locationWhenInUse',
  NSLocationAlwaysAndWhenInUseUsageDescription: 'helpers.permissionsHelper.config.ios.locationAlways',
  NSLocationAlwaysUsageDescription: 'helpers.permissionsHelper.config.ios.locationBackground',
  NSContactsUsageDescription: 'helpers.permissionsHelper.config.ios.contacts',
};

const ANDROID_PERMISSION_TO_I18N: Record<string, string> = {
  CAMERA: 'helpers.permissionsHelper.config.android.CAMERA',
  RECORD_AUDIO: 'helpers.permissionsHelper.config.android.RECORD_AUDIO',
  READ_EXTERNAL_STORAGE: 'helpers.permissionsHelper.config.android.READ_EXTERNAL_STORAGE',
  READ_MEDIA_IMAGES: 'helpers.permissionsHelper.config.android.READ_MEDIA_IMAGES',
  ACCESS_FINE_LOCATION: 'helpers.permissionsHelper.config.android.ACCESS_FINE_LOCATION',
  ACCESS_COARSE_LOCATION: 'helpers.permissionsHelper.config.android.ACCESS_COARSE_LOCATION',
  ACCESS_BACKGROUND_LOCATION: 'helpers.permissionsHelper.config.android.ACCESS_BACKGROUND_LOCATION',
  POST_NOTIFICATIONS: 'helpers.permissionsHelper.config.android.POST_NOTIFICATIONS',
  READ_CALENDAR: 'helpers.permissionsHelper.config.android.READ_CALENDAR',
  WRITE_CALENDAR: 'helpers.permissionsHelper.config.android.WRITE_CALENDAR',
  READ_CONTACTS: 'helpers.permissionsHelper.config.android.READ_CONTACTS',
  WRITE_CONTACTS: 'helpers.permissionsHelper.config.android.WRITE_CONTACTS',
  READ_PHONE_STATE: 'helpers.permissionsHelper.config.android.READ_PHONE_STATE',
};

export function PermissionsHelperScreen() {
  const { isDark } = useTheme();

  const {
    statuses,
    loading,
    requestPermission,
    openSettings,
    refreshStatuses,
    permissionKeys,
    locationPermissionInfo,
    iosEntries,
    androidEntries,
  } = usePermissionsHelperViewModel();
  const bg = isDark ? '#0A0A0A' : '#FFFFFF';
  const cardBg = isDark ? '#1A1A1A' : '#F5F5F5';
  const textColor = isDark ? '#FFFFFF' : '#000000';
  const textSecondary = isDark ? '#999999' : '#6B6B6B';
  const borderColor = isDark ? '#2A2A2A' : '#E5E5E5';
  const btnSecondary = isDark ? '#2A2A2A' : '#E8E8E8';
  const blue = '#007AFF';

  const cardStyle = [styles.card, { backgroundColor: cardBg, borderWidth: 1, borderColor }];
  const configBlockStyle = [styles.configBlock, { backgroundColor: cardBg }];

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: bg }]} edges={['top']}>
      <ScreenHeader
        title={t('helpers.permissionsHelper.title')}
        subtitle={t('helpers.permissionsHelper.description')}
      />
      <ScrollView
        style={[styles.scrollView, { backgroundColor: bg }]}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.topButtonsRow}>
          <TouchableOpacity
            onPress={openSettings}
            style={[styles.settingsBtn, { backgroundColor: btnSecondary }]}
            activeOpacity={0.8}
          >
            <ThemedText style={[styles.settingsBtnText, { color: textColor }]}>
              {t('helpers.permissionsHelper.openSettings')}
            </ThemedText>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => refreshStatuses()}
            style={[styles.settingsBtn, { backgroundColor: btnSecondary }]}
            activeOpacity={0.8}
          >
            <ThemedText style={[styles.settingsBtnText, { color: textColor }]}>
              {t('helpers.permissionsHelper.refreshStatuses')}
            </ThemedText>
          </TouchableOpacity>
        </View>

        {permissionKeys.map((key) => {
          const status = statuses[key];
          const isLoad = loading[key];
          const isAnyLoading = Object.values(loading).some(Boolean);
          const labelKey = PERMISSION_LABEL_KEYS[key] ?? key;
          const label = t(labelKey);
          const statusDisplay = status ? getPermissionStatusDisplay(status, t) : { label: t('helpers.permissionsHelper.notChecked'), color: textSecondary };
          return (
            <View key={key} style={styles.cardContainer}>
              <View style={cardStyle}>
                <View style={styles.cardRow}>
                  <View style={styles.cardLabelBlock}>
                    <ThemedText style={[styles.sectionTitle, { color: textColor }]}>
                      {label}
                    </ThemedText>
                    <View style={styles.statusRow}>
                      <View style={[styles.statusDot, { backgroundColor: statusDisplay.color }]} />
                      <ThemedText style={[styles.statusText, { color: statusDisplay.color }]}>
                        {statusDisplay.label}
                      </ThemedText>
                    </View>
                    {key === 'location' && locationPermissionInfo && (
                      <View style={[styles.locationInfoBlock, { marginTop: 6 }]}>
                        <ThemedText style={[styles.locationInfoText, { color: textSecondary }]}>
                          {t('helpers.permissionsHelper.locationInfoForeground')}: {locationPermissionInfo.foreground}
                        </ThemedText>
                        <ThemedText style={[styles.locationInfoText, { color: textSecondary }]}>
                          {t('helpers.permissionsHelper.locationInfoBackground')}: {locationPermissionInfo.background}
                        </ThemedText>
                        <ThemedText style={[styles.locationInfoText, { color: textSecondary }]}>
                          {t('helpers.permissionsHelper.locationInfoPrecise')}: {locationPermissionInfo.precise ? 'true' : 'false'}
                        </ThemedText>
                      </View>
                    )}
                  </View>
                  <TouchableOpacity
                    onPress={() => requestPermission(key)}
                    disabled={isAnyLoading}
                    style={[
                      styles.requestBtn,
                      { backgroundColor: blue, opacity: isAnyLoading ? 0.6 : 1 },
                    ]}
                    activeOpacity={0.8}
                  >
                    {isLoad ? (
                      <ActivityIndicator size="small" color="#FFFFFF" />
                    ) : (
                      <ThemedText style={styles.requestBtnText}>
                        {t('helpers.permissionsHelper.request')}
                      </ThemedText>
                    )}
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          );
        })}

        <View style={styles.configSection}>
          <ThemedText style={[styles.configTitle, { color: textColor }]}>
            {t('helpers.permissionsHelper.iosConfig')}
          </ThemedText>
          <View style={configBlockStyle}>
            <ThemedText style={[styles.configCode, { color: textSecondary }]} selectable>
              {iosEntries.length > 0
                ? iosEntries.map((e) => {
                    const i18nKey = IOS_KEY_TO_I18N[e.key];
                    const val = i18nKey ? t(i18nKey) : e.value;
                    return `<key>${e.key}</key>\n<string>${val}</string>`;
                  }).join('\n\n')
                : '—'}
            </ThemedText>
          </View>
        </View>

        <View style={styles.configSection}>
          <ThemedText style={[styles.configTitle, { color: textColor }]}>
            {t('helpers.permissionsHelper.androidConfig')}
          </ThemedText>
          <View style={configBlockStyle}>
            <ThemedText style={[styles.configCode, { color: textSecondary }]} selectable>
              {androidEntries.length > 0
                ? androidEntries
                    .map((e) => {
                      const suffix = e.permission.replace('android.permission.', '');
                      const i18nKey = ANDROID_PERMISSION_TO_I18N[suffix];
                      const desc = i18nKey ? t(i18nKey) : e.description;
                      return `<!-- ${desc} -->\n<uses-permission android:name="${e.permission}" />`;
                    })
                    .join('\n\n')
                : '—'}
            </ThemedText>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
