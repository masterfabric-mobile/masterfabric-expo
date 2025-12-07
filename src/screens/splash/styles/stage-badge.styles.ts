import { Sizing, typographyHelper } from 'masterfabric-expo-core';
import { StyleSheet } from 'react-native';

export const stageBadgeStyles = StyleSheet.create({
  badge: {
    paddingHorizontal: Sizing.padding.s,
    paddingVertical: Sizing.spacing.xxs,
    borderRadius: Sizing.card.borderRadius.m,
    borderWidth: Sizing.borderWidth.s,
    alignSelf: Sizing.layout.alignSelf.center,
    marginBottom: Sizing.spacing.xxs,
  },
  badgeText: {
    ...typographyHelper.fromSizing.createStyle(Sizing, 'xxs', 'semibold', 'normal'),
  },
});
