import { Text, View } from 'react-native';
import { profileStyles } from '../styles/profile.styles';

interface StatCardProps {
  value: number;
  label: string;
}

export function StatCard({ value, label }: StatCardProps) {
  return (
    <View style={profileStyles.statCard}>
      <Text style={profileStyles.statValue}>{value}</Text>
      <Text style={profileStyles.statLabel} numberOfLines={1}>
        {label}
      </Text>
    </View>
  );
}
