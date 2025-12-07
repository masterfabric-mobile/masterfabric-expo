import { ThemedText } from '@/src/shared/components/ThemedText';
import { ThemedView } from '@/src/shared/components/ThemedView';
import { Sizing, uiSizeHelper } from 'masterfabric-expo-core';
import { getThemeColors, useTheme } from 'masterfabric-expo-core';
import React from 'react';
import { ScrollView, View } from 'react-native';

export function ScrollTab() {
  const { currentTheme } = useTheme();
  const isDark = currentTheme === 'dark';
  const colors = getThemeColors(isDark);

  const scrollPaddings = uiSizeHelper.getAllScrollPaddings();
  const scrollMargins = uiSizeHelper.getAllScrollMargins();

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
          Scroll Padding
        </ThemedText>

        <View style={{ gap: Sizing.gap.m, marginBottom: Sizing.spacing.xl }}>
          {scrollPaddings.map((item, index) => (
            <View key={index}>
              <ThemedText
                style={{
                  fontSize: Sizing.typography.fontSize.s,
                  color: colors.bodyText,
                  marginBottom: Sizing.spacing.xs,
                }}
              >
                {item.size.toUpperCase()}: {item.value}px
              </ThemedText>
              <ThemedView
                style={{
                  height: Sizing.height.l,
                  backgroundColor: colors.surfaceBackground,
                  borderRadius: Sizing.borderRadius.large,
                  borderWidth: Sizing.borderWidth.s,
                  borderColor: colors.surfaceBorder,
                  overflow: 'hidden',
                }}
              >
                <ScrollView
                  contentContainerStyle={{
                    padding: item.value as number,
                  }}
                  showsVerticalScrollIndicator={false}
                >
                  {[1, 2, 3, 4, 5].map((num) => (
                    <ThemedView
                      key={num}
                      style={{
                        backgroundColor: colors.primary + '20',
                        padding: Sizing.padding.m,
                        borderRadius: Sizing.borderRadius.small,
                        marginBottom: Sizing.spacing.s,
                      }}
                    >
                      <ThemedText style={{ fontSize: Sizing.typography.fontSize.s, color: colors.text }}>
                        Item {num}
                      </ThemedText>
                    </ThemedView>
                  ))}
                </ScrollView>
              </ThemedView>
            </View>
          ))}
        </View>

        <ThemedText
          type="defaultSemiBold"
          style={{
            fontSize: Sizing.typography.fontSize.l,
            marginBottom: Sizing.spacing.m,
          }}
        >
          Scroll Margin
        </ThemedText>

        <View style={{ gap: Sizing.gap.m }}>
          {scrollMargins.map((item, index) => (
            <View key={index}>
              <ThemedText
                style={{
                  fontSize: Sizing.typography.fontSize.s,
                  color: colors.bodyText,
                  marginBottom: Sizing.spacing.xs,
                }}
              >
                {item.size.toUpperCase()}: {item.value}px
              </ThemedText>
              <ThemedView
                style={{
                  height: Sizing.height.l,
                  backgroundColor: colors.surfaceBackground,
                  borderRadius: Sizing.borderRadius.large,
                  borderWidth: Sizing.borderWidth.s,
                  borderColor: colors.surfaceBorder,
                  overflow: 'hidden',
                }}
              >
                <ScrollView
                  contentContainerStyle={{
                    margin: item.value as number,
                  }}
                  showsVerticalScrollIndicator={false}
                >
                  <ThemedView
                    style={{
                      backgroundColor: colors.cardBackground,
                      padding: Sizing.padding.l,
                      borderRadius: Sizing.borderRadius.small,
                      borderWidth: Sizing.borderWidth.s,
                      borderColor: colors.surfaceBorder,
                    }}
                  >
                    <ThemedText style={{ fontSize: Sizing.typography.fontSize.s, color: colors.text }}>
                      Content with scroll margin {item.size.toUpperCase()}
                    </ThemedText>
                  </ThemedView>
                </ScrollView>
              </ThemedView>
            </View>
          ))}
        </View>
      </ThemedView>
    </ScrollView>
  );
}

