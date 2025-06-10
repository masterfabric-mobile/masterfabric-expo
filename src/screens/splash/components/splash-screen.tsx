import React from 'react';
import { View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { getThemeColors } from '@/src/shared/constants/Colors';
import { useTheme } from '@/src/shared/contexts/theme-context';
import { useSplashViewModel } from '../hooks/use-splash-view-model';
import { splashScreenStyles } from '../styles/splash-screen.styles';
import { InfoSection } from './sections/info-section';
import { LogoSection } from './sections/logo-section';
import { ProgressSection } from './sections/progress-section';

export function SplashScreen() {
  const { currentTheme } = useTheme();
  const isDark = currentTheme === 'dark';
  const colors = getThemeColors(isDark);

  const { isLoading, progress, currentTask } = useSplashViewModel();
  
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