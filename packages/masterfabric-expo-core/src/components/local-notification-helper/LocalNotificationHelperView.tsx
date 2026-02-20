import { Ionicons } from '@expo/vector-icons';
import React, { useMemo, useState } from 'react';
import {
  Alert,
  Platform,
  Pressable,
  RefreshControl,
  ScrollView,
  TextInput,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { getThemeColors } from '../../constants/Colors';
import { useTheme } from '../../contexts/ThemeContext';
import type { LocalNotificationHelperOptions } from '../../hooks/useLocalNotificationHelper';
import { useLocalNotificationHelper } from '../../hooks/useLocalNotificationHelper';
import { localNotificationHelperStyles } from '../../styles/local_notification_helper.styles';
import { ScreenHeader } from '../ScreenHeader';
import { ThemedText } from '../ThemedText';
import { ThemedView } from '../ThemedView';

type TranslateFn = (key: string, options?: Record<string, string | number>) => string;

const defaultTranslate: TranslateFn = (key, options) => {
  const fallbacks: Record<string, string> = {
    title: 'Local Notification Helper',
    subtitle: 'Test scheduling, permissions, badge, channels & categories',
    webOnly: 'Test local notifications (iOS/Android only)',
    webMessage: 'Local notifications are not available on web. Use an iOS or Android device or simulator to test.',
    dismiss: 'Dismiss',
    permission: 'Permission',
    status: 'Status',
    granted: 'Granted',
    notGranted: 'Not granted',
    requestPermission: 'Request permission',
    openSettings: 'Open settings',
    permissionGranted: 'Permission granted ✓',
    showRationaleAlert: 'Show rationale alert',
    alertPermissionGrantedTitle: 'Permission Already Granted',
    alertPermissionGrantedMessage: 'Notification permission is already granted. You can test notifications now.',
    schedule: 'Schedule',
    in5s: 'In 5s',
    in1min: 'In 1 min',
    in2minDate: 'In 2 min (date)',
    daily9: 'Daily 9:00',
    androidCalendarNote: 'Note: Calendar triggers don\'t work on Android. Using 24h time interval instead.',
    cancelLast: 'Cancel last',
    cancelAll: 'Cancel all',
    alertScheduled5sTitle: 'Success',
    alertScheduled5sMessage: 'Notification scheduled! It will appear in 5 seconds.',
    alertScheduled1minTitle: 'Success',
    alertScheduled1minMessage: 'Notification scheduled! It will appear in 1 minute.',
    alertDailyTitle: 'Success',
    alertDailyMessageAndroid: 'Daily notification scheduled (using 24h interval on Android).',
    alertDailyMessageIos: 'Daily notification scheduled for 9:00 AM.',
    scheduledCount: 'Scheduled ({{count}})',
    noScheduled: 'No scheduled notifications',
    badge: 'Badge',
    androidBadgeNote: 'Note: Badge count is primarily supported on iOS. On Android, it may not appear on the app icon.',
    setBadge: 'Set badge',
    clearBadge: 'Clear badge',
    badgePlaceholder: '0',
    alertInvalidBadgeTitle: 'Invalid',
    alertInvalidBadgeMessage: 'Enter a number ≥ 0',
    categoriesAndActions: 'Categories & Actions',
    categoriesIntro: 'Categories define action buttons (Complete, Snooze) on notifications. Use in 2 steps:',
    categoriesStep1: '1) Set category (defines the buttons)',
    categoriesStep2: '2) Schedule with category → this sends the actual notification in 10s',
    setCategoryButton: '1. Set TASK_REMINDER category',
    scheduleWithCategoryButton: '2. Schedule with category (10s)',
    alertCategoryReadyTitle: 'Category ready',
    alertCategoryReadyMessage: 'TASK_REMINDER category is set. Now tap "Schedule with category (10s)" to send a notification that will show Complete and Snooze buttons.',
    alertScheduledWithCategoryTitle: 'Scheduled',
    alertScheduledWithCategoryMessage: 'Notification with Complete/Snooze buttons will appear in 10 seconds.',
    currentCategories: 'Current categories ({{count}}):',
    actions: 'Actions',
    noCategories: 'No categories set. Click "Set TASK_REMINDER category" to create one.',
    eventLog: 'Event log',
    lastReceived: 'Last received (foreground)',
    lastTapped: 'Last tapped',
    lastActionId: 'Last action ID',
    alertTaskCompletedTitle: 'Task completed',
    alertTaskCompletedMessage: 'The task was marked as complete.',
    alertTaskSnoozedTitle: 'Task snoozed',
    alertTaskSnoozedMessage: 'Reminder snoozed for 10 minutes.',
    notificationTestTitle: 'Test Notification',
    notificationTestBody: 'Scheduled to show in {{seconds}} seconds',
    notificationScheduledTitle: 'Scheduled Notification',
    notificationScheduledBody: 'Triggered at specific time',
    notificationDailyTitle: 'Daily Reminder',
    notificationDailyBody: 'This is a daily recurring notification',
    notificationDailyBodyAndroid: 'This is a daily recurring notification (using time interval on Android)',
    notificationTaskTitle: 'Task Reminder',
    notificationTaskBody: 'Tap Complete or Snooze',
    commonOk: 'OK',
  };
  let s = fallbacks[key] ?? key;
  if (options) {
    Object.entries(options).forEach(([k, v]) => {
      s = s.replace(new RegExp(`\\{\\{${k}\\}\\}`, 'g'), String(v));
    });
  }
  return s;
};

export interface LocalNotificationHelperViewProps {
  translate?: TranslateFn;
}

export function LocalNotificationHelperView(props: LocalNotificationHelperViewProps = {}) {
  const { translate: translateProp } = props;
  const { currentTheme } = useTheme();
  const isDark = currentTheme === 'dark';
  const colors = getThemeColors(isDark);
  const [badgeInput, setBadgeInput] = useState('0');
  const translate = translateProp ?? defaultTranslate;

  const hookOptions = useMemo<LocalNotificationHelperOptions>(() => ({
    onTaskCompleted: () => {
      Alert.alert(
        translate('alertTaskCompletedTitle'),
        translate('alertTaskCompletedMessage'),
        [{ text: translate('commonOk') }]
      );
    },
    onTaskSnoozed: () => {
      Alert.alert(
        translate('alertTaskSnoozedTitle'),
        translate('alertTaskSnoozedMessage'),
        [{ text: translate('commonOk') }]
      );
    },
    getNotificationContent: (type, params) => {
      switch (type) {
        case 'test':
          return { title: translate('notificationTestTitle'), body: translate('notificationTestBody', { seconds: params?.seconds ?? 0 }) };
        case 'scheduled':
          return { title: translate('notificationScheduledTitle'), body: translate('notificationScheduledBody') };
        case 'daily':
          return { title: translate('notificationDailyTitle'), body: translate('notificationDailyBody') };
        case 'dailyAndroid':
          return { title: translate('notificationDailyTitle'), body: translate('notificationDailyBodyAndroid') };
        case 'task':
          return { title: translate('notificationTaskTitle'), body: translate('notificationTaskBody') };
        default:
          return { title: '', body: '' };
      }
    },
  }), [translate]);

  const {
    state: {
      permission,
      badgeCount,
      scheduled,
      categories,
      lastReceived,
      lastTapped,
      lastActionId,
      isEnabled,
      error,
      loading,
    },
    refreshAll,
    requestPermission,
    scheduleInSeconds,
    scheduleAtDate,
    scheduleRecurringDaily,
    cancelLastScheduled,
    cancelAllScheduled,
    setBadge,
    clearBadge,
    setTestCategory,
    scheduleWithCategory,
    openSettings,
    showPermissionAlert,
    clearError,
  } = useLocalNotificationHelper(hookOptions);

  const cardStyle = [
    localNotificationHelperStyles.card,
    {
      backgroundColor: colors.surfaceBackground,
      borderColor: colors.surfaceBorder + '30',
    },
  ];

  if (Platform.OS === 'web') {
    return (
      <SafeAreaView style={[{ flex: 1, backgroundColor: colors.background }]} edges={['top']}>
        <ScreenHeader
          title={translate('title')}
          subtitle={translate('webOnly')}
        />
        <View style={{ padding: 16 }}>
          <ThemedText style={{ color: colors.text, marginBottom: 8 }}>
            {translate('webMessage')}
          </ThemedText>
        </View>
      </SafeAreaView>
    );
  }

  const handleSetBadge = () => {
    const n = parseInt(badgeInput, 10);
    if (!Number.isNaN(n) && n >= 0) setBadge(n);
    else Alert.alert(translate('alertInvalidBadgeTitle'), translate('alertInvalidBadgeMessage'));
  };

  return (
    <SafeAreaView
      style={[localNotificationHelperStyles.container, { backgroundColor: colors.background }]}
      edges={['top']}
    >
      <ScreenHeader
        title={translate('title')}
        subtitle={translate('subtitle')}
      />

      <ScrollView
        style={{ flex: 1 }}
        contentContainerStyle={localNotificationHelperStyles.scrollContent}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={loading}
            onRefresh={refreshAll}
            tintColor={colors.tint}
          />
        }
      >
        {error && (
          <ThemedView
            style={[
              localNotificationHelperStyles.errorBox,
              {
                backgroundColor: colors.errorColor + '15',
                borderColor: colors.errorColor + '40',
              },
            ]}
          >
            <ThemedText style={{ color: colors.errorColor, marginBottom: 8 }}>{error}</ThemedText>
            <Pressable
              onPress={clearError}
              style={[
                localNotificationHelperStyles.buttonSmall,
                { backgroundColor: colors.errorColor + '30' },
              ]}
            >
              <ThemedText style={{ color: colors.errorColor, fontSize: 13 }}>{translate('dismiss')}</ThemedText>
            </Pressable>
          </ThemedView>
        )}

        {/* Permission */}
        <ThemedView style={cardStyle}>
          <View style={localNotificationHelperStyles.cardHeader}>
            <ThemedText
              type="subtitle"
              style={[localNotificationHelperStyles.cardTitle, { color: colors.sectionTitle }]}
            >
              {translate('permission')}
            </ThemedText>
            <Ionicons
              name={isEnabled ? 'checkmark-circle' : 'close-circle'}
              size={22}
              color={isEnabled ? colors.tint : colors.errorColor}
            />
          </View>
          <ThemedText
            style={[localNotificationHelperStyles.statusText, { color: colors.text }]}
          >
            {translate('status')}: {permission?.status ?? '—'} {permission?.granted ? `(${translate('granted')})` : `(${translate('notGranted')})`}
          </ThemedText>
          <View style={{ flexDirection: 'row', flexWrap: 'wrap', marginTop: 8 }}>
            <Pressable
              onPress={() => requestPermission()}
              style={[
                localNotificationHelperStyles.button,
                { backgroundColor: colors.tint + '25', borderWidth: 1, borderColor: colors.tint },
              ]}
            >
              <ThemedText style={[localNotificationHelperStyles.buttonLabel, { color: colors.tint }]}>
                {translate('requestPermission')}
              </ThemedText>
            </Pressable>
            <Pressable
              onPress={openSettings}
              style={[
                localNotificationHelperStyles.button,
                { backgroundColor: colors.surfaceBorder + '20' },
              ]}
            >
              <ThemedText style={[localNotificationHelperStyles.buttonLabel, { color: colors.text }]}>
                {translate('openSettings')}
              </ThemedText>
            </Pressable>
            <Pressable
              onPress={() => {
                if (isEnabled) {
                  Alert.alert(
                    translate('alertPermissionGrantedTitle'),
                    translate('alertPermissionGrantedMessage'),
                    [{ text: translate('commonOk') }]
                  );
                } else {
                  showPermissionAlert();
                }
              }}
              style={[
                localNotificationHelperStyles.button,
                { backgroundColor: colors.surfaceBorder + '20' },
              ]}
            >
              <ThemedText style={[localNotificationHelperStyles.buttonLabel, { color: colors.text }]}>
                {isEnabled ? translate('permissionGranted') : translate('showRationaleAlert')}
              </ThemedText>
            </Pressable>
          </View>
        </ThemedView>

        {/* Schedule */}
        <ThemedView style={cardStyle}>
          <View style={localNotificationHelperStyles.cardHeader}>
            <ThemedText
              type="subtitle"
              style={[localNotificationHelperStyles.cardTitle, { color: colors.sectionTitle }]}
            >
              {translate('schedule')}
            </ThemedText>
            <Ionicons name="notifications" size={22} color={colors.tint} />
          </View>
          <View style={{ flexDirection: 'row', flexWrap: 'wrap' }}>
            <Pressable
              onPress={async () => {
                const id = await scheduleInSeconds(5);
                if (id) {
                  Alert.alert(translate('alertScheduled5sTitle'), translate('alertScheduled5sMessage'));
                }
              }}
              disabled={!isEnabled}
              style={[
                localNotificationHelperStyles.button,
                {
                  backgroundColor: isEnabled ? colors.tint + '25' : colors.surfaceBorder + '15',
                  borderWidth: 1,
                  borderColor: isEnabled ? colors.tint : colors.surfaceBorder,
                },
              ]}
            >
              <ThemedText
                style={[
                  localNotificationHelperStyles.buttonLabel,
                  { color: isEnabled ? colors.tint : colors.text, opacity: isEnabled ? 1 : 0.6 },
                ]}
              >
                {translate('in5s')}
              </ThemedText>
            </Pressable>
            <Pressable
              onPress={async () => {
                const id = await scheduleInSeconds(60);
                if (id) {
                  Alert.alert(translate('alertScheduled1minTitle'), translate('alertScheduled1minMessage'));
                }
              }}
              disabled={!isEnabled}
              style={[
                localNotificationHelperStyles.button,
                {
                  backgroundColor: isEnabled ? colors.tint + '25' : colors.surfaceBorder + '15',
                  borderWidth: 1,
                  borderColor: isEnabled ? colors.tint : colors.surfaceBorder,
                },
              ]}
            >
              <ThemedText
                style={[
                  localNotificationHelperStyles.buttonLabel,
                  { color: isEnabled ? colors.tint : colors.text, opacity: isEnabled ? 1 : 0.6 },
                ]}
              >
                {translate('in1min')}
              </ThemedText>
            </Pressable>
            <Pressable
              onPress={() => scheduleAtDate(new Date(Date.now() + 2 * 60 * 1000))}
              disabled={!isEnabled}
              style={[
                localNotificationHelperStyles.button,
                {
                  backgroundColor: isEnabled ? colors.tint + '25' : colors.surfaceBorder + '15',
                  borderWidth: 1,
                  borderColor: isEnabled ? colors.tint : colors.surfaceBorder,
                },
              ]}
            >
              <ThemedText
                style={[
                  localNotificationHelperStyles.buttonLabel,
                  { color: isEnabled ? colors.tint : colors.text, opacity: isEnabled ? 1 : 0.6 },
                ]}
              >
                {translate('in2minDate')}
              </ThemedText>
            </Pressable>
            <Pressable
              onPress={async () => {
                const id = await scheduleRecurringDaily();
                if (id) {
                  Alert.alert(
                    translate('alertDailyTitle'),
                    Platform.OS === 'android'
                      ? translate('alertDailyMessageAndroid')
                      : translate('alertDailyMessageIos')
                  );
                }
              }}
              disabled={!isEnabled}
              style={[
                localNotificationHelperStyles.button,
                {
                  backgroundColor: isEnabled ? colors.tint + '25' : colors.surfaceBorder + '15',
                  borderWidth: 1,
                  borderColor: isEnabled ? colors.tint : colors.surfaceBorder,
                },
              ]}
            >
              <ThemedText
                style={[
                  localNotificationHelperStyles.buttonLabel,
                  { color: isEnabled ? colors.tint : colors.text, opacity: isEnabled ? 1 : 0.6 },
                ]}
              >
                {translate('daily9')}
              </ThemedText>
            </Pressable>
            {Platform.OS === 'android' && (
              <ThemedText
                style={[
                  localNotificationHelperStyles.statusText,
                  { color: colors.text, opacity: 0.6, fontSize: 11, marginTop: 4, fontStyle: 'italic' },
                ]}
              >
                {translate('androidCalendarNote')}
              </ThemedText>
            )}
            <Pressable
              onPress={cancelLastScheduled}
              disabled={scheduled.length === 0}
              style={[
                localNotificationHelperStyles.button,
                { backgroundColor: colors.surfaceBorder + '20' },
              ]}
            >
              <ThemedText
                style={[
                  localNotificationHelperStyles.buttonLabel,
                  { color: colors.text, opacity: scheduled.length ? 1 : 0.5 },
                ]}
              >
                {translate('cancelLast')}
              </ThemedText>
            </Pressable>
            <Pressable
              onPress={cancelAllScheduled}
              style={[
                localNotificationHelperStyles.button,
                { backgroundColor: colors.errorColor + '20', borderWidth: 1, borderColor: colors.errorColor + '60' },
              ]}
            >
              <ThemedText style={[localNotificationHelperStyles.buttonLabel, { color: colors.errorColor }]}>
                {translate('cancelAll')}
              </ThemedText>
            </Pressable>
          </View>
        </ThemedView>

        {/* Scheduled list */}
        <ThemedView style={cardStyle}>
          <View style={localNotificationHelperStyles.cardHeader}>
            <ThemedText
              type="subtitle"
              style={[localNotificationHelperStyles.cardTitle, { color: colors.sectionTitle }]}
            >
              {translate('scheduledCount', { count: scheduled.length })}
            </ThemedText>
          </View>
          {scheduled.length === 0 ? (
            <ThemedText style={[localNotificationHelperStyles.statusText, { color: colors.text, opacity: 0.7 }]}>
              {translate('noScheduled')}
            </ThemedText>
          ) : (
            scheduled.slice(-5).reverse().map((s) => (
              <View
                key={s.identifier}
                style={[
                  localNotificationHelperStyles.listItem,
                  { borderColor: colors.surfaceBorder + '40', backgroundColor: colors.background + '80' },
                ]}
              >
                <ThemedText style={{ color: colors.text, fontSize: 12 }} numberOfLines={1}>
                  {s.identifier}
                </ThemedText>
                <ThemedText style={{ color: colors.text, fontSize: 13, fontWeight: '600' }} numberOfLines={1}>
                  {s.content.title}
                </ThemedText>
                <ThemedText style={{ color: colors.text, fontSize: 12, opacity: 0.8 }} numberOfLines={1}>
                  {s.content.body}
                </ThemedText>
              </View>
            ))
          )}
        </ThemedView>

        {/* Badge */}
        <ThemedView style={cardStyle}>
          <View style={localNotificationHelperStyles.cardHeader}>
            <ThemedText
              type="subtitle"
              style={[localNotificationHelperStyles.cardTitle, { color: colors.sectionTitle }]}
            >
              {translate('badge')}
            </ThemedText>
            <ThemedText style={{ color: colors.tint, fontWeight: '700', fontSize: 18 }}>
              {badgeCount}
            </ThemedText>
          </View>
          {Platform.OS === 'android' && (
            <ThemedText
              style={[
                localNotificationHelperStyles.statusText,
                { color: colors.text, opacity: 0.7, marginBottom: 8, fontSize: 12 },
              ]}
            >
              {translate('androidBadgeNote')}
            </ThemedText>
          )}
          <View style={{ flexDirection: 'row', alignItems: 'center', flexWrap: 'wrap' }}>
            <TextInput
              style={[
                localNotificationHelperStyles.badgeInput,
                {
                  backgroundColor: colors.background,
                  borderColor: colors.surfaceBorder,
                  color: colors.text,
                },
              ]}
              value={badgeInput}
              onChangeText={setBadgeInput}
              keyboardType="number-pad"
              placeholder={translate('badgePlaceholder')}
              placeholderTextColor={colors.text + '80'}
            />
            <Pressable
              onPress={handleSetBadge}
              style={[
                localNotificationHelperStyles.buttonSmall,
                { backgroundColor: colors.tint + '25', borderWidth: 1, borderColor: colors.tint },
              ]}
            >
              <ThemedText style={[localNotificationHelperStyles.buttonLabel, { color: colors.tint }]}>
                {translate('setBadge')}
              </ThemedText>
            </Pressable>
            <Pressable
              onPress={clearBadge}
              style={[
                localNotificationHelperStyles.buttonSmall,
                { backgroundColor: colors.surfaceBorder + '20' },
              ]}
            >
              <ThemedText style={[localNotificationHelperStyles.buttonLabel, { color: colors.text }]}>
                {translate('clearBadge')}
              </ThemedText>
            </Pressable>
          </View>
        </ThemedView>

        {/* Categories & action notification */}
        <ThemedView style={cardStyle}>
          <View style={localNotificationHelperStyles.cardHeader}>
            <ThemedText
              type="subtitle"
              style={[localNotificationHelperStyles.cardTitle, { color: colors.sectionTitle }]}
            >
              {translate('categoriesAndActions')}
            </ThemedText>
          </View>
          <ThemedText
            style={[
              localNotificationHelperStyles.statusText,
              { color: colors.text, opacity: 0.7, marginBottom: 6, fontSize: 12 },
            ]}
          >
            {translate('categoriesIntro')}
          </ThemedText>
          <ThemedText
            style={[
              localNotificationHelperStyles.statusText,
              { color: colors.text, opacity: 0.8, marginBottom: 8, fontSize: 12, marginLeft: 8 },
            ]}
          >
            {translate('categoriesStep1')}{'\n'}
            {translate('categoriesStep2')}
          </ThemedText>
          <View style={{ flexDirection: 'row', flexWrap: 'wrap', marginBottom: 8 }}>
            <Pressable
              onPress={async () => {
                const success = await setTestCategory();
                if (success) {
                  Alert.alert(
                    translate('alertCategoryReadyTitle'),
                    translate('alertCategoryReadyMessage')
                  );
                }
              }}
              style={[
                localNotificationHelperStyles.button,
                { backgroundColor: colors.tint + '25', borderWidth: 1, borderColor: colors.tint },
              ]}
              hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}
            >
              <ThemedText style={[localNotificationHelperStyles.buttonLabel, { color: colors.tint }]}>
                {translate('setCategoryButton')}
              </ThemedText>
            </Pressable>
            <Pressable
              onPress={async () => {
                const id = await scheduleWithCategory();
                if (id) {
                  Alert.alert(
                    translate('alertScheduledWithCategoryTitle'),
                    translate('alertScheduledWithCategoryMessage')
                  );
                }
              }}
              disabled={!isEnabled}
              style={[
                localNotificationHelperStyles.button,
                {
                  backgroundColor: isEnabled ? colors.tint + '25' : colors.surfaceBorder + '15',
                  borderWidth: 1,
                  borderColor: isEnabled ? colors.tint : colors.surfaceBorder,
                },
              ]}
              hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}
            >
              <ThemedText
                style={[
                  localNotificationHelperStyles.buttonLabel,
                  { color: isEnabled ? colors.tint : colors.text, opacity: isEnabled ? 1 : 0.6 },
                ]}
              >
                {translate('scheduleWithCategoryButton')}
              </ThemedText>
            </Pressable>
          </View>
          {categories.length > 0 ? (
            <View style={{ marginTop: 8 }}>
              <ThemedText style={[localNotificationHelperStyles.statusLabel, { color: colors.text, marginBottom: 4 }]}>
                {translate('currentCategories', { count: categories.length })}
              </ThemedText>
              {categories.map((c) => (
                <View key={c.identifier} style={{ marginLeft: 8, marginBottom: 4 }}>
                  <ThemedText
                    style={[
                      localNotificationHelperStyles.statusText,
                      { color: colors.text, fontSize: 12, fontWeight: '600' },
                    ]}
                  >
                    • {c.identifier}
                  </ThemedText>
                  {c.actions && c.actions.length > 0 && (
                    <ThemedText
                      style={[
                        localNotificationHelperStyles.statusText,
                        { color: colors.text, fontSize: 11, opacity: 0.7, marginLeft: 8 },
                      ]}
                    >
                      {translate('actions')}: {c.actions.map((a) => a.buttonTitle).join(', ')}
                    </ThemedText>
                  )}
                </View>
              ))}
            </View>
          ) : (
            <ThemedText style={[localNotificationHelperStyles.statusText, { color: colors.text, opacity: 0.6, fontSize: 12 }]}>
              {translate('noCategories')}
            </ThemedText>
          )}
        </ThemedView>

        {/* Events log */}
        <ThemedView style={cardStyle}>
          <View style={localNotificationHelperStyles.cardHeader}>
            <ThemedText
              type="subtitle"
              style={[localNotificationHelperStyles.cardTitle, { color: colors.sectionTitle }]}
            >
              {translate('eventLog')}
            </ThemedText>
            <Ionicons name="document-text" size={22} color={colors.tint} />
          </View>
          <ThemedText style={[localNotificationHelperStyles.statusLabel, { color: colors.text }]}>
            {translate('lastReceived')}
          </ThemedText>
          <ThemedText
            style={[localNotificationHelperStyles.statusText, { color: colors.text }]}
            numberOfLines={2}
          >
            {lastReceived ?? '—'}
          </ThemedText>
          <ThemedText style={[localNotificationHelperStyles.statusLabel, { color: colors.text, marginTop: 8 }]}>
            {translate('lastTapped')}
          </ThemedText>
          <ThemedText
            style={[localNotificationHelperStyles.statusText, { color: colors.text }]}
            numberOfLines={1}
          >
            {lastTapped ?? '—'}
          </ThemedText>
          <ThemedText style={[localNotificationHelperStyles.statusLabel, { color: colors.text, marginTop: 8 }]}>
            {translate('lastActionId')}
          </ThemedText>
          <ThemedText
            style={[localNotificationHelperStyles.statusText, { color: colors.text }]}
            numberOfLines={1}
          >
            {lastActionId ?? '—'}
          </ThemedText>
        </ThemedView>
      </ScrollView>
    </SafeAreaView>
  );
}
