import { Sizing, typographyHelper } from 'masterfabric-expo-core';
import { StyleSheet } from 'react-native';

const getTypographyStyle = (fontSize: string, fontWeight: string, lineHeight: string = 'normal') => 
  (typographyHelper as any).fromSizing?.createStyle(Sizing, fontSize, fontWeight, lineHeight) || {};

export const helperCategoryCardStyles = StyleSheet.create({
  container: {
    padding: Sizing.padding.l,
    borderRadius: Sizing.card.borderRadius.l,
    borderWidth: Sizing.borderWidth.hairline,
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: Sizing.spacing.xxs,
    marginVertical: Sizing.spacing.s,
  },
  iconContainer: {
    width: Sizing.icon.xxl,
    height: Sizing.icon.xxl,
    borderRadius: Sizing.card.borderRadius.m,
    borderWidth: Sizing.borderWidth.hairline,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: Sizing.padding.m,
  },
  content: {
    flex: 1,
  },
  title: {
    ...getTypographyStyle('xl', 'bold', 'normal'),
    marginBottom: Sizing.spacing.xxs,
  },
  description: {
    ...getTypographyStyle('s', 'normal', 'normal'),
  },
  comingSoonContainer: {
    alignSelf: 'flex-start',
    backgroundColor: 'rgba(255, 149, 0, 0.12)',
    paddingHorizontal: Sizing.padding.s,
    paddingVertical: Sizing.spacing.xxs,
    borderRadius: Sizing.borderRadius.small,
    borderWidth: Sizing.borderWidth.hairline,
    borderColor: 'rgba(255, 149, 0, 0.2)',
    marginTop: Sizing.spacing.s,
  },
  comingSoonText: {
    ...getTypographyStyle('xxs', 'semibold', 'normal'),
    color: '#FF9500',
  },
  arrowContainer: {
    width: Sizing.icon.m,
    height: Sizing.icon.m,
    justifyContent: 'center',
    alignItems: 'center',
  },
});