import { Sizing, typographyHelper } from 'masterfabric-expo-core';
import { StyleSheet } from 'react-native';

export const richTextHelperScreenStyles = StyleSheet.create({
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
});

