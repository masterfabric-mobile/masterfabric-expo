import { ThemeProvider } from '@masterfabric-expo/core';
import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { useEffect } from 'react';
import { Platform, useWindowDimensions, View } from 'react-native';

SplashScreen.preventAutoHideAsync();

const MOBILE_WIDTH = 393;
const MOBILE_HEIGHT = 852;

export default function RootLayout() {
  const { height: windowHeight } = useWindowDimensions();

  useEffect(() => {
    SplashScreen.hideAsync();
  }, []);

  const stack = (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="index" />
      <Stack.Screen name="onboarding" />
      <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
      <Stack.Screen name="enter-ingredients" options={{ headerShown: false }} />
      <Stack.Screen name="recipe-search" options={{ headerShown: false }} />
      <Stack.Screen name="recipe-results" options={{ headerShown: false }} />
      <Stack.Screen name="recipe-detail/[id]" options={{ headerShown: false }} />
    </Stack>
  );

  if (Platform.OS === 'web') {
    const scale = Math.min(1, windowHeight / MOBILE_HEIGHT);
    return (
      <ThemeProvider>
        <View
          style={{
            flex: 1,
            minHeight: windowHeight,
            height: windowHeight,
            justifyContent: 'center',
            alignItems: 'center',
            backgroundColor: '#e8e8e8',
          }}
        >
          <View
            style={{
              width: MOBILE_WIDTH,
              height: MOBILE_HEIGHT,
              overflow: 'hidden',
              transform: [{ scale }],
              transformOrigin: 'center center',
            }}
          >
            {stack}
          </View>
        </View>
      </ThemeProvider>
    );
  }

  return (
    <ThemeProvider>
      {stack}
    </ThemeProvider>
  );
}
