import { ThemedText } from '@/src/shared/components/ThemedText';
import { ThemedView } from '@/src/shared/components/ThemedView';
import { Sizing } from 'masterfabric-expo-core';
import { getThemeColors, useTheme } from 'masterfabric-expo-core';
import React, { useState } from 'react';
import { TextInput, View } from 'react-native';

export function InputExample() {
  const { currentTheme } = useTheme();
  const isDark = currentTheme === 'dark';
  const colors = getThemeColors(isDark);
  const [text, setText] = useState('');

  const inputSizes: Array<'small' | 'medium' | 'large'> = ['small', 'medium', 'large'];

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
        Input Examples
      </ThemedText>

      {inputSizes.map((size) => (
        <View key={size} style={{ marginBottom: Sizing.spacing.m }}>
          <ThemedText
            style={{
              fontSize: Sizing.typography.fontSize.s,
              marginBottom: Sizing.spacing.xs,
              color: colors.bodyText,
            }}
          >
            {size.toUpperCase()} Input
          </ThemedText>
          <TextInput
            style={{
              height: Sizing.input.height[size],
              width: Sizing.input.width.full,
              paddingHorizontal: Sizing.input.padding.horizontal.s,
              paddingVertical: Sizing.input.padding.vertical.s,
              borderRadius: Sizing.input.borderRadius.m,
              borderWidth: Sizing.input.borderWidth.s,
              borderColor: colors.surfaceBorder,
              backgroundColor: colors.inputBackground,
              color: colors.text,
              fontSize: Sizing.input.fontSize.m,
            }}
            placeholder={`${size} input example`}
            placeholderTextColor={colors.placeholderText}
            value={text}
            onChangeText={setText}
          />
        </View>
      ))}

      <View style={{ marginTop: Sizing.spacing.s }}>
        <ThemedText
          style={{
            fontSize: Sizing.typography.fontSize.s,
            marginBottom: Sizing.spacing.xs,
            color: colors.bodyText,
          }}
        >
          Multiline Input (minHeight: {Sizing.input.minHeight.m}px)
        </ThemedText>
        <TextInput
          multiline
          style={{
            minHeight: Sizing.input.minHeight.m,
            width: Sizing.input.width.full,
            paddingHorizontal: Sizing.input.padding.horizontal.s,
            paddingVertical: Sizing.input.padding.vertical.s,
            borderRadius: Sizing.input.borderRadius.m,
            borderWidth: Sizing.input.borderWidth.s,
            borderColor: colors.surfaceBorder,
            backgroundColor: colors.inputBackground,
            color: colors.text,
            fontSize: Sizing.input.fontSize.m,
            textAlignVertical: 'top',
          }}
          placeholder="Multiline input example"
          placeholderTextColor={colors.placeholderText}
          value={text}
          onChangeText={setText}
        />
      </View>
    </ThemedView>
  );
}

