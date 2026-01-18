# 2. Home View (Dashboard)

Ana sayfa, kullanıcının uygulamayı açtığında gördüğü merkezi ekrandır. Dark theme tasarımı ile modern bir dashboard deneyimi sunar.

## 🎨 Design

### Dark Theme Colors

```typescript
const colors = {
  background: '#000000',        // Pure black
  cardBackground: '#1C1C1E',    // Dark grey card
  text: '#FFFFFF',              // White text
  textSecondary: '#8E8E93',     // Light grey secondary text
  primary: '#FF9500',           // Orange accent
  success: '#34C759',           // Green for VEGAN tag
  border: '#38383A',            // Border color
};
```

### Layout Structure

```
+-----------------------------------------------------+
|  Dashboard                    [🔔]                  |
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
|  Quick Actions                                      |
|  +-----------+  +-----------+                      |
|  | ➕ Add    |  | 📅 Meal   |                      |
|  | Recipe    |  | Plan      |                      |
|  +-----------+  +-----------+                      |
|  +-----------+  +-----------+                      |
|  | 🛒 Grocer|  | 🔍 Find   |                      |
|  | ies      |  | Recipes   |                      |
|  +-----------+  +-----------+                      |
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

Bu görünüm `src/screens/home/` klasörü altında yer alır.

### Dosya Yapısı

```
src/screens/home/
├── components/
│   ├── home-screen.tsx              # Ana container component
│   ├── dashboard-header.tsx         # Header bölümü (greeting, user name)
│   ├── current-plan-card.tsx       # Current plan card
│   ├── quick-actions.tsx           # Quick actions grid
│   ├── cook-tonight-section.tsx    # Cook Tonight horizontal scroll
│   ├── recent-activity-section.tsx # Recent Activity list
│   └── bottom-tabs.tsx             # Bottom navigation tabs
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
Ana container component. ScrollView içinde tüm bölümleri organize eder.

```typescript
export function HomeScreen() {
  const { 
    isLoading, 
    userName, 
    greeting,
    currentPlan, 
    cookTonightRecipes, 
    recentActivities 
  } = useHomeViewModel();

  return (
    <View style={homeScreenStyles.container}>
      <SafeAreaView style={homeScreenStyles.safeArea}>
        <ScrollView>
          <DashboardHeader greeting={greeting} userName={userName} />
          <CurrentPlanCard {...currentPlan} />
          <QuickActions actions={quickActions} />
          <CookTonightSection recipes={cookTonightRecipes} />
          <RecentActivitySection activities={recentActivities} />
        </ScrollView>
      </SafeAreaView>
      <BottomTabs tabs={bottomTabs} />
    </View>
  );
}
```

#### DashboardHeader
Kullanıcı karşılama bölümü. Greeting ve kullanıcı adını gösterir.

```typescript
export function DashboardHeader({ greeting, userName, avatarUrl }: Props) {
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
        <TouchableOpacity style={dashboardStyles.notificationButton}>
          <MaterialIcons name="notifications" size={24} color="#FFFFFF" />
        </TouchableOpacity>
      </View>
    </View>
  );
}
```

#### CurrentPlanCard
Kullanıcının mevcut planını ve ilerlemesini gösterir.

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

#### QuickActions
Hızlı erişim butonları grid'i.

```typescript
const quickActions = [
  { id: '1', label: 'Add Recipe', icon: '➕', onPress: () => {} },
  { id: '2', label: 'Meal Plan', icon: '📅', onPress: () => {} },
  { id: '3', label: 'Groceries', icon: '🛒', onPress: () => {} },
  { id: '4', label: 'Find Recipes', icon: '🔍', onPress: () => router.push('/enter-ingredients') },
];

export function QuickActions({ actions }: Props) {
  return (
    <View style={dashboardStyles.quickActionsSection}>
      <Text style={dashboardStyles.sectionTitle}>Quick Actions</Text>
      <View style={dashboardStyles.quickActionsGrid}>
        {actions.map(action => (
          <TouchableOpacity key={action.id} style={dashboardStyles.quickActionButton}>
            <Text style={dashboardStyles.quickActionIcon}>{action.icon}</Text>
            <Text style={dashboardStyles.quickActionLabel}>{action.label}</Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
}
```

#### CookTonightSection
Supabase'den çekilen random tarifleri horizontal scroll ile gösterir.

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
                <MaterialIcons name="check-circle" size={24} color="#FF9500" />
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
Alt tab navigasyonu. Fixed position'da.

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
            color={tab.isActive ? '#FF9500' : '#FFFFFF'} 
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
    ├─→ [Find Recipes] → Enter Ingredients Screen
    ├─→ [Add Recipe] → (Future: Add Recipe Screen)
    ├─→ [Meal Plan] → (Future: Meal Plan Screen)
    ├─→ [Groceries] → (Future: Groceries Screen)
    ├─→ [Recipe Card] → Recipe Detail Screen (sonraki aşama)
    ├─→ [Activity Item] → Recipe Detail Screen (sonraki aşama)
    └─→ [Bottom Tab] → (Future: Saved, History, Profile screens)
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
  primary: '#FF9500',
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
  // ... diğer stiller
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
    "quickActions": {
      "title": "Quick Actions",
      "addRecipe": "Add Recipe",
      "mealPlan": "Meal Plan",
      "groceries": "Groceries",
      "findRecipes": "Find Recipes"
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

- [DashboardHeader](./components/dashboard-header.tsx) - Header component
- [CurrentPlanCard](./components/current-plan-card.tsx) - Plan card component
- [QuickActions](./components/quick-actions.tsx) - Quick actions component
- [CookTonightSection](./components/cook-tonight-section.tsx) - Cook tonight section
- [RecentActivitySection](./components/recent-activity-section.tsx) - Recent activity section
- [BottomTabs](./components/bottom-tabs.tsx) - Bottom tabs component

---

**Son Güncelleme:** 2025-01-18  
**Versiyon:** 1.0.0  
**Durum:** ✅ Tamamlandı
