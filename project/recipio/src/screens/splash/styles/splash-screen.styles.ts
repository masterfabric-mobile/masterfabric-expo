import { StyleSheet } from 'react-native';
import { RecipioColors } from '../../../shared/constants/recipio-colors';

export const splashScreenStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: RecipioColors.splash.background,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 56,
    backgroundColor: 'transparent',
    width: '100%',
  },
  logoBadge: {
    width: 96,
    height: 96,
    borderRadius: 28,
    backgroundColor: RecipioColors.primaryAccent,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 24,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.15)',
  },
  title: {
    fontSize: 40,
    fontWeight: '800',
    color: RecipioColors.splash.title,
    letterSpacing: 1,
    marginTop: 24,
    marginBottom: 24,
    paddingHorizontal: 48,
    paddingVertical: 8,
    textAlign: 'center',
    alignSelf: 'stretch',
  },
  subtitle: {
    fontSize: 15,
    color: RecipioColors.splash.subtitle,
    textAlign: 'center',
    lineHeight: 22,
    maxWidth: 260,
  },
  loaderContainer: {
    alignItems: 'center',
    paddingBottom: 40,
  },
  loaderSpinner: {
    marginBottom: 14,
  },
  loaderText: {
    fontSize: 12,
    color: RecipioColors.splash.subtitle,
    letterSpacing: 2,
  },
});
