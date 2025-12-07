import { ThemedText } from '@/src/shared/components/ThemedText';
import { ThemedView } from '@/src/shared/components/ThemedView';
import { Sizing, uiSizeHelper } from 'masterfabric-expo-core';
import { getThemeColors, useTheme } from 'masterfabric-expo-core';
import React from 'react';
import { ScrollView, TextInput, View } from 'react-native';

export function InputsTab() {
  const { currentTheme } = useTheme();
  const isDark = currentTheme === 'dark';
  const colors = getThemeColors(isDark);

  const inputHeights = uiSizeHelper.getAllInputHeights();

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
          Input Heights
        </ThemedText>

        <View style={{ gap: Sizing.gap.m, marginBottom: Sizing.spacing.xl }}>
          {inputHeights.map((item, index) => (
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
              <TextInput
                style={{
                  height: item.value as number,
                  width: '100%',
                  paddingHorizontal: Sizing.input.padding.horizontal.s,
                  paddingVertical: Sizing.input.padding.vertical.s,
                  borderRadius: Sizing.borderRadius.large,
                  borderWidth: Sizing.borderWidth.s,
                  borderColor: colors.surfaceBorder,
                  backgroundColor: colors.inputBackground,
                  color: colors.text,
                }}
                placeholder={`Input ${item.size}`}
                placeholderTextColor={colors.placeholderText}
              />
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
          Border Width
        </ThemedText>

        <View style={{ gap: Sizing.gap.m }}>
          {Object.entries(Sizing.borderWidth).filter(([key]) => key !== 'none' && key !== 'hairline').map(([size, value]) => (
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
              <TextInput
                style={{
                  height: Sizing.input.height.medium,
                  width: '100%',
                  paddingHorizontal: Sizing.input.padding.horizontal.s,
                  paddingVertical: Sizing.input.padding.vertical.s,
                  borderRadius: Sizing.borderRadius.large,
                  borderWidth: value as number,
                  borderColor: colors.surfaceBorder,
                  backgroundColor: colors.inputBackground,
                  color: colors.text,
                }}
                placeholder={`Border width ${size}`}
                placeholderTextColor={colors.placeholderText}
              />
            </View>
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
            Multiline Input
          </ThemedText>
          <TextInput
            multiline
            style={{
              minHeight: Sizing.input.minHeight.m,
              width: '100%',
              paddingHorizontal: Sizing.input.padding.horizontal.s,
              paddingVertical: Sizing.input.padding.vertical.s,
              borderRadius: Sizing.borderRadius.large,
              borderWidth: Sizing.borderWidth.s,
              borderColor: colors.surfaceBorder,
              backgroundColor: colors.inputBackground,
              color: colors.text,
              textAlignVertical: 'top',
            }}
            placeholder="Multiline input (minHeight: m)"
            placeholderTextColor={colors.placeholderText}
          />
        </View>
      </ThemedView>
    </ScrollView>
  );
}

