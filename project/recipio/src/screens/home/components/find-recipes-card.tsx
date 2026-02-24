import { Ionicons } from '@expo/vector-icons';
import { Text, TouchableOpacity, View } from 'react-native';
import { dashboardStyles } from '../styles/dashboard.styles';

interface FindRecipesCardProps {
  onPress: () => void;
}

export function FindRecipesCard({ onPress }: FindRecipesCardProps) {
  return (
    <TouchableOpacity
      style={dashboardStyles.findRecipesCard}
      onPress={onPress}
      activeOpacity={0.8}
    >
      <View style={dashboardStyles.findRecipesIconContainer}>
        <Ionicons
          name="restaurant"
          size={32}
          color="#FF5722"
        />
      </View>
      <View style={dashboardStyles.findRecipesContent}>
        <Text style={dashboardStyles.findRecipesTitle}>
          Find Your Next Meal
        </Text>
        <Text style={dashboardStyles.findRecipesSubtitle}>
          Browse recipes by ingredients you have on hand
        </Text>
      </View>
      <Ionicons
        name="chevron-forward"
        size={24}
        color="#FF5722"
        style={dashboardStyles.findRecipesArrow}
      />
    </TouchableOpacity>
  );
}
