import { Ionicons } from '@expo/vector-icons';
import { Image, Text, TouchableOpacity, View } from 'react-native';
import { dashboardStyles } from '../styles/dashboard.styles';
import type { ActivityItem } from '../models/home-models';

interface RecentActivitySectionProps {
  activities: ActivityItem[];
}

export function RecentActivitySection({
  activities,
}: RecentActivitySectionProps) {
  if (activities.length === 0) return null;

  return (
    <View style={dashboardStyles.recentActivitySection}>
      <Text style={dashboardStyles.sectionTitle}>Recent Activity</Text>
      {activities.map((activity) => (
        <TouchableOpacity
          key={activity.id}
          style={dashboardStyles.activityCard}
          activeOpacity={0.8}
        >
          {activity.type === 'saved' && activity.recipeImageUrl ? (
            <Image
              source={{ uri: activity.recipeImageUrl }}
              style={dashboardStyles.activityImage}
              resizeMode="cover"
            />
          ) : (
            <View style={dashboardStyles.activityIconContainer}>
              <Ionicons
                name={
                  activity.type === 'saved'
                    ? 'bookmark'
                    : 'checkmark-circle'
                }
                size={24}
                color="#FF5722"
              />
            </View>
          )}
          <View style={dashboardStyles.activityTextContent}>
            <Text style={dashboardStyles.activityTitle}>
              {activity.type === 'saved'
                ? `You saved ${activity.recipeTitle}`
                : `Finished ${activity.recipeTitle}`}
            </Text>
            <Text style={dashboardStyles.activityTime}>{activity.timeAgo}</Text>
          </View>
          <Ionicons name="chevron-forward" size={20} color="#8E8E93" />
        </TouchableOpacity>
      ))}
    </View>
  );
}
