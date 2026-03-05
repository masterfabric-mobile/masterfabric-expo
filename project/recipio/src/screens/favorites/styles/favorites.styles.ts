import { Platform, StyleSheet } from 'react-native';
import type { RecipioColorsPalette } from '@/shared/constants/recipio-colors';

export function createFavoritesStyles(colors: RecipioColorsPalette) {
  return StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.background,
    },
    header: {
      paddingTop: Platform.OS === 'web' ? 16 : 48,
      paddingBottom: 16,
      paddingHorizontal: 20,
      borderBottomWidth: 1,
      borderBottomColor: colors.border,
      backgroundColor: colors.cardBackground,
    },
    headerTitle: {
      fontSize: 28,
      fontWeight: '700',
      color: colors.text,
      letterSpacing: -0.5,
    },
    headerSubtitle: {
      fontSize: 14,
      color: colors.textSecondary,
      marginTop: 4,
    },
    list: {
      flex: 1,
      paddingHorizontal: 20,
      paddingTop: 16,
      paddingBottom: 100,
    },
    empty: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      paddingHorizontal: 40,
    },
    emptyIcon: {
      fontSize: 64,
      marginBottom: 20,
    },
    text: {
      fontSize: 20,
      color: colors.text,
      fontWeight: '600',
      textAlign: 'center',
    },
    subtext: {
      fontSize: 15,
      color: colors.textSecondary,
      marginTop: 12,
      textAlign: 'center',
      lineHeight: 22,
    },
    sectionLabel: {
      fontSize: 12,
      fontWeight: '600',
      color: colors.textSecondary,
      letterSpacing: 0.5,
      marginBottom: 12,
    },
  });
}
