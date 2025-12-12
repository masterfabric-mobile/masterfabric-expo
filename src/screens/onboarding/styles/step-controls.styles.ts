import { Sizing, typographyHelper } from 'masterfabric-expo-core';
import { StyleSheet } from 'react-native';

export const stepControlsStyles = StyleSheet.create({
  container: {
    width: '100%',
    alignItems: Sizing.layout.alignItems.center,
  },
  progressContainer: {
    flexDirection: Sizing.layout.flexDirection.row,
    justifyContent: Sizing.layout.justifyContent.center,
    alignItems: Sizing.layout.alignItems.center,
    marginBottom: Sizing.padding.xxl,
    gap: Sizing.gap.s,
  },
  progressDot: {
    width: Sizing.icon.xs,
    height: Sizing.icon.xs,
    borderRadius: Sizing.icon.xs / 2,
  },
  buttonContainer: {
    flexDirection: Sizing.layout.flexDirection.row,
    justifyContent: Sizing.layout.justifyContent.spaceBetween,
    alignItems: Sizing.layout.alignItems.center,
    width: '100%',
    paddingHorizontal: Sizing.padding.l,
  },
  leftButtonContainer: {
    flex: Sizing.flexNumber.full,
    alignItems: Sizing.layout.alignItems.flexStart,
  },
  rightButtonContainer: {
    flex: Sizing.flexNumber.full,
    alignItems: Sizing.layout.alignItems.flexEnd,
  },
  backButton: {
    paddingVertical: Sizing.padding.s,
    paddingHorizontal: Sizing.padding.l,
  },
  backButtonText: {
    ...typographyHelper.fromSizing.createStyle(Sizing, 'm', 'medium', 'normal'),
  },
  nextButton: {
    backgroundColor: '#007AFF',
    paddingVertical: Sizing.padding.s,
    paddingHorizontal: Sizing.padding.xl,
    borderRadius: Sizing.padding.xl,
    minWidth: Sizing.button.width.medium,
    alignItems: Sizing.layout.alignItems.center,
  },
  nextButtonText: {
    color: '#FFFFFF',
    ...typographyHelper.fromSizing.createStyle(Sizing, 'm', 'semibold', 'normal'),
  },
});
