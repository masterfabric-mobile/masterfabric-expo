import { StyleSheet } from 'react-native';

export const uiSizeTestCardStyles = StyleSheet.create({
  container: {
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    marginBottom: 16,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  functionName: {
    fontSize: 16,
    flex: 1,
  },
  categoryBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  categoryText: {
    fontSize: 12,
    fontWeight: '600',
  },
  description: {
    fontSize: 14,
    marginBottom: 16,
    lineHeight: 20,
  },
  inputOutputContainer: {
    flexDirection: 'row',
    gap: 12,
  },
  inputOutputGroup: {
    flex: 1,
  },
  label: {
    fontSize: 12,
    marginBottom: 8,
  },
  inputOutputBox: {
    borderRadius: 8,
    padding: 12,
    borderWidth: 1,
    minHeight: 44,
    justifyContent: 'center',
  },
  inputOutputText: {
    fontSize: 14,
    fontFamily: 'monospace',
  },
});

