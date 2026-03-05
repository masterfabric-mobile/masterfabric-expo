import { View } from 'react-native';
import type { CookingGuideStyles } from '../../styles/cooking-guide.styles';

interface ProgressIndicatorProps {
  currentStep: number;
  totalSteps: number;
  styles: CookingGuideStyles;
}

export function ProgressIndicator({
  currentStep,
  totalSteps,
  styles: cookingGuideStyles,
}: ProgressIndicatorProps) {
  if (totalSteps <= 0) return null;

  return (
    <View style={cookingGuideStyles.progressRow}>
      {Array.from({ length: totalSteps }, (_, i) => i + 1).map((step) => {
        const isActive = step === currentStep;
        return (
          <View
            key={step}
            style={[
              cookingGuideStyles.progressDot,
              isActive && cookingGuideStyles.progressDotActive,
            ]}
          />
        );
      })}
    </View>
  );
}
