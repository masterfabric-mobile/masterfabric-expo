import { Colors, Sizing, typographyHelper } from 'masterfabric-expo-core';
import { StyleSheet } from 'react-native';

export const snackbarHelperScreenStyles = StyleSheet.create({
  container: {
    flex: Sizing.flexNumber.full,
  },
  scrollView: {
    flex: Sizing.flexNumber.full,
  },
  scrollContent: {
    padding: Sizing.padding.m,
    paddingBottom: Sizing.padding.xxxl * 2 + Sizing.padding.xxl,
  },
  sectionTitle: {
    ...typographyHelper.fromSizing.createStyle(Sizing, 'l', 'semibold', 'normal'),
    marginBottom: Sizing.padding.m,
  },
  inputSection: {
    borderRadius: Sizing.card.borderRadius.m,
    padding: Sizing.padding.m,
    marginBottom: Sizing.padding.xl,
    borderWidth: Sizing.borderWidth.s,
  },
  dropdownContainer: {
    marginBottom: Sizing.padding.m,
  },
  dropdownLabel: {
    ...typographyHelper.fromSizing.createStyle(Sizing, 's', 'normal', 'normal'),
    marginBottom: Sizing.gap.s,
  },
  switchContainer: {
    flexDirection: Sizing.layout.flexDirection.row,
    alignItems: Sizing.layout.alignItems.center,
    justifyContent: Sizing.layout.justifyContent.spaceBetween,
    marginBottom: Sizing.padding.l,
  },
  switchLabel: {
    ...typographyHelper.fromSizing.createStyle(Sizing, 's', 'normal', 'normal'),
  },
  buttonRow: {
    flexDirection: Sizing.layout.flexDirection.row,
    gap: Sizing.padding.s,
  },
  previewButton: {
    flex: Sizing.flexNumber.full,
  },
  resultsSection: {
    marginBottom: Sizing.padding.xl,
  },
  infoBox: {
    padding: Sizing.padding.m,
    borderRadius: Sizing.card.borderRadius.m,
    borderWidth: Sizing.borderWidth.s,
  },
  infoTitle: {
    ...typographyHelper.fromSizing.createStyle(Sizing, 'm', 'normal', 'normal'),
    marginBottom: Sizing.gap.s,
  },
  infoText: {
    ...typographyHelper.fromSizing.createStyle(Sizing, 's', 'normal', 'normal'),
    marginBottom: Sizing.padding.s,
  },
  codeBox: {
    padding: Sizing.padding.s,
    borderRadius: Sizing.gap.s,
    borderWidth: Sizing.borderWidth.s,
  },
  codeText: {
    ...typographyHelper.fromSizing.createStyle(Sizing, 'xs', 'normal', 'normal'),
    fontFamily: 'Courier New',
  },
  colorPickerContainer: {
    marginBottom: Sizing.padding.m,
  },
  colorPreviewContainer: {
    flexDirection: Sizing.layout.flexDirection.row,
    alignItems: Sizing.layout.alignItems.center,
    marginTop: Sizing.gap.s,
    marginBottom: Sizing.padding.s,
    gap: Sizing.padding.s,
  },
  colorPreview: {
    width: Sizing.button.height.xl,
    height: Sizing.button.height.xl,
    borderRadius: Sizing.card.borderRadius.m,
    borderWidth: Sizing.borderWidth.m,
  },
  colorHexText: {
    ...typographyHelper.fromSizing.createStyle(Sizing, 'm', 'semibold', 'normal'),
  },
  colorGrid: {
    flexDirection: Sizing.layout.flexDirection.row,
    flexWrap: 'wrap',
    gap: Sizing.spacing.xxs,
    marginTop: Sizing.gap.s,
  },
  colorBoxSmall: {
    width: Sizing.icon.s,
    height: Sizing.icon.s,
    borderRadius: Sizing.borderRadius.small,
  },
  colorBoxSelected: {
    borderWidth: Sizing.spacing.xxs,
    borderColor: Colors.light.snackbarBorderWhite,
    shadowColor: Colors.light.snackbarBlack,
    shadowOffset: { width: 0, height: Sizing.spacing.xxs },
    shadowOpacity: Sizing.shadowOpacity.m,
    shadowRadius: Sizing.spacing.xxs,
    elevation: Sizing.elevation.l,
  },
});

