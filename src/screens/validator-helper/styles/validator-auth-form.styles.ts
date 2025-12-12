import { Sizing, typographyHelper } from 'masterfabric-expo-core';
import { StyleSheet } from 'react-native';
import {
  BUTTON_PRIMARY_COLOR,
  TAB_BUTTON_INACTIVE_COLOR,
} from '../constants/validator-helper-constants';

export const validatorAuthFormStyles = StyleSheet.create({
  wrapper: {
    flex: Sizing.flexNumber.full,
    marginBottom: Sizing.padding.l,
  },
  headerContainer: {
    paddingTop: Sizing.padding.xl,
    paddingBottom: Sizing.padding.xxl,
    paddingHorizontal: Sizing.padding.xl,
    alignItems: 'center',
    justifyContent: 'center',
  },
  logoContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  logo: {
    width: Sizing.icon.l,
    height: Sizing.icon.l,
  },
  cardContainer: {
    flex: Sizing.flexNumber.full,
    borderRadius: Sizing.borderRadius.xxl,
    paddingTop: Sizing.padding.xl,
    paddingHorizontal: Sizing.padding.xl,
    paddingBottom: Sizing.padding.xxl,
    marginTop: -Sizing.padding.xl,
  },
  tabContainer: {
    flexDirection: 'row',
    marginBottom: Sizing.padding.xl,
    gap: Sizing.gap.none,
    borderBottomWidth: Sizing.borderWidth.s,
  },
  tabButton: {
    flex: Sizing.flexNumber.full,
    paddingVertical: Sizing.padding.s,
    paddingHorizontal: Sizing.padding.m,
    alignItems: 'center',
    justifyContent: 'center',
    borderBottomWidth: Sizing.borderWidth.m,
    borderBottomColor: 'transparent',
    marginBottom: -1,
  },
  tabButtonActive: {
    borderBottomColor: BUTTON_PRIMARY_COLOR,
  },
  tabButtonText: {
    ...typographyHelper.fromSizing.createStyle(Sizing, 's', 'medium', 'normal'),
    color: TAB_BUTTON_INACTIVE_COLOR,
  },
  socialContainer: {
    gap: Sizing.gap.s,
    marginBottom: Sizing.padding.xl,
  },
  socialButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: Sizing.padding.s,
    paddingHorizontal: Sizing.padding.l,
    borderRadius: Sizing.card.borderRadius.m,
    borderWidth: Sizing.borderWidth.m,
    gap: Sizing.gap.s,
    minHeight: Sizing.button.height.medium,
  },
  socialButtonText: {
    ...typographyHelper.fromSizing.createStyle(Sizing, 's', 'medium', 'normal'),
  },
  dividerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: Sizing.padding.xl,
    gap: Sizing.gap.m,
  },
  divider: {
    flex: Sizing.flexNumber.full,
    height: Sizing.borderWidth.s,
  },
  dividerText: {
    ...typographyHelper.fromSizing.createStyle(Sizing, 'xs', 'medium', 'normal'),
    letterSpacing: 0.5,
    textTransform: 'uppercase',
  },
  formContainer: {
    gap: Sizing.gap.l,
    marginBottom: Sizing.padding.xl,
  },
  fieldContainer: {
    marginBottom: Sizing.spacing.none,
  },
  label: {
    ...typographyHelper.fromSizing.createStyle(Sizing, 'xs', 'semibold', 'normal'),
    marginBottom: Sizing.padding.s,
    letterSpacing: 0.2,
    textTransform: 'uppercase',
  },
  input: {
    borderWidth: Sizing.borderWidth.m,
    borderRadius: Sizing.card.borderRadius.m,
    paddingHorizontal: Sizing.padding.m,
    paddingVertical: Sizing.padding.s,
    ...typographyHelper.fromSizing.createStyle(Sizing, 'm', 'normal', 'normal'),
    minHeight: Sizing.input.height.medium,
  },
  passwordInputContainer: {
    position: 'relative',
    flexDirection: 'row',
    alignItems: 'center',
  },
  passwordInput: {
    flex: 1,
    borderWidth: 1.5,
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingRight: 48,
    paddingVertical: 14,
    fontSize: 16,
    fontWeight: '400',
    minHeight: 48,
  },
  passwordToggleButton: {
    position: 'absolute',
    right: 12,
    padding: 8,
  },
  errorText: {
    ...typographyHelper.fromSizing.createStyle(Sizing, 'xs', 'medium', 'normal'),
    marginTop: Sizing.spacing.xs,
    marginLeft: Sizing.spacing.xxs,
  },
  continueButton: {
    paddingVertical: Sizing.padding.s,
    paddingHorizontal: Sizing.padding.xl,
    borderRadius: Sizing.card.borderRadius.m,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: Sizing.spacing.xs,
    minHeight: Sizing.button.height.medium,
  },
  continueButtonText: {
    ...typographyHelper.fromSizing.createStyle(Sizing, 'm', 'semibold', 'normal'),
    letterSpacing: 0.2,
  },
  rememberMeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: Sizing.spacing.xxs,
    marginBottom: Sizing.spacing.xxs,
  },
  checkbox: {
    width: Sizing.icon.xs,
    height: Sizing.icon.xs,
    borderRadius: Sizing.borderRadius.xs,
    borderWidth: Sizing.borderWidth.m,
    marginRight: Sizing.padding.s,
    alignItems: 'center',
    justifyContent: 'center',
  },
  rememberMeText: {
    ...typographyHelper.fromSizing.createStyle(Sizing, 's', 'normal', 'normal'),
  },
  requirementsContainer: {
    marginTop: Sizing.spacing.s,
    gap: Sizing.gap.xs,
  },
  requirementItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Sizing.gap.xs,
  },
  requirementText: {
    ...typographyHelper.fromSizing.createStyle(Sizing, 'xs', 'normal', 'normal'),
  },
  matchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Sizing.gap.xs,
    marginTop: Sizing.spacing.xs,
  },
  matchText: {
    ...typographyHelper.fromSizing.createStyle(Sizing, 'xs', 'medium', 'normal'),
  },
});

