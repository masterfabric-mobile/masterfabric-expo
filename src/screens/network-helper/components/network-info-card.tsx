import { IconSymbol } from '@/src/shared/components/ui/IconSymbol';
import { getThemeColors, useTheme } from 'masterfabric-expo-core';
import React, { useEffect } from 'react';
import { Text, View } from 'react-native';
import Animated, { useAnimatedStyle, useSharedValue, withTiming } from 'react-native-reanimated';
import { networkHelperScreenStyles } from '../styles/network-helper-screen.styles';

interface NetworkInfoCardProps {
  title: string;
  icon: string;
  children: React.ReactNode;
  statusBadge?: {
    text: string;
    color: string;
  };
}

export function NetworkInfoCard({ title, icon, children, statusBadge }: NetworkInfoCardProps) {
  const { currentTheme } = useTheme();
  const isDark = currentTheme === 'dark';
  const colors = getThemeColors(isDark);

  return (
    <View
      style={[
        networkHelperScreenStyles.card,
        {
          backgroundColor: colors.surfaceBackground,
          borderColor: colors.surfaceBorder,
        },
      ]}
    >
      <View style={networkHelperScreenStyles.cardHeader}>
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
          <IconSymbol name={icon as any} size={20} color={colors.tint} />
          <Text style={[networkHelperScreenStyles.cardTitle, { color: colors.labelText }]}>
            {title}
          </Text>
        </View>
        {statusBadge && (
          <View
            style={[
              networkHelperScreenStyles.statusBadge,
              {
                backgroundColor: statusBadge.color,
                opacity: 0.2,
              },
            ]}
          >
            <Text style={{ color: statusBadge.color, fontWeight: '600' }}>{statusBadge.text}</Text>
          </View>
        )}
      </View>
      {children}
    </View>
  );
}

interface InfoRowProps {
  label: string;
  value: string | number | null;
  unit?: string;
  isLast?: boolean;
  delay?: number;
  showPlaceholder?: boolean;
  placeholder?: string;
}

export function InfoRow({ 
  label, 
  value, 
  unit, 
  isLast, 
  delay = 0,
  showPlaceholder = false,
  placeholder 
}: InfoRowProps) {
  const { currentTheme } = useTheme();
  const isDark = currentTheme === 'dark';
  const colors = getThemeColors(isDark);

  const opacity = useSharedValue(showPlaceholder ? 0.5 : 0);
  const translateY = useSharedValue(10);

  useEffect(() => {
    const timer = setTimeout(() => {
      opacity.value = withTiming(1, { duration: 300 });
      translateY.value = withTiming(0, { duration: 300 });
    }, delay);

    return () => clearTimeout(timer);
  }, [delay, opacity, translateY]);

  const animatedStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
    transform: [{ translateY: translateY.value }],
  }));

  const displayValue = value !== null && value !== undefined ? String(value) : (placeholder || 'N/A');
  const displayText = unit ? `${displayValue} ${unit}` : displayValue;
  const isPlaceholder = showPlaceholder && (value === null || value === undefined);

  return (
    <Animated.View
      style={[
        networkHelperScreenStyles.infoRow,
        isLast && networkHelperScreenStyles.infoRowLast,
        { borderBottomColor: colors.surfaceBorder },
        animatedStyle,
      ]}
    >
      <Text style={[networkHelperScreenStyles.infoLabel, { color: colors.bodyText }]}>
        {label}
      </Text>
      <Text 
        style={[
          networkHelperScreenStyles.infoValue, 
          { 
            color: isPlaceholder ? colors.bodyText : colors.titleText,
            opacity: isPlaceholder ? 0.6 : 1,
          }
        ]}
      >
        {displayText}
      </Text>
    </Animated.View>
  );
}

