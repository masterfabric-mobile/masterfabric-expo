import { Sizing, typographyHelper } from 'masterfabric-expo-core';
import { StyleSheet } from 'react-native';

export const headerStyles = StyleSheet.create({
  header: {
    flexDirection: Sizing.layout.flexDirection.row,
    alignItems: Sizing.layout.alignItems.center,
    paddingHorizontal: Sizing.padding.l,
    paddingVertical: Sizing.padding.m,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: Sizing.borderWidth.s },
    shadowOpacity: Sizing.shadowOpacity.xs,
    shadowRadius: Sizing.spacing.xxs,
    elevation: Sizing.elevation.s,
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
    marginLeft: Sizing.padding.m,
  },
  headerTitle: {
    ...typographyHelper.fromSizing.createStyle(Sizing, 'xxl', 'bold', 'normal'),
    marginBottom: Sizing.spacing.xxs,
  },
  headerSubtitle: {
    ...typographyHelper.fromSizing.createStyle(Sizing, 's', 'normal', 'normal'),
  },
  headerSpacer: {
    width: Sizing.icon.xl,
  },
});
