import { RecipioColors } from '@/shared/constants/recipio-colors';
import { StyleSheet } from 'react-native';

const ICON_WRAPPER_SIZE = 120;
const ICON_SIZE = 72;

export const splashScreenStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: RecipioColors.background,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 40,
  },
  iconWrapper: {
    width: ICON_WRAPPER_SIZE,
    height: ICON_WRAPPER_SIZE,
    borderRadius: 28,
    backgroundColor: RecipioColors.cardBackground,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 32,
  },
  icon: {
    color: RecipioColors.text,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: RecipioColors.text,
    marginBottom: 8,
  },
  slogan: {
    fontSize: 12,
    fontWeight: '600',
    color: RecipioColors.textSecondary,
    letterSpacing: 2,
    marginBottom: 48,
  },
  loaderSection: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 56,
    alignItems: 'center',
  },
  loader: {
    marginBottom: 12,
  },
  loadingLabel: {
    fontSize: 11,
    fontWeight: '600',
    color: RecipioColors.textSecondary,
    letterSpacing: 1.5,
  },
});

export const splashIconSize = ICON_SIZE;
