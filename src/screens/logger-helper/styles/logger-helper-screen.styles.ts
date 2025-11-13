import { StyleSheet } from 'react-native';

export const loggerHelperScreenStyles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    padding: 16,
    gap: 16,
  },
  header: {
    fontSize: 22,
    fontWeight: '700',
    marginBottom: 4,
  },
  section: {
    gap: 12,
  },
  card: {
    borderRadius: 12,
    padding: 14,
    borderWidth: 1,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: '600',
    opacity: 0.8,
    marginBottom: 4,
  },
  actions: {
    gap: 8,
  },
  resultsList: {
    gap: 10,
  },
});
