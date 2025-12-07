import { Sizing, typographyHelper } from 'masterfabric-expo-core';
import { StyleSheet } from 'react-native';

export const progressSectionStyles = StyleSheet.create({
  loadingContainer: {
    width: '100%',
    paddingHorizontal: Sizing.padding.xxl,
    marginBottom: Sizing.padding.xxl,
  },
  progressBar: {
    height: Sizing.spacing.xxs,
    borderRadius: Sizing.spacing.xxs / 2,
    overflow: Sizing.layout.overflow.hidden,
    width: '100%',
    marginBottom: Sizing.padding.m,
  },
  progressFill: {
    height: '100%',
    borderRadius: Sizing.spacing.xxs / 2,
  },
  progressText: {
    ...typographyHelper.fromSizing.createStyle(Sizing, 's', 'normal', 'normal'),
    textAlign: Sizing.layout.textAlign.center,
    opacity: Sizing.opacity.xl,
  },
  taskText: {
    ...typographyHelper.fromSizing.createStyle(Sizing, 's', 'normal', 'normal'),
    textAlign: Sizing.layout.textAlign.center,
    marginTop: Sizing.gap.s,
    opacity: Sizing.opacity.s,
  },
});
