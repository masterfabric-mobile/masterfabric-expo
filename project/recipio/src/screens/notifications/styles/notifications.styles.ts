import { StyleSheet } from 'react-native';
import type { RecipioColorsPalette } from '@/shared/constants/recipio-colors';
import { STACK_HEADER_ROW } from '@/shared/constants/stack-screen-header';

export function createNotificationsStyles(colors: RecipioColorsPalette) {
  return StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.background,
    },
    header: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      paddingTop: STACK_HEADER_ROW.paddingTop,
      paddingBottom: STACK_HEADER_ROW.paddingBottom,
      paddingHorizontal: STACK_HEADER_ROW.paddingHorizontal,
      borderBottomWidth: 1,
      borderBottomColor: colors.border,
      backgroundColor: colors.cardBackground,
    },
    headerLeft: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 12,
      flex: 1,
      minWidth: 0,
    },
    backButton: {
      padding: 4,
      marginLeft: -4,
    },
    headerTitle: {
      flex: 1,
      fontSize: 22,
      fontWeight: '700',
      color: colors.text,
      letterSpacing: -0.5,
    },
    markAllRead: {
      paddingVertical: 8,
      paddingHorizontal: 12,
    },
    markAllReadText: {
      fontSize: 14,
      fontWeight: '600',
      color: colors.primaryAccent,
    },
    headerRight: {
      alignItems: 'flex-end',
      gap: 6,
    },
    clearAll: {
      paddingVertical: 4,
      paddingHorizontal: 8,
    },
    clearAllText: {
      fontSize: 14,
      fontWeight: '600',
      color: colors.error,
    },
    list: {
      paddingHorizontal: 20,
      paddingTop: 16,
      paddingBottom: 100,
    },
    card: {
      flexDirection: 'row',
      alignItems: 'stretch',
      backgroundColor: colors.cardBackground,
      borderRadius: 12,
      paddingVertical: 12,
      paddingLeft: 16,
      paddingRight: 8,
      marginBottom: 12,
      borderWidth: 1,
      borderColor: colors.border,
    },
    cardPressable: {
      flex: 1,
      flexDirection: 'row',
      alignItems: 'flex-start',
    },
    cardDelete: {
      justifyContent: 'center',
      alignItems: 'center',
      alignSelf: 'stretch',
      minWidth: 44,
      paddingLeft: 4,
    },
    cardUnread: {
      borderLeftWidth: 4,
      borderLeftColor: colors.primaryAccent,
    },
    iconWrap: {
      width: 44,
      height: 44,
      borderRadius: 22,
      backgroundColor: colors.background,
      alignItems: 'center',
      justifyContent: 'center',
      marginRight: 14,
    },
    cardBody: {
      flex: 1,
    },
    cardTitle: {
      fontSize: 16,
      fontWeight: '600',
      color: colors.text,
      marginBottom: 4,
    },
    cardText: {
      fontSize: 14,
      color: colors.textSecondary,
      lineHeight: 20,
    },
    cardTime: {
      fontSize: 12,
      color: colors.textSecondary,
      marginTop: 8,
    },
    empty: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      paddingHorizontal: 40,
      paddingVertical: 60,
    },
    emptyIcon: {
      fontSize: 56,
      marginBottom: 16,
    },
    emptyTitle: {
      fontSize: 20,
      fontWeight: '600',
      color: colors.text,
      textAlign: 'center',
    },
    emptySubtext: {
      fontSize: 15,
      color: colors.textSecondary,
      marginTop: 12,
      textAlign: 'center',
      lineHeight: 22,
    },
    loadingWrap: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      paddingVertical: 48,
    },
  });
}

export type NotificationsStyles = ReturnType<typeof createNotificationsStyles>;
