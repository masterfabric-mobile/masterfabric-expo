import { Text, TouchableOpacity, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import type { RecipioColorsPalette } from '@/shared/constants/recipio-colors';
import type { NotificationItem as NotificationItemType } from '../models/notification-models';
import type { NotificationsStyles } from '../styles/notifications.styles';
import { getRelativeTimeKey } from '../utils/format-time';
import { useI18n } from '@/shared/i18n';

const TYPE_ICON: Record<NotificationItemType['type'], keyof typeof Ionicons.glyphMap> = {
  recipe_suggestion: 'restaurant-outline',
  cooking_reminder: 'time-outline',
  favorite_updated: 'heart-outline',
  tip: 'bulb-outline',
  general: 'notifications-outline',
};

interface NotificationItemProps {
  item: NotificationItemType;
  onPress: (item: NotificationItemType) => void;
  styles: NotificationsStyles;
  colors: RecipioColorsPalette;
}

export function NotificationItem({ item, onPress, styles, colors }: NotificationItemProps) {
  const { t } = useI18n();
  const { key: timeKey, count } = getRelativeTimeKey(item.createdAt);
  const timeLabel = count != null ? t(timeKey, { count }) : t(timeKey);
  const icon = TYPE_ICON[item.type];

  return (
    <TouchableOpacity
      style={[styles.card, !item.read && styles.cardUnread]}
      onPress={() => onPress(item)}
      activeOpacity={0.7}
    >
      <View style={styles.iconWrap}>
        <Ionicons
          name={icon}
          size={22}
          color={item.read ? colors.textSecondary : colors.primaryAccent}
        />
      </View>
      <View style={styles.cardBody}>
        <Text style={styles.cardTitle} numberOfLines={1}>
          {item.title}
        </Text>
        <Text style={styles.cardText} numberOfLines={2}>
          {item.body}
        </Text>
        <Text style={styles.cardTime}>{timeLabel}</Text>
      </View>
    </TouchableOpacity>
  );
}
