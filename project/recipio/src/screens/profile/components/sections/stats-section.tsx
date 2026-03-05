import { View } from 'react-native';
import { useI18n } from '@/shared/i18n';
import type { ProfileStats } from '../../models/profile-models';
import { StatCard } from '../stat-card';
import { createProfileStyles } from '../../styles/profile.styles';

interface StatsSectionProps {
  stats: ProfileStats;
  profileStyles: ReturnType<typeof createProfileStyles>;
}

export function StatsSection({ stats, profileStyles }: StatsSectionProps) {
  const { t } = useI18n();

  return (
    <View style={profileStyles.statsSection}>
      <View style={profileStyles.statsRow}>
        <StatCard profileStyles={profileStyles} value={stats.favorites} label={t('profile.stats.favorites')} />
        <StatCard profileStyles={profileStyles} value={stats.recipesCooked} label={t('profile.stats.recipesCooked')} />
        <StatCard profileStyles={profileStyles} value={stats.dayStreak} label={t('profile.stats.dayStreak')} />
      </View>
    </View>
  );
}
