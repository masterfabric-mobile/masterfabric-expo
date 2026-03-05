import { Platform, StyleSheet } from 'react-native';
import type { RecipioColorsPalette } from '@/shared/constants/recipio-colors';

export function createRecipeSearchStyles(colors: RecipioColorsPalette) {
  return StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.background,
    },
    header: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingHorizontal: 12,
      paddingTop: Platform.OS === 'web' ? 12 : 44,
      paddingBottom: 12,
      borderBottomWidth: 1,
      borderBottomColor: colors.border,
      gap: 12,
    },
    backBtn: {
      padding: 8,
    },
    searchWrap: {
      flex: 1,
      flexDirection: 'row',
      alignItems: 'center',
      height: 44,
      backgroundColor: colors.cardBackground,
      borderRadius: 12,
      paddingHorizontal: 14,
      gap: 10,
      borderWidth: 1,
      borderColor: colors.border,
    },
    searchInput: {
      flex: 1,
      fontSize: 16,
      color: colors.text,
      paddingVertical: 0,
    },
    section: {
      paddingHorizontal: 20,
      paddingTop: 20,
      paddingBottom: 12,
    },
    sectionRow: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: 12,
    },
    sectionTitle: {
      fontSize: 12,
      fontWeight: '600',
      color: colors.textSecondary,
      letterSpacing: 0.5,
    },
    clearRecent: {
      padding: 4,
    },
    clearRecentText: {
      fontSize: 14,
      fontWeight: '600',
      color: colors.primaryAccent,
    },
    chipWrap: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      gap: 8,
    },
    chip: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: colors.cardBackground,
      borderRadius: 20,
      paddingVertical: 8,
      paddingLeft: 14,
      paddingRight: 8,
      borderWidth: 1,
      borderColor: colors.border,
      gap: 6,
    },
    chipText: {
      fontSize: 14,
      color: colors.text,
    },
    recentList: {
      gap: 0,
      marginBottom: 8,
    },
    recentRowRemove: {
      padding: 8,
      justifyContent: 'center',
    },
    list: {
      paddingHorizontal: 20,
      paddingBottom: 100,
    },
    card: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: colors.cardBackground,
      borderRadius: 12,
      padding: 12,
      marginBottom: 12,
      gap: 14,
      borderWidth: 1,
      borderColor: colors.border,
    },
    cardImage: {
      width: 80,
      height: 80,
      borderRadius: 10,
      backgroundColor: colors.border,
    },
    cardBody: {
      flex: 1,
    },
    cardTitle: {
      fontSize: 16,
      fontWeight: '600',
      color: colors.text,
      marginBottom: 4,
    },
    cardMeta: {
      flexDirection: 'row',
      gap: 8,
    },
    cardMetaText: {
      fontSize: 12,
      color: colors.textSecondary,
    },
    empty: {
      padding: 40,
      alignItems: 'center',
    },
    emptyText: {
      fontSize: 15,
      color: colors.textSecondary,
      textAlign: 'center',
    },
  });
}
