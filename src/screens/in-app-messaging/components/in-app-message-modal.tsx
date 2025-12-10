import { Ionicons } from '@expo/vector-icons';
import { getThemeColors, useTheme } from 'masterfabric-expo-core';
import React, { useEffect } from 'react';
import { Image, Pressable, Text, TouchableOpacity, View } from 'react-native';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import Animated, {
  runOnJS,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withTiming,
} from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { InAppMessage } from '../models/in-app-message-models';
import {
  inAppMessageModalDarkStyles,
  inAppMessageModalStyles,
} from '../styles/in-app-message-modal.styles';

interface InAppMessageModalProps {
  message: InAppMessage;
  visible: boolean;
  onDismiss: () => void;
  onAction?: () => void;
  onAction2?: () => void;
}

export function InAppMessageModal({
  message,
  visible,
  onDismiss,
  onAction,
  onAction2,
}: InAppMessageModalProps) {
  const { currentTheme } = useTheme();
  const isDark = currentTheme === 'dark';
  const colors = getThemeColors(isDark);
  const insets = useSafeAreaInsets();

  const isCenter = message.position === 'center' || message.style === 'card';
  
  const translateY = useSharedValue(isCenter ? 0 : -400);
  const scale = useSharedValue(isCenter ? 0.8 : 1);
  const opacity = useSharedValue(0);
  const backdropOpacity = useSharedValue(0);

  const styles = isDark
    ? { ...inAppMessageModalStyles, ...inAppMessageModalDarkStyles }
    : inAppMessageModalStyles;

  // Get colors from message or fallback to theme
  const backgroundColor =
    message.backgroundColor || (isDark ? '#1C1C1E' : '#FFFFFF');
  const textColor = message.textColor || (isDark ? '#FFFFFF' : '#000000');
  const buttonBackgroundColor =
    message.buttonBackgroundColor || colors.tint;
  const buttonTextColor = message.buttonTextColor || '#FFFFFF';
  const button2BackgroundColor =
    message.button2BackgroundColor || (isDark ? '#2C2C2E' : '#F5F5F5');
  const button2TextColor = message.button2TextColor || textColor;

  useEffect(() => {
    if (visible) {
      if (isCenter) {
        // Center card: scale and fade in from center
        scale.value = withSpring(1, {
          damping: 20,
          stiffness: 100,
          mass: 0.7,
        });
        translateY.value = 0;
      } else {
        // Top modal: slide down from top
        translateY.value = withSpring(0, {
          damping: 25,
          stiffness: 120,
          mass: 0.8,
        });
        scale.value = 1;
      }
      opacity.value = withTiming(1, { duration: 300 });
      backdropOpacity.value = withTiming(1, { duration: 300 });
    } else {
      if (isCenter) {
        // Center card: scale down and fade out
        scale.value = withTiming(0.8, { duration: 200 });
        translateY.value = 0;
      } else {
        // Top modal: slide up and fade out
        translateY.value = withTiming(-400, { duration: 250 });
        scale.value = 1;
      }
      opacity.value = withTiming(0, { duration: 200 });
      backdropOpacity.value = withTiming(0, { duration: 200 });
    }
  }, [visible, translateY, scale, opacity, backdropOpacity, isCenter]);

  const modalAnimatedStyle = useAnimatedStyle(() => ({
    transform: [
      { translateY: translateY.value },
      { scale: scale.value },
    ],
    opacity: opacity.value,
  }));

  const backdropAnimatedStyle = useAnimatedStyle(() => ({
    opacity: backdropOpacity.value,
  }));

  // Swipe down gesture to dismiss
  const panGesture = Gesture.Pan()
    .onUpdate((event) => {
      if (event.translationY > 0) {
        translateY.value = event.translationY;
      }
    })
    .onEnd((event) => {
      if (event.translationY > 100 || event.velocityY > 500) {
        // Dismiss if swiped down enough
        translateY.value = withSpring(-400, {
          damping: 15,
          stiffness: 150,
        });
        opacity.value = withTiming(0, { duration: 200 });
        backdropOpacity.value = withTiming(0, { duration: 200 }, () => {
          runOnJS(onDismiss)();
        });
      } else {
        // Spring back
        translateY.value = withSpring(0, {
          damping: 15,
          stiffness: 150,
        });
      }
    });

  if (!visible) {
    return null;
  }

  return (
    <>
      {/* Backdrop */}
      <Animated.View
        style={[
          styles.backdrop,
          backdropAnimatedStyle,
          { zIndex: 999 },
        ]}
      >
        <Pressable
          style={{ flex: 1 }}
          onPress={onDismiss}
          accessibilityRole="button"
          accessibilityLabel="Dismiss message"
        />
      </Animated.View>

      {/* Modal */}
      <Animated.View
        style={[
          isCenter ? styles.containerCenter : styles.container,
          modalAnimatedStyle,
          !isCenter && { paddingTop: insets.top + 16 },
        ]}
      >
        {isCenter ? (
          <Animated.View
            style={[
              styles.modalCenter,
              {
                backgroundColor,
                shadowColor: isDark ? '#FFFFFF' : '#000000',
              },
            ]}
          >
            {/* Image */}
            {message.imageUrl && (
              <View style={styles.imageContainer}>
                <Image
                  source={{ uri: message.imageUrl }}
                  style={styles.image}
                  resizeMode="cover"
                />
              </View>
            )}

            {/* Content */}
            <View style={isCenter ? (styles.contentCenter || styles.content) : styles.content}>
              {/* Header */}
              <View style={styles.header}>
                <Text
                  style={[
                    isCenter ? (styles.titleCenter || styles.title) : styles.title,
                    { color: textColor },
                  ]}
                  numberOfLines={2}
                >
                  {message.title}
                </Text>
                <TouchableOpacity
                  style={styles.closeButton}
                  onPress={onDismiss}
                  accessibilityRole="button"
                  accessibilityLabel="Close"
                >
                  <Ionicons
                    name="close"
                    size={18}
                    color={textColor}
                    style={styles.closeIcon}
                  />
                </TouchableOpacity>
              </View>

              {/* Message */}
              <Text
                style={[
                  isCenter ? (styles.messageCenter || styles.message) : styles.message,
                  { color: textColor },
                ]}
              >
                {message.message}
              </Text>

              {/* Action Buttons */}
              {(message.buttonText || message.button2Text) && (
                <View style={message.button2Text ? styles.buttonContainer : undefined}>
                  {message.buttonText && onAction && (
                    <TouchableOpacity
                      style={[
                        message.button2Text ? styles.buttonHalf : styles.button,
                        { backgroundColor: buttonBackgroundColor },
                      ]}
                      onPress={onAction}
                      accessibilityRole="button"
                      accessibilityLabel={message.buttonText}
                    >
                      <Text
                        style={[
                          styles.buttonText,
                          { color: buttonTextColor },
                        ]}
                      >
                        {message.buttonText}
                      </Text>
                    </TouchableOpacity>
                  )}
                  {message.button2Text && onAction2 && (
                    <TouchableOpacity
                      style={[
                        message.buttonText ? styles.buttonHalf : styles.button,
                        { backgroundColor: button2BackgroundColor },
                      ]}
                      onPress={onAction2}
                      accessibilityRole="button"
                      accessibilityLabel={message.button2Text}
                    >
                      <Text
                        style={[
                          styles.buttonText,
                          { color: button2TextColor },
                        ]}
                      >
                        {message.button2Text}
                      </Text>
                    </TouchableOpacity>
                  )}
                </View>
              )}
            </View>
          </Animated.View>
        ) : (
          <GestureDetector gesture={panGesture}>
            <Animated.View
              style={[
                styles.modal,
                {
                  backgroundColor,
                  shadowColor: isDark ? '#FFFFFF' : '#000000',
                },
              ]}
            >
              {/* Image */}
              {message.imageUrl && (
                <View style={styles.imageContainer}>
                  <Image
                    source={{ uri: message.imageUrl }}
                    style={styles.image}
                    resizeMode="cover"
                  />
                </View>
              )}

              {/* Content */}
              <View style={styles.content}>
                {/* Header */}
                <View style={styles.header}>
                  <Text
                    style={[
                      styles.title,
                      { color: textColor },
                    ]}
                    numberOfLines={2}
                  >
                    {message.title}
                  </Text>
                  <TouchableOpacity
                    style={styles.closeButton}
                    onPress={onDismiss}
                    accessibilityRole="button"
                    accessibilityLabel="Close"
                  >
                    <Ionicons
                      name="close"
                      size={18}
                      color={textColor}
                      style={styles.closeIcon}
                    />
                  </TouchableOpacity>
                </View>

                {/* Message */}
                <Text
                  style={[
                    styles.message,
                    { color: textColor },
                  ]}
                >
                  {message.message}
                </Text>

                {/* Action Buttons */}
                {(message.buttonText || message.button2Text) && (
                  <View style={message.button2Text ? styles.buttonContainer : undefined}>
                    {message.buttonText && onAction && (
                      <TouchableOpacity
                        style={[
                          message.button2Text ? styles.buttonHalf : styles.button,
                          { backgroundColor: buttonBackgroundColor },
                        ]}
                        onPress={onAction}
                        accessibilityRole="button"
                        accessibilityLabel={message.buttonText}
                      >
                        <Text
                          style={[
                            styles.buttonText,
                            { color: buttonTextColor },
                          ]}
                        >
                          {message.buttonText}
                        </Text>
                      </TouchableOpacity>
                    )}
                    {message.button2Text && onAction2 && (
                      <TouchableOpacity
                        style={[
                          message.buttonText ? styles.buttonHalf : styles.button,
                          { backgroundColor: button2BackgroundColor },
                        ]}
                        onPress={onAction2}
                        accessibilityRole="button"
                        accessibilityLabel={message.button2Text}
                      >
                        <Text
                          style={[
                            styles.buttonText,
                            { color: button2TextColor },
                          ]}
                        >
                          {message.button2Text}
                        </Text>
                      </TouchableOpacity>
                    )}
                  </View>
                )}
              </View>
            </Animated.View>
          </GestureDetector>
        )}
      </Animated.View>
    </>
  );
}

