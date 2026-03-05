import { LinearGradient } from 'expo-linear-gradient';
import { Image, ScrollView, Text, TouchableOpacity, View } from 'react-native';
import { useI18n } from '@/shared/i18n';
import { RECIPE_CATEGORIES } from '@/shared/services/recipe-service';
import { createHomeStyles } from '../styles/home.styles';

interface CategoriesSectionProps {
  homeStyles: ReturnType<typeof createHomeStyles>;
  onCategoryPress: (categorySlug: string) => void;
}

export function CategoriesSection({ homeStyles, onCategoryPress }: CategoriesSectionProps) {
  const { t } = useI18n();
  return (
    <View style={homeStyles.categoriesSection}>
      <Text style={homeStyles.categoriesSectionTitle}>{t('home.categories')}</Text>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={homeStyles.categoriesScroll}
      >
        {RECIPE_CATEGORIES.map((cat) => (
          <TouchableOpacity
            key={cat.slug}
            style={homeStyles.categoryCard}
            onPress={() => onCategoryPress(cat.slug)}
            activeOpacity={0.9}
          >
            <Image
              source={{ uri: cat.imageUrl }}
              style={homeStyles.categoryCardImage}
              resizeMode="cover"
            />
            <LinearGradient
              colors={['transparent', 'rgba(0,0,0,0.3)', 'rgba(0,0,0,0.75)']}
              style={homeStyles.categoryCardGradient}
            />
            <View style={homeStyles.categoryCardLabel}>
              <Text style={homeStyles.categoryCardText} numberOfLines={2}>
                {t(cat.labelKey)}
              </Text>
            </View>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );
}
