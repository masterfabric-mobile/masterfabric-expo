import { StyleSheet } from 'react-native';
import { SNACKBAR_HELPER_COLORS } from '../constants/snackbar-colors';

export const snackbarHelperScreenStyles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 200,
  },
  sectionTitle: {
    fontSize: 18,
    marginBottom: 16,
    fontWeight: '600',
  },
  inputSection: {
    borderRadius: 12,
    padding: 16,
    marginBottom: 24,
    borderWidth: 1,
  },
  dropdownContainer: {
    marginBottom: 16,
  },
  dropdownLabel: {
    fontSize: 14,
    marginBottom: 8,
  },
  switchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  switchLabel: {
    fontSize: 14,
  },
  buttonRow: {
    flexDirection: 'row',
    gap: 12,
  },
  previewButton: {
    flex: 1,
  },
  resultsSection: {
    marginBottom: 24,
  },
  infoBox: {
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
  },
  infoTitle: {
    fontSize: 16,
    marginBottom: 8,
  },
  infoText: {
    fontSize: 14,
    lineHeight: 20,
    marginBottom: 12,
  },
  codeBox: {
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
  },
  codeText: {
    fontSize: 12,
    fontFamily: 'Courier New',
    lineHeight: 18,
  },
  colorPickerContainer: {
    marginBottom: 16,
  },
  colorPreviewContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 8,
    marginBottom: 12,
    gap: 12,
  },
  colorPreview: {
    width: 60,
    height: 60,
    borderRadius: 12,
    borderWidth: 2,
  },
  colorHexText: {
    fontSize: 16,
    fontWeight: '600',
  },
  colorGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 4,
    marginTop: 8,
  },
  colorBoxSmall: {
    width: 28,
    height: 28,
    borderRadius: 6,
  },
  colorBoxSelected: {
    borderWidth: 3,
    borderColor: SNACKBAR_HELPER_COLORS.borderWhite,
    shadowColor: SNACKBAR_HELPER_COLORS.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5,
  },
});

