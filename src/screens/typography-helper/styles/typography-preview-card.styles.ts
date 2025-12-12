import { Sizing, typographyHelper } from 'masterfabric-expo-core';
import { StyleSheet } from 'react-native';

export const typographyPreviewCardStyles = StyleSheet.create({
  container: {
    padding: Sizing.padding.l,
    borderRadius: Sizing.card.borderRadius.m,
    borderWidth: Sizing.borderWidth.m,
    marginBottom: Sizing.padding.l,
  },
  title: {
    ...typographyHelper.fromSizing.createStyle(Sizing, 'l', 'semibold', 'normal'),
    marginBottom: Sizing.padding.m,
  },
  previewContainer: {
    padding: Sizing.padding.m,
    borderRadius: Sizing.gap.s,
    borderWidth: Sizing.borderWidth.s,
    marginBottom: Sizing.padding.m,
    minHeight: Sizing.height.xxl,
  },
  previewText: {
    ...typographyHelper.fromSizing.createStyle(Sizing, 'm', 'normal', 'normal'),
  },
  infoRow: {
    flexDirection: Sizing.layout.flexDirection.row,
    justifyContent: Sizing.layout.justifyContent.spaceBetween,
    paddingVertical: Sizing.gap.s,
    borderBottomWidth: Sizing.borderWidth.s,
    borderBottomColor: 'rgba(0,0,0,0.1)',
  },
  infoLabel: {
    ...typographyHelper.fromSizing.createStyle(Sizing, 's', 'medium', 'normal'),
    opacity: Sizing.opacity.l,
  },
  infoValue: {
    ...typographyHelper.fromSizing.createStyle(Sizing, 's', 'semibold', 'normal'),
    fontFamily: 'monospace',
  },
});

