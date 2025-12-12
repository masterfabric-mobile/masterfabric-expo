import { Sizing, typographyHelper } from 'masterfabric-expo-core';
import { StyleSheet } from 'react-native';

const getTypographyStyle = (fontSize: string, fontWeight: string, lineHeight: string = 'normal') => 
  (typographyHelper as any).fromSizing?.createStyle(Sizing, fontSize, fontWeight, lineHeight) || {};

export const accordionStyles = StyleSheet.create({
  container: {
    paddingTop: Sizing.spacing.s,
  },
  section: {
    marginBottom: Sizing.spacing.m,
  },
  sectionHeader: {
    borderRadius: Sizing.card.borderRadius.m,
    padding: Sizing.padding.m,
  },
  sectionHeaderContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  sectionIcon: {
    width: Sizing.icon.m,
    height: Sizing.icon.m,
    borderRadius: Sizing.card.borderRadius.m,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: Sizing.spacing.m,
  },
  sectionTitleContainer: {
    flex: 1,
  },
  sectionTitle: {
    ...getTypographyStyle('l', 'bold', 'normal'),
    marginBottom: Sizing.spacing.xxs,
  },
  sectionDescription: {
    ...getTypographyStyle('s', 'normal', 'normal'),
  },
  sectionContent: {
    paddingLeft: Sizing.padding.m,
    paddingTop: Sizing.spacing.s,
    paddingBottom: Sizing.spacing.s,
  },
  itemCard: {
    borderRadius: Sizing.borderRadius.small,
    padding: Sizing.padding.s,
    marginBottom: Sizing.spacing.s,
  },
  itemContent: {
    flex: 1,
  },
  itemTitle: {
    ...getTypographyStyle('m', 'semibold', 'normal'),
    marginBottom: Sizing.spacing.xxs,
  },
  itemDescription: {
    ...getTypographyStyle('xs', 'normal', 'normal'),
  },
});
