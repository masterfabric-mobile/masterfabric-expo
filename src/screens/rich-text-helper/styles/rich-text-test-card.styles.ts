import { StyleSheet } from 'react-native';

export const richTextTestCardStyles = StyleSheet.create({
  container: {
    padding: 16,
    borderRadius: 12,
    borderWidth: 1.5,
    marginBottom: 12,
  },
  header: {
    marginBottom: 8,
  },
  functionName: {
    fontSize: 16,
    fontWeight: '700',
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
});

