import { StyleSheet } from 'react-native';
import { Sizing, typographyHelper } from 'masterfabric-expo-core';

const getTypographyStyle = (fontSize: string, fontWeight: string, lineHeight: string = 'normal') => 
  (typographyHelper as any).fromSizing?.createStyle(Sizing, fontSize, fontWeight, lineHeight) || {};

export const helperItemCardStyles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: Sizing.padding.s,
    borderRadius: Sizing.card.borderRadius.m,
    marginHorizontal: Sizing.padding.m,
    marginVertical: Sizing.spacing.xxs,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: Sizing.borderWidth.s },
    shadowOpacity: 0.1,
    shadowRadius: Sizing.spacing.xxs,
    elevation: 2,
  },
  iconContainer: {
    width: Sizing.icon.l,
    height: Sizing.icon.l,
    borderRadius: Sizing.borderRadius.small,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: Sizing.padding.s,
  },
  content: {
    flex: 1,
  },
  name: {
    ...getTypographyStyle('m', 'semibold', 'normal'),
    marginBottom: Sizing.spacing.xxs,
  },
  description: {
    ...getTypographyStyle('s', 'normal', 'normal'),
    opacity: 0.7,
  },
  comingSoonContainer: {
    alignSelf: 'flex-start',
    backgroundColor: 'rgba(255, 149, 0, 0.12)',
    paddingHorizontal: Sizing.padding.s,
    paddingVertical: Sizing.spacing.xxs,
    borderRadius: Sizing.borderRadius.small,
    borderWidth: Sizing.borderWidth.hairline,
    borderColor: 'rgba(255, 149, 0, 0.2)',
    marginTop: Sizing.spacing.xxs,
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
