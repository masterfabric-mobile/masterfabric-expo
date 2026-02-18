import { Sizing, typographyHelper } from 'masterfabric-expo-core';
import { StyleSheet, type TextStyle, type ViewStyle } from 'react-native';

export const doubleHelperScreenStyles = StyleSheet.create({
  container: {
    flex: Sizing.flexNumber.full,
  } as ViewStyle,
  scrollView: {
    flex: Sizing.flexNumber.full,
  } as ViewStyle,
  scrollContent: {
    padding: Sizing.padding.l,
    paddingBottom: Sizing.padding.xxl,
  } as ViewStyle,
  resultsTitle: {
    ...(typographyHelper.fromSizing.createStyle(Sizing, 'xl', 'semibold', 'normal') as TextStyle),
    marginTop: Sizing.padding.xl,
    marginBottom: Sizing.padding.m,
  },
});
