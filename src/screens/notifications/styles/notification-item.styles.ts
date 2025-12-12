import { Sizing, typographyHelper } from 'masterfabric-expo-core';
import { StyleSheet } from 'react-native';

export const notificationItemStyles = StyleSheet.create({
  container: {
    paddingHorizontal: Sizing.padding.l,
    paddingVertical: Sizing.padding.m,
    position: 'relative',
  },
  unreadContainer: {
    // No additional styling needed, handled by unreadLine
  },
  content: {
    flexDirection: Sizing.layout.flexDirection.row,
    alignItems: Sizing.layout.alignItems.flexStart,
  },
  iconContainer: {
    marginRight: Sizing.padding.m,
    alignItems: Sizing.layout.alignItems.center,
    justifyContent: Sizing.layout.justifyContent.center,
    paddingTop: Sizing.spacing.xxs,
  },
  iconWrapper: {
    width: Sizing.icon.xl,
    height: Sizing.icon.xl,
    borderRadius: Sizing.icon.xl / 2,
    alignItems: Sizing.layout.alignItems.center,
    justifyContent: Sizing.layout.justifyContent.center,
  },
  textContainer: {
    flex: Sizing.flexNumber.full,
    justifyContent: Sizing.layout.justifyContent.center,
  },
  header: {
    flexDirection: Sizing.layout.flexDirection.row,
    alignItems: Sizing.layout.alignItems.flexStart,
    justifyContent: Sizing.layout.justifyContent.spaceBetween,
    marginBottom: Sizing.spacing.xxs,
  },
  title: {
    ...typographyHelper.fromSizing.createStyle(Sizing, 'm', 'medium', 'normal'),
    flex: Sizing.flexNumber.full,
    marginRight: Sizing.padding.s,
  },
  unreadTitle: {
    fontWeight: '600',
  },
  unreadIndicator: {
    width: Sizing.gap.s,
    height: Sizing.gap.s,
    borderRadius: Sizing.spacing.xxs,
    marginTop: Sizing.padding.xxs,
  },
  message: {
    ...typographyHelper.fromSizing.createStyle(Sizing, 's', 'normal', 'normal'),
    marginBottom: Sizing.padding.s,
    opacity: Sizing.opacity.xl,
  },
  footer: {
    flexDirection: Sizing.layout.flexDirection.row,
    alignItems: Sizing.layout.alignItems.center,
    justifyContent: Sizing.layout.justifyContent.spaceBetween,
  },
  metaContainer: {
    flexDirection: Sizing.layout.flexDirection.row,
    alignItems: Sizing.layout.alignItems.center,
  },
  timeIcon: {
    marginRight: Sizing.spacing.xxs,
    opacity: Sizing.opacity.l,
  },
  timestamp: {
    ...typographyHelper.fromSizing.createStyle(Sizing, 'xs', 'medium', 'normal'),
    opacity: Sizing.opacity.l,
  },
  categoryBadge: {
    flexDirection: Sizing.layout.flexDirection.row,
    alignItems: Sizing.layout.alignItems.center,
    paddingHorizontal: Sizing.gap.s,
    paddingVertical: Sizing.spacing.xxs,
    borderRadius: Sizing.gap.s,
  },
  categoryIcon: {
    marginRight: Sizing.spacing.xxs,
  },
  categoryText: {
    ...typographyHelper.fromSizing.createStyle(Sizing, 'xxs', 'semibold', 'normal'),
    textTransform: 'uppercase',
  },
  unreadLine: {
    position: 'absolute',
    left: 0,
    top: 0,
    bottom: 0,
    width: Sizing.spacing.xxs,
  },
  separator: {
    height: Sizing.divider.height.hairline,
    marginLeft: Sizing.icon.xl + Sizing.padding.m + Sizing.padding.m, // Align with text content
  },
});
