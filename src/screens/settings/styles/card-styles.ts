import { Sizing, typographyHelper } from 'masterfabric-expo-core';
import { StyleSheet } from 'react-native';

export const cardStyles = StyleSheet.create({
  card: {
    borderRadius: Sizing.card.borderRadius.l,
    marginBottom: Sizing.padding.l,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: Sizing.spacing.xxs },
    shadowOpacity: Sizing.shadowOpacity.xs,
    shadowRadius: Sizing.gap.s,
    elevation: Sizing.elevation.s,
  },
  cardHeader: {
    flexDirection: Sizing.layout.flexDirection.row,
    alignItems: Sizing.layout.alignItems.center,
    padding: Sizing.padding.l,
    paddingBottom: Sizing.padding.m,
  },
  iconContainer: {
    width: Sizing.button.height.medium,
    height: Sizing.button.height.medium,
    borderRadius: Sizing.button.height.medium / 2,
    justifyContent: Sizing.layout.justifyContent.center,
    alignItems: Sizing.layout.alignItems.center,
    marginRight: Sizing.padding.m,
  },
  cardHeaderContent: {
    flex: Sizing.flexNumber.full,
  },
  cardTitle: {
    ...typographyHelper.fromSizing.createStyle(Sizing, 'l', 'semibold', 'normal'),
    marginBottom: Sizing.spacing.xxs,
  },
  cardSubtitle: {
    ...typographyHelper.fromSizing.createStyle(Sizing, 's', 'normal', 'normal'),
  },
  cardBody: {
    paddingHorizontal: Sizing.padding.l,
    paddingBottom: Sizing.padding.l,
  },
});
