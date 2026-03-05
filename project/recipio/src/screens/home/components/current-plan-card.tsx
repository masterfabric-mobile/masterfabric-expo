import { Ionicons } from '@expo/vector-icons';
import { Text, TouchableOpacity, View } from 'react-native';
import { useI18n } from '@/shared/i18n';
import { createHomeStyles } from '../styles/home.styles';
import type { CurrentPlan } from '../models/home-models';

interface CurrentPlanCardProps extends CurrentPlan {
  homeStyles: ReturnType<typeof createHomeStyles>;
  onPress?: () => void;
}

export function CurrentPlanCard({
  homeStyles,
  name,
  isActive,
  recipesSaved,
  recipesLimit,
  onPress,
}: CurrentPlanCardProps) {
  const { t } = useI18n();
  const progress = recipesLimit > 0 ? Math.min((recipesSaved / recipesLimit) * 100, 100) : 0;

  const content = (
    <>
      <View style={homeStyles.planHeader}>
        <Text style={homeStyles.planTitle}>{t('home.currentPlan')}</Text>
        {isActive && name ? (
          <View style={homeStyles.planStatus}>
            <View style={homeStyles.planStatusBadge}>
              <Ionicons name="checkmark" size={12} color="#FFFFFF" />
            </View>
            <Text style={homeStyles.planStatusText}>{t('home.active')}</Text>
          </View>
        ) : null}
      </View>
      {name ? (
        <>
          <Text style={homeStyles.planName}>{name}</Text>
          <Text style={homeStyles.planDescription}>{t('home.monthlyRecipesSaved')}</Text>
          <View style={homeStyles.progressBarContainer}>
            <View style={[homeStyles.progressBarBg, { flex: 1 }]}>
              <View
                style={[
                  homeStyles.progressBar,
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
            <Text style={homeStyles.progressText}>
              {recipesSaved}/{recipesLimit}
            </Text>
          </View>
        </>
      ) : (
        <Text style={homeStyles.planDescription}>{t('home.noPlanSubtext')}</Text>
      )}
    </>
  );

  if (onPress) {
    return (
      <TouchableOpacity
        style={homeStyles.planCard}
        onPress={onPress}
        activeOpacity={0.85}
      >
        {content}
      </TouchableOpacity>
    );
  }

  return <View style={homeStyles.planCard}>{content}</View>;
}
