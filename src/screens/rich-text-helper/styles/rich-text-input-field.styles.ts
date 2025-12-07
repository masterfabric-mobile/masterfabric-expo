import { Sizing, typographyHelper } from 'masterfabric-expo-core';
import { StyleSheet } from 'react-native';

export const richTextInputFieldStyles = StyleSheet.create({
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
    minHeight: Sizing.height.xxl,
    textAlignVertical: 'top',
  },
});

