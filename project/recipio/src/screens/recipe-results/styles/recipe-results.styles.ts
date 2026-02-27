import { StyleSheet } from 'react-native';
import { RecipioColors } from '@/shared/constants/recipio-colors';
import { Platform } from 'react-native';

export const recipeResultsStyles = StyleSheet.create({
  container: {
    flex: 1,
    position: 'relative',
    backgroundColor: RecipioColors.background,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: Platform.OS === 'web' ? 12 : 44,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: RecipioColors.border,
  },
  backBtn: {
    padding: 8,
    marginLeft: -8,
  },
  title: {
    flex: 1,
    fontSize: 18,
    fontWeight: '700',
    color: RecipioColors.text,
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
    color: RecipioColors.textSecondary,
  },
  sortRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  sortText: {
    fontSize: 14,
    color: RecipioColors.textSecondary,
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
    backgroundColor: RecipioColors.cardBackground,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: RecipioColors.border,
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
    color: RecipioColors.text,
  },
  sortOptionSelected: {
    backgroundColor: RecipioColors.background,
  },
  list: {
    paddingHorizontal: 20,
    paddingTop: 8,
    paddingBottom: 100,
  },
  card: {
    backgroundColor: RecipioColors.cardBackground,
    borderRadius: 12,
    marginBottom: 16,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: RecipioColors.border,
  },
  cardImageWrap: {
    position: 'relative',
    width: '100%',
    height: 160,
    backgroundColor: RecipioColors.border,
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
  matchBadgeHigh: { backgroundColor: RecipioColors.success },
  matchBadgeMid: { backgroundColor: RecipioColors.orange },
  matchBadgeLow: { backgroundColor: RecipioColors.error },
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
    color: RecipioColors.text,
    marginBottom: 6,
  },
  cardMeta: { flexDirection: 'row', gap: 8, marginBottom: 6 },
  cardMetaText: { fontSize: 12, color: RecipioColors.textSecondary },
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
  cardStatusText: { fontSize: 12, color: RecipioColors.textSecondary },
  cardStatusAll: { color: RecipioColors.success },
  empty: { padding: 40, alignItems: 'center' },
  emptyText: {
    fontSize: 15,
    color: RecipioColors.textSecondary,
    textAlign: 'center',
  },
});

export function getMatchBadgeStyle(matchPercent: number) {
  if (matchPercent >= 80) return recipeResultsStyles.matchBadgeHigh;
  if (matchPercent >= 50) return recipeResultsStyles.matchBadgeMid;
  return recipeResultsStyles.matchBadgeLow;
}
