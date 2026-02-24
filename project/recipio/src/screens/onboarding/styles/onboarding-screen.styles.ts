import { RecipioColors } from '@/shared/constants/recipio-colors';
import { StyleSheet } from 'react-native';

const ICON_WRAPPER_SIZE = 100;

export const onboardingScreenStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: RecipioColors.background,
  },
  content: {
    flex: 1,
    paddingTop: 40,
    paddingHorizontal: 28,
  },
  indicatorRow: {
    alignItems: 'center',
    marginBottom: 8,
  },
  stepContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 40,
  },
  stepContent: {
    alignItems: 'center',
    paddingHorizontal: 24,
    maxWidth: 320,
  },
  stepIconWrapper: {
    width: ICON_WRAPPER_SIZE,
    height: ICON_WRAPPER_SIZE,
    borderRadius: 24,
    backgroundColor: RecipioColors.cardBackground,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 28,
  },
  stepTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: RecipioColors.text,
    textAlign: 'center',
    marginBottom: 16,
  },
  stepDescription: {
    fontSize: 16,
    color: RecipioColors.textSecondary,
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: 8,
  },
});
