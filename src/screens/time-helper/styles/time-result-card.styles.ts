import { Sizing, typographyHelper } from 'masterfabric-expo-core';
import { StyleSheet } from 'react-native';

export const timeResultCardStyles = StyleSheet.create({
  // Card container
  card: {
    borderRadius: Sizing.card.borderRadius.m,
    padding: Sizing.padding.m,
    marginBottom: Sizing.padding.s,
    borderWidth: Sizing.borderWidth.s,
  },
  
  // Header section
  header: {
    flexDirection: Sizing.layout.flexDirection.row,
    justifyContent: Sizing.layout.justifyContent.spaceBetween,
    alignItems: Sizing.layout.alignItems.center,
    marginBottom: Sizing.padding.s,
  },
  functionName: {
    ...typographyHelper.fromSizing.createStyle(Sizing, 'm', 'semibold', 'normal'),
    flex: Sizing.flexNumber.full,
  },
  badge: {
    paddingHorizontal: Sizing.gap.s,
    paddingVertical: Sizing.spacing.xxs,
    borderRadius: Sizing.borderRadius.small,
  },
  badgeText: {
    ...typographyHelper.fromSizing.createStyle(Sizing, 'xs', 'semibold', 'normal'),
  },
  
  // Description
  description: {
    ...typographyHelper.fromSizing.createStyle(Sizing, 'xs', 'normal', 'normal'),
    marginTop: Sizing.spacing.xxs,
  },
  
  // Sections
  section: {
    marginBottom: Sizing.padding.s,
  },
  sectionTitle: {
    ...typographyHelper.fromSizing.createStyle(Sizing, 'xs', 'semibold', 'normal'),
    marginBottom: Sizing.spacing.xxs,
  },
  sectionContent: {
    ...typographyHelper.fromSizing.createStyle(Sizing, 's', 'normal', 'normal'),
  },
  
  // Input/Output container
  inputOutputContainer: {
    backgroundColor: 'transparent', // Will be overridden with theme color
    borderWidth: Sizing.borderWidth.s,
    borderColor: 'transparent', // Will be overridden with theme color
    borderRadius: Sizing.gap.s,
    padding: Sizing.padding.s,
    marginTop: Sizing.spacing.xxs,
  },
});
