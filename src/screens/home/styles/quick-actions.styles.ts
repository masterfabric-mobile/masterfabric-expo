import { Sizing, typographyHelper } from 'masterfabric-expo-core';
import { StyleSheet } from 'react-native';

const getTypographyStyle = (fontSize: string, fontWeight: string, lineHeight: string = 'normal') => 
  (typographyHelper as any).fromSizing?.createStyle(Sizing, fontSize, fontWeight, lineHeight) || {};

export const quickActionsStyles = StyleSheet.create({
  section: {
    marginBottom: Sizing.padding.l,
  },
  sectionTitle: {
    ...getTypographyStyle('xl', 'semibold', 'normal'),
    marginBottom: Sizing.padding.s,
  },
  actionsList: {
    flexDirection: Sizing.layout.flexDirection.column,
    gap: Sizing.gap.s,
  },
  actionGrid: {
    flexDirection: Sizing.layout.flexDirection.column,
    gap: Sizing.gap.s,
  },
  actionCard: {
    flexDirection: Sizing.layout.flexDirection.row,
    alignItems: Sizing.layout.alignItems.center,
    padding: Sizing.padding.m,
    borderRadius: Sizing.card.borderRadius.m,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: Sizing.borderWidth.s },
    shadowOpacity: Sizing.shadowOpacity.m,
    shadowRadius: Sizing.spacing.xxs,
    elevation: Sizing.elevation.s,
  },
  actionIcon: {
    width: Sizing.icon.xl,
    height: Sizing.icon.xl,
    borderRadius: Sizing.borderRadius.small,
    justifyContent: Sizing.layout.justifyContent.center,
    alignItems: Sizing.layout.alignItems.center,
    marginRight: Sizing.padding.m,
  },
  actionIconContainer: {
    width: Sizing.icon.xl,
    height: Sizing.icon.xl,
    borderRadius: Sizing.borderRadius.small,
    justifyContent: Sizing.layout.justifyContent.center,
    alignItems: Sizing.layout.alignItems.center,
    marginRight: Sizing.padding.m,
  },
  actionContent: {
    flex: Sizing.flexNumber.full,
  },
  actionTitle: {
    ...getTypographyStyle('m', 'semibold', 'normal'),
    marginBottom: Sizing.spacing.xxs,
  },
  actionDescription: {
    ...getTypographyStyle('s', 'normal', 'normal'),
    opacity: Sizing.opacity.l,
  },
});

// For backward compatibility
export const actionsStyles = quickActionsStyles;
