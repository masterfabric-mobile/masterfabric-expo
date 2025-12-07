import { Sizing, typographyHelper } from 'masterfabric-expo-core';
import { StyleSheet } from 'react-native';

export const appearanceStyles = StyleSheet.create({
  themeGrid: {
    gap: Sizing.padding.m,
  },
  modernThemeCard: {
    borderRadius: Sizing.card.borderRadius.l,
    padding: Sizing.padding.m,
    borderWidth: Sizing.borderWidth.m,
  },
  themePreview: {
    width: '100%',
    height: Sizing.button.height.xl,
    borderRadius: Sizing.card.borderRadius.m,
    padding: Sizing.padding.s,
    marginBottom: Sizing.padding.s,
    borderWidth: Sizing.borderWidth.s,
    justifyContent: Sizing.layout.justifyContent.spaceBetween,
  },
  previewElement: {
    height: Sizing.gap.s,
    borderRadius: Sizing.spacing.xxs,
    width: '80%',
  },
  themeInfo: {
    gap: Sizing.spacing.xxs,
  },
  themeHeader: {
    flexDirection: Sizing.layout.flexDirection.row,
    alignItems: Sizing.layout.alignItems.center,
    gap: Sizing.gap.s,
  },
  modernThemeLabel: {
    ...typographyHelper.fromSizing.createStyle(Sizing, 'm', 'normal', 'normal'),
    flex: Sizing.flexNumber.full,
  },
  modernThemeDescription: {
    ...typographyHelper.fromSizing.createStyle(Sizing, 'xs', 'normal', 'normal'),
  },
});
