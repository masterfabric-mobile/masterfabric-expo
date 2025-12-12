import { Sizing, typographyHelper } from 'masterfabric-expo-core';
import { StyleSheet } from 'react-native';

export const notificationTabsStyles = StyleSheet.create({
  container: {
    flexDirection: Sizing.layout.flexDirection.row,
    borderBottomWidth: Sizing.divider.height.hairline,
  },
  tab: {
    flex: Sizing.flexNumber.full,
    paddingVertical: Sizing.padding.m,
    alignItems: Sizing.layout.alignItems.center,
    justifyContent: Sizing.layout.justifyContent.center,
  },
  tabText: {
    ...typographyHelper.fromSizing.createStyle(Sizing, 'm', 'medium', 'normal'),
  },
});
