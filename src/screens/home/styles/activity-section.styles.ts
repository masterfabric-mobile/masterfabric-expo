import { Sizing, typographyHelper } from 'masterfabric-expo-core';
import { StyleSheet } from 'react-native';

const getTypographyStyle = (fontSize: string, fontWeight: string, lineHeight: string = 'normal') => 
  (typographyHelper as any).fromSizing?.createStyle(Sizing, fontSize, fontWeight, lineHeight) || {};

export const activitySectionStyles = StyleSheet.create({
  section: {
    marginBottom: Sizing.padding.xl,
  },
  sectionHeader: {
    flexDirection: Sizing.layout.flexDirection.row,
    justifyContent: Sizing.layout.justifyContent.spaceBetween,
    alignItems: Sizing.layout.alignItems.center,
    marginBottom: Sizing.padding.m,
  },
  sectionTitle: {
    ...getTypographyStyle('xl', 'semibold', 'normal'),
  },
  activityCard: {
    borderRadius: Sizing.card.borderRadius.l,
    overflow: Sizing.layout.overflow.hidden,
    shadowOffset: { width: 0, height: Sizing.spacing.xxs },
    shadowOpacity: Sizing.shadowOpacity.m,
    shadowRadius: Sizing.spacing.s,
    elevation: Sizing.elevation.m,
  },
  activityItem: {
    flexDirection: Sizing.layout.flexDirection.row,
    paddingHorizontal: Sizing.padding.m,
    paddingVertical: Sizing.padding.s,
  },
  activityIconContainer: {
    width: Sizing.icon.l,
    height: Sizing.icon.l,
    borderRadius: Sizing.card.borderRadius.m,
    justifyContent: Sizing.layout.justifyContent.center,
    alignItems: Sizing.layout.alignItems.center,
    marginRight: Sizing.padding.s,
  },
  activityContent: {
    flex: Sizing.flexNumber.full,
  },
  activityHeader: {
    flexDirection: Sizing.layout.flexDirection.row,
    justifyContent: Sizing.layout.justifyContent.spaceBetween,
    alignItems: Sizing.layout.alignItems.center,
    marginBottom: Sizing.spacing.xxs,
  },
  activityText: {
    ...getTypographyStyle('m', 'normal', 'normal'),
    opacity: Sizing.opacity.l,
    textAlign: Sizing.layout.textAlign.center,
    paddingVertical: Sizing.padding.s,
  },
  activityTitle: {
    ...getTypographyStyle('s', 'semibold', 'normal'),
    flex: Sizing.flexNumber.full,
    marginRight: Sizing.gap.s,
  },
  activityDescription: {
    ...getTypographyStyle('s', 'normal', 'normal'),
    marginTop: Sizing.spacing.xxs,
    opacity: Sizing.opacity.xl,
  },
  activityTime: {
    ...getTypographyStyle('xs', 'normal', 'normal'),
    opacity: Sizing.opacity.l,
  },
  activityDivider: {
    height: Sizing.borderWidth.s,
    marginLeft: Sizing.icon.xxxl,
    marginRight: Sizing.padding.m,
  },
  emptyStateContainer: {
    alignItems: Sizing.layout.alignItems.center,
    padding: Sizing.padding.xl,
  },
  emptyStateIcon: {
    marginBottom: Sizing.gap.s,
    opacity: Sizing.opacity.m,
  },
});
