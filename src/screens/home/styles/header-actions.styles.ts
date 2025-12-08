import { Sizing } from 'masterfabric-expo-core';
import { StyleSheet } from 'react-native';

export const headerActionsStyles = StyleSheet.create({
  container: {
    flexDirection: Sizing.layout.flexDirection.row,
    alignItems: Sizing.layout.alignItems.center,
    gap: Sizing.gap.m,
  },
  iconButton: {
    width: Sizing.icon.xl,
    height: Sizing.icon.xl,
    borderRadius: Sizing.icon.xl / 2,
    justifyContent: Sizing.layout.justifyContent.center,
    alignItems: Sizing.layout.alignItems.center,
  },
});
