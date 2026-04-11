import { Platform, StyleSheet } from 'react-native';
import type { RecipioColorsPalette } from '@/shared/constants/recipio-colors';

export function createHistoryStyles(colors: RecipioColorsPalette) {
  return StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.background,
    },
    header: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      paddingTop: Platform.OS === 'web' ? 16 : 48,
      paddingBottom: 16,
      paddingHorizontal: 20,
      borderBottomWidth: 1,
      borderBottomColor: colors.border,
      backgroundColor: colors.cardBackground,
    },
    headerContent: {
      flex: 1,
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
    headerClearButton: {
      paddingVertical: 8,
      paddingHorizontal: 12,
    },
    clearButtonText: {
      fontSize: 14,
      color: colors.error,
      fontWeight: '600',
    },
    list: {
      flex: 1,
      paddingHorizontal: 20,
      paddingTop: 16,
      paddingBottom: 100,
    },
    sectionLabel: {
      fontSize: 12,
      fontWeight: '600',
      color: colors.textSecondary,
      letterSpacing: 0.5,
      marginBottom: 12,
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
    emptyText: {
      fontSize: 20,
      color: colors.text,
      fontWeight: '600',
      textAlign: 'center',
    },
    emptySubtext: {
      fontSize: 15,
      color: colors.textSecondary,
      marginTop: 12,
      textAlign: 'center',
      lineHeight: 22,
    },
    loadingWrap: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      paddingVertical: 40,
    },
  });
}

/** Status badge background color by history status */
export function getStatusBadgeColor(
  colors: RecipioColorsPalette,
  status: 'viewed' | 'started' | 'in_progress' | 'completed' | 'abandoned'
): { backgroundColor: string } {
  switch (status) {
    case 'completed':
      return { backgroundColor: colors.success };
    case 'in_progress':
    case 'started':
      return { backgroundColor: colors.primaryAccent };
    case 'abandoned':
      return { backgroundColor: colors.error };
    case 'viewed':
    default:
      return { backgroundColor: colors.textSecondary };
  }
}
