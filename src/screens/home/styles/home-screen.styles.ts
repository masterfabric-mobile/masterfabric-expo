import { Sizing } from 'masterfabric-expo-core';
import { StyleSheet } from 'react-native';

export const homeScreenStyles = StyleSheet.create({
  container: {
    flex: Sizing.flexNumber.full,
  },
  content: {
    flex: Sizing.flexNumber.full,
    paddingHorizontal: Sizing.padding.l,
  },
  scrollContent: {
    flexGrow: 1,
    paddingTop: Sizing.padding.m,
    paddingBottom: Sizing.padding.xxxl * 2, // Add bottom padding to ensure last items are visible
  },
});
