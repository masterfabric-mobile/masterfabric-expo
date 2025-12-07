import { Sizing, typographyHelper } from 'masterfabric-expo-core';
import { StyleSheet } from 'react-native';

export const validatorTestCardStyles = StyleSheet.create({
  container: {
    padding: Sizing.padding.m,
    borderRadius: Sizing.card.borderRadius.m,
    borderWidth: Sizing.borderWidth.m,
    marginBottom: Sizing.spacing.s,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Sizing.spacing.xs,
  },
  validatorType: {
    ...typographyHelper.fromSizing.createStyle(Sizing, 'm', 'bold', 'normal'),
  },
  statusBadge: {
    paddingHorizontal: Sizing.padding.xs,
    paddingVertical: Sizing.padding.xxs,
    borderRadius: Sizing.borderRadius.s,
  },
  statusText: {
    ...typographyHelper.fromSizing.createStyle(Sizing, 'xs', 'semibold', 'normal'),
    textTransform: 'uppercase',
  },
  description: {
    ...typographyHelper.fromSizing.createStyle(Sizing, 's', 'normal', 'normal'),
    marginBottom: Sizing.spacing.s,
    opacity: 0.8,
  },
  inputOutputContainer: {
    gap: Sizing.gap.s,
  },
  inputOutputGroup: {
    gap: Sizing.gap.xs,
  },
  label: {
    ...typographyHelper.fromSizing.createStyle(Sizing, 'xs', 'semibold', 'normal'),
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  inputOutputBox: {
    padding: Sizing.padding.s,
    borderRadius: Sizing.borderRadius.m,
    borderWidth: Sizing.borderWidth.s,
    minHeight: Sizing.input.height.medium,
    justifyContent: 'center',
  },
  inputOutputText: {
    ...typographyHelper.fromSizing.createStyle(Sizing, 's', 'normal', 'normal'),
    fontFamily: 'monospace',
  },
  errorContainer: {
    marginTop: Sizing.spacing.xs,
    padding: Sizing.padding.s,
    borderRadius: Sizing.borderRadius.s,
    borderWidth: Sizing.borderWidth.s,
  },
  errorText: {
    ...typographyHelper.fromSizing.createStyle(Sizing, 's', 'normal', 'normal'),
  },
});

