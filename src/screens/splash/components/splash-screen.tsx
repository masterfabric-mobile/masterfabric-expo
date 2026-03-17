import React from 'react';
import { View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import {
    useMasterView,
    useThemeColors
} from 'masterfabric-expo-core';
import { useSplashViewModel } from '../hooks/use-splash-view-model';
import { splashScreenStyles } from '../styles/splash-screen.styles';
import { InfoSection } from './sections/info-section';
import { LogoSection } from './sections/logo-section';
import { ProgressSection } from './sections/progress-section';

// Hook-based MasterView implementation for Splash Screen
function SplashScreenContent() {
  const { isLoading, progress, currentTask } = useSplashViewModel();
  const { trackActivity, isDark } = useMasterView();
  const colors = useThemeColors();
  
  // Track activity when component mounts
  React.useEffect(() => {
    trackActivity('splash_initialized');
    
    return () => {
      trackActivity('splash_destroyed');
    };
  }, [trackActivity]);
  
  return (
    <SafeAreaView 
      style={[
        splashScreenStyles.container, 
        { backgroundColor: colors.splashBackground }
      ]}  
    > 
      {/* Top Section - Empty space or future content */}
      <View style={splashScreenStyles.topSection} />
      
      {/* Body Section - Logo and branding */}
      <View style={splashScreenStyles.bodySection}>
        <LogoSection />
      </View>
      
      {/* Bottom Section - Progress and info */}
      <View style={splashScreenStyles.bottomSection}>
        <ProgressSection 
          progress={progress}
          currentTask={currentTask}
          isLoading={isLoading}
        />
        <InfoSection />
      </View>
    </SafeAreaView>
  );
}

export function SplashScreen() {
  return <SplashScreenContent />;
}