import { Sizing, typographyHelper } from 'masterfabric-expo-core';
import { StyleSheet } from 'react-native';

export const projectsScreenStyles = StyleSheet.create({
  container: {
    flex: Sizing.flexNumber.full,
  },
  topSection: {
    paddingHorizontal: Sizing.padding.m,
    paddingBottom: Sizing.padding.m,
  },
  bodySection: {
    flex: Sizing.flexNumber.full,
    paddingHorizontal: Sizing.padding.m,
  },
  bottomSection: {
    paddingHorizontal: Sizing.padding.l,
    paddingBottom: Sizing.padding.l,
  },
  title: {
    ...typographyHelper.fromSizing.createStyle(Sizing, 'xxl', 'bold', 'normal'),
    marginBottom: Sizing.gap.s,
  },
  subtitle: {
    ...typographyHelper.fromSizing.createStyle(Sizing, 'm', 'normal', 'normal'),
    opacity: Sizing.opacity.l,
    marginBottom: Sizing.padding.m,
  },
});
