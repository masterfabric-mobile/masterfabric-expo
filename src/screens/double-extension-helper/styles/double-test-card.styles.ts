import { Sizing, typographyHelper } from 'masterfabric-expo-core';
import { StyleSheet, type TextStyle, type ViewStyle } from 'react-native';

export const doubleTestCardStyles = StyleSheet.create({
  container: {
    padding: Sizing.padding.m,
    borderRadius: Sizing.card.borderRadius.m,
    borderWidth: Sizing.borderWidth.m,
    marginBottom: Sizing.padding.s,
  } as ViewStyle,
  header: {
    marginBottom: Sizing.gap.s,
  } as ViewStyle,
  functionName: {
    ...(typographyHelper.fromSizing.createStyle(Sizing, 'm', 'bold', 'normal') as TextStyle),
  },
  description: {
    ...(typographyHelper.fromSizing.createStyle(Sizing, 's', 'normal', 'normal') as TextStyle),
    marginBottom: Sizing.padding.s,
    opacity: Sizing.opacity.xl,
  },
  inputOutputContainer: {
    gap: Sizing.padding.s,
  } as ViewStyle,
  inputOutputGroup: {
    gap: Sizing.spacing.xxs,
  } as ViewStyle,
  label: {
    ...(typographyHelper.fromSizing.createStyle(Sizing, 'xs', 'semibold', 'normal') as TextStyle),
    textTransform: 'uppercase',
  },
  inputOutputBox: {
    padding: Sizing.padding.s,
    borderRadius: Sizing.gap.s,
    borderWidth: Sizing.borderWidth.s,
    minHeight: Sizing.button.height.medium,
    justifyContent: Sizing.layout.justifyContent.center,
  } as ViewStyle,
  inputOutputText: {
    ...(typographyHelper.fromSizing.createStyle(Sizing, 's', 'normal', 'normal') as TextStyle),
    fontFamily: 'monospace',
  },
});
