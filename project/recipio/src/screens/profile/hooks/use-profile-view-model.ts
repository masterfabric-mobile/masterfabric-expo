import { useRouter } from 'expo-router';
import { useCallback, useEffect } from 'react';
import { Alert, Platform } from 'react-native';
import { useI18n } from '@/shared/i18n';
import { getSupabaseClient } from '@/shared/services/supabase-service';
import { syncSessionToStore } from '@/shared/services/profile-service';
import { useProfileStore } from '../store/profile-store';

export function useProfileViewModel() {
  const { t } = useI18n();
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
    syncSessionToStore(setSignedIn, setStats).finally(() => setLoading(false));
  }, [setSignedIn, setStats, setLoading]);

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

  const handleEditProfilePress = useCallback(() => {
    // TODO: open edit profile / photo picker
  }, []);

  const handleSettingsPress = useCallback(() => {
    // TODO: open app settings or settings modal
  }, []);

  const handleNotificationsPress = useCallback(() => {
    setSettings({ notifications: !settings.notifications });
  }, [settings.notifications, setSettings]);

  const handleDietaryPreferencesPress = useCallback(() => {
    // TODO: navigate to dietary preferences
  }, []);

  const handleHelpSupportPress = useCallback(() => {
    // TODO: navigate to help & support
  }, []);

  return {
    isLoading: useProfileStore((s) => s.isLoading),
    isSignedIn,
    user,
    stats,
    settings,
    handleSignInPress,
    handleSignOutPress,
    handleEditProfilePress,
    handleSettingsPress,
    handleNotificationsPress,
    handleDietaryPreferencesPress,
    handleHelpSupportPress,
  };
}
