import { Sizing, typographyHelper } from 'masterfabric-expo-core';
import { StyleSheet } from 'react-native';

export const snackbarResultCardStyles = StyleSheet.create({
  container: {
    borderRadius: Sizing.card.borderRadius.m,
    padding: Sizing.padding.l,
    marginBottom: Sizing.padding.m,
    borderWidth: Sizing.borderWidth.s,
  },
  header: {
    marginBottom: Sizing.padding.m,
  },
  functionName: {
    ...typographyHelper.fromSizing.createStyle(Sizing, 'l', 'normal', 'normal'),
  },
  section: {
    marginBottom: Sizing.padding.s,
  },
  sectionLabel: {
    ...typographyHelper.fromSizing.createStyle(Sizing, 'xs', 'normal', 'normal'),
    marginBottom: Sizing.spacing.xxs,
  },
  sectionValue: {
    ...typographyHelper.fromSizing.createStyle(Sizing, 's', 'normal', 'normal'),
  },
});

