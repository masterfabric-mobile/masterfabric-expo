import { t } from '@/src/shared/i18n';
import {
  ActivityIndicator,
  ScrollView,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { getThemeColors, useTheme } from 'masterfabric-expo-core';
import { ScreenHeader } from '@/src/shared/components/ScreenHeader';
import { ThemedText } from '@/src/shared/components/ThemedText';
import {
  ANDROID_PERMISSION_TO_I18N,
  IOS_KEY_TO_I18N,
  PERMISSION_LABEL_KEYS,
} from '../constants/permissions-helper.constants';
import { usePermissionsHelperViewModel } from '../hooks/use-permissions-helper-view-model';
import { permissionsHelperScreenStyles as styles } from '../styles/permissions-helper-screen.styles';
import { getPermissionStatusDisplay } from '../utils';

export function PermissionsHelperScreen() {
  const { isDark } = useTheme();
  const colors = getThemeColors(isDark);

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

  const cardStyle = [
    styles.card,
    { backgroundColor: colors.cardBackground, borderWidth: 1, borderColor: colors.surfaceBorder },
  ];
  const configBlockStyle = [styles.configBlock, { backgroundColor: colors.cardBackground }];
  const primaryBtnTextColor = '#FFFFFF';

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]} edges={['top']}>
      <ScreenHeader
        title={t('helpers.permissionsHelper.title')}
        subtitle={t('helpers.permissionsHelper.description')}
      />
      <ScrollView
        style={[styles.scrollView, { backgroundColor: colors.background }]}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.topButtonsRow}>
          <TouchableOpacity
            onPress={openSettings}
            style={[styles.settingsBtn, { backgroundColor: colors.buttonBackground }]}
            activeOpacity={0.8}
          >
            <ThemedText style={[styles.settingsBtnText, { color: colors.text }]}>
              {t('helpers.permissionsHelper.openSettings')}
            </ThemedText>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => refreshStatuses()}
            style={[styles.settingsBtn, { backgroundColor: colors.buttonBackground }]}
            activeOpacity={0.8}
          >
            <ThemedText style={[styles.settingsBtnText, { color: colors.text }]}>
              {t('helpers.permissionsHelper.refreshStatuses')}
            </ThemedText>
          </TouchableOpacity>
        </View>
        <ThemedText style={[styles.hintText, { color: colors.inactiveText }]}>
          {t('helpers.permissionsHelper.changePermissionHint')}
        </ThemedText>

        {permissionKeys.map((key) => {
          const status = statuses[key];
          const isLoad = loading[key];
          const isAnyLoading = Object.values(loading).some(Boolean);
          const labelKey = PERMISSION_LABEL_KEYS[key] ?? key;
          const label = t(labelKey);
          const statusDisplay = status
            ? getPermissionStatusDisplay(status, t, colors)
            : { label: t('helpers.permissionsHelper.notChecked'), color: colors.inactiveText };
          return (
            <View key={key} style={styles.cardContainer}>
              <View style={cardStyle}>
                <View style={styles.cardRow}>
                  <View style={styles.cardLabelBlock}>
                    <ThemedText style={[styles.sectionTitle, { color: colors.sectionTitle }]}>
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
                        <ThemedText style={[styles.locationInfoText, { color: colors.inactiveText }]}>
                          {t('helpers.permissionsHelper.locationInfoForeground')}: {locationPermissionInfo.foreground}
                        </ThemedText>
                        <ThemedText style={[styles.locationInfoText, { color: colors.inactiveText }]}>
                          {t('helpers.permissionsHelper.locationInfoBackground')}: {locationPermissionInfo.background}
                        </ThemedText>
                        <ThemedText style={[styles.locationInfoText, { color: colors.inactiveText }]}>
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
                      { backgroundColor: colors.activeButton, opacity: isAnyLoading ? 0.6 : 1 },
                    ]}
                    activeOpacity={0.8}
                  >
                    {isLoad ? (
                      <ActivityIndicator size="small" color={primaryBtnTextColor} />
                    ) : (
                      <ThemedText style={[styles.requestBtnText, { color: primaryBtnTextColor }]}>
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
          <ThemedText style={[styles.configTitle, { color: colors.sectionTitle }]}>
            {t('helpers.permissionsHelper.iosConfig')}
          </ThemedText>
          <View style={configBlockStyle}>
            <ThemedText style={[styles.configCode, { color: colors.inactiveText }]} selectable>
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
          <ThemedText style={[styles.configTitle, { color: colors.sectionTitle }]}>
            {t('helpers.permissionsHelper.androidConfig')}
          </ThemedText>
          <View style={configBlockStyle}>
            <ThemedText style={[styles.configCode, { color: colors.inactiveText }]} selectable>
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
