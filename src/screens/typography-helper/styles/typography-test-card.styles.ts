import { Sizing, typographyHelper } from 'masterfabric-expo-core';
import { StyleSheet } from 'react-native';

export const typographyTestCardStyles = StyleSheet.create({
  container: {
    padding: Sizing.padding.m,
    borderRadius: Sizing.card.borderRadius.m,
    borderWidth: Sizing.borderWidth.m,
    marginBottom: Sizing.padding.s,
  },
  header: {
    marginBottom: Sizing.gap.s,
  },
  functionName: {
    ...typographyHelper.fromSizing.createStyle(Sizing, 'm', 'bold', 'normal'),
  },
  description: {
    ...typographyHelper.fromSizing.createStyle(Sizing, 's', 'normal', 'normal'),
    marginBottom: Sizing.padding.s,
    opacity: Sizing.opacity.xl,
  },
  inputOutputContainer: {
    gap: Sizing.padding.s,
  },
  inputOutputGroup: {
    gap: Sizing.spacing.xxs,
  },
  label: {
    ...typographyHelper.fromSizing.createStyle(Sizing, 'xs', 'semibold', 'normal'),
    textTransform: 'uppercase',
  },
  inputOutputBox: {
    padding: Sizing.padding.s,
    borderRadius: Sizing.gap.s,
    borderWidth: Sizing.borderWidth.s,
    minHeight: Sizing.button.height.medium,
    justifyContent: Sizing.layout.justifyContent.center,
  },
  inputOutputText: {
    ...typographyHelper.fromSizing.createStyle(Sizing, 's', 'normal', 'normal'),
    fontFamily: 'monospace',
  },
});

