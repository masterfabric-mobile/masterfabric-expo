import { Sizing, typographyHelper } from 'masterfabric-expo-core';
import { StyleSheet } from 'react-native';

export const timeDateTimePickerStyles = StyleSheet.create({
  // Picker button
  pickerButton: {
    flexDirection: Sizing.layout.flexDirection.row,
    justifyContent: Sizing.layout.justifyContent.spaceBetween,
    alignItems: Sizing.layout.alignItems.center,
    padding: Sizing.padding.s,
    borderRadius: Sizing.card.borderRadius.m,
    borderWidth: Sizing.borderWidth.s,
    minHeight: Sizing.button.height.medium,
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
  
  // Scroll view
  scrollView: {
    maxHeight: Sizing.height.xxxl * 2 + Sizing.height.xxl,
  },
  
  // Sections
  section: {
    padding: Sizing.padding.m,
    paddingBottom: Sizing.padding.m,
  },
  sectionTitle: {
    ...typographyHelper.fromSizing.createStyle(Sizing, 's', 'semibold', 'normal'),
    marginBottom: Sizing.padding.s,
  },
  
  // Month Header
  monthHeader: {
    flexDirection: Sizing.layout.flexDirection.row,
    alignItems: Sizing.layout.alignItems.center,
    justifyContent: Sizing.layout.justifyContent.center,
    marginBottom: Sizing.padding.m,
  },
  monthTitleButton: {
    alignItems: Sizing.layout.alignItems.center,
    paddingVertical: Sizing.gap.s,
    flex: Sizing.flexNumber.full,
  },
  monthTitle: {
    ...typographyHelper.fromSizing.createStyle(Sizing, 'l', 'semibold', 'normal'),
  },
  monthNavButton: {
    paddingVertical: Sizing.gap.s,
    paddingHorizontal: Sizing.padding.m,
    justifyContent: Sizing.layout.justifyContent.center,
    alignItems: Sizing.layout.alignItems.center,
    minWidth: Sizing.button.height.medium,
    minHeight: Sizing.button.height.medium,
  },
  monthNavArrow: {
    ...typographyHelper.fromSizing.createStyle(Sizing, 'xxl', 'semibold', 'normal'),
  },
  dropdownBackdrop: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 0,
  },
  yearDropdownContainer: {
    marginTop: Sizing.padding.s,
    marginBottom: Sizing.gap.s,
    borderRadius: Sizing.card.borderRadius.m,
    borderWidth: Sizing.borderWidth.s,
    maxHeight: Sizing.height.xxl + Sizing.height.xl,
    overflow: Sizing.layout.overflow.hidden,
  },
  yearDropdownOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 10,
    borderRadius: Sizing.card.borderRadius.m,
    borderWidth: Sizing.borderWidth.s,
    maxHeight: Sizing.height.xxl + Sizing.height.xl,
    overflow: Sizing.layout.overflow.hidden,
    elevation: Sizing.elevation.l,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: Sizing.spacing.xxs },
    shadowOpacity: Sizing.shadowOpacity.m,
    shadowRadius: Sizing.gap.s,
  },
  yearList: {
    maxHeight: Sizing.height.xxl + Sizing.height.xl,
  },
  yearItem: {
    paddingVertical: Sizing.padding.s,
    paddingHorizontal: Sizing.padding.m,
    borderBottomWidth: Sizing.borderWidth.s,
  },
  yearItemText: {
    ...typographyHelper.fromSizing.createStyle(Sizing, 'm', 'normal', 'normal'),
  },
  
  // Calendar Container
  calendarContainer: {
    marginTop: Sizing.gap.s,
    position: 'relative',
  },
  weekdayRow: {
    flexDirection: Sizing.layout.flexDirection.row,
    marginBottom: Sizing.gap.s,
  },
  weekdayHeader: {
    flex: Sizing.flexNumber.full,
    alignItems: Sizing.layout.alignItems.center,
    paddingVertical: Sizing.gap.s,
  },
  weekdayText: {
    ...typographyHelper.fromSizing.createStyle(Sizing, 'xs', 'semibold', 'normal'),
    opacity: Sizing.opacity.l,
  },
  calendarGrid: {
    marginTop: Sizing.spacing.xxs,
  },
  calendarRow: {
    flexDirection: Sizing.layout.flexDirection.row,
    marginBottom: Sizing.spacing.xxs,
  },
  calendarDay: {
    flex: Sizing.flexNumber.full,
    aspectRatio: 1,
    alignItems: Sizing.layout.alignItems.center,
    justifyContent: Sizing.layout.justifyContent.center,
    borderRadius: Sizing.gap.s,
    borderWidth: Sizing.borderWidth.s,
    margin: Sizing.spacing.xxs,
    position: 'relative',
    minHeight: Sizing.width.xs,
  },
  calendarDayText: {
    ...typographyHelper.fromSizing.createStyle(Sizing, 's', 'medium', 'normal'),
  },
  
  // Calendar Action Buttons
  calendarActions: {
    flexDirection: Sizing.layout.flexDirection.row,
    gap: Sizing.padding.s,
    marginTop: Sizing.padding.m,
  },
  actionButton: {
    flex: Sizing.flexNumber.full,
    paddingVertical: Sizing.padding.s,
    paddingHorizontal: Sizing.padding.m,
    borderRadius: Sizing.gap.s,
    borderWidth: Sizing.borderWidth.s,
    alignItems: Sizing.layout.alignItems.center,
    justifyContent: Sizing.layout.justifyContent.center,
  },
  actionButtonText: {
    ...typographyHelper.fromSizing.createStyle(Sizing, 's', 'semibold', 'normal'),
  },
  
  // Time Grid
  timeGrid: {
    flexDirection: Sizing.layout.flexDirection.row,
    flexWrap: 'wrap',
    gap: Sizing.spacing.xxs,
  },
  timeGridItem: {
    width: '11%',
    aspectRatio: 1,
    alignItems: Sizing.layout.alignItems.center,
    justifyContent: Sizing.layout.justifyContent.center,
    borderRadius: Sizing.gap.s,
    borderWidth: Sizing.borderWidth.s,
    minWidth: Sizing.width.xs,
  },
  timeGridText: {
    ...typographyHelper.fromSizing.createStyle(Sizing, 'xs', 'medium', 'normal'),
  },
  minuteScrollView: {
    maxHeight: Sizing.height.xxl,
  },
  
  // Time Text Input
  timeTextInput: {
    borderRadius: Sizing.card.borderRadius.m,
    padding: Sizing.padding.s,
    ...typographyHelper.fromSizing.createStyle(Sizing, 'l', 'medium', 'normal'),
    borderWidth: Sizing.borderWidth.s,
    textAlign: Sizing.layout.textAlign.center,
    marginBottom: Sizing.gap.s,
  },
  inputHint: {
    ...typographyHelper.fromSizing.createStyle(Sizing, 'xs', 'normal', 'normal'),
    textAlign: Sizing.layout.textAlign.center,
    marginTop: Sizing.spacing.xxs,
  },
  
  // Time Picker Wrapper & Inline Dropdown
  timePickerWrapper: {
    position: 'relative',
    zIndex: 1,
  },
  timePickerDropdown: {
    position: 'absolute',
    top: '100%',
    left: 0,
    right: 0,
    marginTop: Sizing.gap.s,
    borderRadius: Sizing.card.borderRadius.m,
    borderWidth: Sizing.borderWidth.s,
    maxHeight: Sizing.height.xxxl + Sizing.height.xxl,
    overflow: Sizing.layout.overflow.hidden,
    elevation: Sizing.elevation.l,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: Sizing.spacing.xxs },
    shadowOpacity: Sizing.shadowOpacity.m,
    shadowRadius: Sizing.gap.s,
  },
  timeInputSection: {
    padding: Sizing.padding.s,
    borderBottomWidth: Sizing.borderWidth.s,
  },
  timePickerTwoColumn: {
    flexDirection: Sizing.layout.flexDirection.row,
    height: Sizing.height.xxxl,
  },
  timePickerColumn: {
    flex: Sizing.flexNumber.full,
  },
  timePickerColumnSeparator: {
    width: Sizing.borderWidth.s,
  },
  timeColumnTitle: {
    ...typographyHelper.fromSizing.createStyle(Sizing, 's', 'semibold', 'normal'),
    marginBottom: Sizing.gap.s,
    paddingHorizontal: Sizing.padding.m,
    paddingTop: Sizing.padding.s,
    textAlign: Sizing.layout.textAlign.center,
  },
  timeColumnScroll: {
    flex: Sizing.flexNumber.full,
  },
  timeColumnContent: {
    paddingVertical: Sizing.gap.s,
  },
  timePickerItem: {
    paddingVertical: Sizing.padding.s,
    paddingHorizontal: Sizing.padding.m,
    borderBottomWidth: Sizing.borderWidth.s,
    borderBottomColor: 'transparent',
    minHeight: Sizing.icon.l,
  },
  timePickerText: {
    ...typographyHelper.fromSizing.createStyle(Sizing, 'm', 'normal', 'normal'),
  },
  inputErrorText: {
    ...typographyHelper.fromSizing.createStyle(Sizing, 'xs', 'normal', 'normal'),
    marginTop: Sizing.spacing.xxs,
    textAlign: Sizing.layout.textAlign.center,
  },
  
  // Time Picker Done Button
  timePickerDoneButton: {
    padding: Sizing.padding.m,
    borderTopWidth: Sizing.borderWidth.s,
  },
  doneButton: {
    paddingVertical: Sizing.padding.s,
    paddingHorizontal: Sizing.padding.xl,
    borderRadius: Sizing.card.borderRadius.m,
    alignItems: Sizing.layout.alignItems.center,
    justifyContent: Sizing.layout.justifyContent.center,
  },
  doneButtonText: {
    ...typographyHelper.fromSizing.createStyle(Sizing, 'm', 'semibold', 'normal'),
  },
});
