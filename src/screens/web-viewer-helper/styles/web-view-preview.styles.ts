import { Sizing } from 'masterfabric-expo-core';
import { StyleSheet } from 'react-native';

export const webViewPreviewStyles = StyleSheet.create({
  container: {
    borderRadius: Sizing.borderRadius.large,
    borderWidth: Sizing.borderWidth.s,
    overflow: 'hidden',
  },
  webView: {
    backgroundColor: 'transparent',
  },
  loadingContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1,
  },
  errorContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 2,
    padding: Sizing.padding.l,
  },
  errorBox: {
    padding: Sizing.padding.l,
    borderRadius: Sizing.borderRadius.small,
    borderWidth: Sizing.borderWidth.s,
  },
});
