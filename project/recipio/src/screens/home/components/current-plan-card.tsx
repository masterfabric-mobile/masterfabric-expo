import { Ionicons } from '@expo/vector-icons';
import { Text, View } from 'react-native';
import { dashboardStyles } from '../styles/dashboard.styles';
import type { CurrentPlan } from '../models/home-models';

interface CurrentPlanCardProps extends CurrentPlan {}

export function CurrentPlanCard({
  name,
  isActive,
  recipesSaved,
  recipesLimit,
}: CurrentPlanCardProps) {
  const progress = Math.min((recipesSaved / recipesLimit) * 100, 100);

  return (
    <View style={dashboardStyles.planCard}>
      <View style={dashboardStyles.planHeader}>
        <Text style={dashboardStyles.planTitle}>CURRENT PLAN</Text>
        {isActive && (
          <View style={dashboardStyles.planStatus}>
            <View style={dashboardStyles.planStatusBadge}>
              <Ionicons name="checkmark" size={12} color="#FFFFFF" />
            </View>
            <Text style={dashboardStyles.planStatusText}>Active</Text>
          </View>
        )}
      </View>
      <Text style={dashboardStyles.planName}>{name}</Text>
      <Text style={dashboardStyles.planDescription}>Monthly Recipes Saved</Text>
      <View style={dashboardStyles.progressBarContainer}>
        <View style={[dashboardStyles.progressBarBg, { flex: 1 }]}>
          <View
            style={[
              dashboardStyles.progressBar,
              {
                width: `${progress}%`,
                position: 'absolute',
                left: 0,
                top: 0,
                bottom: 0,
              },
            ]}
          />
        </View>
        <Text style={dashboardStyles.progressText}>
          {recipesSaved}/{recipesLimit}
        </Text>
      </View>
    </View>
  );
}
