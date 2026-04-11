import { Platform, StyleSheet } from 'react-native';
import type { RecipioColorsPalette } from '@/shared/constants/recipio-colors';

export type RecipeResultsStyles = ReturnType<typeof createRecipeResultsStyles>;

export function createRecipeResultsStyles(colors: RecipioColorsPalette) {
  return StyleSheet.create({
    container: {
      flex: 1,
      position: 'relative',
      backgroundColor: colors.background,
    },
    header: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingHorizontal: 20,
      paddingTop: Platform.OS === 'web' ? 12 : 44,
      paddingBottom: 12,
      borderBottomWidth: 1,
      borderBottomColor: colors.border,
    },
    backBtn: {
      padding: 8,
      marginLeft: -8,
    },
    title: {
      flex: 1,
      fontSize: 18,
      fontWeight: '700',
      color: colors.text,
      marginLeft: 8,
    },
    resultsBar: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      paddingHorizontal: 20,
      paddingVertical: 12,
    },
    resultsText: {
      fontSize: 14,
      color: colors.textSecondary,
    },
    sortRow: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 6,
    },
    sortText: {
      fontSize: 14,
      color: colors.textSecondary,
    },
    sortButton: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 4,
      paddingVertical: 4,
      paddingHorizontal: 8,
    },
    resultsBarWrapper: {
      position: 'relative',
      zIndex: 10,
    },
    sortDropdownBackdrop: {
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      zIndex: 9,
      backgroundColor: 'transparent',
    },
    sortDropdown: {
      position: 'absolute',
      top: '100%',
      right: 0,
      marginTop: 4,
      minWidth: 180,
      backgroundColor: colors.cardBackground,
      borderRadius: 12,
      borderWidth: 1,
      borderColor: colors.border,
      paddingVertical: 6,
      paddingHorizontal: 4,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.12,
      shadowRadius: 12,
      elevation: 8,
    },
    sortOption: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      paddingVertical: 12,
      paddingHorizontal: 12,
      borderRadius: 8,
      marginBottom: 2,
    },
    sortOptionText: {
      fontSize: 15,
      color: colors.text,
    },
    sortOptionSelected: {
      backgroundColor: colors.background,
    },
    list: {
      paddingHorizontal: 20,
      paddingTop: 8,
      paddingBottom: 100,
    },
    card: {
      backgroundColor: colors.cardBackground,
      borderRadius: 12,
      marginBottom: 16,
      overflow: 'hidden',
      borderWidth: 1,
      borderColor: colors.border,
    },
    cardImageWrap: {
      position: 'relative',
      width: '100%',
      height: 160,
      backgroundColor: colors.border,
    },
    cardImage: {
      width: '100%',
      height: '100%',
    },
    matchBadge: {
      position: 'absolute',
      top: 10,
      left: 10,
      paddingHorizontal: 10,
      paddingVertical: 4,
      borderRadius: 14,
    },
    matchBadgeHigh: { backgroundColor: colors.success },
    matchBadgeMid: { backgroundColor: colors.orange },
    matchBadgeLow: { backgroundColor: colors.error },
    matchBadgeText: {
      fontSize: 12,
      fontWeight: '700',
      color: '#FFFFFF',
    },
    cardBody: {
      padding: 14,
    },
    cardTitle: {
      fontSize: 16,
      fontWeight: '600',
      color: colors.text,
      marginBottom: 6,
    },
    cardMeta: { flexDirection: 'row', gap: 8, marginBottom: 6 },
    cardMetaText: { fontSize: 12, color: colors.textSecondary },
    cardStatusRow: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
    },
    cardStatus: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 4,
      flex: 1,
    },
    cardStatusText: { fontSize: 12, color: colors.textSecondary },
    cardStatusAll: { color: colors.success },
    empty: { padding: 40, alignItems: 'center' },
    emptyText: {
      fontSize: 15,
      color: colors.textSecondary,
      textAlign: 'center',
    },
  });
}

export function getMatchBadgeStyle(
  styles: RecipeResultsStyles,
  matchPercent: number
) {
  if (matchPercent >= 80) return styles.matchBadgeHigh;
  if (matchPercent >= 50) return styles.matchBadgeMid;
  return styles.matchBadgeLow;
}
