import { Ionicons } from '@expo/vector-icons';
import { Text, TextInput, View } from 'react-native';
import type { RecipioColorsPalette } from '@/shared/constants/recipio-colors';
import { useI18n } from '@/shared/i18n';
import type { CookingGuideStyles } from '../../styles/cooking-guide.styles';

interface StepContentProps {
  stepNumber: number;
  totalSteps: number;
  text: string;
  note: string;
  chefTip?: string;
  onNoteChange: (text: string) => void;
  styles: CookingGuideStyles;
  colors: RecipioColorsPalette;
}

export function StepContent({
  stepNumber,
  totalSteps,
  text,
  note,
  chefTip,
  onNoteChange,
  styles: cookingGuideStyles,
  colors,
}: StepContentProps) {
  const { t } = useI18n();

  return (
    <>
      <Text style={cookingGuideStyles.stepLabel}>
        {t('cookingGuide.step')} {stepNumber} {t('cookingGuide.of')} {totalSteps}
      </Text>
      <Text style={cookingGuideStyles.stepText}>{text}</Text>
      {chefTip ? (
        <View style={cookingGuideStyles.chefTipCard}>
          <Ionicons
            name="bulb"
            size={22}
            color={colors.primaryAccent}
          />
          <View style={{ flex: 1 }}>
            <Text style={cookingGuideStyles.chefTipLabel}>
              {t('cookingGuide.chefTip')}
            </Text>
            <Text style={cookingGuideStyles.chefTipText}>{chefTip}</Text>
          </View>
        </View>
      ) : null}
      <View style={cookingGuideStyles.notesSection}>
        <Text style={cookingGuideStyles.notesLabel}>{t('cookingGuide.notes')}</Text>
        <TextInput
          style={cookingGuideStyles.notesInput}
          placeholder={t('cookingGuide.addNote')}
          placeholderTextColor={colors.textSecondary}
          value={note}
          onChangeText={onNoteChange}
          multiline
          maxLength={500}
        />
      </View>
    </>
  );
}
