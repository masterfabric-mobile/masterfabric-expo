import { useTheme } from 'masterfabric-expo-core';
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
import { TOAST_ICONS, ToastMessage, ToastType } from '../models/toast-helper.models';
import { toastStyles } from '../styles/toast.styles';

interface ToastProps {
  toast: ToastMessage;
  onHide: () => void;
}

export function Toast({ toast, onHide }: ToastProps) {
  const { currentTheme } = useTheme();
  const isDark = currentTheme === 'dark';
  const isRTL = I18nManager.isRTL;

  const opacity = useSharedValue(0);
  const translateY = useSharedValue(-50);
  const translateX = useSharedValue(0);
  const scale = useSharedValue(0.8);

  const hideToast = () => {
    opacity.value = withTiming(0, { duration: 200, easing: Easing.ease });
    translateY.value = withTiming(-50, { duration: 200 }, () => {
      runOnJS(onHide)();
    });
  };

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

  useEffect(() => {
    const config = getAnimationConfig();
    
    if (!config) {
      opacity.value = 1;
      translateY.value = 0;
      scale.value = 1;
      return;
    }

    opacity.value = withTiming(1, { duration: config.duration, easing: Easing.ease });
    translateY.value = withSequence(
      withSpring(config.translateY, { damping: config.damping, stiffness: config.stiffness }),
      withSpring(0, { damping: config.damping, stiffness: config.stiffness })
    );
    scale.value = withSequence(
      withSpring(config.scale, { damping: config.damping, stiffness: config.stiffness }),
      withSpring(1, { damping: config.damping, stiffness: config.stiffness })
    );

    if (toast.duration !== 0) {
      const timer = setTimeout(hideToast, toast.duration || 4000);
      return () => clearTimeout(timer);
    }
  }, [opacity, translateY, scale, toast.duration]);

  const panGesture = Gesture.Pan()
    .onUpdate((e) => {
      translateX.value = e.translationX;
      opacity.value = withTiming(Math.max(0, 1 - Math.abs(e.translationX) / 100));
    })
    .onEnd((e) => {
      if (Math.abs(e.translationX) > 80) {
        translateX.value = withTiming(e.translationX > 0 ? 400 : -400, undefined, () => {
          runOnJS(onHide)();
        });
      } else {
        translateX.value = withSpring(0);
        opacity.value = withTiming(1);
      }
    });

  const tapGesture = Gesture.Tap().onEnd(() => {
    scale.value = withSequence(
      withSpring(0.95, { damping: 12, stiffness: 200 }),
      withSpring(1, { damping: 12, stiffness: 200 })
    );
    if (toast.onPress) {
      runOnJS(toast.onPress)();
    }
  });

  const composed = Gesture.Simultaneous(panGesture, tapGesture);

  const animatedStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
    transform: [
      { translateY: translateY.value },
      { translateX: translateX.value },
      { scale: scale.value },
    ],
  }));


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

  const getIconName = () => {
    if (toast.type === 'custom' && toast.customConfig?.icon) {
      return toast.customConfig.icon;
    }
    return TOAST_ICONS[toast.type as Exclude<ToastType, 'custom'>];
  };

  const getIconColor = () => {
    if (toast.type === 'custom' && toast.customConfig?.iconColor) {
      return toast.customConfig.iconColor;
    }
    return '#fff';
  };

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
        <Pressable
          onPress={hideToast}
          style={toastStyles.closeButton}
          accessible={true}
          accessibilityLabel="Bildirimi kapat"
          accessibilityRole="button"
        >
          <Text style={toastStyles.closeButtonText}>×</Text>
        </Pressable>
        <View style={toastStyles.contentContainer}>
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
          <View style={toastStyles.messageContainer}>
            <Text style={[toastStyles.toastText, { color: getTextColor() }]}>{toast.message}</Text>
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
