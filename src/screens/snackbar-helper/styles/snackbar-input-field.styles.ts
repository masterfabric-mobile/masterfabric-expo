import { Sizing, typographyHelper } from 'masterfabric-expo-core';
import { StyleSheet } from 'react-native';

export const snackbarInputFieldStyles = StyleSheet.create({
  container: {
    marginBottom: Sizing.padding.m,
  },
  label: {
    ...typographyHelper.fromSizing.createStyle(Sizing, 's', 'normal', 'normal'),
    marginBottom: Sizing.gap.s,
  },
  inputContainer: {
    borderRadius: Sizing.gap.s,
    borderWidth: Sizing.borderWidth.s,
    paddingHorizontal: Sizing.padding.s,
    paddingVertical: Sizing.gap.s,
  },
  input: {
    ...typographyHelper.fromSizing.createStyle(Sizing, 's', 'normal', 'normal'),
    paddingVertical: Sizing.gap.s,
  },
});

