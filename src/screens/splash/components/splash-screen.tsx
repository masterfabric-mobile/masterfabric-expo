import { Image } from 'expo-image';
import React from 'react';
import { StyleSheet, useColorScheme, View } from 'react-native';
import Animated, {
    useAnimatedStyle,
    useSharedValue,
    withDelay,
    withSpring
} from 'react-native-reanimated';
import { SafeAreaView } from 'react-native-safe-area-context';

import { ThemedText } from '@/src/shared/components/ThemedText';
import { useLocale } from '@/src/shared/hooks/use-locale';
import { t } from '@/src/shared/i18n';
import { useSplashViewModel } from '../hooks/use-splash-view-model';

export function SplashScreen() {
  const colorScheme = useColorScheme();
  const { locale } = useLocale(); // This will trigger re-render on locale change
  const { isLoading, progress, currentTask } = useSplashViewModel();
  
  const logoScale = useSharedValue(0);
  const logoOpacity = useSharedValue(0);
  const textOpacity = useSharedValue(0);
  
  React.useEffect(() => {
    logoScale.value = withSpring(1, { damping: 15, stiffness: 100 });
    logoOpacity.value = withSpring(1, { damping: 15, stiffness: 100 });
    
    textOpacity.value = withDelay(
      500,
      withSpring(1, { damping: 15, stiffness: 100 })
    );
  }, []);
  
  const logoAnimatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: logoScale.value }],
    opacity: logoOpacity.value,
  }));
  
  const textAnimatedStyle = useAnimatedStyle(() => ({
    opacity: textOpacity.value,
  }));
  
  const isDark = colorScheme === 'dark';
  
  return (
    <SafeAreaView 
      style={[
        styles.container, 
        { backgroundColor: isDark ? '#0F0F0F' : '#FFFFFF' }
      ]}
    >
      <View style={styles.content}>
        <Animated.View style={[styles.logoContainer, logoAnimatedStyle]}>
          <Image
            source={require('@/src/assets/images/splash-icon.svg')}
            style={styles.logo}
            contentFit="contain"
          />
        </Animated.View>
        
        <Animated.View style={[styles.textContainer, textAnimatedStyle]}>
          <ThemedText type="title" style={styles.appName}>
            {t('splash.appName')}
          </ThemedText>
          <ThemedText type="subtitle" style={styles.tagline}>
            {t('splash.tagline')}
          </ThemedText>
        </Animated.View>
        
        {isLoading && (
          <View style={styles.loadingContainer}>
            <View style={[
              styles.progressBar,
              { backgroundColor: isDark ? '#333' : '#E5E5E5' }
            ]}>
              <Animated.View 
                style={[
                  styles.progressFill,
                  { 
                    width: `${progress}%`,
                    backgroundColor: isDark ? '#007AFF' : '#0066CC'
                  }
                ]}
              />
            </View>
            {currentTask && (
              <ThemedText 
                type="default" 
                style={[
                  styles.loadingText,
                  { color: isDark ? '#FFFFFF' : '#666666' }
                ]}
              >
                {currentTask}
              </ThemedText>
            )}
          </View>
        )}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 40,
  },
  logoContainer: {
    marginBottom: 40,
  },
  logo: {
    width: 120,
    height: 120,
  },
  textContainer: {
    alignItems: 'center',
    marginBottom: 60,
  },
  appName: {
    fontSize: 32,
    fontWeight: '700',
    marginBottom: 8,
    textAlign: 'center',
  },
  tagline: {
    fontSize: 16,
    opacity: 0.7,
    textAlign: 'center',
  },
  loadingContainer: {
    position: 'absolute',
    bottom: 80,
    left: 40,
    right: 40,
  },
  progressBar: {
    height: 4,
    borderRadius: 2,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    borderRadius: 2,
  },
  loadingText: {
    fontSize: 14,
    textAlign: 'center',
    marginTop: 12,
    opacity: 0.8,
  },
});