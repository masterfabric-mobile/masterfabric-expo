import { Image, Pressable, ScrollView, Text, View } from 'react-native';
import { useI18n } from '@/shared/i18n';
import { STORY_SECTIONS } from '../data/story-sections';
import { createHomeStyles } from '../styles/home.styles';
import type { StorySectionId } from '../data/story-sections';

interface StoriesStripProps {
  homeStyles: ReturnType<typeof createHomeStyles>;
  onStoryPress: (sectionId: StorySectionId) => void;
}

export function StoriesStrip({ homeStyles, onStoryPress }: StoriesStripProps) {
  const { t } = useI18n();

  return (
    <View style={homeStyles.storiesSection}>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={homeStyles.storiesScrollContent}
      >
        {STORY_SECTIONS.map((section) => (
          <Pressable
            key={section.id}
            style={homeStyles.storyItemWrap}
            onPress={() => onStoryPress(section.id)}
            accessibilityRole="button"
            accessibilityLabel={t(section.titleKey as 'home.stories.mostViewed')}
          >
            <View style={homeStyles.storyRing}>
              <View style={homeStyles.storyCircle}>
                <Image
                  source={{ uri: section.coverImage }}
                  style={homeStyles.storyImage}
                  resizeMode="cover"
                />
              </View>
            </View>
            <Text style={homeStyles.storyLabel} numberOfLines={2}>
              {t(section.titleKey as 'home.stories.mostViewed')}
            </Text>
          </Pressable>
        ))}
      </ScrollView>
    </View>
  );
}
