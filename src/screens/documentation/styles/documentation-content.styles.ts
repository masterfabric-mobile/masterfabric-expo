import { StyleSheet } from 'react-native';
import { Sizing, typographyHelper } from 'masterfabric-expo-core';

const getTypographyStyle = (fontSize: string, fontWeight: string, lineHeight: string = 'normal') => 
  (typographyHelper as any).fromSizing?.createStyle(Sizing, fontSize, fontWeight, lineHeight) || {};

export const documentationContentStyles = StyleSheet.create({
  container: {
    paddingTop: Sizing.spacing.s,
  },
  section: {
    marginBottom: Sizing.spacing.xl,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: Sizing.spacing.m,
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
    ...getTypographyStyle('xl', 'bold', 'normal'),
    marginBottom: Sizing.spacing.xxs,
  },
  sectionDescription: {
    ...getTypographyStyle('s', 'normal', 'normal'),
  },
  itemsContainer: {
    gap: Sizing.gap.s,
  },
  itemCard: {
    borderRadius: Sizing.card.borderRadius.m,
    padding: Sizing.padding.m,
  },
  itemContent: {
    flex: 1,
  },
  itemHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: Sizing.spacing.s,
  },
  itemTitle: {
    ...getTypographyStyle('m', 'semibold', 'normal'),
    flex: 1,
  },
  itemDescription: {
    ...getTypographyStyle('s', 'normal', 'normal'),
  },
});
