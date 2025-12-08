import { Sizing, typographyHelper } from 'masterfabric-expo-core';
import { StyleSheet } from 'react-native';

export const versionInfoStyles = StyleSheet.create({
  container: {
    alignItems: Sizing.layout.alignItems.center,
    paddingVertical: Sizing.gap.s,
  },
  versionText: {
    ...typographyHelper.fromSizing.createStyle(Sizing, 'm', 'medium', 'normal'),
  },
  nameText: {
    ...typographyHelper.fromSizing.createStyle(Sizing, 's', 'normal', 'normal'),
    marginTop: Sizing.spacing.xxs,
    opacity: Sizing.opacity.xl,
  },
});
