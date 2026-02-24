/**
 * SnackbarQueue Component
 * 
 * Global snackbar queue renderer
 * Place this in your app root layout
 */

import { Ionicons } from '@expo/vector-icons';
import { getThemeColors } from 'masterfabric-expo-core';
import React, { useEffect, useRef } from 'react';
import { Animated, Pressable, StyleSheet, Text, useColorScheme, View } from 'react-native';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useSnackbar } from '../hooks/use-snackbar';
import type { SnackbarProps } from '../services/snackbar-service';

interface SingleSnackbarProps {
  snackbar: SnackbarProps;
  index: number;
  onDismiss: (id: string) => void;
}

function SingleSnackbar({ snackbar, index, onDismiss }: SingleSnackbarProps) {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';
  const colors = getThemeColors(isDark);
  const insets = useSafeAreaInsets();
  
  const [isExpanded, setIsExpanded] = React.useState(false);
  
  const translateY = useRef(new Animated.Value(100)).current;
  const translateX = useRef(new Animated.Value(0)).current;
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

  // Swipe to dismiss gesture - sağa kaydırınca kapanır
  const panGesture = Gesture.Pan()
    .activeOffsetX(10) // Minimum 10px horizontal hareket
    .failOffsetY([-10, 10]) // Dikey hareket varsa iptal et
    .onUpdate((event) => {
      // Sadece sağa kaydırmaya izin ver
      if (event.translationX > 0) {
        translateX.setValue(event.translationX);
        // Opacity'yi mesafeye göre azalt
        const newOpacity = Math.max(0, 1 - event.translationX / 250);
        opacity.setValue(newOpacity);
      }
    })
    .onEnd((event) => {
      const shouldDismiss = event.translationX > 80 || event.velocityX > 500;
      
      if (shouldDismiss) {
        // Sağa kaydırarak kaybol
        Animated.parallel([
          Animated.timing(translateX, {
            toValue: 500, // Ekran dışına çık
            duration: 250,
            useNativeDriver: true,
          }),
          Animated.timing(opacity, {
            toValue: 0,
            duration: 250,
            useNativeDriver: true,
          }),
        ]).start(() => onDismiss(snackbar.id));
      } else {
        // Geri gel (bounce efekti)
        Animated.parallel([
          Animated.spring(translateX, {
            toValue: 0,
            useNativeDriver: true,
            tension: 120,
            friction: 10,
          }),
          Animated.timing(opacity, {
            toValue: 1,
            duration: 200,
            useNativeDriver: true,
          }),
        ]).start();
      }
    });

  const getSnackbarColors = () => {
    // Check for custom color and icon
    const customBg = (snackbar as any).customColor;
    const customIcon = (snackbar as any).customIcon;
    
    // Default type icons - these should use Ionicons
    const defaultIcons = ['✅', '❌', '⚠️', 'ℹ️'];
    const shouldUseCustomIcon = customIcon && !defaultIcons.includes(customIcon);
    
    // Map custom icons to their type equivalents for color
    const getTypeFromIcon = (icon: string) => {
      if (icon === '✅') return 'success';
      if (icon === '❌') return 'error';
      if (icon === '⚠️') return 'warning';
      if (icon === 'ℹ️') return 'info';
      return null;
    };
    
    if (customBg) {
      const iconType = getTypeFromIcon(customIcon);
      
      return {
        background: customBg,
        icon: '#FFFFFF',
        iconName: iconType === 'success' ? 'checkmark-circle' as const :
                  iconType === 'error' ? 'close-circle' as const :
                  iconType === 'warning' ? 'warning' as const :
                  iconType === 'info' ? 'information-circle' as const :
                  'brush' as const,
        customIcon: shouldUseCustomIcon ? customIcon : undefined,
      };
    }

    switch (snackbar.type) {
      case 'success':
        return {
          background: colors.successColor,
          icon: '#FFFFFF',
          iconName: 'checkmark-circle' as const,
          customIcon: shouldUseCustomIcon ? customIcon : undefined,
        };
      case 'error':
        return {
          background: colors.errorColor,
          icon: '#FFFFFF',
          iconName: 'close-circle' as const,
          customIcon: shouldUseCustomIcon ? customIcon : undefined,
        };
      case 'warning':
        return {
          background: colors.warningColor,
          icon: '#FFFFFF',
          iconName: 'warning' as const,
          customIcon: shouldUseCustomIcon ? customIcon : undefined,
        };
      case 'info':
      default:
        return {
          background: colors.tint,
          icon: '#FFFFFF',
          iconName: 'information-circle' as const,
          customIcon: shouldUseCustomIcon ? customIcon : undefined,
        };
    }
  };

  const snackbarColors = getSnackbarColors();
  const isTop = snackbar.position === 'top';
  const isCenter = snackbar.position === 'center';
  
  // Calculate vertical offset for stacking
  const stackOffset = index * 68;
  const bottomPosition = isTop || isCenter ? undefined : insets.bottom + 16 + stackOffset;
  const topPosition = isTop ? insets.top + 16 + stackOffset : (isCenter ? '50%' : undefined);

  return (
    <GestureDetector gesture={panGesture}>
      <Animated.View
        style={[
          styles.container,
          isCenter ? {
            top: '50%',
            transform: [
              { translateY: -30 }, // Half of snackbar height (60px / 2)
              { translateX },
            ],
          } : {
            [isTop ? 'top' : 'bottom']: isTop ? topPosition : bottomPosition,
            transform: [
              { translateY: isTop ? Animated.multiply(translateY, -1) : translateY },
              { translateX },
            ],
          },
          {
            opacity,
            zIndex: 9999 - index,
            pointerEvents: 'auto',
          },
        ]}
      >
        <View
          style={[
            styles.snackbar,
            {
              backgroundColor: snackbarColors.background,
            },
          ]}
        >
          <View style={styles.contentContainer}>
            <View style={styles.iconContainer}>
              {snackbarColors.customIcon ? (
                <Text style={{ fontSize: 32, lineHeight: 32, color: '#FFFFFF' }}>
                  {snackbarColors.customIcon}
                </Text>
              ) : (
                <Ionicons
                  name={snackbarColors.iconName}
                  size={32}
                  color={snackbarColors.icon}
                />
              )}
            </View>
            
            <Pressable onPress={() => setIsExpanded(!isExpanded)} style={{ flex: 1 }}>
              <Text
                style={[
                  styles.message, 
                  { 
                    color: '#FFFFFF',
                    flex: undefined,
                    flexShrink: 1,
                  }
                ]}
                numberOfLines={isExpanded ? undefined : 3}
                ellipsizeMode="tail"
              >
                {snackbar.message}
              </Text>
            </Pressable>

          {snackbar.action && (
            <Pressable
              onPress={() => {
                snackbar.action?.onPress();
                onDismiss(snackbar.id);
              }}
              style={styles.actionButton}
            >
              <Text
                style={[
                  styles.actionText,
                  { 
                    color: '#FFFFFF',
                    // Bigger font for single icon/emoji
                    fontSize: snackbar.action.label.length <= 2 ? 28 : 14,
                  },
                ]}
              >
                {snackbar.action.label}
              </Text>
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
      </View>
    </Animated.View>
    </GestureDetector>
  );
}

export function SnackbarQueue() {
  const { snackbars, dismissSnackbar } = useSnackbar();

  if (snackbars.length === 0) return null;

  // Separate snackbars by position
  const centerSnackbars = snackbars.filter(s => s.position === 'center');
  const otherSnackbars = snackbars.filter(s => s.position !== 'center');

  // For center position, show only the latest one
  const displaySnackbars = [
    ...otherSnackbars,
    ...(centerSnackbars.length > 0 ? [centerSnackbars[centerSnackbars.length - 1]] : [])
  ];

  return (
    <>
      {displaySnackbars.map((snackbar, index) => (
        <SingleSnackbar
          key={snackbar.id}
          snackbar={snackbar}
          index={snackbar.position === 'center' ? 0 : index}
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
    minHeight: 60,
  },
  contentContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  iconContainer: {
    width: 36,
    height: 36,
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

