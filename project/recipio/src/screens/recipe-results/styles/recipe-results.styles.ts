import { StyleSheet } from 'react-native';
import { RecipioColors } from '@/shared/constants/recipio-colors';
import { Platform } from 'react-native';

export const recipeResultsStyles = StyleSheet.create({
  container: {
    flex: 1,
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
  sortText: {
    fontSize: 14,
    color: RecipioColors.textSecondary,
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
