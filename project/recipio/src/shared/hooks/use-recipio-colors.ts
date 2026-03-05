import { useProfileStore } from '@/screens/profile/store/profile-store';
import { getRecipioColors, type RecipioColorsPalette } from '@/shared/constants/recipio-colors';

/** Returns Recipio palette for current profile theme (dark = black bg, light = white bg). */
export function useRecipioColors(): RecipioColorsPalette {
  const theme = useProfileStore((s) => s.settings.theme);
  return getRecipioColors(theme === 'dark');
}
