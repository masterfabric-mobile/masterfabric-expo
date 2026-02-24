import { RecipioColors } from '@/shared/constants/recipio-colors';
import { StyleSheet } from 'react-native';
import { Platform } from 'react-native';

export const recipeSearchStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: RecipioColors.background,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingTop: Platform.OS === 'web' ? 12 : 44,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: RecipioColors.border,
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
    backgroundColor: RecipioColors.cardBackground,
    borderRadius: 12,
    paddingHorizontal: 14,
    gap: 10,
    borderWidth: 1,
    borderColor: RecipioColors.border,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: RecipioColors.text,
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
    color: RecipioColors.textSecondary,
    letterSpacing: 0.5,
  },
  clearRecent: {
    padding: 4,
  },
  clearRecentText: {
    fontSize: 14,
    fontWeight: '600',
    color: RecipioColors.primaryAccent,
  },
  chipWrap: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  chip: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: RecipioColors.cardBackground,
    borderRadius: 20,
    paddingVertical: 8,
    paddingLeft: 14,
    paddingRight: 8,
    borderWidth: 1,
    borderColor: RecipioColors.border,
    gap: 6,
  },
  chipText: {
    fontSize: 14,
    color: RecipioColors.text,
  },
  list: {
    paddingHorizontal: 20,
    paddingBottom: 100,
  },
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: RecipioColors.cardBackground,
    borderRadius: 12,
    padding: 12,
    marginBottom: 12,
    gap: 14,
    borderWidth: 1,
    borderColor: RecipioColors.border,
  },
  cardImage: {
    width: 80,
    height: 80,
    borderRadius: 10,
    backgroundColor: RecipioColors.border,
  },
  cardBody: {
    flex: 1,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: RecipioColors.text,
    marginBottom: 4,
  },
  cardMeta: {
    flexDirection: 'row',
    gap: 8,
  },
  cardMetaText: {
    fontSize: 12,
    color: RecipioColors.textSecondary,
  },
  empty: {
    padding: 40,
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 15,
    color: RecipioColors.textSecondary,
    textAlign: 'center',
  },
});
