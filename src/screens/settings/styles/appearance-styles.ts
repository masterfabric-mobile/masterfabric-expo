import { StyleSheet } from 'react-native';

export const appearanceStyles = StyleSheet.create({
  themeGrid: {
    gap: 16,
  },
  modernThemeCard: {
    borderRadius: 16,
    padding: 16,
    borderWidth: 2,
  },
  themePreview: {
    width: '100%',
    height: 60,
    borderRadius: 12,
    padding: 12,
    marginBottom: 12,
    borderWidth: 1,
    justifyContent: 'space-between',
  },
  previewElement: {
    height: 8,
    borderRadius: 4,
    width: '80%',
  },
  themeInfo: {
    gap: 6,
  },
  themeHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  modernThemeLabel: {
    fontSize: 16,
    flex: 1,
  },
  modernThemeDescription: {
    fontSize: 13,
    lineHeight: 18,
  },
});
