import { StyleSheet } from 'react-native';
import { Sizing } from 'masterfabric-expo-core';

export const uiSizeHelperScreenStyles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: Sizing.padding.xxl,
  },
  infoCard: {
    borderRadius: Sizing.card.borderRadius.m,
    padding: Sizing.card.padding.medium,
    borderWidth: Sizing.borderWidth.s,
    marginBottom: Sizing.spacing.m,
  },
  modalBackdrop: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: Sizing.padding.l,
  },
  modal: {
    minWidth: Sizing.modal.minWidth.m,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: Sizing.spacing.s,
    },
    shadowOpacity: 0.25,
    shadowRadius: Sizing.spacing.m,
    elevation: 5,
  },
  modalButton: {
    alignItems: 'center',
    justifyContent: 'center',
  },
});

