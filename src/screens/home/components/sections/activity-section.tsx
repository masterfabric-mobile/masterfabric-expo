import React from 'react';
import { useColorScheme } from 'react-native';
import { ThemedText } from '@/src/shared/components/ThemedText';
import { ThemedView } from '@/src/shared/components/ThemedView';
import { t } from '@/src/shared/i18n';
import { activitySectionStyles } from '../../styles/activity-section.styles';

export function ActivitySection() {
  const isDark = useColorScheme() === 'dark';

  return (
    <ThemedView style={activitySectionStyles.section}>
      <ThemedText type="subtitle" style={activitySectionStyles.sectionTitle}>
        {t('home.recentActivity')}
      </ThemedText>
      
      <ThemedView style={[
        activitySectionStyles.activityCard,
        { backgroundColor: isDark ? '#1C1C1E' : '#F2F2F7' }
      ]}>
        <ThemedText style={activitySectionStyles.activityText}>
          {t('home.noActivity')}
        </ThemedText>
      </ThemedView>
    </ThemedView>
  );
}
