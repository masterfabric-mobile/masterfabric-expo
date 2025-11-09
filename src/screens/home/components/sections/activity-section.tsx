import { ThemedText } from '@/src/shared/components/ThemedText';
import { useLocale } from '@/src/shared/contexts/locale-context';
import { getCurrentLocale, getTranslatedTitle, t } from '@/src/shared/i18n';
import { Ionicons } from '@expo/vector-icons';
import { getThemeColors, useTheme } from 'masterfabric-expo-core';
import React, { useMemo } from 'react';
import { View } from 'react-native';
import { ActivityItem, useHomeStore } from '../../store/home-store';
import { activitySectionStyles } from '../../styles/activity-section.styles';
import { formatActivityDescription, formatActivityTime, getActivityIcon } from '../../utils';

export function ActivitySection() {
  const { currentTheme } = useTheme();
  const isDark = currentTheme === 'dark';
  const colors = getThemeColors(isDark);
  const { recentActivity } = useHomeStore();
  const { locale } = useLocale();
  const currentLocale = getCurrentLocale();
  
  // Filter duplicates and get only the last 3 unique activities
  const latestActivities = useMemo(() => {
    const uniqueActivities = recentActivity.filter((activity, index, self) => 
      index === self.findIndex(a => (
        a.title === activity.title && 
        a.type === activity.type &&
        // Allow duplicates if they're more than 5 minutes apart
        Math.abs(new Date(a.timestamp).getTime() - 
                new Date(activity.timestamp).getTime()) < 300000
      ))
    );
    
    return uniqueActivities.slice(0, 3);
  }, [recentActivity, locale]); // Add locale dependency so it updates when locale changes
  
  // Create a render function for activity items that will update with locale changes
  const renderActivityItem = (activity: ActivityItem, index: number) => {
    const iconInfo = getActivityIcon(activity);
    
    // Special handling for translating titles
    const displayTitle = getTranslatedTitle(activity.title);
    
    // Format the description with special handling for theme/language changes
    const description = formatActivityDescription(activity, t);
    
    return (
      <View key={`${activity.id}-${currentLocale}-${index}`}>
        <View style={activitySectionStyles.activityItem}>
          <View style={[
            activitySectionStyles.activityIconContainer,
            { backgroundColor: iconInfo.color + '20' }
          ]}>
            <Ionicons
              name={iconInfo.icon}
              size={20}
              color={iconInfo.color}
            />
          </View>
          
          <View style={activitySectionStyles.activityContent}>
            <View style={activitySectionStyles.activityHeader}>
              <ThemedText 
                style={[
                  activitySectionStyles.activityTitle,
                  { color: colors.bodyText }
                ]}
                numberOfLines={1}
              >
                {displayTitle}
              </ThemedText>
              
              <ThemedText 
                style={[
                  activitySectionStyles.activityTime,
                  { color: colors.labelText }
                ]}
              >
                {formatActivityTime(new Date(activity.timestamp))}
              </ThemedText>
            </View>
            
            <ThemedText 
              style={[
                activitySectionStyles.activityDescription,
                { 
                  color: colors.labelText,
                  // Special styling for theme and language changes
                  fontWeight: (activity.details?.action === 'theme_change' || 
                               activity.details?.action === 'language_change') ? '600' : 'normal'
                }
              ]}
              numberOfLines={2}
            >
              {description}
            </ThemedText>
          </View>
        </View>
        
        {index < latestActivities.length - 1 && (
          <View 
            style={[
              activitySectionStyles.activityDivider,
              { backgroundColor: colors.divider + '40' }
            ]} 
          />
        )}
      </View>
    );
  };
  
  return (
    <View style={activitySectionStyles.section}>
      <View style={activitySectionStyles.sectionHeader}>
        <ThemedText 
          type="subtitle" 
          style={[
            activitySectionStyles.sectionTitle,
            { color: colors.sectionTitle }
          ]}
        >
          {t('home.recentActivity')}
        </ThemedText>
      </View>
      
      <View style={[
        activitySectionStyles.activityCard,
        { 
          backgroundColor: colors.surfaceBackground,
          borderColor: colors.surfaceBorder + '40',
          borderWidth: 1,
          shadowColor: colors.surfaceShadow,
        }
      ]}>
        {latestActivities.length > 0 ? (
          latestActivities.map((activity, index) => renderActivityItem(activity, index))
        ) : (
          <View style={activitySectionStyles.emptyStateContainer}>
            <Ionicons 
              name="time-outline"
              size={32} 
              color={colors.labelText} 
              style={activitySectionStyles.emptyStateIcon}
            />
            <ThemedText 
              style={[
                activitySectionStyles.activityText,
                { color: colors.labelText }
              ]}
            >
              {t('home.noActivity')}
            </ThemedText>
          </View>
        )}
      </View>
    </View>
  );
}
