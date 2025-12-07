import { Sizing, typographyHelper } from 'masterfabric-expo-core';
import { StyleSheet } from 'react-native';

const getTypographyStyle = (fontSize: string, fontWeight: string, lineHeight: string = 'normal') => 
  (typographyHelper as any).fromSizing?.createStyle(Sizing, fontSize, fontWeight, lineHeight) || {};

export const headerLogoStyles = StyleSheet.create({
  container: {
    flexDirection: Sizing.layout.flexDirection.row,
    alignItems: Sizing.layout.alignItems.center,
  },
  logo: {
    marginRight: Sizing.padding.s,
  },
  appName: {
    ...getTypographyStyle('l', 'semibold', 'normal'),
  },
});
