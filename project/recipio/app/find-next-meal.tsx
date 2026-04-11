import { Ionicons } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useMemo } from 'react';
import {
  Image,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { getStorySectionById } from '@/screens/home/data/story-sections';
import { useI18n } from '@/shared/i18n';
import { useRecipioColors } from '@/shared/hooks/use-recipio-colors';

const CARD_WIDTH = 160;
const CARD_MARGIN = 12;
const CARD_HEIGHT = 200;
const GRID_GAP = 12;
const GRID_PADDING = 20;
const LIST_IMAGE_SIZE = 80;
const LIST_ROW_GAP = 12;

export default function FindNextMealScreen() {
  const router = useRouter();
  const { section: sectionId } = useLocalSearchParams<{ section?: string }>();
  const insets = useSafeAreaInsets();
  const colors = useRecipioColors();
  const { t } = useI18n();
  const styles = useMemo(() => createStyles(colors, insets), [colors, insets]);

  const section = useMemo(
    () => getStorySectionById(sectionId ?? null),
    [sectionId]
  );

  const handleClose = () => router.back();
  const handleFindByIngredients = () => {
    router.replace('/enter-ingredients');
  };

  // Full-screen single section: title + grid of mock images
  if (section) {
    return (
      <View style={styles.container}>
        <View style={styles.header}>
          <View style={styles.headerSpacer} />
          <Text style={styles.headerTitle} numberOfLines={1}>
            {t(section.titleKey as 'home.stories.mostViewed')}
          </Text>
          <Pressable
            onPress={handleClose}
            style={styles.closeButton}
            hitSlop={16}
            accessibilityLabel={t('common.goBack')}
          >
            <Ionicons name="close" size={28} color={colors.text} />
          </Pressable>
        </View>

        <ScrollView
          style={styles.scroll}
          contentContainerStyle={styles.sectionListContent}
          showsVerticalScrollIndicator={false}
        >
          {section.items.map((item) => (
            <View key={item.id} style={styles.listRow}>
              <Image
                source={{ uri: item.image }}
                style={styles.listRowImage}
                resizeMode="cover"
              />
              <Text style={styles.listRowTitle} numberOfLines={2}>
                {item.title}
              </Text>
            </View>
          ))}
        </ScrollView>

        <View style={styles.ctaWrapper}>
          <Pressable
            style={styles.ctaButton}
            onPress={handleFindByIngredients}
            accessibilityRole="button"
          >
            <Ionicons name="restaurant" size={22} color="#FFFFFF" />
            <Text style={styles.ctaText}>
              {t('home.findNextMealStory.findByIngredients')}
            </Text>
            <Ionicons name="chevron-forward" size={22} color="#FFFFFF" />
          </Pressable>
        </View>
      </View>
    );
  }

  // Fallback: no section param – show default (most liked + recently added)
  const defaultSection = getStorySectionById('mostViewed');
  const secondSection = getStorySectionById('starsOfWeek');
  if (!defaultSection || !secondSection) return null;

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.headerSpacer} />
        <Text style={styles.headerTitle} numberOfLines={1}>
          {t('home.findYourNextMeal')}
        </Text>
        <Pressable
          onPress={handleClose}
          style={styles.closeButton}
          hitSlop={16}
          accessibilityLabel={t('common.goBack')}
        >
          <Ionicons name="close" size={28} color={colors.text} />
        </Pressable>
      </View>

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>
            {t(defaultSection.titleKey as 'home.stories.mostViewed')}
          </Text>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.horizontalScroll}
          >
            {defaultSection.items.map((item) => (
              <Pressable key={item.id} style={styles.card}>
                <Image
                  source={{ uri: item.image }}
                  style={styles.cardImage}
                  resizeMode="cover"
                />
                <View style={styles.cardOverlay} />
                <Text style={styles.cardTitle} numberOfLines={2}>
                  {item.title}
                </Text>
              </Pressable>
            ))}
          </ScrollView>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>
            {t(secondSection.titleKey as 'home.stories.mostViewed')}
          </Text>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.horizontalScroll}
          >
            {secondSection.items.map((item) => (
              <Pressable key={item.id} style={styles.card}>
                <Image
                  source={{ uri: item.image }}
                  style={styles.cardImage}
                  resizeMode="cover"
                />
                <View style={styles.cardOverlay} />
                <Text style={styles.cardTitle} numberOfLines={2}>
                  {item.title}
                </Text>
              </Pressable>
            ))}
          </ScrollView>
        </View>

        <Pressable
          style={styles.ctaButton}
          onPress={handleFindByIngredients}
          accessibilityRole="button"
        >
          <Ionicons name="restaurant" size={22} color="#FFFFFF" />
          <Text style={styles.ctaText}>
            {t('home.findNextMealStory.findByIngredients')}
          </Text>
          <Ionicons name="chevron-forward" size={22} color="#FFFFFF" />
        </Pressable>
      </ScrollView>
    </View>
  );
}

function createStyles(
  colors: ReturnType<typeof useRecipioColors>,
  insets: ReturnType<typeof useSafeAreaInsets>
) {
  return StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.background,
    },
    header: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      paddingTop: insets.top + 8,
      paddingBottom: 12,
      paddingHorizontal: 20,
      borderBottomWidth: StyleSheet.hairlineWidth,
      borderBottomColor: colors.border,
    },
    headerSpacer: {
      width: 44,
    },
    headerTitle: {
      flex: 1,
      fontSize: 17,
      fontWeight: '700',
      color: colors.text,
      textAlign: 'center',
    },
    closeButton: {
      width: 44,
      height: 44,
      justifyContent: 'center',
      alignItems: 'center',
    },
    scroll: {
      flex: 1,
    },
    scrollContent: {
      paddingVertical: 24,
      paddingBottom: 48,
    },
    sectionListContent: {
      padding: GRID_PADDING,
      gap: LIST_ROW_GAP,
      paddingBottom: 100,
    },
    listRow: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 14,
      backgroundColor: colors.cardBackground,
      borderRadius: 12,
      overflow: 'hidden',
      paddingRight: 14,
    },
    listRowImage: {
      width: LIST_IMAGE_SIZE,
      height: LIST_IMAGE_SIZE,
      backgroundColor: colors.border,
    },
    listRowTitle: {
      flex: 1,
      fontSize: 16,
      fontWeight: '600',
      color: colors.text,
    },
    ctaWrapper: {
      position: 'absolute',
      bottom: 0,
      left: 0,
      right: 0,
      padding: GRID_PADDING,
      paddingBottom: insets.bottom + GRID_PADDING,
      backgroundColor: colors.background,
      borderTopWidth: StyleSheet.hairlineWidth,
      borderTopColor: colors.border,
    },
    section: {
      marginBottom: 28,
    },
    sectionTitle: {
      fontSize: 18,
      fontWeight: '700',
      color: colors.text,
      marginBottom: 14,
      paddingHorizontal: 20,
    },
    horizontalScroll: {
      paddingHorizontal: 20,
      gap: CARD_MARGIN,
      paddingRight: 20 + CARD_MARGIN,
    },
    card: {
      width: CARD_WIDTH,
      height: CARD_HEIGHT,
      borderRadius: 16,
      overflow: 'hidden',
      backgroundColor: colors.cardBackground,
    },
    cardImage: {
      width: '100%',
      height: '100%',
    },
    cardOverlay: {
      ...StyleSheet.absoluteFillObject,
      backgroundColor: 'rgba(0,0,0,0.25)',
    },
    cardTitle: {
      position: 'absolute',
      bottom: 12,
      left: 12,
      right: 12,
      fontSize: 15,
      fontWeight: '600',
      color: '#FFFFFF',
      textShadowColor: 'rgba(0,0,0,0.6)',
      textShadowOffset: { width: 0, height: 1 },
      textShadowRadius: 3,
    },
    ctaButton: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: colors.primaryAccent,
      paddingVertical: 16,
      paddingHorizontal: 24,
      borderRadius: 16,
      gap: 10,
    },
    ctaText: {
      fontSize: 16,
      fontWeight: '700',
      color: '#FFFFFF',
    },
  });
}
