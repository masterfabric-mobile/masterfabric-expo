/**
 * SnackbarQueue Component
 * 
 * Global snackbar queue renderer
 * Place this in your app root layout
 */

import { Ionicons } from '@expo/vector-icons';
import { getThemeColors, useTheme } from 'masterfabric-expo-core';
import React, { useEffect, useRef } from 'react';
import { Animated, Pressable, StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useSnackbar } from '../hooks/use-snackbar';
import type { SnackbarProps } from '../services/snackbar-service';
import { ThemedText } from './ThemedText';
import { ThemedView } from './ThemedView';

interface SingleSnackbarProps {
  snackbar: SnackbarProps;
  index: number;
  onDismiss: (id: string) => void;
}

function SingleSnackbar({ snackbar, index, onDismiss }: SingleSnackbarProps) {
  const { currentTheme } = useTheme();
  const isDark = currentTheme === 'dark';
  const colors = getThemeColors(isDark);
  const insets = useSafeAreaInsets();
  
  const translateY = useRef(new Animated.Value(100)).current;
  const opacity = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    // Animate in
    Animated.parallel([
      Animated.spring(translateY, {
        toValue: 0,
        useNativeDriver: true,
        tension: 100,
        friction: 10,
      }),
      Animated.timing(opacity, {
        toValue: 1,
        duration: 200,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  const getSnackbarColors = () => {
    switch (snackbar.type) {
      case 'success':
        return {
          background: isDark ? '#1B5E20' : '#4CAF50',
          icon: '#FFFFFF',
          iconName: 'checkmark-circle' as const,
        };
      case 'error':
        return {
          background: isDark ? '#B71C1C' : '#F44336',
          icon: '#FFFFFF',
          iconName: 'close-circle' as const,
        };
      case 'warning':
        return {
          background: isDark ? '#E65100' : '#FF9800',
          icon: '#FFFFFF',
          iconName: 'warning' as const,
        };
      case 'info':
      default:
        return {
          background: isDark ? '#0D47A1' : '#2196F3',
          icon: '#FFFFFF',
          iconName: 'information-circle' as const,
        };
    }
  };

  const snackbarColors = getSnackbarColors();
  const isTop = snackbar.position === 'top';
  
  // Calculate vertical offset for stacking
  const stackOffset = index * 72;
  const bottomPosition = isTop ? undefined : insets.bottom + 20 + stackOffset;
  const topPosition = isTop ? insets.top + 20 + stackOffset : undefined;

  return (
    <Animated.View
      style={[
        styles.container,
        {
          [isTop ? 'top' : 'bottom']: isTop ? topPosition : bottomPosition,
          transform: [
            { translateY: isTop ? Animated.multiply(translateY, -1) : translateY },
          ],
          opacity,
          zIndex: 9999 - index,
        },
      ]}
      pointerEvents="auto"
    >
      <ThemedView
        style={[
          styles.snackbar,
          {
            backgroundColor: snackbarColors.background,
          },
        ]}
      >
        <View style={styles.contentContainer}>
          <View style={styles.iconContainer}>
            <Ionicons
              name={snackbarColors.iconName}
              size={24}
              color={snackbarColors.icon}
            />
          </View>
          
          <ThemedText
            style={[styles.message, { color: '#FFFFFF' }]}
            numberOfLines={3}
          >
            {snackbar.message}
          </ThemedText>

          {snackbar.action && (
            <Pressable
              onPress={() => {
                snackbar.action?.onPress();
                onDismiss(snackbar.id);
              }}
              style={styles.actionButton}
            >
              <ThemedText
                style={[
                  styles.actionText,
                  { color: '#FFFFFF' },
                ]}
              >
                {snackbar.action.label}
              </ThemedText>
            </Pressable>
          )}
        </View>

        <Pressable
          onPress={() => onDismiss(snackbar.id)}
          style={styles.closeButton}
          hitSlop={8}
        >
          <Ionicons name="close" size={20} color="#FFFFFF" />
        </Pressable>
      </ThemedView>
    </Animated.View>
  );
}

export function SnackbarQueue() {
  const { snackbars, dismissSnackbar } = useSnackbar();

  if (snackbars.length === 0) return null;

  return (
    <>
      {snackbars.map((snackbar, index) => (
        <SingleSnackbar
          key={snackbar.id}
          snackbar={snackbar}
          index={index}
          onDismiss={dismissSnackbar}
        />
      ))}
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    left: 16,
    right: 16,
    zIndex: 99999,
  },
  snackbar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderRadius: 12,
    paddingVertical: 14,
    paddingHorizontal: 16,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
    minHeight: 56,
  },
  contentContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  iconContainer: {
    width: 24,
    height: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  message: {
    flex: 1,
    fontSize: 15,
    lineHeight: 20,
    fontWeight: '500',
  },
  actionButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    marginLeft: 8,
  },
  actionText: {
    fontSize: 14,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
  closeButton: {
    width: 32,
    height: 32,
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 8,
  },
});

