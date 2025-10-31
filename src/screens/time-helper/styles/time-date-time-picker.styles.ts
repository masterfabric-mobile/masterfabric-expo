import { StyleSheet } from 'react-native';

export const timeDateTimePickerStyles = StyleSheet.create({
  // Picker button
  pickerButton: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 14,
    borderRadius: 12,
    borderWidth: 1,
    minHeight: 44,
  },
  
  // Modal overlay
  modalOverlay: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  
  // Modal content
  modalContent: {
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    maxHeight: '85%',
    paddingBottom: 20,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    borderBottomWidth: 1,
  },
  headerButtons: {
    flexDirection: 'row',
    gap: 16,
  },
  cancelButton: {
    fontSize: 16,
  },
  confirmButton: {
    fontSize: 16,
    fontWeight: '600',
  },
  
  // Scroll view
  scrollView: {
    maxHeight: 600,
  },
  
  // Sections
  section: {
    padding: 16,
    paddingBottom: 16,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 12,
  },
  
  // Month Header
  monthHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  monthTitleButton: {
    alignItems: 'center',
    paddingVertical: 8,
    flex: 1,
  },
  monthTitle: {
    fontSize: 18,
    fontWeight: '600',
  },
  monthNavButton: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    justifyContent: 'center',
    alignItems: 'center',
    minWidth: 44,
    minHeight: 44,
  },
  monthNavArrow: {
    fontSize: 28,
    fontWeight: '600',
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
    marginTop: 12,
    marginBottom: 8,
    borderRadius: 12,
    borderWidth: 1,
    maxHeight: 250,
    overflow: 'hidden',
  },
  yearDropdownOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 10,
    borderRadius: 12,
    borderWidth: 1,
    maxHeight: 250,
    overflow: 'hidden',
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 8,
  },
  yearList: {
    maxHeight: 250,
  },
  yearItem: {
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
  },
  yearItemText: {
    fontSize: 16,
  },
  
  // Calendar Container
  calendarContainer: {
    marginTop: 8,
    position: 'relative',
  },
  weekdayRow: {
    flexDirection: 'row',
    marginBottom: 8,
  },
  weekdayHeader: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 8,
  },
  weekdayText: {
    fontSize: 12,
    fontWeight: '600',
    opacity: 0.7,
  },
  calendarGrid: {
    marginTop: 4,
  },
  calendarRow: {
    flexDirection: 'row',
    marginBottom: 4,
  },
  calendarDay: {
    flex: 1,
    aspectRatio: 1,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 8,
    borderWidth: 1,
    margin: 2,
    position: 'relative',
    minHeight: 40,
  },
  calendarDayText: {
    fontSize: 15,
    fontWeight: '500',
  },
  
  // Calendar Action Buttons
  calendarActions: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 16,
  },
  actionButton: {
    flex: 1,
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  actionButtonText: {
    fontSize: 14,
    fontWeight: '600',
  },
  
  // Time Grid
  timeGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
  },
  timeGridItem: {
    width: '11%',
    aspectRatio: 1,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 8,
    borderWidth: 1,
    minWidth: 45,
  },
  timeGridText: {
    fontSize: 13,
    fontWeight: '500',
  },
  minuteScrollView: {
    maxHeight: 180,
  },
  
  // Time Text Input
  timeTextInput: {
    borderRadius: 12,
    padding: 14,
    fontSize: 18,
    fontWeight: '500',
    borderWidth: 1,
    textAlign: 'center',
    letterSpacing: 2,
    marginBottom: 8,
  },
  inputHint: {
    fontSize: 12,
    textAlign: 'center',
    marginTop: 4,
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
    marginTop: 8,
    borderRadius: 12,
    borderWidth: 1,
    maxHeight: 350,
    overflow: 'hidden',
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
  },
  timeInputSection: {
    padding: 12,
    borderBottomWidth: 1,
  },
  timePickerTwoColumn: {
    flexDirection: 'row',
    height: 280,
  },
  timePickerColumn: {
    flex: 1,
  },
  timePickerColumnSeparator: {
    width: 1,
  },
  timeColumnTitle: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 8,
    paddingHorizontal: 16,
    paddingTop: 12,
    textAlign: 'center',
  },
  timeColumnScroll: {
    flex: 1,
  },
  timeColumnContent: {
    paddingVertical: 8,
  },
  timePickerItem: {
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: 'transparent',
    minHeight: 48,
  },
  timePickerText: {
    fontSize: 16,
  },
  inputErrorText: {
    fontSize: 12,
    marginTop: 4,
    textAlign: 'center',
  },
  
  // Time Picker Done Button
  timePickerDoneButton: {
    padding: 16,
    borderTopWidth: 1,
  },
  doneButton: {
    paddingVertical: 14,
    paddingHorizontal: 24,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  doneButtonText: {
    fontSize: 16,
    fontWeight: '600',
  },
});

