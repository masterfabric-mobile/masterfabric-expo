import { StyleSheet } from 'react-native';

export const validatorTestCardStyles = StyleSheet.create({
  container: {
    padding: 16,
    borderRadius: 12,
    borderWidth: 1.5,
    marginBottom: 12,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  validatorType: {
    fontSize: 16,
    fontWeight: '700',
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  statusText: {
    fontSize: 12,
    fontWeight: '600',
    textTransform: 'uppercase',
  },
  description: {
    fontSize: 14,
    lineHeight: 20,
    marginBottom: 12,
    opacity: 0.8,
  },
  inputOutputContainer: {
    gap: 12,
  },
  inputOutputGroup: {
    gap: 6,
  },
  label: {
    fontSize: 12,
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  inputOutputBox: {
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
    minHeight: 44,
    justifyContent: 'center',
  },
  inputOutputText: {
    fontSize: 14,
    fontFamily: 'monospace',
    lineHeight: 18,
  },
  errorContainer: {
    marginTop: 8,
    padding: 10,
    borderRadius: 6,
    borderWidth: 1,
  },
  errorText: {
    fontSize: 13,
    lineHeight: 18,
  },
});

