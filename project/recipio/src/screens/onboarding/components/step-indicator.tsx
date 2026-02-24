import { RecipioColors } from '@/shared/constants/recipio-colors';
import { StyleSheet, View } from 'react-native';

interface StepIndicatorProps {
  currentStep: number;
  totalSteps: number;
}

const dotSize = 8;
const dotGap = 10;

export function StepIndicator({ currentStep, totalSteps }: StepIndicatorProps) {
  return (
    <View style={styles.container}>
      {Array.from({ length: totalSteps }).map((_, i) => (
        <View
          key={i}
          style={[
            styles.dot,
            i === currentStep && styles.dotActive,
            i < currentStep && styles.dotPast,
            i > currentStep && styles.dotInactive,
          ]}
        />
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: dotGap,
  },
  dot: {
    width: dotSize,
    height: dotSize,
    borderRadius: dotSize / 2,
  },
  dotActive: {
    backgroundColor: RecipioColors.primaryAccent,
    opacity: 1,
  },
  dotPast: {
    backgroundColor: RecipioColors.primaryAccent,
    opacity: 0.6,
  },
  dotInactive: {
    backgroundColor: RecipioColors.border,
    opacity: 0.5,
  },
});
