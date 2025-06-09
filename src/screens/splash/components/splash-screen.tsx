import React from 'react';
import { useColorScheme, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { useSplashViewModel } from '../hooks/use-splash-view-model';
import { splashScreenStyles } from '../styles/splash-screen.styles';
import { InfoSection } from './sections/info-section';
import { LogoSection } from './sections/logo-section';
import { ProgressSection } from './sections/progress-section';

export function SplashScreen() {
  const colorScheme = useColorScheme();

  const { isLoading, progress, currentTask } = useSplashViewModel();
  
  const isDark = colorScheme === 'dark';
  
  return (
    <SafeAreaView 
      style={[
        splashScreenStyles.container, 
        { backgroundColor: isDark ? '#0F0F0F' : '#FFFFFF' }
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