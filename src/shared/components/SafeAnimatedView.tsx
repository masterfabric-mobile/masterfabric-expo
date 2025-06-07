import React from 'react';
import { View, ViewProps } from 'react-native';
import Animated, { AnimatedProps } from 'react-native-reanimated';

interface SafeAnimatedViewProps extends AnimatedProps<ViewProps> {
  children?: React.ReactNode;
}

export function SafeAnimatedView({ children, ...props }: SafeAnimatedViewProps) {
  try {
    return (
      <Animated.View {...props}>
        {children}
      </Animated.View>
    );
  } catch (error) {
    console.error('SafeAnimatedView error:', error);
    // Fallback to regular View
    return (
      <View style={props.style}>
        {children}
      </View>
    );
  }
}