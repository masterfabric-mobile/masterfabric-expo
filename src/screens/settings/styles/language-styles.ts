import { Sizing, typographyHelper } from 'masterfabric-expo-core';
import { StyleSheet } from 'react-native';

export const languageStyles = StyleSheet.create({
  dropdown: {
    borderRadius: Sizing.card.borderRadius.m,
    borderWidth: Sizing.borderWidth.s,
    paddingHorizontal: Sizing.padding.m,
    paddingVertical: Sizing.padding.s,
  },
  optionsContainer: {
    gap: Sizing.gap.s,
  },
  option: {
    flexDirection: Sizing.layout.flexDirection.row,
    alignItems: Sizing.layout.alignItems.center,
    justifyContent: Sizing.layout.justifyContent.spaceBetween,
    padding: Sizing.padding.m,
    borderRadius: Sizing.card.borderRadius.m,
    borderWidth: Sizing.borderWidth.m,
  },
  optionText: {
    ...typographyHelper.fromSizing.createStyle(Sizing, 'm', 'medium', 'normal'),
  },
  checkmark: {
    ...typographyHelper.fromSizing.createStyle(Sizing, 'l', 'bold', 'normal'),
    color: '#007AFF',
  },
});
