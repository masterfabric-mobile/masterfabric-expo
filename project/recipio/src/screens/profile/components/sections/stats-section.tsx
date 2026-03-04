import { View } from 'react-native';
import { useI18n } from '@/shared/i18n';
import type { ProfileStats } from '../../models/profile-models';
import { StatCard } from '../stat-card';
import { profileStyles } from '../../styles/profile.styles';

interface StatsSectionProps {
  stats: ProfileStats;
}

export function StatsSection({ stats }: StatsSectionProps) {
  const { t } = useI18n();

  return (
    <View style={profileStyles.statsSection}>
      <View style={profileStyles.statsRow}>
        <StatCard value={stats.favorites} label={t('profile.stats.favorites')} />
        <StatCard value={stats.recipesCooked} label={t('profile.stats.recipesCooked')} />
        <StatCard value={stats.dayStreak} label={t('profile.stats.dayStreak')} />
      </View>
    </View>
  );
}
