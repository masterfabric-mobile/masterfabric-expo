import { Sizing, typographyHelper } from 'masterfabric-expo-core';
import { StyleSheet } from 'react-native';

export const onboardingScreenStyles = StyleSheet.create({
  container: {
    flex: Sizing.flexNumber.full,
  },
  contentContainer: {
    flex: Sizing.flexNumber.full,
  },
  skipContainer: {
    alignItems: Sizing.layout.alignItems.flexEnd,
    paddingHorizontal: Sizing.padding.m,
    paddingTop: Sizing.padding.m,
  },
  skipButton: {
    paddingVertical: Sizing.gap.s,
    paddingHorizontal: Sizing.padding.m,
  },
  skipButtonText: {
    ...typographyHelper.fromSizing.createStyle(Sizing, 'm', 'medium', 'normal'),
    opacity: Sizing.opacity.s,
  },
  stepContainer: {
    flex: Sizing.flexNumber.full,
    justifyContent: Sizing.layout.justifyContent.center,
    paddingHorizontal: Sizing.padding.m,
  },
  controlsContainer: {
    width: '100%',
    paddingBottom: Sizing.padding.l,
  },
});
