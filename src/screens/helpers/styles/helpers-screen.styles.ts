import { StyleSheet } from 'react-native';
import { Sizing } from 'masterfabric-expo-core';

export const helpersScreenStyles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: Sizing.padding.m,
    paddingTop: Sizing.padding.m,
    paddingBottom: 120,
  },
  categoriesContainer: {
    gap: Sizing.gap.xs,
  },
});
