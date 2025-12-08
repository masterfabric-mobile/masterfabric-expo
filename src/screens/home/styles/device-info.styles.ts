import { Sizing, typographyHelper } from 'masterfabric-expo-core';
import { StyleSheet } from 'react-native';

const getTypographyStyle = (fontSize: string, fontWeight: string, lineHeight: string = 'normal') => 
  (typographyHelper as any).fromSizing?.createStyle(Sizing, fontSize, fontWeight, lineHeight) || {};

export const deviceInfoStyles = StyleSheet.create({
  section: {
    marginBottom: Sizing.padding.xxl,
  },
  sectionTitle: {
    ...getTypographyStyle('xl', 'semibold', 'normal'),
    marginBottom: Sizing.padding.m,
  },
  infoCard: {
    padding: Sizing.padding.m,
    borderRadius: Sizing.card.borderRadius.m,
  },
  infoText: {
    ...getTypographyStyle('s', 'normal', 'normal'),
    marginBottom: Sizing.gap.s,
    opacity: Sizing.opacity.xl,
  },
});
