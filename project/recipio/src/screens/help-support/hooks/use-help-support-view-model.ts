import { useRouter } from 'expo-router';
import { useCallback } from 'react';
import { Linking, Platform } from 'react-native';

const SUPPORT_EMAIL = 'support@recipio.app';

export function useHelpSupportViewModel() {
  const router = useRouter();

  const handleBack = useCallback(() => {
    router.back();
  }, [router]);

  const openEmail = useCallback(() => {
    const url = `mailto:${SUPPORT_EMAIL}`;
    if (Platform.OS === 'web') {
      window.open(url, '_blank');
    } else {
      Linking.openURL(url);
    }
  }, []);

  return {
    handleBack,
    openEmail,
    supportEmail: SUPPORT_EMAIL,
  };
}
