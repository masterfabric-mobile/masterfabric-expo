import React, { useEffect } from 'react';
import { useColorScheme, View } from 'react-native';
import Animated, {
    useAnimatedStyle,
    useSharedValue,
    withTiming,
} from 'react-native-reanimated';

import { ThemedText } from '@/src/shared/components/ThemedText';

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
    <View style={{
      width: '100%',
      paddingHorizontal: 40,
      marginBottom: 30,
    }}>
      {/* Progress Bar Container */}
      <View style={{
        height: 6,
        borderRadius: 3,
        overflow: 'hidden',
        width: '100%',
        backgroundColor: isDark ? '#333333' : '#E5E5E5',
        marginBottom: 16,
      }}>
        <Animated.View 
          style={[
            {
              height: '100%',
              borderRadius: 3,
              backgroundColor: isDark ? '#007AFF' : '#0066CC',
            },
            animatedProgressStyle
          ]}
        />
      </View>
      
      {/* Progress Text */}
      <ThemedText 
        type="default" 
        style={{
          fontSize: 14,
          textAlign: 'center',
          opacity: 0.8,
          color: isDark ? '#FFFFFF' : '#666666'
        }}
      >
        {`${Math.round(progress)}%`}
      </ThemedText>
      
      {/* Current Task */}
      {currentTask && (
        <ThemedText 
          type="default" 
          style={{
            fontSize: 14,
            textAlign: 'center',
            marginTop: 8,
            opacity: 0.6,
            color: isDark ? '#FFFFFF' : '#666666'
          }}
        >
          {currentTask}
        </ThemedText>
      )}
    </View>
  );
}
