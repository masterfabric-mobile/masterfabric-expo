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
        <StatCard value={stats.saved} label={t('profile.stats.saved')} />
        <StatCard value={stats.created} label={t('profile.stats.created')} />
        <StatCard value={stats.followers} label={t('profile.stats.followers')} />
      </View>
    </View>
  );
}
