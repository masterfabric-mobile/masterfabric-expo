import { Sizing, typographyHelper } from 'masterfabric-expo-core';
import { StyleSheet } from 'react-native';

export const stringInputFieldStyles = StyleSheet.create({
  container: {
    padding: Sizing.padding.l,
    borderRadius: Sizing.card.borderRadius.m,
    borderWidth: Sizing.borderWidth.m,
    marginBottom: Sizing.padding.l,
  },
  title: {
    ...typographyHelper.fromSizing.createStyle(Sizing, 'l', 'semibold', 'normal'),
    marginBottom: Sizing.padding.m,
  },
  inputGroup: {
    marginBottom: Sizing.padding.m,
  },
  inputRow: {
    flexDirection: Sizing.layout.flexDirection.row,
    justifyContent: Sizing.layout.justifyContent.spaceBetween,
    gap: Sizing.padding.s,
  },
  label: {
    ...typographyHelper.fromSizing.createStyle(Sizing, 's', 'medium', 'normal'),
    marginBottom: Sizing.spacing.xxs,
  },
  textInput: {
    borderWidth: Sizing.borderWidth.s,
    borderRadius: Sizing.gap.s,
    paddingHorizontal: Sizing.padding.s,
    paddingVertical: Sizing.padding.s,
    ...typographyHelper.fromSizing.createStyle(Sizing, 'm', 'normal', 'normal'),
  },
  numberInput: {
    borderWidth: Sizing.borderWidth.s,
    borderRadius: Sizing.gap.s,
    paddingHorizontal: Sizing.padding.s,
    paddingVertical: Sizing.padding.s,
    ...typographyHelper.fromSizing.createStyle(Sizing, 'm', 'normal', 'normal'),
    minWidth: Sizing.width.l,
  },
});
