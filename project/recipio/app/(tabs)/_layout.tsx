import { RecipioColors } from '@/shared/constants/recipio-colors';
import { Ionicons } from '@expo/vector-icons';
import { Tabs } from 'expo-router';

const DASHBOARD_COLORS = {
  background: RecipioColors.background,
  tabBar: RecipioColors.cardBackground,
  active: RecipioColors.primaryAccent,
  inactive: RecipioColors.textSecondary,
};

export default function TabsLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarStyle: { backgroundColor: DASHBOARD_COLORS.tabBar },
        tabBarActiveTintColor: DASHBOARD_COLORS.active,
        tabBarInactiveTintColor: DASHBOARD_COLORS.inactive,
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'Home',
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="home" size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="favorites"
        options={{
          title: 'Saved',
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="heart" size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="history"
        options={{
          title: 'History',
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="time" size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: 'Profile',
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="person" size={size} color={color} />
          ),
        }}
      />
    </Tabs>
  );
}
