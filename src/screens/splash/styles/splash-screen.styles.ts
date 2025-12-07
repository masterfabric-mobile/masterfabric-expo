import { Sizing } from 'masterfabric-expo-core';
import { StyleSheet } from 'react-native';

export const splashScreenStyles = StyleSheet.create({
  container: {
    flex: Sizing.flexNumber.full,
    justifyContent: Sizing.layout.justifyContent.center,
    alignItems: Sizing.layout.alignItems.center,
  },
  topSection: {
    flex: 0.3,
    justifyContent: Sizing.layout.justifyContent.center,
    alignItems: Sizing.layout.alignItems.center,
    paddingHorizontal: Sizing.padding.xxl,
  },
  bodySection: {
    flex: 0.4,
    justifyContent: Sizing.layout.justifyContent.center,
    alignItems: Sizing.layout.alignItems.center,
    paddingHorizontal: Sizing.padding.xxl,
  },
  bottomSection: {
    flex: 0.3,
    justifyContent: Sizing.layout.justifyContent.flexEnd,
    alignItems: Sizing.layout.alignItems.center,
    paddingBottom: Sizing.padding.xxl,
  },
});
