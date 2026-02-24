import { StyleSheet } from 'react-native';
import { RecipioColors } from '@/shared/constants/recipio-colors';

export const profileStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: RecipioColors.background,
    justifyContent: 'center',
    alignItems: 'center',
  },
  text: {
    fontSize: 18,
    color: RecipioColors.text,
    fontWeight: '600',
  },
  subtext: {
    fontSize: 14,
    color: RecipioColors.textSecondary,
    marginTop: 8,
  },
});
