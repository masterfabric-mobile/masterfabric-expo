import { ThemedText } from '@/src/shared/components/ThemedText';
import { ThemedView } from '@/src/shared/components/ThemedView';
import { Ionicons } from '@expo/vector-icons';
import { Sizing } from 'masterfabric-expo-core';
import { getThemeColors, useTheme } from 'masterfabric-expo-core';
import React from 'react';
import { View } from 'react-native';

export function IconExample() {
  const { currentTheme } = useTheme();
  const isDark = currentTheme === 'dark';
  const colors = getThemeColors(isDark);

  const iconSizes: Array<keyof typeof Sizing.icon> = [
    'xxs', 'xs', 's', 'm', 'l', 'xl', 'xxl', 'xxxl'
  ];

  const avatarSizes: Array<keyof typeof Sizing.avatar> = [
    'xxs', 'xs', 's', 'm', 'l', 'xl', 'xxl', 'xxxl'
  ];

  return (
    <ThemedView
      style={{
        backgroundColor: colors.cardBackground,
        borderRadius: Sizing.card.borderRadius.l,
        padding: Sizing.card.padding.medium,
        borderWidth: Sizing.borderWidth.s,
        borderColor: colors.surfaceBorder,
      }}
    >
      <ThemedText
        type="defaultSemiBold"
        style={{
          fontSize: Sizing.typography.fontSize.l,
          marginBottom: Sizing.spacing.m,
        }}
      >
        Icon & Avatar Examples
      </ThemedText>

      <View style={{ marginBottom: Sizing.spacing.l }}>
        <ThemedText
          type="defaultSemiBold"
          style={{
            fontSize: Sizing.typography.fontSize.m,
            marginBottom: Sizing.spacing.s,
          }}
        >
          Icon Sizes
        </ThemedText>
        <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: Sizing.gap.m, alignItems: 'center' }}>
          {iconSizes.map((size) => (
            <View
              key={size}
              style={{
                alignItems: 'center',
                justifyContent: 'center',
                width: Sizing.icon[size] + Sizing.spacing.m,
                height: Sizing.icon[size] + Sizing.spacing.m,
              }}
            >
              <Ionicons
                name="star"
                size={Sizing.icon[size]}
                color={colors.primary}
              />
              <ThemedText
                style={{
                  fontSize: Sizing.typography.fontSize.xxs,
                  marginTop: Sizing.spacing.xxs,
                  color: colors.bodyText,
                }}
              >
                {size}
              </ThemedText>
            </View>
          ))}
        </View>
      </View>

      <View>
        <ThemedText
          type="defaultSemiBold"
          style={{
            fontSize: Sizing.typography.fontSize.m,
            marginBottom: Sizing.spacing.s,
          }}
        >
          Avatar Sizes
        </ThemedText>
        <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: Sizing.gap.m, alignItems: 'center' }}>
          {avatarSizes.map((size) => (
            <View
              key={size}
              style={{
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <ThemedView
                style={{
                  width: Sizing.avatar[size],
                  height: Sizing.avatar[size],
                  borderRadius: Sizing.avatar[size] / 2,
                  backgroundColor: colors.primary,
                  justifyContent: 'center',
                  alignItems: 'center',
                }}
              >
                <Ionicons
                  name="person"
                  size={Sizing.avatar[size] * 0.6}
                  color="#FFFFFF"
                />
              </ThemedView>
              <ThemedText
                style={{
                  fontSize: Sizing.typography.fontSize.xxs,
                  marginTop: Sizing.spacing.xxs,
                  color: colors.bodyText,
                }}
              >
                {size}
              </ThemedText>
            </View>
          ))}
        </View>
      </View>
    </ThemedView>
  );
}

