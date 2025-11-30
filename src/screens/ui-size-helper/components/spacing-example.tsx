import { ThemedText } from '@/src/shared/components/ThemedText';
import { ThemedView } from '@/src/shared/components/ThemedView';
import { Sizing, Spacer } from 'masterfabric-expo-core';
import { getThemeColors, useTheme } from 'masterfabric-expo-core';
import React from 'react';
import { View } from 'react-native';

export function SpacingExample() {
  const { currentTheme } = useTheme();
  const isDark = currentTheme === 'dark';
  const colors = getThemeColors(isDark);

  const spacingSizes: Array<keyof typeof Sizing.spacing> = ['xxs', 'xs', 's', 'm', 'l', 'xl', 'xxl', 'xxxl'];

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
        Spacing Examples
      </ThemedText>
      <ThemedText
        style={{
          fontSize: Sizing.typography.fontSize.s,
          marginBottom: Sizing.spacing.l,
          color: colors.bodyText,
        }}
      >
        All spacing values follow the 8pt grid system
      </ThemedText>

      {spacingSizes.map((size) => (
        <View key={size} style={{ marginBottom: Sizing.spacing.s }}>
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <ThemedView
              style={{
                width: Sizing.spacing[size],
                height: Sizing.spacing[size],
                backgroundColor: colors.primary,
                borderRadius: Sizing.borderRadius.small,
                marginRight: Sizing.spacing.s,
              }}
            />
            <ThemedText
              style={{
                fontSize: Sizing.typography.fontSize.s,
                color: colors.bodyText,
              }}
            >
              {size}: {Sizing.spacing[size]}px
            </ThemedText>
          </View>
        </View>
      ))}

      <Spacer size="m" />

      <ThemedText
        type="defaultSemiBold"
        style={{
          fontSize: Sizing.typography.fontSize.m,
          marginBottom: Sizing.spacing.s,
        }}
      >
        Spacer Component
      </ThemedText>
      <View>
        <ThemedView
          style={{
            height: Sizing.height.xs,
            backgroundColor: colors.primary,
            borderRadius: Sizing.borderRadius.small,
          }}
        />
        <Spacer size="s" />
        <ThemedView
          style={{
            height: Sizing.height.xs,
            backgroundColor: colors.primary,
            borderRadius: Sizing.borderRadius.small,
          }}
        />
        <Spacer size="m" />
        <ThemedView
          style={{
            height: Sizing.height.xs,
            backgroundColor: colors.primary,
            borderRadius: Sizing.borderRadius.small,
          }}
        />
        <Spacer size="l" />
        <ThemedView
          style={{
            height: Sizing.height.xs,
            backgroundColor: colors.primary,
            borderRadius: Sizing.borderRadius.small,
          }}
        />
      </View>
    </ThemedView>
  );
}

