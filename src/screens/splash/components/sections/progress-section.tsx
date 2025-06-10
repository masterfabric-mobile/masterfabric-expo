import React, { useEffect } from 'react';
import { View } from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';

import { ThemedText } from '@/src/shared/components/ThemedText';
import { getThemeColors } from '@/src/shared/constants/Colors';
import { useTheme } from '@/src/shared/contexts/theme-context';
import { progressSectionStyles } from '../../styles/progress-section.styles';

interface ProgressSectionProps {
  progress: number;
  currentTask: string;
  isLoading: boolean;
}

export function ProgressSection({ progress, currentTask, isLoading }: ProgressSectionProps) {
  const { currentTheme } = useTheme();
  const isDark = currentTheme === 'dark';
  const colors = getThemeColors(isDark);
  const progressWidth = useSharedValue(0);
  
  useEffect(() => {
    progressWidth.value = withTiming(progress, {
      duration: 500,
    });
  }, [progress]);
  
  const animatedProgressStyle = useAnimatedStyle(() => ({
    width: `${progressWidth.value}%`,
  }));
  
  if (!isLoading) return null;
  
  return (
    <View style={progressSectionStyles.loadingContainer}>
      {/* Progress Bar Container */}
      <View style={[
        progressSectionStyles.progressBar,
        { backgroundColor: colors.splashProgressBg }
      ]}>
        <Animated.View 
          style={[
            progressSectionStyles.progressFill,
            { backgroundColor: colors.splashProgress },
            animatedProgressStyle
          ]}
        />
      </View>
      
      {/* Progress Text */}
      <ThemedText 
        type="default" 
        style={[
          progressSectionStyles.progressText,
          { color: colors.splashText }
        ]}
      >
        {`${Math.round(progress)}%`}
      </ThemedText>
      
      {/* Current Task */}
      {currentTask && (
        <ThemedText 
          type="default" 
          style={[
            progressSectionStyles.taskText,
            { color: colors.splashSubtext }
          ]}
        >
          {currentTask}
        </ThemedText>
      )}
    </View>
  );
}
