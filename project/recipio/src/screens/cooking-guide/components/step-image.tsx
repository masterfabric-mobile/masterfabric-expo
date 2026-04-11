import { Image, View } from 'react-native';
import type { CookingGuideStyles } from '../styles/cooking-guide.styles';

interface StepImageProps {
  imageUrl: string | null;
  /** Optional: for future per-step images */
  stepNumber?: number;
  styles: CookingGuideStyles;
}

export function StepImage({ imageUrl, stepNumber, styles: cookingGuideStyles }: StepImageProps) {
  return (
    <View style={cookingGuideStyles.stepImageContainer}>
      {imageUrl ? (
        <Image
          source={{ uri: imageUrl }}
          style={cookingGuideStyles.stepImage}
          resizeMode="cover"
        />
      ) : (
        <View
          style={[
            cookingGuideStyles.stepImageContainer,
            { justifyContent: 'center', alignItems: 'center' },
          ]}
        >
          {/* Placeholder when no image; stepNumber could be used for step-specific asset later */}
          <View style={{ fontSize: 48 }} />
        </View>
      )}
    </View>
  );
}
