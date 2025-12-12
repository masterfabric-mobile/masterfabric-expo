import { Sizing, typographyHelper } from 'masterfabric-expo-core';
import { StyleSheet } from 'react-native';

export const projectsHeaderStyles = StyleSheet.create({
  header: {
    flexDirection: Sizing.layout.flexDirection.row,
    alignItems: Sizing.layout.alignItems.center,
    paddingHorizontal: Sizing.padding.l,
    paddingVertical: Sizing.padding.m,
    gap: Sizing.padding.m,
  },
  backButton: {
    width: Sizing.icon.xl,
    height: Sizing.icon.xl,
    borderRadius: Sizing.icon.xl / 2,
    justifyContent: Sizing.layout.justifyContent.center,
    alignItems: Sizing.layout.alignItems.center,
  },
  headerContent: {
    flex: Sizing.flexNumber.full,
  },
  headerTitle: {
    ...typographyHelper.fromSizing.createStyle(Sizing, 'xxl', 'bold', 'normal'),
    marginBottom: Sizing.spacing.xxs,
  },
  headerSubtitle: {
    ...typographyHelper.fromSizing.createStyle(Sizing, 's', 'normal', 'normal'),
    opacity: Sizing.opacity.l,
  },
  headerSpacer: {
    width: Sizing.icon.xl,
  },
});
