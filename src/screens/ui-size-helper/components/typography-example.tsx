import { ThemedText } from '@/src/shared/components/ThemedText';
import { ThemedView } from '@/src/shared/components/ThemedView';
import { Sizing } from 'masterfabric-expo-core';
import { getThemeColors, useTheme } from 'masterfabric-expo-core';
import React from 'react';
import { View } from 'react-native';

export function TypographyExample() {
  const { currentTheme } = useTheme();
  const isDark = currentTheme === 'dark';
  const colors = getThemeColors(isDark);

  const fontSizes: Array<keyof typeof Sizing.typography.fontSize> = [
    'xxs', 'xs', 's', 'm', 'l', 'xl', 'xxl', 'xxxl'
  ];

  const fontWeights: Array<keyof typeof Sizing.typography.fontWeight> = [
    'thin', 'light', 'normal', 'medium', 'semibold', 'bold', 'extrabold', 'black'
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
        Typography Examples
      </ThemedText>

      <View style={{ marginBottom: Sizing.spacing.l }}>
        <ThemedText
          type="defaultSemiBold"
          style={{
            fontSize: Sizing.typography.fontSize.m,
            marginBottom: Sizing.spacing.s,
          }}
        >
          Font Sizes
        </ThemedText>
        {fontSizes.map((size) => (
          <ThemedText
            key={size}
            style={{
              fontSize: Sizing.typography.fontSize[size],
              marginBottom: Sizing.spacing.xs,
              color: colors.text,
            }}
          >
            {size.toUpperCase()}: {Sizing.typography.fontSize[size]}px - The quick brown fox
          </ThemedText>
        ))}
      </View>

      <View style={{ marginBottom: Sizing.spacing.l }}>
        <ThemedText
          type="defaultSemiBold"
          style={{
            fontSize: Sizing.typography.fontSize.m,
            marginBottom: Sizing.spacing.s,
          }}
        >
          Font Weights
        </ThemedText>
        {fontWeights.map((weight) => (
          <ThemedText
            key={weight}
            style={{
              fontSize: Sizing.typography.fontSize.m,
              fontWeight: Sizing.typography.fontWeight[weight] as any,
              marginBottom: Sizing.spacing.xs,
              color: colors.text,
            }}
          >
            {weight}: The quick brown fox
          </ThemedText>
        ))}
      </View>

      <View>
        <ThemedText
          type="defaultSemiBold"
          style={{
            fontSize: Sizing.typography.fontSize.m,
            marginBottom: Sizing.spacing.s,
          }}
        >
          Line Heights
        </ThemedText>
        <ThemedText
          style={{
            fontSize: Sizing.typography.fontSize.m,
            lineHeight: Sizing.typography.fontSize.m * Sizing.typography.lineHeight.tight,
            marginBottom: Sizing.spacing.s,
            color: colors.text,
          }}
        >
          Tight (1.2): Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
        </ThemedText>
        <ThemedText
          style={{
            fontSize: Sizing.typography.fontSize.m,
            lineHeight: Sizing.typography.fontSize.m * Sizing.typography.lineHeight.normal,
            marginBottom: Sizing.spacing.s,
            color: colors.text,
          }}
        >
          Normal (1.5): Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
        </ThemedText>
        <ThemedText
          style={{
            fontSize: Sizing.typography.fontSize.m,
            lineHeight: Sizing.typography.fontSize.m * Sizing.typography.lineHeight.relaxed,
            color: colors.text,
          }}
        >
          Relaxed (1.8): Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
        </ThemedText>
      </View>
    </ThemedView>
  );
}

