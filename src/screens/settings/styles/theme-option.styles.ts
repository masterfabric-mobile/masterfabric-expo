import { Sizing, typographyHelper } from 'masterfabric-expo-core';
import { StyleSheet } from 'react-native';

export const themeOptionStyles = StyleSheet.create({
  optionsContainer: {
    gap: Sizing.gap.s,
    marginBottom: Sizing.padding.xl,
  },
  option: {
    flexDirection: Sizing.layout.flexDirection.row,
    alignItems: Sizing.layout.alignItems.center,
    justifyContent: Sizing.layout.justifyContent.spaceBetween,
    padding: Sizing.padding.m,
    borderRadius: Sizing.card.borderRadius.m,
    borderWidth: Sizing.borderWidth.m,
  },
  optionContent: {
    flexDirection: Sizing.layout.flexDirection.row,
    alignItems: Sizing.layout.alignItems.center,
  },
  optionIcon: {
    marginRight: Sizing.padding.s,
  },
  optionText: {
    ...typographyHelper.fromSizing.createStyle(Sizing, 'm', 'medium', 'normal'),
  },
  checkmark: {
    ...typographyHelper.fromSizing.createStyle(Sizing, 'l', 'bold', 'normal'),
  },
});
