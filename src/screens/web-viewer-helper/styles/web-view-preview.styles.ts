import { Sizing } from 'masterfabric-expo-core';
import { StyleSheet } from 'react-native';

export const webViewPreviewStyles = StyleSheet.create({
  container: {
    borderRadius: Sizing.borderRadius.large,
    borderWidth: Sizing.borderWidth.s,
    overflow: 'hidden',
    width: '100%',
    alignSelf: 'stretch',
  },
  webView: {
    backgroundColor: 'transparent',
    flex: 1,
    width: '100%',
    alignSelf: 'stretch',
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
    width: '100%',
    minHeight: 200,
    justifyContent: 'center',
    alignItems: 'center',
    padding: Sizing.padding.l,
  },
  errorBox: {
    padding: Sizing.padding.l,
    borderRadius: Sizing.borderRadius.small,
    borderWidth: Sizing.borderWidth.s,
    width: '100%',
    maxWidth: '90%',
  },
});
