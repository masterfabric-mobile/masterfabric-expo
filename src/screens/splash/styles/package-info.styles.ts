import { Sizing, typographyHelper } from 'masterfabric-expo-core';
import { StyleSheet } from 'react-native';

export const packageInfoStyles = StyleSheet.create({
  container: {
    alignItems: Sizing.layout.alignItems.center,
    paddingVertical: Sizing.spacing.xxs,
  },
  text: {
    ...typographyHelper.fromSizing.createStyle(Sizing, 'xs', 'normal', 'normal'),
    textAlign: Sizing.layout.textAlign.center,
  },
});
