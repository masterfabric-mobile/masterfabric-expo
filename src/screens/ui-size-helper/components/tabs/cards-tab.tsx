import { ThemedText } from '@/src/shared/components/ThemedText';
import { ThemedView } from '@/src/shared/components/ThemedView';
import { Sizing, uiSizeHelper } from 'masterfabric-expo-core';
import { getThemeColors, useTheme } from 'masterfabric-expo-core';
import React from 'react';
import { ScrollView, View } from 'react-native';

export function CardsTab() {
  const { currentTheme } = useTheme();
  const isDark = currentTheme === 'dark';
  const colors = getThemeColors(isDark);

  const cardPaddings = uiSizeHelper.getAllCardPaddings();

  return (
    <ScrollView showsVerticalScrollIndicator={false}>
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
          Card Padding
        </ThemedText>

        <View style={{ gap: Sizing.gap.m }}>
          {cardPaddings.map((item, index) => (
            <ThemedView
              key={index}
              style={{
                backgroundColor: colors.surfaceBackground,
                borderRadius: Sizing.borderRadius.large,
                padding: item.value as number,
                borderWidth: Sizing.borderWidth.s,
                borderColor: colors.surfaceBorder,
              }}
            >
              <ThemedText
                type="defaultSemiBold"
                style={{
                  fontSize: Sizing.typography.fontSize.m,
                  marginBottom: Sizing.spacing.xs,
                }}
              >
                {item.size.toUpperCase()}: {item.value}px
              </ThemedText>
              <ThemedText
                style={{
                  fontSize: Sizing.typography.fontSize.s,
                  color: colors.bodyText,
                }}
              >
                This card demonstrates padding value of {item.size.toUpperCase()}
              </ThemedText>
            </ThemedView>
          ))}
        </View>

        <View style={{ marginTop: Sizing.spacing.xl }}>
          <ThemedText
            type="defaultSemiBold"
            style={{
              fontSize: Sizing.typography.fontSize.l,
              marginBottom: Sizing.spacing.m,
            }}
          >
            Border Radius
          </ThemedText>

          <View style={{ gap: Sizing.gap.m }}>
            {Object.entries(Sizing.borderRadius).map(([size, value]) => (
              <ThemedView
                key={size}
                style={{
                  backgroundColor: colors.surfaceBackground,
                  borderRadius: value,
                  padding: Sizing.card.padding.medium,
                  borderWidth: Sizing.borderWidth.s,
                  borderColor: colors.surfaceBorder,
                }}
              >
                <ThemedText
                  type="defaultSemiBold"
                  style={{
                    fontSize: Sizing.typography.fontSize.m,
                    marginBottom: Sizing.spacing.xs,
                  }}
                >
                  {size.toUpperCase()}: {value}px
                </ThemedText>
                <ThemedText
                  style={{
                    fontSize: Sizing.typography.fontSize.s,
                    color: colors.bodyText,
                  }}
                >
                  Card with {size} border radius
                </ThemedText>
              </ThemedView>
            ))}
          </View>
        </View>
      </ThemedView>
    </ScrollView>
  );
}

