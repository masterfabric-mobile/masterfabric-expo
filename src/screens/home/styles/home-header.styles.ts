import { Sizing, typographyHelper } from 'masterfabric-expo-core';
import { StyleSheet } from 'react-native';

const getTypographyStyle = (fontSize: string, fontWeight: string, lineHeight: string = 'normal') => 
  (typographyHelper as any).fromSizing?.createStyle(Sizing, fontSize, fontWeight, lineHeight) || {};

export const homeHeaderStyles = StyleSheet.create({
  container: {
    flexDirection: Sizing.layout.flexDirection.row,
    justifyContent: Sizing.layout.justifyContent.spaceBetween,
    alignItems: Sizing.layout.alignItems.center,
    paddingHorizontal: Sizing.padding.m,
    paddingVertical: Sizing.padding.s,
    minHeight: Sizing.button.height.medium,
    borderBottomWidth: Sizing.borderWidth.s,
  },
  logoSection: {
    flexDirection: Sizing.layout.flexDirection.row,
    alignItems: Sizing.layout.alignItems.center,
  },
  logoText: {
    ...getTypographyStyle('xl', 'bold', 'normal'),
  },
});
