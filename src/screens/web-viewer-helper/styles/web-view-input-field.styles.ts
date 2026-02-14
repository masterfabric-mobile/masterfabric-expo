import { Sizing } from 'masterfabric-expo-core';
import { StyleSheet } from 'react-native';

export const webViewInputFieldStyles = StyleSheet.create({
  container: {
    padding: Sizing.padding.m,
    borderRadius: Sizing.card.borderRadius.m,
    borderWidth: Sizing.borderWidth.m,
    marginBottom: Sizing.padding.m,
    // shadowColor will be set dynamically from colors
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 3,
  },
  title: {
    fontSize: Sizing.typography.fontSize.l,
    fontWeight: Sizing.typography.fontWeight.semibold,
    lineHeight: Sizing.typography.fontSize.l * Sizing.typography.lineHeight.normal,
    marginBottom: Sizing.padding.m,
  },
  contentTypeContainer: {
    marginBottom: Sizing.padding.m,
  },
  contentTypeButtons: {
    flexDirection: 'row',
    gap: Sizing.gap.m,
    marginTop: Sizing.padding.s,
  },
  contentTypeButton: {
    flex: 1,
    paddingVertical: Sizing.padding.m,
    paddingHorizontal: Sizing.padding.s,
    borderRadius: Sizing.borderRadius.small,
    borderWidth: Sizing.borderWidth.s,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 44,
  },
  contentTypeButtonText: {
    fontSize: Sizing.typography.fontSize.m,
    fontWeight: Sizing.typography.fontWeight.semibold,
    lineHeight: Sizing.typography.fontSize.m * Sizing.typography.lineHeight.normal,
    flexShrink: 0,
  },
  inputGroup: {
    marginBottom: Sizing.padding.m,
  },
  label: {
    fontSize: Sizing.typography.fontSize.s,
    fontWeight: Sizing.typography.fontWeight.medium,
    lineHeight: Sizing.typography.fontSize.s * Sizing.typography.lineHeight.normal,
    marginBottom: Sizing.padding.s,
  },
  textInput: {
    padding: Sizing.padding.m,
    borderRadius: Sizing.borderRadius.small,
    borderWidth: Sizing.borderWidth.s,
    fontSize: Sizing.typography.fontSize.m,
    fontWeight: Sizing.typography.fontWeight.normal,
    lineHeight: Sizing.typography.fontSize.m * Sizing.typography.lineHeight.normal,
    minHeight: 44,
  },
  textArea: {
    padding: Sizing.padding.m,
    borderRadius: Sizing.borderRadius.small,
    borderWidth: Sizing.borderWidth.s,
    fontSize: Sizing.typography.fontSize.m,
    fontWeight: Sizing.typography.fontWeight.normal,
    lineHeight: Sizing.typography.fontSize.m * Sizing.typography.lineHeight.normal,
    minHeight: 120,
  },
  advancedToggle: {
    paddingVertical: Sizing.padding.m,
    paddingHorizontal: Sizing.padding.m,
    marginTop: Sizing.padding.m,
    borderRadius: Sizing.borderRadius.small,
    borderWidth: Sizing.borderWidth.s,
    alignItems: 'center',
    justifyContent: 'center',
  },
  advancedToggleText: {
    fontSize: Sizing.typography.fontSize.m,
    fontWeight: Sizing.typography.fontWeight.semibold,
    lineHeight: Sizing.typography.fontSize.m * Sizing.typography.lineHeight.normal,
  },
  advancedContainer: {
    marginTop: Sizing.padding.m,
    paddingTop: Sizing.padding.l,
    paddingBottom: Sizing.padding.m,
    borderTopWidth: Sizing.borderWidth.s,
    borderRadius: Sizing.borderRadius.small,
    paddingHorizontal: Sizing.padding.s,
    marginHorizontal: -Sizing.padding.s,
  },
  methodButtons: {
    flexDirection: 'row',
    gap: Sizing.gap.m,
    marginTop: Sizing.padding.s,
  },
  methodButton: {
    flex: 1,
    paddingVertical: Sizing.padding.m,
    paddingHorizontal: Sizing.padding.l,
    borderRadius: Sizing.borderRadius.small,
    borderWidth: Sizing.borderWidth.s,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 44,
  },
  methodButtonText: {
    fontSize: Sizing.typography.fontSize.m,
    fontWeight: Sizing.typography.fontWeight.semibold,
    lineHeight: Sizing.typography.fontSize.m * Sizing.typography.lineHeight.normal,
  },
  buttonContainer: {
    flexDirection: 'row',
    gap: Sizing.gap.m,
    marginTop: Sizing.padding.m,
    paddingTop: Sizing.padding.m,
    borderTopWidth: Sizing.borderWidth.s,
    // borderTopColor will be set dynamically from colors
  },
  button: {
    flex: 1,
    minHeight: 48,
  },
});
