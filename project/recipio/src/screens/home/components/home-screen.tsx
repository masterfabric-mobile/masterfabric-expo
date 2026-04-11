import { useMemo, useState } from 'react';
import {
  ActivityIndicator,
  RefreshControl,
  ScrollView,
  View,
} from 'react-native';
import { useRecipioColors } from '@/shared/hooks/use-recipio-colors';
import { useHomeViewModel } from '../hooks/use-home-view-model';
import { CategoriesSection } from './categories-section';
import { CookTonightSection } from './cook-tonight-section';
import { DashboardHeader } from './dashboard-header';
import { RecentActivitySection } from './recent-activity-section';
import { StoriesStrip } from './stories-strip';
import { StoryViewerModal } from './story-viewer-modal';
import { createHomeStyles } from '../styles/home.styles';
import type { StorySectionId } from '../data/story-sections';

export function HomeScreen() {
  const colors = useRecipioColors();
  const homeStyles = useMemo(() => createHomeStyles(colors), [colors]);
  const [storySectionId, setStorySectionId] = useState<StorySectionId | null>(null);
  const {
    isLoading,
    isRefreshing,
    userName,
    greeting,
    avatarUrl,
    currentPlan,
    cookTonightRecipes,
    recentActivities,
    handleRefresh,
    handleSearch,
    handleRecipePress,
    handlePlanPress,
    handleViewAllCookTonight,
    handleCategoryPress,
  } = useHomeViewModel();

  if (isLoading && cookTonightRecipes.length === 0) {
    return (
      <View style={[homeStyles.container, homeStyles.loadingContainer]}>
        <ActivityIndicator size="large" color={colors.primaryAccent} />
      </View>
    );
  }

  return (
    <View style={homeStyles.container}>
      <ScrollView
        style={homeStyles.safeArea}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={isRefreshing}
            onRefresh={handleRefresh}
            tintColor={colors.primaryAccent}
          />
        }
      >
        <DashboardHeader
          homeStyles={homeStyles}
          greeting={greeting}
          userName={userName}
          avatarUrl={avatarUrl}
          onSearchPress={handleSearch}
          onProfilePress={handlePlanPress}
        />
        <StoriesStrip
          homeStyles={homeStyles}
          onStoryPress={(id) => setStorySectionId(id)}
        />
        <StoryViewerModal
          sectionId={storySectionId}
          onClose={() => setStorySectionId(null)}
        />
        <CategoriesSection homeStyles={homeStyles} onCategoryPress={handleCategoryPress} />
        <CookTonightSection
          homeStyles={homeStyles}
          recipes={cookTonightRecipes}
          onRecipePress={handleRecipePress}
          onViewAll={handleViewAllCookTonight}
        />
        <RecentActivitySection
          homeStyles={homeStyles}
          activities={recentActivities}
          onActivityPress={handleRecipePress}
        />
      </ScrollView>
    </View>
  );
}
