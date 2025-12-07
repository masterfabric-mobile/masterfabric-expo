import { Sizing, typographyHelper } from 'masterfabric-expo-core';
import { StyleSheet } from 'react-native';

export const projectCardStyles = StyleSheet.create({
  card: {
    borderRadius: Sizing.card.borderRadius.xl,
    padding: Sizing.padding.l,
    marginBottom: Sizing.padding.s,
    marginHorizontal: Sizing.spacing.xxs,
    borderWidth: Sizing.borderWidth.none,
    shadowOffset: { width: 0, height: Sizing.spacing.xxs },
    shadowOpacity: Sizing.shadowOpacity.s,
    shadowRadius: Sizing.padding.l,
    elevation: Sizing.elevation.s,
  },
  header: {
    flexDirection: Sizing.layout.flexDirection.row,
    justifyContent: Sizing.layout.justifyContent.spaceBetween,
    alignItems: Sizing.layout.alignItems.flexStart,
    marginBottom: Sizing.padding.s,
  },
  title: {
    ...typographyHelper.fromSizing.createStyle(Sizing, 'l', 'bold', 'normal'),
    flex: Sizing.flexNumber.full,
    marginRight: Sizing.padding.s,
  },
  languageIndicator: {
    width: Sizing.spacing.xxs,
    height: Sizing.spacing.xxs,
    borderRadius: Sizing.spacing.xxs / 2,
    marginTop: Sizing.spacing.xxs,
  },
  description: {
    ...typographyHelper.fromSizing.createStyle(Sizing, 's', 'normal', 'normal'),
    opacity: Sizing.opacity.m,
    marginBottom: Sizing.padding.m,
  },
  footer: {
    flexDirection: Sizing.layout.flexDirection.row,
    justifyContent: Sizing.layout.justifyContent.spaceBetween,
    alignItems: Sizing.layout.alignItems.center,
    paddingTop: Sizing.padding.s,
    borderTopWidth: Sizing.borderWidth.hairline,
  },
  stats: {
    flexDirection: Sizing.layout.flexDirection.row,
    alignItems: Sizing.layout.alignItems.center,
    gap: Sizing.padding.m,
  },
  stat: {
    flexDirection: Sizing.layout.flexDirection.row,
    alignItems: Sizing.layout.alignItems.center,
    gap: Sizing.spacing.xxs,
  },
  statText: {
    ...typographyHelper.fromSizing.createStyle(Sizing, 'xs', 'semibold', 'normal'),
    opacity: Sizing.opacity.l,
  },
  rightSection: {
    alignItems: Sizing.layout.alignItems.flexEnd,
    gap: Sizing.spacing.xxs,
  },
  date: {
    ...typographyHelper.fromSizing.createStyle(Sizing, 'xxs', 'medium', 'normal'),
    opacity: Sizing.opacity.s,
  },
  language: {
    ...typographyHelper.fromSizing.createStyle(Sizing, 'xs', 'semibold', 'normal'),
    opacity: Sizing.opacity.xl,
  },
});
