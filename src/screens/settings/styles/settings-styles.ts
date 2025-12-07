import { Sizing } from 'masterfabric-expo-core';
import { StyleSheet } from 'react-native';

export const settingsStyles = StyleSheet.create({
  container: {
    flex: Sizing.flexNumber.full,
  },
  content: {
    flex: Sizing.flexNumber.full,
  },
  contentContainer: {
    padding: Sizing.padding.l,
    paddingBottom: Sizing.padding.xxl,
  },
});
