import { Sizing, typographyHelper } from 'masterfabric-expo-core';
import { StyleSheet } from 'react-native';

export const notificationScreenStyles = StyleSheet.create({
  container: {
    flex: Sizing.flexNumber.full,
  },
  header: {
    flexDirection: Sizing.layout.flexDirection.row,
    justifyContent: Sizing.layout.justifyContent.spaceBetween,
    alignItems: Sizing.layout.alignItems.center,
    paddingHorizontal: Sizing.padding.l,
    paddingVertical: Sizing.padding.m,
    borderBottomWidth: Sizing.borderWidth.s,
  },
  headerTitle: {
    ...typographyHelper.fromSizing.createStyle(Sizing, 'xxl', 'bold', 'normal'),
  },
  headerActions: {
    flexDirection: Sizing.layout.flexDirection.row,
    gap: Sizing.gap.m,
  },
  actionButton: {
    paddingHorizontal: Sizing.padding.m,
    paddingVertical: Sizing.padding.xxs,
    borderRadius: Sizing.borderRadius.small,
  },
  actionButtonText: {
    ...typographyHelper.fromSizing.createStyle(Sizing, 's', 'semibold', 'normal'),
  },
  emptyContainer: {
    flex: Sizing.flexNumber.full,
    justifyContent: Sizing.layout.justifyContent.center,
    alignItems: Sizing.layout.alignItems.center,
    paddingHorizontal: Sizing.padding.xxl,
  },
  emptyTitle: {
    ...typographyHelper.fromSizing.createStyle(Sizing, 'xl', 'semibold', 'normal'),
    marginTop: Sizing.padding.m,
    marginBottom: Sizing.gap.s,
  },
  emptyMessage: {
    ...typographyHelper.fromSizing.createStyle(Sizing, 'm', 'normal', 'normal'),
    textAlign: Sizing.layout.textAlign.center,
  },
  listContainer: {
    flex: Sizing.flexNumber.full,
  },
  notificationItem: {
    paddingHorizontal: Sizing.padding.l,
    paddingVertical: Sizing.padding.m,
    borderBottomWidth: Sizing.borderWidth.s,
  },
  notificationContent: {
    flex: Sizing.flexNumber.full,
  },
  notificationHeader: {
    flexDirection: Sizing.layout.flexDirection.row,
    justifyContent: Sizing.layout.justifyContent.spaceBetween,
    alignItems: Sizing.layout.alignItems.flexStart,
    marginBottom: Sizing.spacing.xxs,
  },
  notificationTitle: {
    ...typographyHelper.fromSizing.createStyle(Sizing, 'm', 'semibold', 'normal'),
    flex: Sizing.flexNumber.full,
    marginRight: Sizing.gap.s,
  },
  notificationTime: {
    ...typographyHelper.fromSizing.createStyle(Sizing, 'xs', 'normal', 'normal'),
    opacity: Sizing.opacity.l,
  },
  notificationMessage: {
    ...typographyHelper.fromSizing.createStyle(Sizing, 's', 'normal', 'normal'),
    marginBottom: Sizing.gap.s,
  },
  notificationBadge: {
    paddingHorizontal: Sizing.gap.s,
    paddingVertical: Sizing.spacing.xxs,
    borderRadius: Sizing.spacing.xxs,
    alignSelf: Sizing.layout.alignSelf.flexStart,
  },
  notificationBadgeText: {
    ...typographyHelper.fromSizing.createStyle(Sizing, 'xs', 'medium', 'normal'),
  },
  unreadIndicator: {
    width: Sizing.gap.s,
    height: Sizing.gap.s,
    borderRadius: Sizing.spacing.xxs,
    position: 'absolute',
    right: Sizing.padding.m,
    top: Sizing.padding.l,
  },
   // Action Bar Styles
  actionBar: {
    flexDirection: Sizing.layout.flexDirection.row,
    paddingHorizontal: Sizing.padding.m,
    paddingVertical: Sizing.padding.s,
    borderBottomWidth: Sizing.divider.height.hairline,
    gap: Sizing.gap.m,
  },
  actionContainer: {
    flexDirection: Sizing.layout.flexDirection.row,
    gap: Sizing.gap.m,
    flex: Sizing.flexNumber.full,
  },
  modernActionButton: {
    flex: Sizing.flexNumber.full,
    flexDirection: Sizing.layout.flexDirection.row,
    alignItems: Sizing.layout.alignItems.center,
    justifyContent: Sizing.layout.justifyContent.center,
    paddingHorizontal: Sizing.padding.m,
    paddingVertical: Sizing.padding.s,
    borderRadius: Sizing.card.borderRadius.m,
    gap: Sizing.gap.s,
  },
  modernActionText: {
    ...typographyHelper.fromSizing.createStyle(Sizing, 's', 'semibold', 'normal'),
  },

  // List Styles
  modernListContainer: {
    flex: Sizing.flexNumber.full,
    backgroundColor: 'transparent',
  },
  listContentContainer: {
    paddingBottom: Sizing.padding.l,
  },

  // Empty State Styles
  modernEmptyContainer: {
    flex: Sizing.flexNumber.full,
    alignItems: Sizing.layout.alignItems.center,
    justifyContent: Sizing.layout.justifyContent.center,
    paddingHorizontal: Sizing.padding.l,
  },
  modernEmptyIconContainer: {
    width: Sizing.icon.xxxl,
    height: Sizing.icon.xxxl,
    borderRadius: Sizing.icon.xxxl / 2,
    alignItems: Sizing.layout.alignItems.center,
    justifyContent: Sizing.layout.justifyContent.center,
    marginBottom: Sizing.padding.m,
  },
  modernEmptyTitle: {
    ...typographyHelper.fromSizing.createStyle(Sizing, 'l', 'medium', 'normal'),
    marginBottom: Sizing.gap.s,
  },
  modernEmptyMessage: {
    ...typographyHelper.fromSizing.createStyle(Sizing, 's', 'normal', 'normal'),
    textAlign: Sizing.layout.textAlign.center,
  },

  // Legacy styles (to be removed)
  actionBarButton: {
    flexDirection: Sizing.layout.flexDirection.row,
    alignItems: Sizing.layout.alignItems.center,
    paddingHorizontal: Sizing.padding.m,
    paddingVertical: Sizing.gap.s,
    borderRadius: Sizing.gap.s,
    gap: Sizing.spacing.xxs,
  },
  actionText: {
    ...typographyHelper.fromSizing.createStyle(Sizing, 'xs', 'medium', 'normal'),
  },
  emptyIconContainer: {
    width: Sizing.icon.xxxl + Sizing.icon.xl,
    height: Sizing.icon.xxxl + Sizing.icon.xl,
    borderRadius: (Sizing.icon.xxxl + Sizing.icon.xl) / 2,
    alignItems: Sizing.layout.alignItems.center,
    justifyContent: Sizing.layout.justifyContent.center,
    marginBottom: Sizing.padding.l,
  },

  // Supabase Badge Styles
  supabaseBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingTop: 2,
    paddingBottom: 6,
    gap: 4,
  },
  supabaseLogo: {
    width: 14,
    height: 14,
  },
  supabaseBadgeText: {
    fontSize: 12,
    opacity: 0.7,
    lineHeight: 14,
  },
});
