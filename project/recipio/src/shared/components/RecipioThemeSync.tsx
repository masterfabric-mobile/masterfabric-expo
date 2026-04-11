import { useTheme } from '@masterfabric-expo/core';
import { useEffect } from 'react';
import { useProfileStore } from '@/screens/profile/store/profile-store';

/** Syncs profile theme (dark/light) to core ThemeProvider so DOM and core components stay in sync. */
export function RecipioThemeSync() {
  const { setTheme } = useTheme();
  const theme = useProfileStore((s) => s.settings.theme);

  useEffect(() => {
    setTheme(theme);
  }, [theme, setTheme]);

  return null;
}
