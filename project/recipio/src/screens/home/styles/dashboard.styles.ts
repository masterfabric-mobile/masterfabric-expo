import { StyleSheet } from 'react-native';
import { RecipioColors } from '@/shared/constants/recipio-colors';

const colors = {
  background: RecipioColors.background,
  cardBackground: RecipioColors.cardBackground,
  text: RecipioColors.text,
  textSecondary: RecipioColors.textSecondary,
  primary: RecipioColors.primaryAccent,
  success: RecipioColors.success,
  border: RecipioColors.border,
};

export const dashboardStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  safeArea: {
    flex: 1,
  },
  header: {
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 20,
  },
  dashboardLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: colors.textSecondary,
    letterSpacing: 1,
    marginBottom: 8,
  },
  headerContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  profileSection: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  avatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: colors.cardBackground,
  },
  greetingText: {
    fontSize: 12,
    color: colors.textSecondary,
    letterSpacing: 0.5,
    marginBottom: 2,
  },
  userNameText: {
    fontSize: 20,
    fontWeight: '700',
    color: colors.text,
  },
  planCard: {
    backgroundColor: colors.cardBackground,
    borderRadius: 12,
    padding: 20,
    marginHorizontal: 20,
    marginBottom: 24,
  },
  planHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  planTitle: {
    fontSize: 12,
    fontWeight: '600',
    color: colors.textSecondary,
    letterSpacing: 1,
  },
  planStatus: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  planStatusBadge: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: colors.success,
    justifyContent: 'center',
    alignItems: 'center',
  },
  planStatusText: {
    fontSize: 12,
    color: colors.success,
    fontWeight: '600',
  },
  planName: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.text,
    marginBottom: 4,
  },
  planDescription: {
    fontSize: 14,
    color: colors.textSecondary,
    marginBottom: 12,
  },
  progressBarContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  progressBar: {
    flex: 1,
    height: 6,
    backgroundColor: colors.primary,
    borderRadius: 3,
  },
  progressBarBg: {
    flex: 1,
    height: 6,
    backgroundColor: colors.border,
    borderRadius: 3,
    overflow: 'hidden',
  },
  progressText: {
    fontSize: 12,
    color: colors.textSecondary,
    minWidth: 40,
  },
  findRecipesCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.cardBackground,
    borderRadius: 12,
    padding: 20,
    marginHorizontal: 20,
    marginBottom: 24,
    gap: 16,
    borderWidth: 1,
    borderColor: colors.border,
  },
  findRecipesIconContainer: {
    width: 56,
    height: 56,
    borderRadius: 12,
    backgroundColor: 'rgba(255, 149, 0, 0.15)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  findRecipesContent: {
    flex: 1,
  },
  findRecipesTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.text,
    marginBottom: 4,
  },
  findRecipesSubtitle: {
    fontSize: 14,
    color: colors.textSecondary,
  },
  findRecipesArrow: {
    marginLeft: 4,
  },
  searchButton: {
    padding: 8,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.text,
    marginBottom: 16,
    paddingHorizontal: 20,
  },
  cookTonightSection: {
    marginBottom: 24,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    marginBottom: 12,
  },
  viewAllText: {
    fontSize: 14,
    color: colors.primary,
    fontWeight: '600',
  },
  recipeScroll: {
    paddingHorizontal: 20,
  },
  recipeCard: {
    width: 160,
    marginRight: 12,
    backgroundColor: colors.cardBackground,
    borderRadius: 12,
    overflow: 'hidden',
  },
  recipeImage: {
    width: '100%',
    height: 100,
    backgroundColor: colors.border,
  },
  recipeTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.text,
    padding: 12,
    paddingBottom: 4,
  },
  recipeMeta: {
    flexDirection: 'row',
    paddingHorizontal: 12,
    paddingBottom: 12,
    gap: 4,
  },
  recipeMetaText: {
    fontSize: 12,
    color: colors.textSecondary,
  },
  emptyRecipesContainer: {
    padding: 24,
    alignItems: 'center',
  },
  emptyRecipesText: {
    fontSize: 14,
    color: colors.textSecondary,
    textAlign: 'center',
  },
  recentActivitySection: {
    paddingHorizontal: 20,
    paddingBottom: 100,
  },
  activityCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.cardBackground,
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    gap: 12,
  },
  activityImage: {
    width: 48,
    height: 48,
    borderRadius: 8,
    backgroundColor: colors.border,
  },
  activityIconContainer: {
    width: 48,
    height: 48,
    borderRadius: 8,
    backgroundColor: colors.cardBackground,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.border,
  },
  activityTextContent: {
    flex: 1,
  },
  activityTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.text,
  },
  activityTime: {
    fontSize: 12,
    color: colors.textSecondary,
    marginTop: 2,
  },
});
