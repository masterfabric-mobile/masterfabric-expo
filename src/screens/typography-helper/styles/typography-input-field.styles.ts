import { Sizing, typographyHelper } from 'masterfabric-expo-core';
import { StyleSheet } from 'react-native';

export const typographyInputFieldStyles = StyleSheet.create({
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
  colorPickerButton: {
    borderWidth: Sizing.borderWidth.s,
    borderRadius: Sizing.gap.s,
    padding: Sizing.padding.s,
    marginBottom: Sizing.gap.s,
  },
  colorPickerContent: {
    flexDirection: Sizing.layout.flexDirection.row,
    alignItems: Sizing.layout.alignItems.center,
    gap: Sizing.padding.s,
  },
  colorPreview: {
    width: Sizing.icon.s,
    height: Sizing.icon.s,
    borderRadius: Sizing.icon.s / 2,
    borderWidth: Sizing.borderWidth.s,
    borderColor: 'rgba(0, 0, 0, 0.1)',
  },
  colorPickerText: {
    ...typographyHelper.fromSizing.createStyle(Sizing, 'm', 'normal', 'normal'),
    flex: Sizing.flexNumber.full,
  },
});

