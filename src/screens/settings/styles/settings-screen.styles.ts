import { Sizing, typographyHelper } from 'masterfabric-expo-core';
import { StyleSheet } from 'react-native';

export const settingsScreenStyles = StyleSheet.create({
  container: {
    flex: Sizing.flexNumber.full,
  },
  scrollContent: {
    paddingBottom: Sizing.padding.xxl,
  },
  section: {
    paddingHorizontal: Sizing.padding.l,
    marginBottom: Sizing.padding.xxl,
  },
  sectionTitle: {
    ...typographyHelper.fromSizing.createStyle(Sizing, 'xl', 'semibold', 'normal'),
    marginBottom: Sizing.gap.s,
  },
  sectionDescription: {
    ...typographyHelper.fromSizing.createStyle(Sizing, 's', 'normal', 'normal'),
    opacity: Sizing.opacity.l,
    marginBottom: Sizing.padding.m,
  },
});
