# 2. Home View (Dashboard)

The home screen is the main screen the user sees when opening the app. It provides a modern dashboard experience with a dark theme.

## 🎨 Design

### Dark Theme Colors

```typescript
const colors = {
  background: '#000000',        // Pure black
  cardBackground: '#1C1C1E',    // Dark grey card
  text: '#FFFFFF',              // White text
  textSecondary: '#8E8E93',     // Light grey secondary text
  primary: '#FF5722',           // Primary accent
  success: '#34C759',           // Green for VEGAN tag
  border: '#38383A',            // Border color
};
```

### Layout Structure

**Design note:** Quick Actions grid is not used. Only "Find Your Next Meal" card is shown. Header uses search icon (not notification/bell). Layout matches the design reference image.

```
+-----------------------------------------------------+
|  Dashboard                    [🔍]                  |
|  GOOD MORNING                                        |
|  Welcome, Alex!                                      |
+-----------------------------------------------------+
|  +-----------------------------------------------+  |
|  | CURRENT PLAN                    [Active]      |  |
|  | Pro Chef                                       |  |
|  | Monthly Recipes Saved                          |  |
|  | [████████████░░░░] 45/50                      |  |
|  +-----------------------------------------------+  |
+-----------------------------------------------------+
|  +-----------------------------------------------+  |
|  | [🍴]  Find Your Next Meal              [→]   |  |
|  |       Browse recipes by ingredients           |  |
|  |       you have on hand                        |  |
|  +-----------------------------------------------+  |
+-----------------------------------------------------+
|  Cook Tonight                          [View All]  |
|  ┌─────────┐ ┌─────────┐ ┌─────────┐              |
|  │ [Image] │ │ [Image] │ │ [Image] │              |
|  │ Recipe 1│ │ Recipe 2│ │ Recipe 3│              |
|  │ 20m Easy│ │ 30m Med │ │ 25m Easy│              |
|  └─────────┘ └─────────┘ └─────────┘              |
+-----------------------------------------------------+
|  Recent Activity                                    |
|  ┌─────────────────────────────────────────────┐  |
|  │ [Image] You saved Recipe Name     2h ago → │  |
|  └─────────────────────────────────────────────┘  |
|  ┌─────────────────────────────────────────────┐  |
|  │ [✓] Finished Recipe Name      Yesterday →  │  |
|  └─────────────────────────────────────────────┘  |
+-----------------------------------------------------+
|  [🏠 Home] [❤️ Saved] [🕐 History] [👤 Profile]  |
+-----------------------------------------------------+
```

## 🏗️ Architecture & Components

This view lives under `src/screens/home/`.

### File structure

```
src/screens/home/
├── components/
│   ├── home-screen.tsx              # Main container component
│   ├── dashboard-header.tsx         # Header (greeting, search icon — no notification icon)
│   ├── current-plan-card.tsx        # Current plan card
│   ├── find-recipes-card.tsx        # Single "Find Your Next Meal" card (only quick action)
│   ├── cook-tonight-section.tsx     # Cook Tonight horizontal scroll
│   └── recent-activity-section.tsx  # Recent Activity list
├── hooks/
│   └── use-home-view-model.ts      # View model hook (Supabase integration)
├── models/
│   └── home-models.ts              # Type definitions
├── styles/
│   ├── home-screen.styles.ts       # Container styles
│   └── dashboard.styles.ts         # Dashboard styles (Dark theme)
└── index.ts
```

### Core Components

#### HomeScreen
Main container. Organizes all sections inside a ScrollView.

```typescript
export function HomeScreen() {
  const { 
    isLoading, 
    userName, 
    greeting,
    currentPlan, 
    cookTonightRecipes, 
    recentActivities,
    handleFindRecipes,
  } = useHomeViewModel();

  return (
    <View style={homeScreenStyles.container}>
      <SafeAreaView style={homeScreenStyles.safeArea}>
        <ScrollView>
          <DashboardHeader greeting={greeting} userName={userName} onSearchPress={handleFindRecipes} />
          <CurrentPlanCard {...currentPlan} />
          <FindRecipesCard onPress={handleFindRecipes} />
          <CookTonightSection recipes={cookTonightRecipes} />
          <RecentActivitySection activities={recentActivities} />
        </ScrollView>
      </SafeAreaView>
    </View>
  );
}
```

#### DashboardHeader
User greeting section. Shows greeting and user name. **Search icon** in header (no notification/bell icon). Search navigates to ingredient input.

```typescript
export function DashboardHeader({ greeting, userName, avatarUrl, onSearchPress }: Props) {
  return (
    <View style={dashboardStyles.header}>
      <Text style={dashboardStyles.dashboardLabel}>Dashboard</Text>
      <View style={dashboardStyles.headerContent}>
        <View style={dashboardStyles.profileSection}>
          <Image source={{ uri: avatarUrl }} style={dashboardStyles.avatar} />
          <View>
            <Text style={dashboardStyles.greetingText}>{greeting}</Text>
            <Text style={dashboardStyles.userNameText}>Welcome, {userName}!</Text>
          </View>
        </View>
        <TouchableOpacity style={dashboardStyles.searchButton} onPress={onSearchPress}>
          <Ionicons name="search" size={24} color="#FFFFFF" />
        </TouchableOpacity>
      </View>
    </View>
  );
}
```

#### CurrentPlanCard
Shows the user's current plan and progress.

```typescript
export function CurrentPlanCard({ planName, isActive, recipesSaved, recipesLimit }: Props) {
  const progress = (recipesSaved / recipesLimit) * 100;
  
  return (
    <View style={dashboardStyles.planCard}>
      <View style={dashboardStyles.planHeader}>
        <Text style={dashboardStyles.planTitle}>CURRENT PLAN</Text>
        <View style={dashboardStyles.planStatus}>
          <View style={dashboardStyles.planStatusBadge}>
            <MaterialIcons name="check" size={14} color="#FFFFFF" />
          </View>
          <Text style={dashboardStyles.planStatusText}>Active</Text>
        </View>
      </View>
      <Text style={dashboardStyles.planName}>{planName}</Text>
      <Text style={dashboardStyles.planDescription}>Monthly Recipes Saved</Text>
      <View style={dashboardStyles.progressBarContainer}>
        <View style={[dashboardStyles.progressBar, { width: `${progress}%` }]} />
        <Text style={dashboardStyles.progressText}>{recipesSaved}/{recipesLimit}</Text>
      </View>
    </View>
  );
}
```

#### FindRecipesCard
Single prominent card for "Find Your Next Meal". **Only quick action** — no Quick Actions grid. Matches design reference.

```typescript
export function FindRecipesCard({ onPress }: { onPress: () => void }) {
  return (
    <TouchableOpacity style={dashboardStyles.findRecipesCard} onPress={onPress}>
      <View style={dashboardStyles.findRecipesIconContainer}>
        <Ionicons name="restaurant" size={32} color="#FF5722" />
      </View>
      <View style={dashboardStyles.findRecipesContent}>
        <Text style={dashboardStyles.findRecipesTitle}>Find Your Next Meal</Text>
        <Text style={dashboardStyles.findRecipesSubtitle}>
          Browse recipes by ingredients you have on hand
        </Text>
      </View>
      <Ionicons name="chevron-forward" size={24} color="#FF5722" />
    </TouchableOpacity>
  );
}
```

#### CookTonightSection
Shows random recipes from Supabase in a horizontal scroll.

```typescript
export function CookTonightSection({ recipes, onViewAll, onRecipePress }: Props) {
  return (
    <View style={dashboardStyles.cookTonightSection}>
      <View style={dashboardStyles.sectionHeader}>
        <Text style={dashboardStyles.sectionTitle}>Cook Tonight</Text>
        {onViewAll && (
          <TouchableOpacity onPress={onViewAll}>
            <Text style={dashboardStyles.viewAllText}>View All</Text>
          </TouchableOpacity>
        )}
      </View>
      
      {recipes.length === 0 ? (
        <View style={dashboardStyles.emptyRecipesContainer}>
          <Text style={dashboardStyles.emptyRecipesText}>
            No recipes available. Add some ingredients to find recipes!
          </Text>
        </View>
      ) : (
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          {recipes.map(recipe => (
            <TouchableOpacity key={recipe.id} style={dashboardStyles.recipeCard}>
              <Image source={{ uri: recipe.imageUrl }} style={dashboardStyles.recipeImage} />
              <Text style={dashboardStyles.recipeTitle}>{recipe.title}</Text>
              <View style={dashboardStyles.recipeMeta}>
                <Text>{recipe.time}</Text>
                <Text>•</Text>
                <Text>{recipe.difficulty}</Text>
              </View>
            </TouchableOpacity>
          ))}
        </ScrollView>
      )}
    </View>
  );
}
```

#### RecentActivitySection
Kullanıcının son aktivitelerini listeler.

```typescript
export function RecentActivitySection({ activities }: Props) {
  return (
    <View style={dashboardStyles.recentActivitySection}>
      <Text style={dashboardStyles.sectionTitle}>Recent Activity</Text>
      <View style={dashboardStyles.activitiesList}>
        {activities.map(activity => (
          <TouchableOpacity key={activity.id} style={dashboardStyles.activityCard}>
            {activity.type === 'saved' && activity.recipeImageUrl ? (
              <Image source={{ uri: activity.recipeImageUrl }} style={dashboardStyles.activityImage} />
            ) : (
              <View style={dashboardStyles.activityIconContainer}>
                <MaterialIcons name="check-circle" size={24} color="#FF5722" />
              </View>
            )}
            <View style={dashboardStyles.activityTextContent}>
              <Text style={dashboardStyles.activityTitle}>
                {activity.type === 'saved' ? `You saved ${activity.recipeTitle}` : `Finished ${activity.recipeTitle}`}
              </Text>
              <Text style={dashboardStyles.activityTime}>{activity.timeAgo}</Text>
            </View>
            <MaterialIcons name="chevron-right" size={24} color="#8E8E93" />
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
}
```

#### BottomTabs
Bottom tab navigation. Fixed position.

```typescript
const bottomTabs = [
  { id: 'home', label: 'Home', icon: '🏠', isActive: true, onPress: () => {} },
  { id: 'saved', label: 'Saved', icon: '❤️', isActive: false, onPress: () => {} },
  { id: 'history', label: 'History', icon: '🕐', isActive: false, onPress: () => {} },
  { id: 'profile', label: 'Profile', icon: '👤', isActive: false, onPress: () => {} },
];

export function BottomTabs({ tabs }: Props) {
  return (
    <View style={dashboardStyles.bottomTabsContainer}>
      {tabs.map(tab => (
        <TouchableOpacity key={tab.id} style={dashboardStyles.tabItem}>
          <MaterialIcons 
            name={getIconName(tab.icon)} 
            size={24} 
            color={tab.isActive ? '#FF5722' : '#FFFFFF'} 
          />
          <Text style={[dashboardStyles.tabLabel, tab.isActive && dashboardStyles.tabLabelActive]}>
            {tab.label}
          </Text>
        </TouchableOpacity>
      ))}
    </View>
  );
}
```

## 📊 State Management

### View Model Hook

```typescript
// src/screens/home/hooks/use-home-view-model.ts
export function useHomeViewModel() {
  const [state, setState] = useState<HomeState>({
    isLoading: true,
    userName: 'Alex',
    currentPlan: {
      name: 'Pro Chef',
      isActive: true,
      recipesSaved: 45,
      recipesLimit: 50,
    },
    cookTonightRecipes: [],
    recentActivities: [],
  });

  useEffect(() => {
    const loadData = async () => {
      try {
        setState(prev => ({ ...prev, isLoading: true }));

        // Load user profile
        const userProfile = await getCurrentUserProfile();
        
        // Load cook tonight recipes (random from Supabase)
        const recipes = await getCookTonightRecipes({ limit: 5 });
        
        // Load recent activities
        const activities = await getRecentActivities(5);
        
        // Load monthly recipes count
        const monthlyCount = await getMonthlyRecipesCount();

        setState({
          isLoading: false,
          userName: userProfile?.name || 'Alex',
          currentPlan: {
            name: userProfile?.currentPlan.name || 'Pro Chef',
            isActive: userProfile?.currentPlan.isActive ?? true,
            recipesSaved: monthlyCount.saved,
            recipesLimit: monthlyCount.limit,
          },
          cookTonightRecipes: recipes,
          recentActivities: activities,
        });
      } catch (error) {
        console.error('Error loading home data:', error);
        setState(prev => ({ ...prev, isLoading: false }));
      }
    };

    loadData();
  }, []);

  return {
    ...state,
    greeting: getGreeting(),
  };
}
```

## 🗄️ Data Fetching

### Supabase Queries

**Cook Tonight Recipes:**
```typescript
// src/shared/services/recipe-service.ts
export async function getCookTonightRecipes(filters?: RecipeFilters): Promise<Recipe[]> {
  const supabase = getSupabaseClient();
  
  // Fetch random recipes
  let query = supabase
    .from('recipes')
    .select('*')
    .limit(filters?.limit || 5);

  const { data, error } = await query;
  
  // Shuffle and map
  return mappedRecipes;
}
```

**Recent Activities:**
```typescript
export async function getRecentActivities(limit: number = 5): Promise<Activity[]> {
  const supabase = getSupabaseClient();
  
  const { data, error } = await supabase
    .from('user_activities')
    .select('*, recipes(*)')
    .order('created_at', { ascending: false })
    .limit(limit);

  return mappedActivities;
}
```

**Monthly Recipes Count:**
```typescript
export async function getMonthlyRecipesCount(): Promise<{ saved: number; limit: number }> {
  const supabase = getSupabaseClient();
  
  const now = new Date();
  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

  const { count, error } = await supabase
    .from('user_activities')
    .select('*', { count: 'exact', head: true })
    .eq('type', 'saved')
    .gte('created_at', startOfMonth.toISOString());

  return {
    saved: count || 0,
    limit: 50,
  };
}
```

## 🧭 Navigation Flow

```
Home Screen
    ↓
    ├─→ [Search icon] / [Find Your Next Meal] → Enter Ingredients Screen
    ├─→ [Recipe Card] → Recipe Detail Screen (later phase)
    ├─→ [Activity Item] → Recipe Detail Screen (later phase)
    └─→ [Bottom Tab] → Saved, History, Profile screens
```

## 🎨 Styling

### Dark Theme Styles

```typescript
// src/screens/home/styles/dashboard.styles.ts
import { StyleSheet } from 'react-native';

const colors = {
  background: '#000000',
  cardBackground: '#1C1C1E',
  text: '#FFFFFF',
  textSecondary: '#8E8E93',
  primary: '#FF5722',
  success: '#34C759',
  border: '#38383A',
};

export const dashboardStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 20,
    backgroundColor: colors.background,
  },
  planCard: {
    backgroundColor: colors.cardBackground,
    borderRadius: 12,
    padding: 20,
    marginHorizontal: 20,
    marginBottom: 24,
  },
  // ... other styles
});
```

## 📝 Translation Keys

```json
{
  "home": {
    "dashboard": "Dashboard",
    "greeting": {
      "goodMorning": "GOOD MORNING",
      "goodAfternoon": "GOOD AFTERNOON",
      "goodEvening": "GOOD EVENING",
      "welcome": "Welcome, {name}!"
    },
    "currentPlan": {
      "title": "CURRENT PLAN",
      "active": "Active",
      "monthlyRecipes": "Monthly Recipes Saved"
    },
    "findRecipesCard": {
      "title": "Find Your Next Meal",
      "subtitle": "Browse recipes by ingredients you have on hand"
    },
    "cookTonight": {
      "title": "Cook Tonight",
      "viewAll": "View All",
      "empty": "No recipes available. Add some ingredients to find recipes!"
    },
    "recentActivity": {
      "title": "Recent Activity",
      "saved": "You saved {recipeName}",
      "finished": "Finished {recipeName}"
    },
    "bottomTabs": {
      "home": "Home",
      "saved": "Saved",
      "history": "History",
      "profile": "Profile"
    }
  }
}
```

## 🔗 Related Components

- [DashboardHeader](./components/dashboard-header.tsx) - Header (search icon, no notification)
- [CurrentPlanCard](./components/current-plan-card.tsx) - Plan card component
- [FindRecipesCard](./components/find-recipes-card.tsx) - Single "Find Your Next Meal" card
- [CookTonightSection](./components/cook-tonight-section.tsx) - Cook tonight section
- [RecentActivitySection](./components/recent-activity-section.tsx) - Recent activity section

---

**Last updated:** 2025-02-10  
**Version:** 1.0.0  
**Status:** Complete
