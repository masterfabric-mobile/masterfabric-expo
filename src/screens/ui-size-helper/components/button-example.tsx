import { ThemedText } from '@/src/shared/components/ThemedText';
import { ThemedView } from '@/src/shared/components/ThemedView';
import { Sizing } from 'masterfabric-expo-core';
import { getThemeColors, useTheme } from 'masterfabric-expo-core';
import React from 'react';
import { TouchableOpacity, View } from 'react-native';

interface ButtonExampleProps {
  onModalPress: () => void;
}

export function ButtonExample({ onModalPress }: ButtonExampleProps) {
  const { currentTheme } = useTheme();
  const isDark = currentTheme === 'dark';
  const colors = getThemeColors(isDark);

  const buttonSizes: Array<'small' | 'medium' | 'large'> = ['small', 'medium', 'large'];

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
        Button Examples
      </ThemedText>

      <View style={{ marginBottom: Sizing.spacing.l }}>
        <ThemedText
          type="defaultSemiBold"
          style={{
            fontSize: Sizing.typography.fontSize.m,
            marginBottom: Sizing.spacing.s,
          }}
        >
          Button Sizes
        </ThemedText>
        {buttonSizes.map((size) => (
          <TouchableOpacity
            key={size}
            style={{
              backgroundColor: colors.primary,
              borderRadius: Sizing.button.borderRadius.l,
              height: Sizing.button.height[size],
              paddingHorizontal: Sizing.button.padding.horizontal[size],
              paddingVertical: Sizing.button.padding.vertical[size],
              alignItems: 'center',
              justifyContent: 'center',
              marginBottom: Sizing.spacing.s,
            }}
          >
            <ThemedText
              style={{
                color: '#FFFFFF',
                fontSize: Sizing.button.fontSize[size],
                fontWeight: Sizing.typography.fontWeight.semibold,
              }}
            >
              {size.toUpperCase()} Button
            </ThemedText>
          </TouchableOpacity>
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
          Border Radius Variants
        </ThemedText>
        <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: Sizing.gap.s }}>
          {(['xs', 's', 'm', 'l', 'xl', 'round'] as const).map((radius) => (
            <TouchableOpacity
              key={radius}
              style={{
                backgroundColor: colors.primary,
                borderRadius: radius === 'round' 
                  ? Sizing.button.borderRadius.round 
                  : Sizing.button.borderRadius[radius],
                height: Sizing.button.height.small,
                paddingHorizontal: Sizing.button.padding.horizontal.small,
                alignItems: 'center',
                justifyContent: 'center',
                minWidth: Sizing.width.s,
              }}
            >
              <ThemedText
                style={{
                  color: '#FFFFFF',
                  fontSize: Sizing.button.fontSize.small,
                  fontWeight: Sizing.typography.fontWeight.medium,
                }}
              >
                {radius}
              </ThemedText>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      <TouchableOpacity
        onPress={onModalPress}
        style={{
          backgroundColor: colors.primary,
          borderRadius: Sizing.button.borderRadius.l,
          height: Sizing.button.height.medium,
          paddingHorizontal: Sizing.button.padding.horizontal.medium,
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <ThemedText
          style={{
            color: '#FFFFFF',
            fontSize: Sizing.button.fontSize.medium,
            fontWeight: Sizing.typography.fontWeight.semibold,
          }}
        >
          Open Modal Example
        </ThemedText>
      </TouchableOpacity>
    </ThemedView>
  );
}

