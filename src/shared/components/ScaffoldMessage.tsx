import { Ionicons } from '@expo/vector-icons';
import { getThemeColors, useTheme } from 'masterfabric-expo-core';
import React, { useEffect } from 'react';
import { Animated, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

interface ScaffoldMessageProps {
  message: string;
  type?: 'success' | 'error' | 'warning' | 'info';
  duration?: number;
  visible: boolean;
  onHide: () => void;
  icon?: string;
}

export function ScaffoldMessage({
  message,
  type = 'info',
  duration = 3000,
  visible,
  onHide,
  icon
}: ScaffoldMessageProps) {
  const { currentTheme } = useTheme();
  const isDark = currentTheme === 'dark';
  const colors = getThemeColors(isDark);
  const insets = useSafeAreaInsets();
  const slideAnim = React.useRef(new Animated.Value(100)).current;
  const opacityAnim = React.useRef(new Animated.Value(0)).current;

  const getBackgroundColor = () => {
    switch (type) {
      case 'success':
        return colors.successColor;
      case 'error':
        return colors.errorColor;
      case 'warning':
        return colors.warningColor;
      case 'info':
      default:
        return colors.tint;
    }
  };

  const getIcon = () => {
    if (icon) return icon;
    switch (type) {
      case 'success':
        return 'checkmark-circle';
      case 'error':
        return 'close-circle';
      case 'warning':
        return 'warning';
      case 'info':
      default:
        return 'information-circle';
    }
  };

  useEffect(() => {
    if (visible) {
      // Slide up and fade in
      Animated.parallel([
        Animated.timing(slideAnim, {
          toValue: 0,
          duration: 400,
          useNativeDriver: true,
        }),
        Animated.timing(opacityAnim, {
          toValue: 1,
          duration: 400,
          useNativeDriver: true,
        }),
      ]).start();

      const timer = setTimeout(() => {
        // Slide down and fade out
        Animated.parallel([
          Animated.timing(slideAnim, {
            toValue: 100,
            duration: 400,
            useNativeDriver: true,
          }),
          Animated.timing(opacityAnim, {
            toValue: 0,
            duration: 400,
            useNativeDriver: true,
          }),
        ]).start(() => {
          onHide();
        });
      }, duration);

      return () => clearTimeout(timer);
    }
  }, [visible, slideAnim, opacityAnim, duration, onHide]);

  if (!visible) return null;

  return (
    <Animated.View
      style={[
        styles.container,
        {
          bottom: insets.bottom + 20,
          transform: [{ translateY: slideAnim }],
          opacity: opacityAnim,
        }
      ]}
    >
      <View style={[
        styles.content,
        {
          backgroundColor: getBackgroundColor(),
          shadowColor: isDark ? '#FFFFFF' : '#000000',
        }
      ]}>
        <View style={styles.iconContainer}>
          <Ionicons
            name={getIcon() as any}
            size={20}
            color="#FFFFFF"
          />
        </View>
        <Text style={styles.message} numberOfLines={2}>
          {message}
        </Text>
      </View>
    </Animated.View>
  );
}

// const { width } = Dimensions.get('window'); // Not used in current implementation

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    left: 16,
    right: 16,
    zIndex: 1000,
    elevation: 1000,
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 12,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  iconContainer: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  message: {
    flex: 1,
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '500',
    lineHeight: 20,
  },
});
