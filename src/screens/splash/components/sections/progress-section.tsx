import React, { useEffect } from 'react';
import { useColorScheme, View } from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';

import { ThemedText } from '@/src/shared/components/ThemedText';
import { progressSectionStyles } from '../../styles/progress-section.styles';

interface ProgressSectionProps {
  progress: number;
  currentTask: string;
  isLoading: boolean;
}

export function ProgressSection({ progress, currentTask, isLoading }: ProgressSectionProps) {
  const isDark = useColorScheme() === 'dark';
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
        { backgroundColor: isDark ? '#333333' : '#E5E5E5' }
      ]}>
        <Animated.View 
          style={[
            progressSectionStyles.progressFill,
            { backgroundColor: isDark ? '#007AFF' : '#0066CC' },
            animatedProgressStyle
          ]}
        />
      </View>
      
      {/* Progress Text */}
      <ThemedText 
        type="default" 
        style={[
          progressSectionStyles.progressText,
          { color: isDark ? '#FFFFFF' : '#666666' }
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
            { color: isDark ? '#FFFFFF' : '#666666' }
          ]}
        >
          {currentTask}
        </ThemedText>
      )}
    </View>
  );
}
