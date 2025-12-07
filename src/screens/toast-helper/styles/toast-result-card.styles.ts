import { Sizing, typographyHelper } from 'masterfabric-expo-core';
import { StyleSheet } from 'react-native';

export const toastResultCardStyles = StyleSheet.create({
  card: {
    borderRadius: Sizing.card.borderRadius.m,
    borderWidth: Sizing.borderWidth.s,
    marginBottom: Sizing.padding.m,
    overflow: Sizing.layout.overflow.hidden,
  },
  header: {
    paddingHorizontal: Sizing.padding.m,
    paddingVertical: Sizing.padding.s,
    borderBottomWidth: Sizing.borderWidth.s,
    borderBottomColor: 'rgba(0, 0, 0, 0.1)',
  },
  operationName: {
    ...typographyHelper.fromSizing.createStyle(Sizing, 'm', 'semibold', 'normal'),
  },
  content: {
    padding: Sizing.padding.m,
  },
  section: {
    marginBottom: Sizing.padding.s,
  },
  label: {
    ...typographyHelper.fromSizing.createStyle(Sizing, 's', 'semibold', 'normal'),
    marginBottom: Sizing.spacing.xxs,
  },
  value: {
    ...typographyHelper.fromSizing.createStyle(Sizing, 's', 'normal', 'normal'),
    fontFamily: 'monospace',
    backgroundColor: 'rgba(0, 0, 0, 0.05)',
    padding: Sizing.gap.s,
    borderRadius: Sizing.borderRadius.small,
    borderWidth: Sizing.borderWidth.s,
    borderColor: 'rgba(0, 0, 0, 0.1)',
  },
  description: {
    ...typographyHelper.fromSizing.createStyle(Sizing, 's', 'normal', 'normal'),
  },
});
