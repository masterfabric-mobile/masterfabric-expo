import { StyleSheet } from 'react-native';

export const toastContainerStyles = StyleSheet.create({
  container: {
    position: 'absolute',
    left: 0,
    right: 0,
    alignItems: 'stretch',
    zIndex: 1000,
    paddingHorizontal: 16,
  },
});
