import { Sizing, typographyHelper } from 'masterfabric-expo-core';
import { StyleSheet } from 'react-native';

export const validatorInputFieldStyles = StyleSheet.create({
  container: {
    padding: Sizing.padding.l,
    borderRadius: Sizing.card.borderRadius.m,
    borderWidth: Sizing.borderWidth.m,
    marginBottom: Sizing.padding.l,
    overflow: 'hidden',
  },
  title: {
    ...typographyHelper.fromSizing.createStyle(Sizing, 'l', 'semibold', 'normal'),
    marginBottom: Sizing.padding.m,
  },
  inputGroup: {
    marginBottom: Sizing.padding.m,
  },
  inputGroupFlex: {
    flex: Sizing.flexNumber.full,
  },
  inputRow: {
    flexDirection: 'row',
    gap: Sizing.gap.s,
  },
  label: {
    ...typographyHelper.fromSizing.createStyle(Sizing, 's', 'medium', 'normal'),
    marginBottom: Sizing.spacing.xs,
  },
  textInput: {
    borderWidth: Sizing.borderWidth.s,
    borderRadius: Sizing.borderRadius.m,
    paddingHorizontal: Sizing.padding.s,
    paddingVertical: Sizing.padding.s,
    ...typographyHelper.fromSizing.createStyle(Sizing, 'm', 'normal', 'normal'),
  },
  numberInput: {
    borderWidth: Sizing.borderWidth.s,
    borderRadius: Sizing.borderRadius.m,
    paddingHorizontal: Sizing.padding.s,
    paddingVertical: Sizing.padding.s,
    ...typographyHelper.fromSizing.createStyle(Sizing, 'm', 'normal', 'normal'),
    flex: Sizing.flexNumber.full,
  },
  picker: {
    borderWidth: Sizing.borderWidth.s,
    borderRadius: Sizing.borderRadius.m,
    paddingHorizontal: Sizing.padding.s,
    paddingVertical: Sizing.padding.s,
    ...typographyHelper.fromSizing.createStyle(Sizing, 'm', 'normal', 'normal'),
    minHeight: Sizing.input.height.medium,
  },
  checkboxContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: Sizing.spacing.s,
    height: Sizing.input.height.medium,
  },
  checkboxLabel: {
    ...typographyHelper.fromSizing.createStyle(Sizing, 's', 'normal', 'normal'),
    marginLeft: Sizing.spacing.xs,
  },
});

