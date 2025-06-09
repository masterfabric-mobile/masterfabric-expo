import { ThemedText } from '@/src/shared/components/ThemedText';
import { t } from '@/src/shared/i18n';
import React from 'react';
import { useColorScheme, View } from 'react-native';
import { activitySectionStyles } from '../../styles/activity-section.styles';

export function ActivitySection() {
  const isDark = useColorScheme() === 'dark';

  return (
    <View style={activitySectionStyles.section}>
      <ThemedText type="subtitle" style={activitySectionStyles.sectionTitle}>
        {t('home.recentActivity')}
      </ThemedText>
      
      <View style={[
        activitySectionStyles.activityCard,
        { backgroundColor: isDark ? '#1C1C1E' : '#F2F2F7' }
      ]}>
        <ThemedText style={activitySectionStyles.activityText}>
          {t('home.noActivity')}
        </ThemedText>
      </View>
    </View>
  );
}
