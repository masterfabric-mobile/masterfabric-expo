/**
 * Global snackbar — success / error / info.
 * Mount once in root layout. Use useSnackbar() to show messages.
 * Responsive: fits screen width with horizontal margin, max width on large screens.
 */

import { Ionicons } from '@expo/vector-icons';
import React, { useEffect, useRef, useState } from 'react';
import { Animated, Platform, Pressable, StyleSheet, Text } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useSnackbarStore } from '@/shared/store/snackbar-store';
import { RecipioColors } from '@/shared/constants/recipio-colors';
import type { SnackbarType } from '@/shared/models/snackbar-models';

const HORIZONTAL_MARGIN = 16;
const MAX_SNACKBAR_WIDTH = 400;

function getWindowWidth(): number {
  if (typeof window !== 'undefined') return window.innerWidth;
  try {
    const { Dimensions } = require('react-native');
    return Dimensions.get('window').width;
  } catch {
    return MAX_SNACKBAR_WIDTH + HORIZONTAL_MARGIN * 2;
  }
}

const TYPE_CONFIG: Record<
  SnackbarType,
  { icon: keyof typeof Ionicons.glyphMap; bg: string; iconColor: string }
> = {
  success: {
    icon: 'checkmark-circle',
    bg: RecipioColors.success,
    iconColor: '#FFFFFF',
  },
  error: {
    icon: 'close-circle',
    bg: RecipioColors.error,
    iconColor: '#FFFFFF',
  },
  info: {
    icon: 'information-circle',
    bg: RecipioColors.cardBackground,
    iconColor: RecipioColors.primaryAccent,
  },
};

export function Snackbar() {
  const insets = useSafeAreaInsets();
  const visible = useSnackbarStore((s) => s.visible);
  const message = useSnackbarStore((s) => s.message);
  const type = useSnackbarStore((s) => s.type);
  const hide = useSnackbarStore((s) => s.hide);

  const [windowWidth, setWindowWidth] = useState(getWindowWidth);
  useEffect(() => {
    if (Platform.OS !== 'web' || typeof window === 'undefined') return;
    const onResize = () => setWindowWidth(getWindowWidth());
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, []);

  const availableWidth = windowWidth - HORIZONTAL_MARGIN * 2;
  const snackbarWidth = Math.min(
    availableWidth,
    MAX_SNACKBAR_WIDTH,
    Math.round(windowWidth * 0.92)
  );
  const snackbarLeft = (windowWidth - snackbarWidth) / 2;

  const translateY = useRef(new Animated.Value(100)).current;
  const opacity = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (visible) {
      translateY.setValue(100);
      opacity.setValue(0);
      Animated.parallel([
        Animated.spring(translateY, {
          toValue: 0,
          useNativeDriver: true,
          tension: 80,
          friction: 12,
        }),
        Animated.timing(opacity, {
          toValue: 1,
          duration: 200,
          useNativeDriver: true,
        }),
      ]).start();
    } else {
      Animated.timing(translateY, { toValue: 100, useNativeDriver: true }).start();
      opacity.setValue(0);
    }
  }, [visible]);

  if (!visible) return null;

  const config = TYPE_CONFIG[type];

  return (
    <Animated.View
      style={[
        styles.wrapper,
        {
          bottom: insets.bottom + 16,
          left: snackbarLeft,
          width: snackbarWidth,
          maxWidth: windowWidth - HORIZONTAL_MARGIN * 2,
          opacity,
          transform: [{ translateY }],
        },
      ]}
      pointerEvents="box-none"
    >
      <Pressable
        style={[styles.snackbar, { backgroundColor: config.bg }]}
        onPress={hide}
      >
        <Ionicons
          name={config.icon}
          size={22}
          color={config.iconColor}
          style={styles.icon}
        />
        <Text style={styles.message} numberOfLines={2}>
          {message}
        </Text>
      </Pressable>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    position: 'absolute',
    zIndex: 9999,
  },
  snackbar: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: RecipioColors.border,
    minHeight: 52,
  },
  icon: {
    marginRight: 12,
  },
  message: {
    flex: 1,
    minWidth: 0,
    fontSize: 15,
    color: RecipioColors.text,
    fontWeight: '500',
  },
});
