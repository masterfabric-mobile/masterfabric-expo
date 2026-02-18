import { Sizing, typographyHelper } from 'masterfabric-expo-core';
import { StyleSheet, type TextStyle, type ViewStyle } from 'react-native';

export const doubleInputFieldStyles = StyleSheet.create({
  container: {
    paddingVertical: Sizing.padding.m,
    paddingHorizontal: Sizing.padding.l,
    borderRadius: Sizing.card.borderRadius.m,
    borderWidth: 1,
    marginBottom: Sizing.padding.m,
  } as ViewStyle,
  title: {
    ...(typographyHelper.fromSizing.createStyle(Sizing, 'm', 'semibold', 'normal') as TextStyle),
    marginBottom: Sizing.padding.m,
  },
  inputRow: {
    flexDirection: 'row',
    gap: Sizing.gap.s,
    marginBottom: Sizing.padding.s,
  } as ViewStyle,
  sectionGap: {
    marginBottom: Sizing.padding.m,
  } as ViewStyle,
  inputGroup: {
    flex: 1,
    minWidth: 0,
  } as ViewStyle,
  inputGroupFull: {
    marginBottom: Sizing.padding.xs,
  } as ViewStyle,
  label: {
    ...(typographyHelper.fromSizing.createStyle(Sizing, 'xs', 'medium', 'normal') as TextStyle),
    marginBottom: Sizing.spacing.xxs,
    opacity: 0.9,
  },

  input: {
    borderWidth: 1,
    borderRadius: Sizing.input.borderRadius.s,
    paddingHorizontal: Sizing.padding.s,
    paddingVertical: Sizing.padding.xs,
    minHeight: 40,
    ...(typographyHelper.fromSizing.createStyle(Sizing, 'm', 'normal', 'normal') as TextStyle),
  },
  numberInput: {
    borderWidth: 1,
    borderRadius: Sizing.input.borderRadius.s,
    paddingHorizontal: Sizing.padding.s,
    paddingVertical: Sizing.padding.xs,
    minHeight: 40,
    minWidth: 0,
    flex: 1,
    ...(typographyHelper.fromSizing.createStyle(Sizing, 'm', 'normal', 'normal') as TextStyle),
  },

  textInput: {
    borderWidth: 1,
    borderRadius: Sizing.input.borderRadius.s,
    paddingHorizontal: Sizing.padding.s,
    paddingVertical: Sizing.padding.xs,
    minHeight: 40,
    minWidth: 0,
    flex: 1,
    ...(typographyHelper.fromSizing.createStyle(Sizing, 'm', 'normal', 'normal') as TextStyle),
  },

  runButtonWrap: {
    marginTop: Sizing.padding.m,
  } as ViewStyle,
});
