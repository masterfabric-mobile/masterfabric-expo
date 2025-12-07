import { Sizing, typographyHelper } from 'masterfabric-expo-core';
import { StyleSheet } from 'react-native';

export const stepContentStyles = StyleSheet.create({
  scrollContent: {
    flexGrow: Sizing.flexNumber.full,
    justifyContent: Sizing.layout.justifyContent.center,
    paddingBottom: Sizing.padding.l,
    paddingHorizontal: Sizing.padding.m,
  },
  container: {
    alignItems: Sizing.layout.alignItems.center,
    width: '100%',
  },
  iconContainer: {
    width: Sizing.icon.xxxl + Sizing.icon.xl,
    height: Sizing.icon.xxxl + Sizing.icon.xl,
    borderRadius: (Sizing.icon.xxxl + Sizing.icon.xl) / 2,
    justifyContent: Sizing.layout.justifyContent.center,
    alignItems: Sizing.layout.alignItems.center,
    marginBottom: Sizing.padding.xxl,
  },
  textContainer: {
    alignItems: Sizing.layout.alignItems.center,
    width: '100%',
    paddingHorizontal: Sizing.padding.m,
  },
  title: {
    ...typographyHelper.fromSizing.createStyle(Sizing, 'xxl', 'bold', 'normal'),
    textAlign: Sizing.layout.textAlign.center,
    marginBottom: Sizing.gap.s,
  },
  subtitle: {
    ...typographyHelper.fromSizing.createStyle(Sizing, 'l', 'normal', 'normal'),
    textAlign: Sizing.layout.textAlign.center,
    marginBottom: Sizing.padding.xl,
    opacity: Sizing.opacity.xl,
  },
  descriptionContainer: {
    width: '100%',
    alignItems: Sizing.layout.alignItems.center,
  },
  paragraphContainer: {
    padding: Sizing.padding.m,
    borderRadius: Sizing.card.borderRadius.m,
    width: '100%',
    maxWidth: Sizing.maxWidth.m,
    borderLeftWidth: Sizing.borderWidth.l,
  },
  paragraphText: {
    ...typographyHelper.fromSizing.createStyle(Sizing, 'm', 'normal', 'normal'),
    textAlign: Sizing.layout.textAlign.left,
  },
  // Legacy styles kept for compatibility
  bullet: {
    width: Sizing.spacing.xxs,
    height: Sizing.spacing.xxs,
    borderRadius: Sizing.spacing.xxs / 2,
    marginRight: Sizing.padding.s,
    marginTop: Sizing.gap.s,
  },
  descriptionText: {
    ...typographyHelper.fromSizing.createStyle(Sizing, 'm', 'normal', 'normal'),
    flex: Sizing.flexNumber.full,
  },
  paragraphItem: {
    marginBottom: Sizing.padding.s,
    padding: Sizing.padding.s,
    borderRadius: Sizing.gap.s,
    borderLeftWidth: Sizing.borderWidth.l,
    borderLeftColor: '#007AFF',
    width: '90%',
  },
});
