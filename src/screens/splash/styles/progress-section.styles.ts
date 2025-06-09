import { StyleSheet } from 'react-native';

export const progressSectionStyles = StyleSheet.create({
  loadingContainer: {
    width: '100%',
    paddingHorizontal: 40,
    marginBottom: 30,
  },
  progressBar: {
    height: 6,
    borderRadius: 3,
    overflow: 'hidden',
    width: '100%',
    marginBottom: 16,
  },
  progressFill: {
    height: '100%',
    borderRadius: 3,
  },
  progressText: {
    fontSize: 14,
    textAlign: 'center',
    opacity: 0.8,
  },
  taskText: {
    fontSize: 14,
    textAlign: 'center',
    marginTop: 8,
    opacity: 0.6,
  },
});
