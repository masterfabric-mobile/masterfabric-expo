import React from 'react';
import { StyleProp, View, ViewProps, ViewStyle } from 'react-native';
import Animated, { AnimatedProps } from 'react-native-reanimated';

interface SafeAnimatedViewProps extends AnimatedProps<ViewProps> {
  children?: React.ReactNode;
}

export function SafeAnimatedView({ children, style, ...props }: SafeAnimatedViewProps) {
  try {
    return (
      <Animated.View style={style} {...props}>
        {children}
      </Animated.View>
    );
  } catch (error) {
    console.error('SafeAnimatedView error:', error);
    // Fallback to regular View - filter out animated-specific props
    const { 
      entering, 
      exiting, 
      layout, 
      sharedTransitionTag, 
      sharedTransitionStyle,
      ...regularProps 
    } = props as any;
    
    const fallbackStyle = style as StyleProp<ViewStyle>;
    return (
      <View style={fallbackStyle} {...regularProps}>
        {children}
      </View>
    );
  }
}