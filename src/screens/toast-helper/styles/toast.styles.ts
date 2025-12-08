import { Sizing, typographyHelper } from 'masterfabric-expo-core';
import { I18nManager, StyleSheet } from 'react-native';

const isRTL = I18nManager.isRTL;

export const toastStyles = StyleSheet.create({
  toast: {
    padding: Sizing.padding.m,
    paddingRight: isRTL ? Sizing.padding.m : Sizing.padding.xxl,
    paddingLeft: isRTL ? Sizing.padding.xxl : Sizing.padding.m,
    borderRadius: Sizing.card.borderRadius.m,
    marginBottom: Sizing.padding.s,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: Sizing.spacing.xxs,
    },
    shadowOpacity: Sizing.shadowOpacity.m,
    shadowRadius: Sizing.gap.s,
    elevation: Sizing.elevation.xl,
    maxWidth: '100%',
    alignSelf: Sizing.layout.alignSelf.stretch,
  },
  contentContainer: {
    flexDirection: isRTL ? Sizing.layout.flexDirection.rowReverse : Sizing.layout.flexDirection.row,
    alignItems: Sizing.layout.alignItems.flexStart,
    gap: Sizing.padding.s,
  },
  messageContainer: {
    flex: Sizing.flexNumber.full,
    gap: Sizing.gap.s,
  },
  toastText: {
    color: '#fff',
    ...typographyHelper.fromSizing.createStyle(Sizing, 'm', 'normal', 'normal'),
    flex: Sizing.flexNumber.full,
    flexWrap: 'wrap',
  },
  icon: {
    marginRight: isRTL ? 0 : Sizing.padding.s,
    marginLeft: isRTL ? Sizing.padding.s : 0,
    alignSelf: Sizing.layout.alignSelf.flexStart,
  },
  actionButton: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    paddingHorizontal: Sizing.padding.s,
    paddingVertical: Sizing.spacing.xxs,
    borderRadius: Sizing.borderRadius.small,
    alignSelf: Sizing.layout.alignSelf.flexStart,
  },
  actionButtonText: {
    color: '#fff',
    ...typographyHelper.fromSizing.createStyle(Sizing, 's', 'semibold', 'normal'),
  },
  closeButton: {
    position: 'absolute',
    [isRTL ? 'left' : 'right']: Sizing.gap.s,
    top: Sizing.gap.s,
    width: Sizing.icon.s,
    height: Sizing.icon.s,
    justifyContent: Sizing.layout.justifyContent.center,
    alignItems: Sizing.layout.alignItems.center,
    borderRadius: Sizing.icon.s / 2,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
  },
  closeButtonText: {
    color: '#fff',
    ...typographyHelper.fromSizing.createStyle(Sizing, 'xl', 'normal', 'normal'),
    textAlign: Sizing.layout.textAlign.center,
  },
});
