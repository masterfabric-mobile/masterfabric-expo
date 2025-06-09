import { Image } from 'expo-image';
import React from 'react';
import { View } from 'react-native';
import Animated, {
    useAnimatedStyle,
    useSharedValue,
    withDelay,
    withSpring
} from 'react-native-reanimated';

import { ThemedText } from '@/src/shared/components/ThemedText';
import { t } from '@/src/shared/i18n';

export function LogoSection() {
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
  
  return (
    <View style={{ alignItems: 'center' }}>
      <Animated.View style={logoAnimatedStyle}>
        <Image
          source={require('@/src/assets/images/splash-icon.svg')}
          style={{ width: 120, height: 120 }}
          contentFit="contain"
        />
      </Animated.View>
      
      <Animated.View style={[{ alignItems: 'center', marginTop: 20 }, textAnimatedStyle]}>
        <ThemedText type="title" style={{ fontSize: 32, fontWeight: '700', marginBottom: 8, textAlign: 'center' }}>
          {t('splash.appName')}
        </ThemedText>
        <ThemedText type="subtitle" style={{ fontSize: 16, opacity: 0.7, textAlign: 'center' }}>
          {t('splash.tagline')}
        </ThemedText>
      </Animated.View>
    </View>
  );
}
