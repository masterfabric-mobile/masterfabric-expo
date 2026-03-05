import { Ionicons } from '@expo/vector-icons';
import { Image, Text, TouchableOpacity, View } from 'react-native';
import { useI18n } from '@/shared/i18n';
import { createHomeStyles } from '../styles/home.styles';
import type { ActivityItem } from '../models/home-models';

interface RecentActivitySectionProps {
  homeStyles: ReturnType<typeof createHomeStyles>;
  activities: ActivityItem[];
  onActivityPress?: (recipeId: number) => void;
}

export function RecentActivitySection({ homeStyles, activities, onActivityPress }: RecentActivitySectionProps) {
  const { t } = useI18n();

  return (
    <View style={homeStyles.recentActivitySection}>
      <Text style={homeStyles.sectionTitle}>{t('home.recentActivity')}</Text>
      {activities.length === 0 ? (
        <View style={homeStyles.emptyActivityContainer}>
          <Text style={homeStyles.emptyActivityIcon}>📋</Text>
          <Text style={homeStyles.emptyActivityText}>{t('home.recentActivityEmpty')}</Text>
          <Text style={homeStyles.emptyActivitySubtext}>{t('home.recentActivityEmptySubtext')}</Text>
        </View>
      ) : (
        activities.map((activity) => (
          <TouchableOpacity
            key={activity.id}
            style={homeStyles.activityCard}
            activeOpacity={0.8}
            onPress={() => onActivityPress?.(activity.recipeId)}
          >
            {activity.recipeImageUrl ? (
              <Image
                source={{ uri: activity.recipeImageUrl }}
                style={homeStyles.activityImage}
                resizeMode="cover"
              />
            ) : (
              <View style={homeStyles.activityIconContainer}>
                <Ionicons name="bookmark" size={24} color={homeStyles.viewAllText.color} />
              </View>
            )}
            <View style={homeStyles.activityTextContent}>
              <Text style={homeStyles.activityTitle}>
                {t('home.youSaved', { title: activity.recipeTitle })}
              </Text>
              <Text style={homeStyles.activityTime}>{activity.timeAgo}</Text>
            </View>
            <Ionicons name="chevron-forward" size={20} color={homeStyles.activityTime.color} />
          </TouchableOpacity>
        ))
      )}
    </View>
  );
}
