import { Sizing, typographyHelper } from 'masterfabric-expo-core';
import { StyleSheet } from 'react-native';

export const typographyHelperScreenStyles = StyleSheet.create({
  container: {
    flex: Sizing.flexNumber.full,
  },
  scrollView: {
    flex: Sizing.flexNumber.full,
  },
  scrollContent: {
    padding: Sizing.padding.l,
    paddingBottom: Sizing.padding.xxl,
  },
  resultsTitle: {
    ...typographyHelper.fromSizing.createStyle(Sizing, 'xl', 'semibold', 'normal'),
    marginTop: Sizing.padding.xl,
    marginBottom: Sizing.padding.m,
  },
  showcaseContainer: {
    marginVertical: Sizing.padding.m,
    padding: Sizing.padding.m,
    borderRadius: Sizing.card.borderRadius.m,
    borderWidth: Sizing.borderWidth.s,
  },
  showcaseTitle: {
    ...typographyHelper.fromSizing.createStyle(Sizing, 'l', 'semibold', 'normal'),
    marginBottom: Sizing.padding.m,
    textAlign: Sizing.layout.textAlign.center,
  },
  showcaseSection: {
    marginBottom: Sizing.padding.l,
    paddingVertical: Sizing.padding.s,
    borderBottomWidth: Sizing.borderWidth.s,
    borderBottomColor: '#E5E5E5',
  },
  sectionLabel: {
    ...typographyHelper.fromSizing.createStyle(Sizing, 's', 'medium', 'normal'),
    marginBottom: Sizing.gap.s,
    opacity: Sizing.opacity.l,
  },
});

