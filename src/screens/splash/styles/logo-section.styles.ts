import { Sizing, typographyHelper } from 'masterfabric-expo-core';
import { StyleSheet } from 'react-native';

export const logoSectionStyles = StyleSheet.create({
  logoContainer: {
    alignItems: Sizing.layout.alignItems.center,
  },
  logo: {
    width: Sizing.icon.xxxl + Sizing.icon.xxl,
    height: Sizing.icon.xxxl + Sizing.icon.xxl,
  },
  textContainer: {
    alignItems: Sizing.layout.alignItems.center,
    marginTop: Sizing.padding.l,
  },
  appName: {
    ...typographyHelper.fromSizing.createStyle(Sizing, 'xxxl', 'bold', 'normal'),
    marginBottom: Sizing.gap.s,
    textAlign: Sizing.layout.textAlign.center,
  },
  tagline: {
    ...typographyHelper.fromSizing.createStyle(Sizing, 'm', 'normal', 'normal'),
    opacity: Sizing.opacity.l,
    textAlign: Sizing.layout.textAlign.center,
  },
});
