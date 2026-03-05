import { StyleSheet } from 'react-native';
import type { RecipioColorsPalette } from '@/shared/constants/recipio-colors';

export function createDietaryPreferencesStyles(colors: RecipioColorsPalette) {
  return StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.background,
    },
    scroll: {
      flex: 1,
    },
    scrollContent: {
      paddingHorizontal: 20,
      paddingTop: 16,
      paddingBottom: 40,
    },
    header: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      paddingVertical: 16,
      paddingHorizontal: 4,
      borderBottomWidth: 1,
      borderBottomColor: colors.border,
    },
    headerSide: {
      minWidth: 40,
    },
    headerTitle: {
      fontSize: 18,
      fontWeight: '600',
      color: colors.text,
    },
    section: {
      marginTop: 24,
    },
    sectionHeader: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 8,
      marginBottom: 12,
    },
    sectionTitle: {
      fontSize: 14,
      fontWeight: '700',
      color: colors.text,
      letterSpacing: 0.5,
    },
    pillsRow: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      gap: 10,
    },
    pill: {
      paddingVertical: 10,
      paddingHorizontal: 16,
      borderRadius: 20,
      backgroundColor: colors.cardBackground,
      borderWidth: 1,
      borderColor: colors.border,
    },
    pillSelected: {
      backgroundColor: colors.primaryAccent,
      borderColor: colors.primaryAccent,
    },
    pillText: {
      fontSize: 14,
      fontWeight: '500',
      color: colors.text,
    },
    pillTextSelected: {
      color: '#FFFFFF',
    },
    addRow: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 10,
      marginTop: 12,
      marginBottom: 12,
    },
    input: {
      flex: 1,
      height: 44,
      borderRadius: 10,
      backgroundColor: colors.cardBackground,
      borderWidth: 1,
      borderColor: colors.border,
      paddingHorizontal: 14,
      fontSize: 15,
      color: colors.text,
    },
    addButton: {
      width: 44,
      height: 44,
      borderRadius: 10,
      backgroundColor: colors.primaryAccent,
      alignItems: 'center',
      justifyContent: 'center',
    },
    infoBox: {
      marginTop: 24,
      padding: 16,
      borderRadius: 12,
      backgroundColor: colors.cardBackground,
      borderWidth: 1,
      borderColor: colors.border,
    },
    infoText: {
      fontSize: 14,
      color: colors.textSecondary,
      lineHeight: 20,
    },
    saveButton: {
      marginTop: 28,
      height: 52,
      borderRadius: 12,
      backgroundColor: colors.primaryAccent,
      alignItems: 'center',
      justifyContent: 'center',
    },
    saveButtonText: {
      fontSize: 16,
      fontWeight: '600',
      color: '#FFFFFF',
    },
  });
}
