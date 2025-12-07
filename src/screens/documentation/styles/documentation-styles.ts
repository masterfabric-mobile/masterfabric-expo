import { Sizing } from 'masterfabric-expo-core';
import { StyleSheet } from 'react-native';

export const documentationStyles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: Sizing.padding.m,
    paddingBottom: Sizing.padding.l,
  },
});
