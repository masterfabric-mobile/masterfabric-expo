import { ThemedText } from '@/src/shared/components/ThemedText';
import { ThemedView } from '@/src/shared/components/ThemedView';
import { Sizing, uiSizeHelper } from 'masterfabric-expo-core';
import { getThemeColors, useTheme } from 'masterfabric-expo-core';
import React from 'react';
import { ScrollView, TouchableOpacity, View } from 'react-native';

interface ButtonsTabProps {
  onModalPress: () => void;
}

export function ButtonsTab({ onModalPress }: ButtonsTabProps) {
  const { currentTheme } = useTheme();
  const isDark = currentTheme === 'dark';
  const colors = getThemeColors(isDark);

  const buttonHeights = uiSizeHelper.getAllButtonHeights();

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
          Button Heights
        </ThemedText>

        <View style={{ gap: Sizing.gap.m, marginBottom: Sizing.spacing.xl }}>
          {buttonHeights.map((item, index) => (
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
              <TouchableOpacity
                style={{
                  width: '100%',
                  height: item.value as number,
                  backgroundColor: colors.primary,
                  borderRadius: Sizing.borderRadius.large,
                  justifyContent: 'center',
                  alignItems: 'center',
                  paddingHorizontal: Sizing.button.padding.horizontal.medium,
                }}
                activeOpacity={0.8}
              >
                <ThemedText
                  style={{
                    color: '#FFFFFF',
                    fontWeight: Sizing.typography.fontWeight.semibold,
                  }}
                >
                  Button ({item.size})
                </ThemedText>
              </TouchableOpacity>
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
          Border Radius
        </ThemedText>

        <View style={{ gap: Sizing.gap.m }}>
          {Object.entries(Sizing.borderRadius).map(([size, value]) => (
            <View key={size}>
              <ThemedText
                style={{
                  fontSize: Sizing.typography.fontSize.s,
                  color: colors.bodyText,
                  marginBottom: Sizing.spacing.xs,
                }}
              >
                {size.toUpperCase()}: {value}px
              </ThemedText>
              <TouchableOpacity
                style={{
                  width: '100%',
                  height: Sizing.button.height.medium,
                  backgroundColor: colors.primary,
                  borderRadius: value,
                  justifyContent: 'center',
                  alignItems: 'center',
                  paddingHorizontal: Sizing.button.padding.horizontal.medium,
                }}
                activeOpacity={0.8}
              >
                <ThemedText
                  style={{
                    color: '#FFFFFF',
                    fontWeight: Sizing.typography.fontWeight.semibold,
                  }}
                >
                  Border Radius {size}
                </ThemedText>
              </TouchableOpacity>
            </View>
          ))}
        </View>

        <View style={{ marginTop: Sizing.spacing.xl }}>
          <TouchableOpacity
            onPress={onModalPress}
            style={{
              width: '100%',
              height: Sizing.button.height.medium,
              backgroundColor: colors.primary,
              borderRadius: Sizing.borderRadius.large,
              paddingHorizontal: Sizing.button.padding.horizontal.medium,
              alignItems: 'center',
              justifyContent: 'center',
            }}
            activeOpacity={0.8}
          >
            <ThemedText
              style={{
                color: '#FFFFFF',
                fontWeight: Sizing.typography.fontWeight.semibold,
              }}
            >
              Open Modal Example
            </ThemedText>
          </TouchableOpacity>
        </View>
      </ThemedView>
    </ScrollView>
  );
}

