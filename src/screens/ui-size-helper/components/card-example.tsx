import { ThemedText } from '@/src/shared/components/ThemedText';
import { ThemedView } from '@/src/shared/components/ThemedView';
import { Sizing, Spacer } from 'masterfabric-expo-core';
import { getThemeColors, useTheme } from 'masterfabric-expo-core';
import React from 'react';
import { View } from 'react-native';

export function CardExample() {
  const { currentTheme } = useTheme();
  const isDark = currentTheme === 'dark';
  const colors = getThemeColors(isDark);

  const cardPaddings: Array<keyof typeof Sizing.card.padding> = [
    'xxs', 'xs', 'small', 'medium', 'large', 'xl', 'xxl'
  ];

  const cardRadiuses: Array<keyof typeof Sizing.card.borderRadius> = [
    'xs', 's', 'm', 'l', 'xl', 'xxl'
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
        Card Examples
      </ThemedText>

      <View style={{ marginBottom: Sizing.spacing.l }}>
        <ThemedText
          type="defaultSemiBold"
          style={{
            fontSize: Sizing.typography.fontSize.m,
            marginBottom: Sizing.spacing.s,
          }}
        >
          Card Padding Variants
        </ThemedText>
        {cardPaddings.map((padding) => (
          <ThemedView
            key={padding}
            style={{
              backgroundColor: colors.surfaceBackground,
              borderRadius: Sizing.card.borderRadius.m,
              padding: Sizing.card.padding[padding],
              marginBottom: Sizing.spacing.s,
              borderWidth: Sizing.borderWidth.hairline,
              borderColor: colors.surfaceBorder,
            }}
          >
            <ThemedText
              style={{
                fontSize: Sizing.typography.fontSize.s,
                color: colors.text,
              }}
            >
              Padding: {padding} ({Sizing.card.padding[padding]}px)
            </ThemedText>
          </ThemedView>
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
          Border Radius Variants
        </ThemedText>
        {cardRadiuses.map((radius) => (
          <ThemedView
            key={radius}
            style={{
              backgroundColor: colors.surfaceBackground,
              borderRadius: Sizing.card.borderRadius[radius],
              padding: Sizing.card.padding.medium,
              marginBottom: Sizing.spacing.s,
              borderWidth: Sizing.borderWidth.s,
              borderColor: colors.surfaceBorder,
            }}
          >
            <ThemedText
              style={{
                fontSize: Sizing.typography.fontSize.s,
                color: colors.text,
              }}
            >
              Border Radius: {radius} ({Sizing.card.borderRadius[radius]}px)
            </ThemedText>
          </ThemedView>
        ))}
      </View>
    </ThemedView>
  );
}

