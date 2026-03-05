import { Text, TouchableOpacity, View } from 'react-native';
import { useI18n } from '@/shared/i18n';
import { createHomeStyles } from '../styles/home.styles';
import type { CurrentPlan } from '../models/home-models';

interface PlanStripProps {
  homeStyles: ReturnType<typeof createHomeStyles>;
  plan: CurrentPlan;
  onPress?: () => void;
}

export function PlanStrip({ homeStyles, plan, onPress }: PlanStripProps) {
  const { t } = useI18n();
  const { name, isActive, recipesSaved, recipesLimit } = plan;
  const progress = recipesLimit > 0 ? Math.min((recipesSaved / recipesLimit) * 100, 100) : 0;

  const content = (
    <>
      <View style={homeStyles.planStripLeft}>
        {isActive && name ? (
          <View style={homeStyles.planStatusDot} />
        ) : null}
        <Text style={homeStyles.planStripName} numberOfLines={1}>
          {name || t('home.currentPlan')}
        </Text>
        {name ? (
          <Text style={homeStyles.planStripLabel}>{t('home.monthlyRecipesSaved')}</Text>
        ) : null}
      </View>
      {recipesLimit > 0 ? (
        <View style={homeStyles.planStripProgress}>
          <View style={homeStyles.planStripProgressBg}>
            <View
              style={[
                homeStyles.planStripProgressFill,
                { width: `${progress}%` },
              ]}
            />
          </View>
          <Text style={homeStyles.planStripCount}>
            {recipesSaved}/{recipesLimit}
          </Text>
        </View>
      ) : null}
    </>
  );

  if (onPress) {
    return (
      <TouchableOpacity
        style={homeStyles.planStrip}
        onPress={onPress}
        activeOpacity={0.85}
      >
        {content}
      </TouchableOpacity>
    );
  }
  return <View style={homeStyles.planStrip}>{content}</View>;
}
