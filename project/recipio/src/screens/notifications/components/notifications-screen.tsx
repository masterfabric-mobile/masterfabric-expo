import { useMemo } from 'react';
import {
  ActivityIndicator,
  FlatList,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useI18n } from '@/shared/i18n';
import { useRecipioColors } from '@/shared/hooks/use-recipio-colors';
import { useNotificationsViewModel } from '../hooks/use-notifications-view-model';
import { NotificationItem } from './notification-item';
import { createNotificationsStyles } from '../styles/notifications.styles';

export function NotificationsScreen() {
  const { t } = useI18n();
  const router = useRouter();
  const colors = useRecipioColors();
  const notificationsStyles = useMemo(
    () => createNotificationsStyles(colors),
    [colors],
  );
  const {
    items,
    isLoading,
    unreadCount,
    refetch,
    handleNotificationPress,
    handleMarkAllRead,
  } = useNotificationsViewModel();

  if (isLoading && items.length === 0) {
    return (
      <View style={notificationsStyles.container}>
        <View style={notificationsStyles.header}>
          <View style={notificationsStyles.headerLeft}>
            <TouchableOpacity
              style={notificationsStyles.backButton}
              onPress={() => router.back()}
              activeOpacity={0.7}
            >
              <Ionicons name="chevron-back" size={24} color={colors.text} />
            </TouchableOpacity>
            <Text style={notificationsStyles.headerTitle}>
              {t('notifications.title')}
            </Text>
          </View>
        </View>
        <View style={notificationsStyles.loadingWrap}>
          <ActivityIndicator size="large" color={colors.primaryAccent} />
        </View>
      </View>
    );
  }

  if (items.length === 0) {
    return (
      <View style={notificationsStyles.container}>
        <View style={notificationsStyles.header}>
          <View style={notificationsStyles.headerLeft}>
            <TouchableOpacity
              style={notificationsStyles.backButton}
              onPress={() => router.back()}
              activeOpacity={0.7}
            >
              <Ionicons name="chevron-back" size={24} color={colors.text} />
            </TouchableOpacity>
            <Text style={notificationsStyles.headerTitle}>
              {t('notifications.title')}
            </Text>
          </View>
        </View>
        <View style={notificationsStyles.empty}>
          <Text style={notificationsStyles.emptyIcon}>🔔</Text>
          <Text style={notificationsStyles.emptyTitle}>
            {t('notifications.emptyTitle')}
          </Text>
          <Text style={notificationsStyles.emptySubtext}>
            {t('notifications.emptySubtext')}
          </Text>
        </View>
      </View>
    );
  }

  return (
    <View style={notificationsStyles.container}>
      <View style={notificationsStyles.header}>
        <View style={notificationsStyles.headerLeft}>
          <TouchableOpacity
            style={notificationsStyles.backButton}
            onPress={() => router.back()}
            activeOpacity={0.7}
          >
            <Ionicons name="chevron-back" size={24} color={colors.text} />
          </TouchableOpacity>
          <Text style={notificationsStyles.headerTitle}>
            {t('notifications.title')}
          </Text>
        </View>
        {unreadCount > 0 && (
          <TouchableOpacity
            style={notificationsStyles.markAllRead}
            onPress={handleMarkAllRead}
            activeOpacity={0.7}
          >
            <Text style={notificationsStyles.markAllReadText}>
              {t('notifications.markAllRead')}
            </Text>
          </TouchableOpacity>
        )}
      </View>
      <FlatList
        data={items}
        keyExtractor={(item) => item.id}
        contentContainerStyle={notificationsStyles.list}
        renderItem={({ item }) => (
          <NotificationItem
            item={item}
            onPress={handleNotificationPress}
            styles={notificationsStyles}
            colors={colors}
          />
        )}
      />
    </View>
  );
}
