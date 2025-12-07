import { Sizing, typographyHelper } from 'masterfabric-expo-core';
import { StyleSheet } from 'react-native';

export const projectsTabBarStyles = StyleSheet.create({
  container: {
    paddingHorizontal: Sizing.padding.l,
    paddingVertical: Sizing.padding.s,
  },
  tabContainer: {
    flexDirection: Sizing.layout.flexDirection.row,
    borderRadius: Sizing.gap.s,
    padding: Sizing.spacing.xxs,
    gap: Sizing.spacing.xxs,
  },
  tab: {
    flex: Sizing.flexNumber.full,
    paddingVertical: Sizing.padding.s,
    paddingHorizontal: Sizing.padding.m,
    borderRadius: Sizing.borderRadius.small,
    alignItems: Sizing.layout.alignItems.center,
    justifyContent: Sizing.layout.justifyContent.center,
    minHeight: Sizing.icon.xl,
  },
  activeTab: {
    shadowOffset: {
      width: 0,
      height: Sizing.spacing.xxs,
    },
    shadowOpacity: Sizing.shadowOpacity.m,
    shadowRadius: Sizing.spacing.xxs,
    elevation: Sizing.elevation.m,
  },
  tabText: {
    ...typographyHelper.fromSizing.createStyle(Sizing, 's', 'normal', 'normal'),
    textAlign: Sizing.layout.textAlign.center,
  },
});
