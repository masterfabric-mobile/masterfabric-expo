import { Sizing, typographyHelper } from 'masterfabric-expo-core';
import { StyleSheet } from 'react-native';

export const toastInputFieldStyles = StyleSheet.create({
  container: {
    borderRadius: Sizing.card.borderRadius.m,
    borderWidth: Sizing.borderWidth.s,
    marginBottom: Sizing.padding.xl,
    padding: Sizing.padding.m,
  },
  sectionTitle: {
    ...typographyHelper.fromSizing.createStyle(Sizing, 'm', 'semibold', 'normal'),
    marginBottom: Sizing.padding.s,
    marginTop: Sizing.gap.s,
  },
  messageInput: {
    borderWidth: Sizing.borderWidth.s,
    borderRadius: Sizing.gap.s,
    padding: Sizing.padding.s,
    ...typographyHelper.fromSizing.createStyle(Sizing, 'm', 'normal', 'normal'),
    minHeight: Sizing.height.xxl,
    textAlignVertical: 'top',
  },
  optionsContainer: {
    flexDirection: Sizing.layout.flexDirection.column,
    gap: Sizing.gap.s,
    marginBottom: Sizing.gap.s,
  },
  typeOptionsContainer: {
    flexDirection: Sizing.layout.flexDirection.column,
    gap: Sizing.gap.s,
    marginBottom: Sizing.padding.m,
  },
  optionButton: {
    paddingHorizontal: Sizing.padding.m,
    paddingVertical: Sizing.gap.s,
    borderRadius: Sizing.padding.l,
    borderWidth: Sizing.borderWidth.s,
    width: '100%',
    alignItems: Sizing.layout.alignItems.center,
  },
  optionButtonText: {
    ...typographyHelper.fromSizing.createStyle(Sizing, 's', 'medium', 'normal'),
  },
  durationInput: {
    borderWidth: Sizing.borderWidth.s,
    borderRadius: Sizing.gap.s,
    padding: Sizing.padding.s,
    ...typographyHelper.fromSizing.createStyle(Sizing, 'm', 'normal', 'normal'),
    marginBottom: Sizing.gap.s,
  },
  durationDescription: {
    ...typographyHelper.fromSizing.createStyle(Sizing, 'xs', 'normal', 'italic'),
  },
  fieldLabel: {
    ...typographyHelper.fromSizing.createStyle(Sizing, 's', 'medium', 'normal'),
    marginBottom: Sizing.spacing.xxs,
    marginTop: Sizing.gap.s,
  },
  customInput: {
    borderWidth: Sizing.borderWidth.s,
    borderRadius: Sizing.gap.s,
    padding: Sizing.padding.s,
    ...typographyHelper.fromSizing.createStyle(Sizing, 'm', 'normal', 'normal'),
    marginBottom: Sizing.gap.s,
  },
  dropdownButton: {
    borderWidth: Sizing.borderWidth.s,
    borderRadius: Sizing.gap.s,
    padding: Sizing.padding.s,
    marginBottom: Sizing.gap.s,
  },
  dropdownContent: {
    flexDirection: Sizing.layout.flexDirection.row,
    alignItems: Sizing.layout.alignItems.center,
    gap: Sizing.gap.s,
  },
  dropdownText: {
    ...typographyHelper.fromSizing.createStyle(Sizing, 'm', 'normal', 'normal'),
    flex: Sizing.flexNumber.full,
  },
  dropdownContainer: {
    borderWidth: Sizing.borderWidth.s,
    borderRadius: Sizing.gap.s,
    padding: Sizing.padding.s,
    marginBottom: Sizing.gap.s,
    maxHeight: Sizing.height.xxl + Sizing.height.xl,
  },
  scrollContainer: {
    maxHeight: Sizing.height.xxl,
  },
  iconGrid: {
    flexDirection: Sizing.layout.flexDirection.row,
    flexWrap: 'wrap',
    gap: Sizing.gap.s,
  },
  iconCard: {
    flex: Sizing.flexNumber.full,
    minWidth: Sizing.width.l,
    maxWidth: '31%',
    borderRadius: Sizing.gap.s,
    borderWidth: Sizing.borderWidth.s,
    padding: Sizing.gap.s,
    alignItems: Sizing.layout.alignItems.center,
    gap: Sizing.spacing.xxs,
  },
  iconCardSelected: {
    borderColor: '#007AFF',
    borderWidth: Sizing.borderWidth.m,
    backgroundColor: 'rgba(0, 122, 255, 0.1)',
  },
  iconName: {
    ...typographyHelper.fromSizing.createStyle(Sizing, 'xxs', 'medium', 'normal'),
    textAlign: Sizing.layout.textAlign.center,
    width: '100%',
  },
  buttonContainer: {
    flexDirection: Sizing.layout.flexDirection.row,
    gap: Sizing.padding.s,
    marginTop: Sizing.padding.m,
  },
  sendButton: {
    flex: Sizing.flexNumber.full,
    paddingVertical: Sizing.padding.s,
    borderRadius: Sizing.gap.s,
    alignItems: Sizing.layout.alignItems.center,
  },
  sendButtonText: {
    color: '#FFFFFF',
    ...typographyHelper.fromSizing.createStyle(Sizing, 'm', 'semibold', 'normal'),
  },
  exampleButton: {
    flex: Sizing.flexNumber.full,
    paddingVertical: Sizing.padding.s,
    borderRadius: Sizing.gap.s,
    alignItems: Sizing.layout.alignItems.center,
  },
  exampleButtonText: {
    color: '#FFFFFF',
    ...typographyHelper.fromSizing.createStyle(Sizing, 'm', 'semibold', 'normal'),
  },
  colorPickerButton: {
    borderWidth: Sizing.borderWidth.s,
    borderRadius: Sizing.gap.s,
    padding: Sizing.padding.s,
    marginBottom: Sizing.gap.s,
  },
  colorPickerContent: {
    flexDirection: Sizing.layout.flexDirection.row,
    alignItems: Sizing.layout.alignItems.center,
    gap: Sizing.padding.s,
  },
  colorPreview: {
    width: Sizing.icon.s,
    height: Sizing.icon.s,
    borderRadius: Sizing.icon.s / 2,
    borderWidth: Sizing.borderWidth.s,
    borderColor: 'rgba(0, 0, 0, 0.1)',
  },
  colorPickerText: {
    ...typographyHelper.fromSizing.createStyle(Sizing, 'm', 'normal', 'normal'),
    flex: Sizing.flexNumber.full,
  },
});