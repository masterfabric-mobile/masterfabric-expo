import { ThemedText } from '@/src/shared/components/ThemedText';
import { ThemedView } from '@/src/shared/components/ThemedView';
import { Sizing, uiSizeHelper } from 'masterfabric-expo-core';
import { getThemeColors, useTheme } from 'masterfabric-expo-core';
import React from 'react';
import { ScrollView, View } from 'react-native';

export function PaddingTab() {
  const { currentTheme } = useTheme();
  const isDark = currentTheme === 'dark';
  const colors = getThemeColors(isDark);

  const paddings = uiSizeHelper.getAllPaddings();

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
          Padding Values
        </ThemedText>

        <View style={{ gap: Sizing.gap.s }}>
          {paddings.map((item, index) => (
            <ThemedView
              key={index}
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                padding: Sizing.padding[item.size as keyof typeof Sizing.padding],
                backgroundColor: colors.surfaceBackground,
                borderRadius: Sizing.borderRadius.small,
                borderWidth: Sizing.borderWidth.s,
                borderColor: colors.surfaceBorder,
              }}
            >
              <ThemedView
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
      </ThemedView>
    </ScrollView>
  );
}

