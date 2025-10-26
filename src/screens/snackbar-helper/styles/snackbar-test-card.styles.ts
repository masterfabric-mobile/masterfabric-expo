import { StyleSheet } from 'react-native';

export const snackbarTestCardStyles = StyleSheet.create({
  container: {
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 12,
  },
  functionName: {
    fontSize: 16,
  },
  section: {
    marginBottom: 8,
  },
  sectionLabel: {
    fontSize: 13,
    marginBottom: 4,
  },
  sectionValue: {
    fontSize: 14,
    lineHeight: 20,
  },
});

