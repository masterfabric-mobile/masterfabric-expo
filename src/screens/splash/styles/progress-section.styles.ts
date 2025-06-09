import { StyleSheet } from 'react-native';

export const progressSectionStyles = StyleSheet.create({
  loadingContainer: {
    width: '100%',
    paddingHorizontal: 40,
    marginBottom: 20,
  },
  progressBar: {
    height: 4,
    borderRadius: 2,
    overflow: 'hidden',
    width: '100%',
  },
  progressFill: {
    height: '100%',
    borderRadius: 2,
    minWidth: 0,
  },
  loadingText: {
    fontSize: 14,
    textAlign: 'center',
    marginTop: 12,
    opacity: 0.8,
  },
});
