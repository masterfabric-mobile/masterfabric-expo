import { Sizing } from 'masterfabric-expo-core';
import { StyleSheet } from 'react-native';

export const webViewerHelperScreenStyles = StyleSheet.create({
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
  previewSection: {
    marginTop: Sizing.padding.xl,
  },
  previewTitle: {
    fontSize: Sizing.typography.fontSize.xl,
    fontWeight: Sizing.typography.fontWeight.semibold as any,
    lineHeight: Sizing.typography.fontSize.xl * Sizing.typography.lineHeight.normal,
    marginBottom: Sizing.padding.m,
  },
  resultsSection: {
    marginTop: Sizing.padding.xl,
  },
  resultsTitle: {
    fontSize: Sizing.typography.fontSize.xl,
    fontWeight: Sizing.typography.fontWeight.semibold as any,
    lineHeight: Sizing.typography.fontSize.xl * Sizing.typography.lineHeight.normal,
    marginBottom: Sizing.padding.m,
  },
});
