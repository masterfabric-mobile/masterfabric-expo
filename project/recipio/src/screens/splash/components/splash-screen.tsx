import { useRouter } from 'expo-router';
import { ThemedText, useMasterView, useThemeColors } from 'masterfabric-expo-core';
import { useEffect } from 'react';
import { ActivityIndicator, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export function SplashScreen() {
  const router = useRouter();
  const { trackActivity } = useMasterView();
  const colors = useThemeColors();

  useEffect(() => {
    trackActivity('splash_viewed');
    
    // Navigate to tabs after 2 seconds
    const timer = setTimeout(() => {
      trackActivity('splash_completed');
      router.replace('/(tabs)');
    }, 2000);

    return () => clearTimeout(timer);
  }, [router, trackActivity]);

  return (
    <SafeAreaView style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: colors.background }}>
      <View style={{ alignItems: 'center', gap: 16 }}>
        <ThemedText type="title" style={{ fontSize: 32, color: '#FF6B35' }}>
          Recipio
        </ThemedText>
        <ThemedText style={{ fontSize: 16, color: colors.actionDescription }}>
          Find recipes based on your ingredients
        </ThemedText>
        <ActivityIndicator size="large" color="#FF6B35" style={{ marginTop: 32 }} />
      </View>
    </SafeAreaView>
  );
}

