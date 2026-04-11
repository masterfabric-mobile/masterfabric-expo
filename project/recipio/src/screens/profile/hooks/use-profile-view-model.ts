import { useRouter } from 'expo-router';
import { useCallback, useEffect } from 'react';
import { Alert, Platform } from 'react-native';
import { useI18n } from '@/shared/i18n';
import { getSupabaseClient } from '@/shared/services/supabase-service';
import { syncSessionToStore } from '@/shared/services/profile-service';
import { storage } from '@/shared/utils/storage';
import { fetchNotificationsList } from '@/screens/notifications/utils/fetch-notifications';
import { useNotificationsStore } from '@/screens/notifications/store/notifications-store';
import { useProfileStore } from '../store/profile-store';

export function useProfileViewModel() {
  const { t, locale, setLocale } = useI18n();
  const router = useRouter();
  const {
    isSignedIn,
    user,
    stats,
    settings,
    setLoading,
    setSignedIn,
    setStats,
    setSettings,
    signOut: storeSignOut,
  } = useProfileStore();

  useEffect(() => {
    const supabase = getSupabaseClient();
    if (!supabase) return;
    setLoading(true);
    (async () => {
      const savedTheme = await storage.getTheme();
      if (savedTheme) setSettings({ theme: savedTheme });
      await syncSessionToStore(setSignedIn, setStats, setSettings);
    })().finally(() => setLoading(false));
  }, [setSignedIn, setStats, setSettings, setLoading]);

  useEffect(() => {
    if (useNotificationsStore.getState().items.length > 0) return;
    let cancelled = false;
    (async () => {
      const list = await fetchNotificationsList();
      if (cancelled) return;
      if (useNotificationsStore.getState().items.length === 0) {
        useNotificationsStore.getState().setItems(list);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  const handleSignInPress = useCallback(() => {
    router.push('/auth');
  }, [router]);

  const performSignOut = useCallback(async () => {
    const supabase = getSupabaseClient();
    if (supabase) await supabase.auth.signOut();
    storeSignOut();
  }, [storeSignOut]);

  const handleSignOutPress = useCallback(() => {
    if (Platform.OS === 'web') {
      const message = `${t('profile.signOut')}?`;
      if (typeof window !== 'undefined' && window.confirm(message)) {
        performSignOut();
      }
      return;
    }
    Alert.alert(
      t('profile.signOut'),
      undefined,
      [
        { text: t('profile.signOut'), style: 'destructive', onPress: performSignOut },
        { text: t('profile.cancel'), style: 'cancel' },
      ]
    );
  }, [t, performSignOut]);

  const handleNotificationsPress = useCallback(() => {
    router.push('/notifications');
  }, [router]);

  const handleLanguagePress = useCallback(() => {
    const next = locale === 'en' ? 'tr' : 'en';
    setLocale(next);
    setSettings({ language: next });
  }, [locale, setLocale, setSettings]);

  const handleThemePress = useCallback(() => {
    const next = settings.theme === 'dark' ? 'light' : 'dark';
    setSettings({ theme: next });
    storage.setTheme(next).catch(() => {});
  }, [settings.theme, setSettings]);

  const handleDietaryPreferencesPress = useCallback(() => {
    router.push('/dietary-preferences');
  }, [router]);

  const handleHelpSupportPress = useCallback(() => {
    router.push('/help-support');
  }, [router]);

  const unreadNotificationCount = useNotificationsStore((s) =>
    s.items.reduce((n, i) => n + (i.read ? 0 : 1), 0)
  );

  return {
    isLoading: useProfileStore((s) => s.isLoading),
    isSignedIn,
    user,
    stats,
    settings,
    locale,
    unreadNotificationCount,
    handleSignInPress,
    handleSignOutPress,
    handleNotificationsPress,
    handleLanguagePress,
    handleThemePress,
    handleDietaryPreferencesPress,
    handleHelpSupportPress,
  };
}
