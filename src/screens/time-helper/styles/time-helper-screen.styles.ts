import { Sizing, typographyHelper } from 'masterfabric-expo-core';
import { StyleSheet } from 'react-native';

export const timeHelperScreenStyles = StyleSheet.create({
  // Container styles
  container: {
    flex: Sizing.flexNumber.full,
  },
  scrollView: {
    flex: Sizing.flexNumber.full,
  },
  scrollContent: {
    padding: Sizing.padding.m,
    paddingBottom: Sizing.padding.xxl,
  },
  
  // Results section
  resultsTitle: {
    ...typographyHelper.fromSizing.createStyle(Sizing, 'l', 'semibold', 'normal'),
    marginTop: Sizing.padding.xl,
    marginBottom: Sizing.padding.m,
  },
});
