import { ThemedText } from '@/src/shared/components/ThemedText';
import { ThemedView } from '@/src/shared/components/ThemedView';
import { Sizing, Spacer, uiSizeHelper } from 'masterfabric-expo-core';
import { getThemeColors, useTheme } from 'masterfabric-expo-core';
import React from 'react';
import { ScrollView, View } from 'react-native';

export function SpacingTab() {
  const { currentTheme } = useTheme();
  const isDark = currentTheme === 'dark';
  const colors = getThemeColors(isDark);

  const spacings = uiSizeHelper.getAllSpacings();
  const gaps = Object.entries(Sizing.gap).map(([size, value]) => ({ size, value }));

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
          Spacing Values
        </ThemedText>

        <View style={{ gap: Sizing.gap.m, marginBottom: Sizing.spacing.l }}>
          {spacings.map((item, index) => (
            <ThemedView
              key={index}
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                padding: Sizing.padding.m,
                backgroundColor: colors.surfaceBackground,
                borderRadius: Sizing.borderRadius.small,
                borderWidth: Sizing.borderWidth.s,
                borderColor: colors.surfaceBorder,
              }}
            >
              <View
                style={{
                  width: item.value as number,
                  height: Sizing.height.s,
                  backgroundColor: colors.primary,
                  borderRadius: Sizing.borderRadius.small,
                  marginRight: Sizing.spacing.m,
                }}
              />
              <View style={{ flex: 1 }}>
                <ThemedText
                  type="defaultSemiBold"
                  style={{
                    fontSize: Sizing.typography.fontSize.m,
                    marginBottom: Sizing.spacing.xxs,
                  }}
                >
                  {item.size.toUpperCase()}
                </ThemedText>
                <ThemedText
                  style={{
                    fontSize: Sizing.typography.fontSize.s,
                    color: colors.bodyText,
                  }}
                >
                  {item.value}px
                </ThemedText>
              </View>
            </ThemedView>
          ))}
        </View>

        <ThemedText
          type="defaultSemiBold"
          style={{
            fontSize: Sizing.typography.fontSize.l,
            marginBottom: Sizing.spacing.m,
          }}
        >
          Gap Values
        </ThemedText>

        <View style={{ gap: Sizing.gap.s }}>
          {gaps.map((item, index) => (
            <ThemedView
              key={index}
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                padding: Sizing.padding.m,
                backgroundColor: colors.surfaceBackground,
                borderRadius: Sizing.borderRadius.small,
                borderWidth: Sizing.borderWidth.s,
                borderColor: colors.surfaceBorder,
              }}
            >
              <View
                style={{
                  width: item.value as number,
                  height: Sizing.height.s,
                  backgroundColor: colors.primary,
                  borderRadius: Sizing.borderRadius.small,
                  marginRight: Sizing.spacing.m,
                }}
              />
              <View style={{ flex: 1 }}>
                <ThemedText
                  type="defaultSemiBold"
                  style={{
                    fontSize: Sizing.typography.fontSize.m,
                    marginBottom: Sizing.spacing.xxs,
                  }}
                >
                  {item.size.toUpperCase()}
                </ThemedText>
                <ThemedText
                  style={{
                    fontSize: Sizing.typography.fontSize.s,
                    color: colors.bodyText,
                  }}
                >
                  {item.value}px
                </ThemedText>
              </View>
            </ThemedView>
          ))}
        </View>

        <Spacer size="l" />

        <ThemedText
          type="defaultSemiBold"
          style={{
            fontSize: Sizing.typography.fontSize.l,
            marginBottom: Sizing.spacing.m,
          }}
        >
          Spacer Component
        </ThemedText>

        <ThemedView
          style={{
            backgroundColor: colors.surfaceBackground,
            borderRadius: Sizing.borderRadius.large,
            padding: Sizing.padding.m,
            borderWidth: Sizing.borderWidth.s,
            borderColor: colors.surfaceBorder,
          }}
        >
          <ThemedView
            style={{
              height: Sizing.height.m,
              backgroundColor: colors.primary + '30',
              borderRadius: Sizing.borderRadius.small,
              justifyContent: 'center',
              alignItems: 'center',
              marginBottom: Sizing.spacing.s,
            }}
          >
            <ThemedText style={{ color: colors.text }}>Component A</ThemedText>
          </ThemedView>
          <Spacer size="m" />
          <ThemedView
            style={{
              height: Sizing.height.m,
              backgroundColor: colors.primary + '30',
              borderRadius: Sizing.borderRadius.small,
              justifyContent: 'center',
              alignItems: 'center',
            }}
          >
            <ThemedText style={{ color: colors.text }}>Component B</ThemedText>
          </ThemedView>
          <ThemedText
            style={{
              fontSize: Sizing.typography.fontSize.xs,
              color: colors.bodyText,
              marginTop: Sizing.spacing.s,
              textAlign: 'center',
            }}
          >
            Spacer size="m" = {Sizing.spacer.m}px
          </ThemedText>
        </ThemedView>
      </ThemedView>
    </ScrollView>
  );
}

