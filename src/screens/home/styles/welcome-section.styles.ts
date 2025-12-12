import { Sizing, typographyHelper } from 'masterfabric-expo-core';
import { StyleSheet } from 'react-native';

const getTypographyStyle = (fontSize: string, fontWeight: string, lineHeight: string = 'normal') => 
  (typographyHelper as any).fromSizing?.createStyle(Sizing, fontSize, fontWeight, lineHeight) || {};

export const welcomeSectionStyles = StyleSheet.create({
  container: {
    paddingVertical: Sizing.padding.xl,
    paddingHorizontal: Sizing.spacing.xxs,
    marginBottom: Sizing.padding.m,
  },
  greeting: {
    ...getTypographyStyle('xxxl', 'extrabold', 'normal'),
    marginBottom: Sizing.gap.s,
    letterSpacing: -0.5,
  },
  developerText: {
    ...getTypographyStyle('l', 'semibold', 'normal'),
    opacity: Sizing.opacity.xl,
    marginBottom: Sizing.padding.s,
    letterSpacing: 0.2,
  },
  userName: {
    ...getTypographyStyle('m', 'medium', 'normal'),
    opacity: Sizing.opacity.l,
  },
});
