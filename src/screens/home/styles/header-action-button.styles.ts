import { Sizing } from 'masterfabric-expo-core';
import { StyleSheet } from 'react-native';

export const headerActionButtonStyles = StyleSheet.create({
  iconButton: {
    width: Sizing.icon.xl,
    height: Sizing.icon.xl,
    borderRadius: Sizing.icon.xl / 2,
    justifyContent: Sizing.layout.justifyContent.center,
    alignItems: Sizing.layout.alignItems.center,
  },
  profileButton: {
    width: Sizing.icon.xl,
    height: Sizing.icon.xl,
    borderRadius: Sizing.icon.xl / 2,
    justifyContent: Sizing.layout.justifyContent.center,
    alignItems: Sizing.layout.alignItems.center,
  },
});
