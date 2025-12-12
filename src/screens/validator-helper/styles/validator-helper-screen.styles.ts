import { Sizing, typographyHelper } from 'masterfabric-expo-core';
import { StyleSheet } from 'react-native';

export const validatorHelperScreenStyles = StyleSheet.create({
  container: {
    flex: Sizing.flexNumber.full,
  },
  scrollView: {
    flex: Sizing.flexNumber.full,
  },
  scrollContent: {
    padding: Sizing.padding.l,
    paddingBottom: Sizing.padding.xxl,
    gap: Sizing.gap.none,
  },
  resultsTitle: {
    ...typographyHelper.fromSizing.createStyle(Sizing, 'l', 'semibold', 'normal'),
    marginTop: Sizing.padding.xl,
    marginBottom: Sizing.padding.m,
  },
});

