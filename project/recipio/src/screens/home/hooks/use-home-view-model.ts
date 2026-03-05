import { useCallback, useEffect } from 'react';
import { useRouter } from 'expo-router';
import { useFocusEffect } from '@react-navigation/native';
import {
  getCookTonightRecipes,
  getCurrentUserProfile,
  getMonthlyRecipesCount,
  getRecentFavoritesWithDates,
  getRecipesByIds,
} from '@/shared/services';
import { useI18n } from '@/shared/i18n';
import { useProfileStore } from '@/screens/profile/store/profile-store';
import { getDefaultAvatarUrl } from '@/screens/profile/utils/profile-utils';
import { getRelativeTimeKey } from '@/screens/notifications/utils/format-time';
import { useHomeStore } from '../store/home-store';
import type { ActivityItem, CurrentPlan, RecipeCard } from '../models/home-models';

const RECENT_ACTIVITY_LIMIT = 5;

type ActivityRow = { type: 'saved' | 'finished'; recipeId: number; dateIso: string };

function formatTimeAgo(iso: string, t: (key: string, params?: { count?: number }) => string): string {
  const { key, count } = getRelativeTimeKey(iso);
  return count !== undefined ? t(key, { count }) : t(key);
}

type GreetingKey = 'home.greetingMorning' | 'home.greetingAfternoon' | 'home.greetingEvening';

function getGreetingKey(): GreetingKey {
  const hour = new Date().getHours();
  if (hour < 12) return 'home.greetingMorning';
  if (hour < 18) return 'home.greetingAfternoon';
  return 'home.greetingEvening';
}

function mapRecipeToCard(
  r: { id: number; title: string; description: string; imageUrl: string; time: string; difficulty: string }
): RecipeCard {
  return {
    id: r.id,
    title: r.title,
    description: r.description,
    imageUrl: r.imageUrl,
    time: r.time,
    difficulty: r.difficulty,
  };
}

async function loadRecentActivities(
  locale: string,
  dietaryPreferences: Parameters<typeof getRecipesByIds>[1] extends { dietaryPreferences?: infer D } ? D : undefined,
  t: (key: string, params?: { count?: number }) => string
): Promise<ActivityItem[]> {
  const savedRows = await getRecentFavoritesWithDates(RECENT_ACTIVITY_LIMIT);
  const savedAsRows: ActivityRow[] = savedRows.map((r) => ({
    type: 'saved' as const,
    recipeId: r.recipe_id,
    dateIso: r.created_at,
  }));
  const merged = [...savedAsRows]
    .sort((a, b) => new Date(b.dateIso).getTime() - new Date(a.dateIso).getTime())
    .slice(0, RECENT_ACTIVITY_LIMIT);
  const recipeIds = [...new Set(merged.map((m) => m.recipeId))];
  const recipes = await getRecipesByIds(recipeIds, { locale, dietaryPreferences: dietaryPreferences ?? null });
  const recipeMap = new Map(recipes.map((r) => [r.id, r]));
  return merged
    .map((row) => {
      const recipe = recipeMap.get(row.recipeId);
      if (!recipe) return null;
      return {
        id: `${row.type}-${row.recipeId}-${row.dateIso}`,
        type: row.type,
        recipeId: row.recipeId,
        recipeTitle: recipe.title,
        recipeImageUrl: recipe.imageUrl || undefined,
        timeAgo: formatTimeAgo(row.dateIso, t),
      };
    })
    .filter((a): a is ActivityItem => a != null);
}

export function useHomeViewModel() {
  const router = useRouter();
  const { locale, t } = useI18n();
  const dietaryPreferences = useProfileStore((s) => s.settings.dietaryPreferences);
  const {
    isLoading,
    isRefreshing,
    profile,
    currentPlan,
    cookTonightRecipes,
    recentActivities,
    setLoading,
    setRefreshing,
    setHomeData,
  } = useHomeStore();

  const loadHomeData = useCallback(async () => {
    setLoading(true);
    try {
      const [userProfile, recipes, monthlyCount, recentActivitiesList] = await Promise.all([
        getCurrentUserProfile(),
        getCookTonightRecipes({
          limit: 6,
          locale,
          dietaryPreferences: dietaryPreferences ?? undefined,
        }),
        getMonthlyRecipesCount(),
        loadRecentActivities(locale, dietaryPreferences ?? undefined, t),
      ]);

      const greeting = t(getGreetingKey());
      setHomeData({
        profile: {
          userName: userProfile.name,
          greeting,
          avatarUrl: userProfile.avatarUrl ?? getDefaultAvatarUrl(userProfile.id ?? 'guest'),
        },
        currentPlan: {
          name: userProfile.currentPlan.name,
          isActive: userProfile.currentPlan.isActive,
          recipesSaved: monthlyCount.saved,
          recipesLimit: monthlyCount.limit,
        },
        cookTonightRecipes: recipes.map(mapRecipeToCard),
        recentActivities: recentActivitiesList,
      });
    } catch (error) {
      console.error('HomeViewModel: loadHomeData error', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [locale, dietaryPreferences, t, setLoading, setRefreshing, setHomeData]);

  useEffect(() => {
    loadHomeData();
  }, [loadHomeData]);

  useFocusEffect(
    useCallback(() => {
      loadHomeData();
    }, [loadHomeData])
  );

  const handleRefresh = useCallback(() => {
    setRefreshing(true);
    loadHomeData();
  }, [loadHomeData, setRefreshing]);

  const handleStoryPress = useCallback(
    (sectionId: string) => {
      router.push({ pathname: '/find-next-meal', params: { section: sectionId } });
    },
    [router]
  );

  const handleSearch = useCallback(() => {
    router.push('/recipe-search');
  }, [router]);

  const handleRecipePress = useCallback(
    (recipeId: number) => {
      router.push(`/recipe-detail/${recipeId}`);
    },
    [router]
  );

  const handlePlanPress = useCallback(() => {
    router.push('/profile');
  }, [router]);

  const handleViewAllCookTonight = useCallback(() => {
    router.push('/enter-ingredients');
  }, [router]);

  const handleCategoryPress = useCallback(
    (categorySlug: string) => {
      router.push({ pathname: '/recipe-results', params: { category: categorySlug } });
    },
    [router]
  );

  return {
    isLoading,
    isRefreshing,
    userName: profile.userName,
    greeting: profile.greeting,
    avatarUrl: profile.avatarUrl,
    currentPlan,
    cookTonightRecipes,
    recentActivities,
    handleRefresh,
    handleStoryPress,
    handleSearch,
    handleRecipePress,
    handlePlanPress,
    handleViewAllCookTonight,
    handleCategoryPress,
  };
}
