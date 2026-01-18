import { Sizing } from 'masterfabric-expo-core';
import { StyleSheet } from 'react-native';

export const webViewTestCardStyles = StyleSheet.create({
  container: {
    padding: Sizing.padding.l,
    borderRadius: Sizing.borderRadius.large,
    borderWidth: Sizing.borderWidth.s,
    marginBottom: Sizing.padding.m,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: Sizing.padding.s,
  },
  functionName: {
    fontSize: Sizing.typography.fontSize.l,
    fontWeight: Sizing.typography.fontWeight.semibold,
    lineHeight: Sizing.typography.fontSize.l * Sizing.typography.lineHeight.normal,
  },
  sourceTypeBadge: {
    paddingVertical: Sizing.padding.xs,
    paddingHorizontal: Sizing.padding.m,
    borderRadius: Sizing.borderRadius.small,
  },
  sourceTypeText: {
    fontSize: Sizing.typography.fontSize.s,
    fontWeight: Sizing.typography.fontWeight.medium,
    lineHeight: Sizing.typography.fontSize.s * Sizing.typography.lineHeight.normal,
  },
  description: {
    fontSize: Sizing.typography.fontSize.m,
    fontWeight: Sizing.typography.fontWeight.normal,
    lineHeight: Sizing.typography.fontSize.m * Sizing.typography.lineHeight.normal,
    marginBottom: Sizing.padding.m,
    opacity: 0.8,
  },
  inputOutputContainer: {
    gap: Sizing.gap.m,
  },
  inputOutputGroup: {
    marginBottom: Sizing.padding.m,
  },
  label: {
    fontSize: Sizing.typography.fontSize.m,
    fontWeight: Sizing.typography.fontWeight.medium,
    lineHeight: Sizing.typography.fontSize.m * Sizing.typography.lineHeight.normal,
    marginBottom: Sizing.padding.s,
  },
  inputOutputBox: {
    padding: Sizing.padding.m,
    borderRadius: Sizing.borderRadius.small,
    borderWidth: Sizing.borderWidth.s,
    minHeight: 60,
  },
  inputOutputText: {
    fontSize: Sizing.typography.fontSize.m,
    fontWeight: Sizing.typography.fontWeight.normal,
    lineHeight: Sizing.typography.fontSize.m * Sizing.typography.lineHeight.normal,
    fontFamily: 'monospace',
  },
});
