import { Sizing, typographyHelper } from 'masterfabric-expo-core';
import { StyleSheet } from 'react-native';

export const timeInputFieldStyles = StyleSheet.create({
  // Container
  container: {
    marginBottom: Sizing.padding.xl,
  },
  
  // Input card
  inputCard: {
    borderRadius: Sizing.card.borderRadius.m,
    padding: Sizing.padding.m,
    marginBottom: Sizing.padding.m,
    borderWidth: Sizing.borderWidth.s,
  },
  
      // Labels
      label: {
        ...typographyHelper.fromSizing.createStyle(Sizing, 's', 'semibold', 'normal'),
        marginBottom: Sizing.spacing.xxs,
      },
      description: {
        ...typographyHelper.fromSizing.createStyle(Sizing, 'xxs', 'normal', 'normal'),
        marginBottom: Sizing.gap.s,
        opacity: Sizing.opacity.l,
      },
  
  // Input fields
  input: {
    borderRadius: Sizing.gap.s,
    padding: Sizing.padding.s,
    ...typographyHelper.fromSizing.createStyle(Sizing, 'm', 'normal', 'normal'),
    marginBottom: Sizing.padding.m,
    minHeight: Sizing.button.height.medium,
    borderWidth: Sizing.borderWidth.s,
  },
  
  // Layout
  row: {
    flexDirection: Sizing.layout.flexDirection.row,
    gap: Sizing.padding.s,
    marginBottom: Sizing.padding.m,
  },
  dateTimeRow: {
    flexDirection: Sizing.layout.flexDirection.row,
    gap: Sizing.padding.s,
    marginBottom: Sizing.padding.m,
  },
  halfWidth: {
    flex: Sizing.flexNumber.full,
  },
  
      // Buttons
      buttonRow: {
        flexDirection: Sizing.layout.flexDirection.row,
        gap: Sizing.padding.s,
        marginTop: Sizing.gap.s,
      },
      button: {
        flex: Sizing.flexNumber.full,
        borderRadius: Sizing.card.borderRadius.m,
        padding: Sizing.padding.m,
        alignItems: Sizing.layout.alignItems.center,
        justifyContent: Sizing.layout.justifyContent.center,
      },
  
  // Picker container
  pickerContainer: {
    borderRadius: Sizing.gap.s,
    overflow: Sizing.layout.overflow.hidden,
    marginBottom: Sizing.padding.m,
  },
});
