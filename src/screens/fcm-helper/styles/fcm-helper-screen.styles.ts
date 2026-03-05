import { StyleSheet } from 'react-native';

export const fcmHelperScreenStyles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 100,
  },
  card: {
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 12,
  },
  bodyText: {
    fontSize: 14,
    lineHeight: 20,
    marginBottom: 8,
    opacity: 0.9,
  },
  statusRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  statusLabel: {
    fontSize: 13,
    marginRight: 8,
    minWidth: 120,
    opacity: 0.8,
  },
  statusValue: {
    fontSize: 13,
    fontWeight: '500',
    flex: 1,
  },
  button: {
    paddingVertical: 10,
    paddingHorizontal: 14,
    borderRadius: 8,
    marginRight: 8,
    marginBottom: 8,
    flexDirection: 'row',
    alignItems: 'center',
  },
  buttonLabel: {
    fontSize: 14,
    fontWeight: '500',
  },
  tokenBlock: {
    marginTop: 8,
    padding: 10,
    borderRadius: 8,
    maxHeight: 120,
  },
  tokenText: {
    fontSize: 11,
    fontFamily: 'monospace',
  },
});
