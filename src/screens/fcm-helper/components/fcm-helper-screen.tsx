import { ScreenHeader } from '@/src/shared/components/ScreenHeader';
import { useTranslation } from '@/src/shared/i18n';
import Constants from 'expo-constants';
import { getThemeColors, Sizing, useTheme } from 'masterfabric-expo-core';
import React, { useCallback, useEffect, useState } from 'react';
import {
  Alert,
  Platform,
  Pressable,
  ScrollView,
  Text,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { fcmHelperScreenStyles } from '../styles/fcm-helper-screen.styles';

const isExpoGo = Constants.appOwnership === 'expo';
const isNative = Platform.OS === 'ios' || Platform.OS === 'android';

function useFcmMessaging() {
  const [messaging, setMessaging] = useState<typeof import('@react-native-firebase/messaging').default | null>(null);
  useEffect(() => {
    if (!isNative) return;
    try {
      const m = require('@react-native-firebase/messaging').default;
      setMessaging(m);
    } catch {
      setMessaging(null);
    }
  }, []);
  return messaging;
}

export function FcmHelperScreen() {
  const { t } = useTranslation();
  const { currentTheme } = useTheme();
  const isDark = currentTheme === 'dark';
  const colors = getThemeColors(isDark);
  const messaging = useFcmMessaging();

  const [permission, setPermission] = useState<number | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [lastMessage, setLastMessage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const refreshStatus = useCallback(async () => {
    if (!messaging || !isNative) return;
    try {
      const tkn = await messaging().getToken();
      setToken(tkn);
    } catch {
      setToken(null);
    }
  }, [messaging]);

  useEffect(() => {
    if (!messaging || !isNative) return;
    refreshStatus();
  }, [messaging, refreshStatus]);

  useEffect(() => {
    if (!messaging || !isNative) return;
    const unsub = messaging().onMessage(async (remoteMessage) => {
      const maybeBody = remoteMessage.notification?.body ?? remoteMessage.data?.body ?? remoteMessage.data ?? {};
      const body = typeof maybeBody === 'string' ? maybeBody : JSON.stringify(maybeBody);
      setLastMessage(body);
    });
    return () => unsub();
  }, [messaging]);

  useEffect(() => {
    if (!messaging || !isNative) return;
    const unsub = messaging().onNotificationOpenedApp((remoteMessage) => {
      const body = remoteMessage.notification?.body ?? 'Opened from notification';
      setLastMessage(`[Opened] ${body}`);
    });
    return () => unsub();
  }, [messaging]);

  useEffect(() => {
    if (!messaging || !isNative) return;
    messaging()
      .getInitialNotification()
      .then((remoteMessage) => {
        if (remoteMessage) {
          const body = remoteMessage.notification?.body ?? 'Launched from notification';
          setLastMessage(`[Launched] ${body}`);
        }
      });
  }, [messaging]);

  const handleRequestPermission = async () => {
    if (!messaging) {
      Alert.alert(
        'FCM not available',
        'Firebase Cloud Messaging is only available on iOS and Android development builds. Run: npx expo run:ios or npx expo run:android.'
      );
      return;
    }
    setLoading(true);
    try {
      const authStatus = await messaging().requestPermission();
      setPermission(authStatus);
      const tkn = await messaging().getToken();
      setToken(tkn);
      Alert.alert(
        'Permission',
        authStatus === 1 ? 'Granted. Token refreshed.' : `Status: ${authStatus} (1=authorized, 0=notDetermined, -1=denied)`
      );
    } catch (e) {
      Alert.alert('Error', (e instanceof Error ? e.message : String(e)) || 'Request failed');
    } finally {
      setLoading(false);
    }
  };

  const handleCopyToken = () => {
    if (!token) return;
    const { Clipboard } = require('react-native');
    Clipboard.setString(token);
    Alert.alert('Copied', 'FCM token copied to clipboard.');
  };

  return (
    <SafeAreaView
      style={[fcmHelperScreenStyles.container, { backgroundColor: colors.background }]}
      edges={['top']}
    >
      <ScreenHeader
        title={t('helpers.fcmHelper.title') || 'FCM Helper'}
        subtitle={t('helpers.fcmHelper.description') || 'Firebase Cloud Messaging (iOS/Android)'}
        variant="minimal"
      />
      <ScrollView
        style={fcmHelperScreenStyles.scrollView}
        contentContainerStyle={fcmHelperScreenStyles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View
          style={[
            fcmHelperScreenStyles.card,
            { borderColor: colors.surfaceBorder, backgroundColor: colors.surfaceBackground },
          ]}
        >
          <Text style={[fcmHelperScreenStyles.cardTitle, { color: colors.text }]}>
            About this helper
          </Text>
          <Text style={[fcmHelperScreenStyles.bodyText, { color: colors.text }]}>
            FCM (Firebase Cloud Messaging) is used for push notifications on iOS and Android.
            Requires google-services.json (Android) and GoogleService-Info.plist (iOS) in project root.
            Use this screen to check permission, copy the FCM token for your backend, and see foreground/opened messages.
          </Text>
        </View>

        {isExpoGo && (
          <View
            style={[
              fcmHelperScreenStyles.card,
              { borderColor: colors.tint, backgroundColor: colors.surfaceBackground },
            ]}
          >
            <Text style={[fcmHelperScreenStyles.cardTitle, { color: colors.tint }]}>
              Expo Go – FCM not available
            </Text>
            <Text style={[fcmHelperScreenStyles.bodyText, { color: colors.text }]}>
              FCM uses native code. Run a development build: npx expo run:ios or npx expo run:android.
            </Text>
          </View>
        )}

        {!isNative && (
          <View
            style={[
              fcmHelperScreenStyles.card,
              { borderColor: colors.surfaceBorder, backgroundColor: colors.surfaceBackground },
            ]}
          >
            <Text style={[fcmHelperScreenStyles.bodyText, { color: colors.text }]}>
              FCM is only available on iOS and Android. Use a device or native simulator.
            </Text>
          </View>
        )}

        {messaging && isNative && (
          <>
            <View
              style={[
                fcmHelperScreenStyles.card,
                { borderColor: colors.surfaceBorder, backgroundColor: colors.surfaceBackground },
              ]}
            >
              <Text style={[fcmHelperScreenStyles.cardTitle, { color: colors.text }]}>
                Permission
              </Text>
              {permission != null && (
                <View style={fcmHelperScreenStyles.statusRow}>
                  <Text style={[fcmHelperScreenStyles.statusLabel, { color: colors.labelText }]}>
                    Status
                  </Text>
                  <Text style={[fcmHelperScreenStyles.statusValue, { color: colors.text }]}>
                    {permission === 1 ? 'Authorized' : permission === 0 ? 'Not determined' : 'Denied'}
                  </Text>
                </View>
              )}
              <Pressable
                onPress={handleRequestPermission}
                disabled={loading}
                style={[fcmHelperScreenStyles.button, { backgroundColor: colors.tint }]}
              >
                <Text style={[fcmHelperScreenStyles.buttonLabel, { color: '#fff' }]}>
                  {loading ? 'Requesting…' : 'Request permission / Refresh token'}
                </Text>
              </Pressable>
            </View>

            <View
              style={[
                fcmHelperScreenStyles.card,
                { borderColor: colors.surfaceBorder, backgroundColor: colors.surfaceBackground },
              ]}
            >
              <Text style={[fcmHelperScreenStyles.cardTitle, { color: colors.text }]}>
                FCM Token
              </Text>
              <Text style={[fcmHelperScreenStyles.bodyText, { color: colors.labelText }]}>
                Send this token to your server to target this device for push notifications.
              </Text>
              {token ? (
                <>
                  <View
                    style={[
                      fcmHelperScreenStyles.tokenBlock,
                      { backgroundColor: colors.background, borderWidth: 1, borderColor: colors.surfaceBorder },
                    ]}
                  >
                    <Text
                      style={[fcmHelperScreenStyles.tokenText, { color: colors.text }]}
                      numberOfLines={4}
                      selectable
                    >
                      {token}
                    </Text>
                  </View>
                  <Pressable
                    onPress={handleCopyToken}
                    style={[fcmHelperScreenStyles.button, { backgroundColor: colors.tint, marginTop: Sizing.spacing.s }]}
                  >
                    <Text style={[fcmHelperScreenStyles.buttonLabel, { color: '#fff' }]}>
                      Copy token
                    </Text>
                  </Pressable>
                </>
              ) : (
                <Text style={[fcmHelperScreenStyles.bodyText, { color: colors.labelText }]}>
                  Request permission first to get the token.
                </Text>
              )}
            </View>

            <View
              style={[
                fcmHelperScreenStyles.card,
                { borderColor: colors.surfaceBorder, backgroundColor: colors.surfaceBackground },
              ]}
            >
              <Text style={[fcmHelperScreenStyles.cardTitle, { color: colors.text }]}>
                Last message
              </Text>
              <Text style={[fcmHelperScreenStyles.bodyText, { color: colors.labelText }]}>
                Foreground or opened notification payload (for testing).
              </Text>
              {lastMessage ? (
                <View
                  style={[
                    fcmHelperScreenStyles.tokenBlock,
                    { backgroundColor: colors.background, borderWidth: 1, borderColor: colors.surfaceBorder },
                  ]}
                >
                  <Text style={[fcmHelperScreenStyles.tokenText, { color: colors.text }]} selectable>
                    {lastMessage}
                  </Text>
                </View>
              ) : (
                <Text style={[fcmHelperScreenStyles.bodyText, { color: colors.labelText, fontStyle: 'italic' }]}>
                  No message yet. Send a test from Firebase Console or your backend.
                </Text>
              )}
            </View>
          </>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}
