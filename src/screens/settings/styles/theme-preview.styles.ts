import { StyleSheet } from 'react-native';

export const themePreviewStyles = StyleSheet.create({
  previewSection: {
    marginTop: 8,
  },
  previewTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 12,
  },
  previewCard: {
    padding: 16,
    borderRadius: 12,
  },
  previewCardTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 8,
  },
  previewCardText: {
    fontSize: 14,
    opacity: 0.7,
    marginBottom: 16,
  },
  previewButton: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 8,
    alignSelf: 'flex-start',
  },
  previewButtonText: {
    fontSize: 14,
    fontWeight: '600',
  },
});
