import { Sizing, typographyHelper } from 'masterfabric-expo-core';
import { StyleSheet } from 'react-native';

export const themePreviewStyles = StyleSheet.create({
  previewSection: {
    marginTop: Sizing.gap.s,
  },
  previewTitle: {
    ...typographyHelper.fromSizing.createStyle(Sizing, 'l', 'semibold', 'normal'),
    marginBottom: Sizing.padding.s,
  },
  previewCard: {
    padding: Sizing.padding.m,
    borderRadius: Sizing.card.borderRadius.m,
  },
  previewCardTitle: {
    ...typographyHelper.fromSizing.createStyle(Sizing, 'm', 'semibold', 'normal'),
    marginBottom: Sizing.gap.s,
  },
  previewCardText: {
    ...typographyHelper.fromSizing.createStyle(Sizing, 's', 'normal', 'normal'),
    opacity: Sizing.opacity.l,
    marginBottom: Sizing.padding.m,
  },
  previewButton: {
    paddingHorizontal: Sizing.padding.l,
    paddingVertical: Sizing.padding.s,
    borderRadius: Sizing.gap.s,
    alignSelf: Sizing.layout.alignSelf.flexStart,
  },
  previewButtonText: {
    ...typographyHelper.fromSizing.createStyle(Sizing, 's', 'semibold', 'normal'),
  },
});
