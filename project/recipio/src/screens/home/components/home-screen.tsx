import { useHomeViewModel } from '../hooks/use-home-view-model';
import { CookTonightSection } from './cook-tonight-section';
import { CurrentPlanCard } from './current-plan-card';
import { DashboardHeader } from './dashboard-header';
import { FindRecipesCard } from './find-recipes-card';
import { RecentActivitySection } from './recent-activity-section';
import { dashboardStyles } from '../styles/dashboard.styles';
import { ActivityIndicator, ScrollView, View } from 'react-native';

export function HomeScreen() {
  const {
    isLoading,
    userName,
    greeting,
    currentPlan,
    cookTonightRecipes,
    recentActivities,
    handleFindRecipes,
    handleSearch,
    handleRecipePress,
  } = useHomeViewModel();

  if (isLoading) {
    return (
      <View
        style={[
          dashboardStyles.container,
          { justifyContent: 'center', alignItems: 'center' },
        ]}
      >
        <ActivityIndicator size="large" color="#FF5722" />
      </View>
    );
  }

  return (
    <View style={dashboardStyles.container}>
      <ScrollView
        style={dashboardStyles.safeArea}
        showsVerticalScrollIndicator={false}
      >
        <DashboardHeader
          greeting={greeting}
          userName={userName}
          onSearchPress={handleSearch}
        />
        <CurrentPlanCard {...currentPlan} />
        <FindRecipesCard onPress={handleFindRecipes} />
        <CookTonightSection recipes={cookTonightRecipes} onRecipePress={handleRecipePress} />
        <RecentActivitySection activities={recentActivities} />
      </ScrollView>
    </View>
  );
}
