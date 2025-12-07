import { Sizing, typographyHelper } from 'masterfabric-expo-core';
import { StyleSheet } from 'react-native';

export const loggerHelperScreenStyles = StyleSheet.create({
  container: {
    flex: Sizing.flexNumber.full,
  },
  scrollContent: {
    padding: Sizing.padding.l,
    gap: Sizing.gap.l,
  },
  header: {
    ...typographyHelper.fromSizing.createStyle(Sizing, 'xl', 'bold', 'normal'),
    marginBottom: Sizing.spacing.xxs,
  },
  section: {
    gap: Sizing.gap.m,
  },
  card: {
    borderRadius: Sizing.card.borderRadius.m,
    padding: Sizing.padding.m,
    borderWidth: Sizing.borderWidth.s,
  },
  sectionTitle: {
    ...typographyHelper.fromSizing.createStyle(Sizing, 's', 'semibold', 'normal'),
    opacity: Sizing.opacity.xl,
    marginBottom: Sizing.spacing.xxs,
  },
  actions: {
    gap: Sizing.gap.s,
  },
  resultsList: {
    gap: Sizing.gap.s,
  },
});
