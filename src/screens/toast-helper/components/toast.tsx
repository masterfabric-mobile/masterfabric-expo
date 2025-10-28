import { TOAST_ICONS, ToastMessage, ToastType, useTheme } from 'masterfabric-expo-core';
import React, { useEffect } from 'react';
import { I18nManager, Pressable, Text, View } from 'react-native';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import Animated, {
    Easing,
    runOnJS,
    useAnimatedStyle,
    useSharedValue,
    withSequence,
    withSpring,
    withTiming,
} from 'react-native-reanimated';
import { IconSymbol } from '../../../shared/components/ui/IconSymbol';
import { toastStyles } from '../styles/toast.styles';

interface ToastProps {
  toast: ToastMessage;
  onHide: () => void;
}

/**
 * Toast Component
 * 
 * A highly interactive and animated toast notification component that supports:
 * - Multiple toast types (success, error, warning, info, custom)
 * - Customizable animations (light, medium, strong, none)
 * - Gesture interactions (tap, swipe to dismiss)
 * - RTL (Right-to-Left) language support
 * - Accessibility features
 * - Custom styling and colors
 * 
 * Features:
 * - Smooth entrance/exit animations
 * - Swipe-to-dismiss functionality
 * - Tap interactions
 * - Auto-dismiss timer
 * - Action buttons support
 * - Custom icon and color configuration
 * - Theme-aware styling
 */
export function Toast({ toast, onHide }: ToastProps) {
  // Get theme and RTL settings for proper styling
  const { currentTheme } = useTheme();
  const isDark = currentTheme === 'dark';
  const isRTL = I18nManager.isRTL;

  // Animation shared values for smooth transitions
  const opacity = useSharedValue(0);
  const translateY = useSharedValue(-50);
  const translateX = useSharedValue(0);
  const scale = useSharedValue(0.8);

  /**
   * Hide toast with smooth exit animation
   * Animates opacity and position, then calls onHide callback
   */
  const hideToast = () => {
    opacity.value = withTiming(0, { duration: 200, easing: Easing.ease });
    translateY.value = withTiming(-50, { duration: 200 }, () => {
      runOnJS(onHide)();
    });
  };

  /**
   * Get animation configuration based on toast animation strength
   * Returns different animation parameters for light, medium, strong, or none
   * @returns Animation configuration object or null for no animation
   */
  const getAnimationConfig = () => {
    switch (toast.animation) {
      case 'light':
        return {
          duration: 200,
          damping: 20,
          stiffness: 300,
          scale: 1.02,
          translateY: 5
        };
      case 'medium':
        return {
          duration: 400,
          damping: 15,
          stiffness: 200,
          scale: 1.1,
          translateY: 10
        };
      case 'strong':
        return {
          duration: 600,
          damping: 10,
          stiffness: 100,
          scale: 1.2,
          translateY: 20
        };
      case 'none':
      default:
        return null;
    }
  };

  /**
   * Handle toast entrance animation and auto-dismiss timer
   * Sets up initial animation based on toast configuration
   */
  useEffect(() => {
    const config = getAnimationConfig();
    
    // If no animation is configured, set static values
    if (!config) {
      opacity.value = 1;
      translateY.value = 0;
      scale.value = 1;
      return;
    }

    // Animate entrance with configured parameters
    opacity.value = withTiming(1, { duration: config.duration, easing: Easing.ease });
    translateY.value = withSequence(
      withSpring(config.translateY, { damping: config.damping, stiffness: config.stiffness }),
      withSpring(0, { damping: config.damping, stiffness: config.stiffness })
    );
    scale.value = withSequence(
      withSpring(config.scale, { damping: config.damping, stiffness: config.stiffness }),
      withSpring(1, { damping: config.damping, stiffness: config.stiffness })
    );

    // Set up auto-dismiss timer if duration is specified
    if (toast.duration !== 0) {
      const timer = setTimeout(hideToast, toast.duration || 4000);
      return () => clearTimeout(timer);
    }
  }, [opacity, translateY, scale, toast.duration]);

  /**
   * Pan gesture handler for swipe-to-dismiss functionality
   * Allows users to swipe horizontally to dismiss the toast
   */
  const panGesture = Gesture.Pan()
    .onUpdate((e) => {
      // Update position and opacity based on swipe distance
      translateX.value = e.translationX;
      opacity.value = withTiming(Math.max(0, 1 - Math.abs(e.translationX) / 100));
    })
    .onEnd((e) => {
      // If swipe distance exceeds threshold, dismiss toast
      if (Math.abs(e.translationX) > 80) {
        translateX.value = withTiming(e.translationX > 0 ? 400 : -400, undefined, () => {
          runOnJS(onHide)();
        });
      } else {
        // Otherwise, snap back to original position
        translateX.value = withSpring(0);
        opacity.value = withTiming(1);
      }
    });

  /**
   * Tap gesture handler for toast interactions
   * Provides visual feedback and executes onPress callback if available
   */
  const tapGesture = Gesture.Tap().onEnd(() => {
    // Provide visual feedback with scale animation
    scale.value = withSequence(
      withSpring(0.95, { damping: 12, stiffness: 200 }),
      withSpring(1, { damping: 12, stiffness: 200 })
    );
    // Execute toast onPress callback if provided
    if (toast.onPress) {
      runOnJS(toast.onPress)();
    }
  });

  // Combine pan and tap gestures to work simultaneously
  const composed = Gesture.Simultaneous(panGesture, tapGesture);

  /**
   * Animated style that combines all animation values
   * Used to apply smooth transitions to the toast container
   */
  const animatedStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
    transform: [
      { translateY: translateY.value },
      { translateX: translateX.value },
      { scale: scale.value },
    ],
  }));

  /**
   * Get background color based on toast type
   * Returns appropriate color for each toast type or custom color
   * @returns Background color string
   */
  const getBackgroundColor = () => {
    switch (toast.type) {
      case 'success':
        return '#4CAF50';
      case 'error':
        return '#F44336';
      case 'warning':
        return '#FF9800';
      case 'info':
        return '#2196F3';
      case 'custom':
        return toast.customConfig?.backgroundColor || '#9C27B0';
      default:
        return (toast.style as any)?.backgroundColor || '#9C27B0';
    }
  };

  /**
   * Get icon name based on toast type
   * Returns custom icon if specified, otherwise default icon for type
   * @returns Icon name string
   */
  const getIconName = () => {
    if (toast.type === 'custom' && toast.customConfig?.icon) {
      return toast.customConfig.icon;
    }
    return TOAST_ICONS[toast.type as Exclude<ToastType, 'custom'>];
  };

  /**
   * Get icon color based on toast configuration
   * Returns custom icon color if specified, otherwise default white
   * @returns Icon color string
   */
  const getIconColor = () => {
    if (toast.type === 'custom' && toast.customConfig?.iconColor) {
      return toast.customConfig.iconColor;
    }
    return '#fff';
  };

  /**
   * Get text color based on toast configuration
   * Returns custom text color if specified, otherwise default white
   * @returns Text color string
   */
  const getTextColor = () => {
    if (toast.type === 'custom' && toast.customConfig?.textColor) {
      return toast.customConfig.textColor;
    }
    return '#fff';
  };

  return (
    <GestureDetector gesture={composed}>
      <Animated.View
        style={[
          toastStyles.toast,
          { backgroundColor: getBackgroundColor() },
          animatedStyle,
        ]}
        accessible={true}
        accessibilityRole="alert"
        accessibilityLiveRegion="polite"
        accessibilityLabel={`${toast.type}: ${toast.message}`}
      >
        {/* Close button for manual dismissal */}
        <Pressable
          onPress={hideToast}
          style={toastStyles.closeButton}
          accessible={true}
          accessibilityLabel="Bildirimi kapat"
          accessibilityRole="button"
        >
          <Text style={toastStyles.closeButtonText}>×</Text>
        </Pressable>
        
        {/* Main content container */}
        <View style={toastStyles.contentContainer}>
          {/* Toast icon with RTL support */}
          <IconSymbol 
            name={getIconName()} 
            size={24} 
            color={getIconColor()} 
            style={{
              marginRight: isRTL ? 0 : 12,
              marginLeft: isRTL ? 12 : 0,
              alignSelf: 'flex-start',
            }}
          />
          
          {/* Message and action container */}
          <View style={toastStyles.messageContainer}>
            {/* Toast message text */}
            <Text style={[toastStyles.toastText, { color: getTextColor() }]}>{toast.message}</Text>
            
            {/* Optional action button */}
            {toast.action && (
              <Pressable
                onPress={() => {
                  toast.action?.onPress();
                  hideToast();
                }}
                style={[toastStyles.actionButton, toast.action.style]}
                accessible={true}
                accessibilityLabel={toast.action.text}
                accessibilityRole="button"
              >
                <Text style={toastStyles.actionButtonText}>{toast.action.text}</Text>
              </Pressable>
            )}
          </View>
        </View>
      </Animated.View>
    </GestureDetector>
  );
}
