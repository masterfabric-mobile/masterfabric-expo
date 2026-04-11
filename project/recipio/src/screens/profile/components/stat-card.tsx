import { Text, View } from 'react-native';
import { createProfileStyles } from '../styles/profile.styles';

interface StatCardProps {
  value: number;
  label: string;
  profileStyles: ReturnType<typeof createProfileStyles>;
}

export function StatCard({ value, label, profileStyles }: StatCardProps) {
  return (
    <View style={profileStyles.statCard}>
      <Text style={profileStyles.statValue}>{value}</Text>
      <Text style={profileStyles.statLabel} numberOfLines={2} allowFontScaling>
        {label}
      </Text>
    </View>
  );
}
