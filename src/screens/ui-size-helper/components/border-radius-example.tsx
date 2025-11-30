import { ThemedText } from '@/src/shared/components/ThemedText';
import { ThemedView } from '@/src/shared/components/ThemedView';
import { Sizing } from 'masterfabric-expo-core';
import { getThemeColors, useTheme } from 'masterfabric-expo-core';
import React from 'react';
import { View } from 'react-native';

export function BorderRadiusExample() {
  const { currentTheme } = useTheme();
  const isDark = currentTheme === 'dark';
  const colors = getThemeColors(isDark);

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
        Border Radius Examples
      </ThemedText>

      <View style={{ marginBottom: Sizing.spacing.l }}>
        <ThemedText
          style={{
            fontSize: Sizing.typography.fontSize.s,
            marginBottom: Sizing.spacing.s,
            color: colors.bodyText,
          }}
        >
          Base Border Radius
        </ThemedText>
        <View style={{ flexDirection: 'row', gap: Sizing.gap.m }}>
          <ThemedView
            style={{
              width: Sizing.width.m,
              height: Sizing.height.m,
              backgroundColor: colors.primary,
              borderRadius: Sizing.borderRadius.small,
              justifyContent: 'center',
              alignItems: 'center',
            }}
          >
            <ThemedText
              style={{
                color: '#FFFFFF',
                fontSize: Sizing.typography.fontSize.xs,
              }}
            >
              Small ({Sizing.borderRadius.small}px)
            </ThemedText>
          </ThemedView>
          <ThemedView
            style={{
              width: Sizing.width.m,
              height: Sizing.height.m,
              backgroundColor: colors.primary,
              borderRadius: Sizing.borderRadius.large,
              justifyContent: 'center',
              alignItems: 'center',
            }}
          >
            <ThemedText
              style={{
                color: '#FFFFFF',
                fontSize: Sizing.typography.fontSize.xs,
              }}
            >
              Large ({Sizing.borderRadius.large}px)
            </ThemedText>
          </ThemedView>
        </View>
      </View>

      <View>
        <ThemedText
          style={{
            fontSize: Sizing.typography.fontSize.s,
            marginBottom: Sizing.spacing.s,
            color: colors.bodyText,
          }}
        >
          Border Width Variants
        </ThemedText>
        {(['none', 'hairline', 's', 'm', 'l', 'xl', 'xxl'] as const).map((width) => (
          <ThemedView
            key={width}
            style={{
              width: Sizing.width.full,
              height: Sizing.height.xs,
              backgroundColor: colors.surfaceBackground,
              borderWidth: width === 'none' 
                ? Sizing.borderWidth.none 
                : width === 'hairline'
                ? Sizing.borderWidth.hairline
                : Sizing.borderWidth[width],
              borderColor: colors.primary,
              borderRadius: Sizing.borderRadius.small,
              marginBottom: Sizing.spacing.xs,
              justifyContent: 'center',
              paddingHorizontal: Sizing.padding.s,
            }}
          >
            <ThemedText
              style={{
                fontSize: Sizing.typography.fontSize.xs,
                color: colors.text,
              }}
            >
              {width}: {width === 'none' ? '0' : width === 'hairline' ? 'hairline' : `${Sizing.borderWidth[width]}px`}
            </ThemedText>
          </ThemedView>
        ))}
      </View>
    </ThemedView>
  );
}

