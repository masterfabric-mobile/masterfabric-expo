import type { RecipioColorsPalette } from '@/shared/constants/recipio-colors';
import { Platform, StyleSheet } from 'react-native';

const HORIZONTAL_PADDING = 20;
const SECTION_GAP = 24;
const CARD_RADIUS = 20;
const CARD_RADIUS_SM = 12;

export function createHomeStyles(colors: RecipioColorsPalette) {
  const c = {
    background: colors.background,
    cardBackground: colors.cardBackground,
    text: colors.text,
    textSecondary: colors.textSecondary,
    primary: colors.primaryAccent,
    primaryMuted: colors.lightOrange,
    success: colors.success,
    border: colors.border,
  };
  return StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: c.background,
    },
    safeArea: {
      flex: 1,
    },
    // —— Header: search-first layout ——
    header: {
      paddingHorizontal: HORIZONTAL_PADDING,
      paddingTop: Platform.OS === 'web' ? 16 : 44,
      paddingBottom: 16,
    },
    searchRow: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 12,
      marginBottom: 16,
    },
    searchTouchable: {
      flex: 1,
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: c.cardBackground,
      borderRadius: 14,
      paddingVertical: 12,
      paddingHorizontal: 16,
      gap: 10,
      borderWidth: 1,
      borderColor: c.border,
    },
    searchIcon: {
      opacity: 0.8,
    },
    searchPlaceholder: {
      fontSize: 16,
      color: c.textSecondary,
      flex: 1,
    },
    headerRight: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 8,
    },
    avatarButton: {
      width: 44,
      height: 44,
      borderRadius: 22,
      backgroundColor: c.cardBackground,
      justifyContent: 'center',
      alignItems: 'center',
      borderWidth: 1,
      borderColor: c.border,
    },
    avatar: {
      width: 44,
      height: 44,
      borderRadius: 22,
      backgroundColor: c.cardBackground,
    },
    welcomeBlock: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
    },
    greetingText: {
      fontSize: 13,
      color: c.textSecondary,
      letterSpacing: 0.2,
      marginBottom: 2,
    },
    userNameText: {
      fontSize: 20,
      fontWeight: '700',
      color: c.text,
      letterSpacing: -0.2,
    },

    // —— Stories strip (Instagram-style circular) ——
    storiesSection: {
      marginBottom: SECTION_GAP,
    },
    storiesScrollContent: {
      paddingHorizontal: HORIZONTAL_PADDING,
      gap: 16,
      paddingVertical: 8,
      paddingRight: HORIZONTAL_PADDING + 16,
    },
    storyItemWrap: {
      alignItems: 'center',
      width: 88,
    },
    storyRing: {
      width: 72 + 6,
      height: 72 + 6,
      borderRadius: (72 + 6) / 2,
      padding: 3,
      backgroundColor: c.primary,
      justifyContent: 'center',
      alignItems: 'center',
      marginBottom: 6,
    },
    storyCircle: {
      width: 72,
      height: 72,
      borderRadius: 36,
      overflow: 'hidden',
      backgroundColor: c.border,
    },
    storyImage: {
      width: '100%',
      height: '100%',
    },
    storyLabel: {
      fontSize: 11,
      color: c.text,
      fontWeight: '500',
      maxWidth: 82,
      textAlign: 'center',
    },

    // —— Plan strip (compact) ——
    planStripSection: {
      paddingHorizontal: HORIZONTAL_PADDING,
      marginBottom: SECTION_GAP,
    },
    planStrip: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: c.cardBackground,
      borderRadius: CARD_RADIUS_SM,
      paddingVertical: 14,
      paddingHorizontal: 16,
      gap: 12,
      borderWidth: 1,
      borderColor: c.border,
    },
    planStripLeft: {
      flex: 1,
      flexDirection: 'row',
      alignItems: 'center',
      gap: 8,
    },
    planStatusDot: {
      width: 8,
      height: 8,
      borderRadius: 4,
      backgroundColor: c.success,
    },
    planStripName: {
      fontSize: 15,
      fontWeight: '600',
      color: c.text,
    },
    planStripLabel: {
      fontSize: 12,
      color: c.textSecondary,
      marginLeft: 4,
    },
    planStripProgress: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 8,
      minWidth: 72,
    },
    planStripProgressBg: {
      flex: 1,
      height: 6,
      backgroundColor: c.border,
      borderRadius: 3,
      overflow: 'hidden',
      position: 'relative',
    },
    planStripProgressFill: {
      position: 'absolute',
      left: 0,
      top: 0,
      bottom: 0,
      backgroundColor: c.primary,
      borderRadius: 3,
    },
    planStripCount: {
      fontSize: 12,
      fontWeight: '700',
      color: c.textSecondary,
      minWidth: 32,
      textAlign: 'right',
    },

    // —— Categories section (horizontal scroll with image + gradient) ——
    categoriesSection: {
      marginBottom: SECTION_GAP,
    },
    categoriesSectionTitle: {
      fontSize: 17,
      fontWeight: '700',
      color: c.text,
      marginBottom: 14,
      paddingHorizontal: HORIZONTAL_PADDING,
    },
    categoriesScroll: {
      paddingHorizontal: HORIZONTAL_PADDING,
      paddingBottom: 8,
    },
    categoryCard: {
      width: 140,
      height: 176,
      marginRight: 12,
      borderRadius: 16,
      overflow: 'hidden',
    },
    categoryCardImage: {
      ...StyleSheet.absoluteFillObject,
      width: '100%',
      height: '100%',
    },
    categoryCardGradient: {
      ...StyleSheet.absoluteFillObject,
    },
    categoryCardLabel: {
      position: 'absolute',
      left: 12,
      right: 12,
      bottom: 12,
    },
    categoryCardText: {
      fontSize: 16,
      fontWeight: '700',
      color: '#FFFFFF',
      textShadowColor: 'rgba(0,0,0,0.5)',
      textShadowOffset: { width: 0, height: 1 },
      textShadowRadius: 3,
    },

    // —— Section common ——
    sectionTitle: {
      fontSize: 17,
      fontWeight: '700',
      color: c.text,
      marginBottom: 12,
    },
    sectionHeader: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      paddingHorizontal: HORIZONTAL_PADDING,
      marginBottom: 12,
    },
    viewAllButton: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingVertical: 8,
      paddingHorizontal: 14,
      borderRadius: 20,
      gap: 6,
      backgroundColor: c.primary,
      borderWidth: 0,
    },
    viewAllButtonText: {
      fontSize: 13,
      color: '#FFFFFF',
      fontWeight: '700',
    },
    viewAllText: {
      fontSize: 14,
      color: c.primary,
      fontWeight: '600',
    },

    // —— Cook tonight (gradient cards + icon badges) ——
    cookTonightSection: {
      marginBottom: SECTION_GAP,
    },
    recipeScroll: {
      paddingHorizontal: HORIZONTAL_PADDING,
      gap: 0,
      paddingBottom: 8,
    },
    recipeCard: {
      width: 180,
      marginRight: 14,
      borderRadius: CARD_RADIUS_SM,
      overflow: 'hidden',
      backgroundColor: c.cardBackground,
      borderWidth: 0,
    },
    recipeImageWrap: {
      width: '100%',
      aspectRatio: 4 / 3,
      backgroundColor: c.border,
      position: 'relative',
    },
    recipeImage: {
      width: '100%',
      height: '100%',
    },
    recipeCardGradient: {
      ...StyleSheet.absoluteFillObject,
    },
    recipeBadgesOverlay: {
      position: 'absolute',
      top: 8,
      left: 8,
      right: 8,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
    },
    recipeTitleOverlay: {
      position: 'absolute',
      bottom: 0,
      left: 0,
      right: 0,
      padding: 12,
    },
    recipeTitleOnGradient: {
      fontSize: 15,
      fontWeight: '600',
      color: '#FFFFFF',
    },
    recipeContent: {
      padding: 12,
    },
    recipeTitle: {
      fontSize: 15,
      fontWeight: '600',
      color: c.text,
      marginBottom: 8,
    },
    recipeBadges: {
      flexDirection: 'row',
      alignItems: 'center',
      flexWrap: 'wrap',
      gap: 6,
    },
    recipeBadge: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingVertical: 5,
      paddingHorizontal: 10,
      borderRadius: 8,
      gap: 4,
      backgroundColor: 'rgba(0, 0, 0, 0.55)',
    },
    recipeBadgeText: {
      fontSize: 11,
      fontWeight: '600',
      color: '#FFFFFF',
    },
    recipeBadgeTimeQuick: {
      backgroundColor: 'rgba(0, 0, 0, 0.55)',
    },
    recipeBadgeTimeQuickText: {
      color: '#FFFFFF',
    },
    recipeBadgeTimeMedium: {
      backgroundColor: 'rgba(0, 0, 0, 0.55)',
    },
    recipeBadgeTimeMediumText: {
      color: '#FFFFFF',
    },
    recipeBadgeTimeLong: {
      backgroundColor: 'rgba(0, 0, 0, 0.55)',
    },
    recipeBadgeTimeLongText: {
      color: '#FFFFFF',
    },
    recipeBadgeDifficultyEasy: {
      backgroundColor: 'rgba(0, 0, 0, 0.55)',
    },
    recipeBadgeDifficultyEasyText: {
      color: '#FFFFFF',
    },
    recipeBadgeDifficultyMedium: {
      backgroundColor: 'rgba(0, 0, 0, 0.55)',
    },
    recipeBadgeDifficultyMediumText: {
      color: '#FFFFFF',
    },
    recipeBadgeDifficultyHard: {
      backgroundColor: 'rgba(0, 0, 0, 0.55)',
    },
    recipeBadgeDifficultyHardText: {
      color: '#FFFFFF',
    },
    recipeMeta: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 6,
    },
    recipeMetaText: {
      fontSize: 12,
      color: c.textSecondary,
    },
    emptyRecipesContainer: {
      paddingVertical: 40,
      paddingHorizontal: HORIZONTAL_PADDING,
      alignItems: 'center',
    },
    emptyRecipesText: {
      fontSize: 15,
      color: c.textSecondary,
      textAlign: 'center',
      lineHeight: 22,
    },

    // —— Recent activity ——
    recentActivitySection: {
      paddingHorizontal: HORIZONTAL_PADDING,
      paddingBottom: 100,
    },
    activityCard: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: c.cardBackground,
      borderRadius: CARD_RADIUS_SM,
      padding: 14,
      marginBottom: 10,
      gap: 12,
      borderWidth: 1,
      borderColor: c.border,
    },
    activityImage: {
      width: 44,
      height: 44,
      borderRadius: 10,
      backgroundColor: c.border,
    },
    activityIconContainer: {
      width: 44,
      height: 44,
      borderRadius: 10,
      backgroundColor: c.background,
      justifyContent: 'center',
      alignItems: 'center',
      borderWidth: 1,
      borderColor: c.border,
    },
    activityTextContent: {
      flex: 1,
    },
    activityTitle: {
      fontSize: 14,
      fontWeight: '600',
      color: c.text,
    },
    activityTime: {
      fontSize: 12,
      color: c.textSecondary,
      marginTop: 2,
    },
    emptyActivityContainer: {
      paddingVertical: 28,
      paddingHorizontal: 24,
      alignItems: 'center',
      backgroundColor: c.cardBackground,
      borderRadius: CARD_RADIUS_SM,
      marginTop: 4,
      borderWidth: 1,
      borderColor: c.border,
    },
    emptyActivityIcon: {
      fontSize: 40,
      marginBottom: 10,
    },
    emptyActivityText: {
      fontSize: 15,
      fontWeight: '600',
      color: c.text,
      textAlign: 'center',
      marginBottom: 4,
    },
    emptyActivitySubtext: {
      fontSize: 13,
      color: c.textSecondary,
      textAlign: 'center',
      lineHeight: 20,
    },

    // —— Legacy compatibility (plan card full – if needed) ——
    planCard: {
      backgroundColor: c.cardBackground,
      borderRadius: CARD_RADIUS,
      padding: 20,
      marginHorizontal: HORIZONTAL_PADDING,
      marginBottom: 20,
      borderWidth: 1,
      borderColor: c.border,
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
      color: c.textSecondary,
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
      backgroundColor: c.success,
      justifyContent: 'center',
      alignItems: 'center',
    },
    planStatusText: {
      fontSize: 12,
      color: c.success,
      fontWeight: '600',
    },
    planName: {
      fontSize: 18,
      fontWeight: '700',
      color: c.text,
      marginBottom: 4,
    },
    planDescription: {
      fontSize: 14,
      color: c.textSecondary,
      marginBottom: 14,
    },
    progressBarContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 12,
    },
    progressBar: {
      height: 6,
      backgroundColor: c.primary,
      borderRadius: 3,
    },
    progressBarBg: {
      flex: 1,
      height: 6,
      backgroundColor: c.border,
      borderRadius: 3,
      overflow: 'hidden',
    },
    progressText: {
      fontSize: 12,
      color: c.textSecondary,
      minWidth: 44,
      fontWeight: '600',
    },

    findRecipesCard: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: c.cardBackground,
      borderRadius: CARD_RADIUS,
      padding: 20,
      marginHorizontal: HORIZONTAL_PADDING,
      marginBottom: SECTION_GAP,
      gap: 16,
      borderWidth: 1,
      borderColor: c.border,
    },
    findRecipesIconContainer: {
      width: 56,
      height: 56,
      borderRadius: 14,
      backgroundColor: 'rgba(255, 87, 34, 0.12)',
      justifyContent: 'center',
      alignItems: 'center',
    },
    findRecipesContent: {
      flex: 1,
    },
    findRecipesTitle: {
      fontSize: 18,
      fontWeight: '700',
      color: c.text,
      marginBottom: 4,
    },
    findRecipesSubtitle: {
      fontSize: 14,
      color: c.textSecondary,
      lineHeight: 20,
    },
    findRecipesArrow: {
      marginLeft: 4,
    },

    loadingContainer: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
    },
  });
}
