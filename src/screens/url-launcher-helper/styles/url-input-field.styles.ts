import { StyleSheet } from 'react-native';

export const urlInputFieldStyles = StyleSheet.create({
  container: {
    padding: 20,
    borderRadius: 12,
    borderWidth: 1,
    marginBottom: 20,
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 18,
    opacity: 0.95,
  },
  inputGroup: {
    marginBottom: 18,
  },
  inputRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 12,
  },
  label: {
    fontSize: 14,
    fontWeight: '500',
    marginBottom: 8,
    opacity: 0.85,
  },
  textInput: {
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 16,
  },
  numberInput: {
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 16,
    minWidth: 80,
  },
  sectionTitle: {
    fontSize: 15,
    fontWeight: '600',
    marginTop: 24,
    marginBottom: 14,
    opacity: 0.9,
  },
  sectionDivider: {
    height: 1,
    marginVertical: 20,
    opacity: 0.15,
  },
});

