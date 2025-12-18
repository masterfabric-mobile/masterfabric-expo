import { StyleSheet } from 'react-native';

export const hapticFeedbackCardStyles = StyleSheet.create({
  container: {
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  title: {
    fontSize: 16,
    fontWeight: '600',
  },
  toggleContainer: {
    marginBottom: 20,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(128, 128, 128, 0.2)',
  },
  toggleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  toggleLabelContainer: {
    flex: 1,
    marginRight: 12,
  },
  toggleLabel: {
    fontSize: 14,
    fontWeight: '500',
    marginBottom: 4,
  },
  toggleDescription: {
    fontSize: 12,
  },
  hapticsContainer: {
    gap: 12,
    marginBottom: 16,
  },
  hapticButton: {
    borderRadius: 8,
    borderWidth: 1,
    padding: 12,
  },
  hapticButtonContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  hapticButtonText: {
    marginLeft: 12,
    flex: 1,
  },
  hapticButtonLabel: {
    fontSize: 14,
    fontWeight: '500',
    marginBottom: 2,
  },
  hapticButtonDescription: {
    fontSize: 12,
  },
  testAllButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 14,
    borderRadius: 8,
    borderWidth: 1,
    gap: 8,
  },
  testAllButtonText: {
    fontSize: 14,
    fontWeight: '600',
  },
});
