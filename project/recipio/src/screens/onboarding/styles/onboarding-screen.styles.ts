import { StyleSheet } from 'react-native';
import type { RecipioColorsPalette } from '@/shared/constants/recipio-colors';

const ICON_WRAPPER_SIZE = 100;

export function createOnboardingScreenStyles(colors: RecipioColorsPalette) {
  return StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.background,
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
      backgroundColor: colors.cardBackground,
      justifyContent: 'center',
      alignItems: 'center',
      marginBottom: 28,
    },
    stepTitle: {
      fontSize: 24,
      fontWeight: 'bold',
      color: colors.text,
      textAlign: 'center',
      marginBottom: 16,
    },
    stepDescription: {
      fontSize: 16,
      color: colors.textSecondary,
      textAlign: 'center',
      lineHeight: 24,
      marginBottom: 8,
    },
  });
}
