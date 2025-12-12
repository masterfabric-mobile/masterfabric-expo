import { Sizing, typographyHelper } from 'masterfabric-expo-core';
import { StyleSheet } from 'react-native';

export const timeHelperCustomPickerStyles = StyleSheet.create({
  // Picker button
  pickerButton: {
    flexDirection: Sizing.layout.flexDirection.row,
    justifyContent: Sizing.layout.justifyContent.spaceBetween,
    alignItems: Sizing.layout.alignItems.center,
    padding: Sizing.padding.s,
    borderRadius: Sizing.card.borderRadius.m,
    borderWidth: Sizing.borderWidth.s,
  },
  
  // Modal overlay
  modalOverlay: {
    flex: Sizing.flexNumber.full,
    justifyContent: Sizing.layout.justifyContent.flexEnd,
  },
  
  // Modal content
  modalContent: {
    borderTopLeftRadius: Sizing.padding.l,
    borderTopRightRadius: Sizing.padding.l,
    maxHeight: '85%',
    paddingBottom: Sizing.padding.l,
  },
  modalHeader: {
    flexDirection: Sizing.layout.flexDirection.row,
    justifyContent: Sizing.layout.justifyContent.spaceBetween,
    alignItems: Sizing.layout.alignItems.center,
    padding: Sizing.padding.l,
    borderBottomWidth: Sizing.borderWidth.s,
  },
  headerButtons: {
    flexDirection: Sizing.layout.flexDirection.row,
    gap: Sizing.padding.m,
  },
  cancelButton: {
    ...typographyHelper.fromSizing.createStyle(Sizing, 'm', 'normal', 'normal'),
  },
  confirmButton: {
    ...typographyHelper.fromSizing.createStyle(Sizing, 'm', 'semibold', 'normal'),
  },
  
  // Item list
  itemList: {
    maxHeight: Sizing.height.xxxl + Sizing.height.xl,
  },
  item: {
    flexDirection: Sizing.layout.flexDirection.row,
    justifyContent: Sizing.layout.justifyContent.spaceBetween,
    alignItems: Sizing.layout.alignItems.center,
    padding: Sizing.padding.m,
    borderBottomWidth: Sizing.borderWidth.s,
  },
  itemText: {
    ...typographyHelper.fromSizing.createStyle(Sizing, 'm', 'normal', 'normal'),
    flex: Sizing.flexNumber.full,
  },
});

