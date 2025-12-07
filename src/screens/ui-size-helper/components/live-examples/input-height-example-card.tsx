import { Dropdown } from '@/src/shared/components/Dropdown';
import { ThemedText } from '@/src/shared/components/ThemedText';
import { ThemedView } from '@/src/shared/components/ThemedView';
import { t } from '@/src/shared/i18n';
import { Sizing, getThemeColors, useTheme } from 'masterfabric-expo-core';
import React, { useState } from 'react';
import { TextInput, View } from 'react-native';

export function InputHeightExampleCard() {
  const { currentTheme } = useTheme();
  const isDark = currentTheme === 'dark';
  const colors = getThemeColors(isDark);

  const inputHeights: Array<'small' | 'medium' | 'large'> = ['small', 'medium', 'large'];
  const [selectedSize, setSelectedSize] = useState<'small' | 'medium' | 'large'>('medium');
  const inputHeightValue = Sizing.input.height[selectedSize];

  const sizeOptions = inputHeights.map((size) => ({
    label: `${size.charAt(0).toUpperCase() + size.slice(1)}: ${Sizing.input.height[size]}px`,
    value: size,
  }));

  return (
    <ThemedView
      style={{
        backgroundColor: colors.surfaceBackground,
        borderRadius: Sizing.card.borderRadius.l,
        padding: Sizing.card.padding.medium,
        borderWidth: Sizing.borderWidth.s,
        borderColor: colors.surfaceBorder + '30',
        marginBottom: Sizing.spacing.l,
      }}
    >
      <ThemedText
        type="subtitle"
        style={{
          fontSize: Sizing.typography.fontSize.l,
          marginBottom: Sizing.spacing.xs,
          color: colors.sectionTitle,
        }}
      >
        {t('helpers.uiSizeHelper.examples.inputHeight.title')}
      </ThemedText>
      <ThemedText
        style={{
          fontSize: Sizing.typography.fontSize.s,
          marginBottom: Sizing.spacing.m,
          color: colors.bodyText,
        }}
      >
        {t('helpers.uiSizeHelper.examples.inputHeight.description')}
      </ThemedText>

      {/* Dropdown */}
      <View style={{ marginBottom: Sizing.spacing.m }}>
        <ThemedText
          type="defaultSemiBold"
          style={{
            fontSize: Sizing.typography.fontSize.s,
            marginBottom: Sizing.spacing.xs,
            color: colors.bodyText,
          }}
        >
          {t('helpers.uiSizeHelper.examples.inputHeight.selectSize')}
        </ThemedText>
        <Dropdown
          options={sizeOptions}
          selectedValue={selectedSize}
          onSelect={(value) => setSelectedSize(value as 'small' | 'medium' | 'large')}
          placeholder={t('helpers.uiSizeHelper.examples.inputHeight.selectSize')}
        />
      </View>

      {/* Live Example */}
      <View style={{ gap: Sizing.gap.m }}>
        <View>
          <ThemedText
            style={{
              fontSize: Sizing.typography.fontSize.xs,
              marginBottom: Sizing.spacing.xs,
              color: colors.bodyText,
            }}
          >
            Text Input
          </ThemedText>
          <TextInput
            style={{
              height: inputHeightValue,
              backgroundColor: colors.inputBackground,
              borderRadius: Sizing.borderRadius.large,
              borderWidth: Sizing.borderWidth.s,
              borderColor: colors.surfaceBorder,
              paddingHorizontal: Sizing.input.padding.horizontal.s,
              color: colors.text,
              fontSize: Sizing.typography.fontSize.m,
            }}
            placeholder="Enter text..."
            placeholderTextColor={colors.placeholderText}
          />
        </View>
        <View>
          <ThemedText
            style={{
              fontSize: Sizing.typography.fontSize.xs,
              marginBottom: Sizing.spacing.xs,
              color: colors.bodyText,
            }}
          >
            Email Input
          </ThemedText>
          <TextInput
            style={{
              height: inputHeightValue,
              backgroundColor: colors.inputBackground,
              borderRadius: Sizing.borderRadius.large,
              borderWidth: Sizing.borderWidth.s,
              borderColor: colors.surfaceBorder,
              paddingHorizontal: Sizing.input.padding.horizontal.s,
              color: colors.text,
              fontSize: Sizing.typography.fontSize.m,
            }}
            placeholder="email@example.com"
            placeholderTextColor={colors.placeholderText}
            keyboardType="email-address"
          />
        </View>
      </View>
    </ThemedView>
  );
}
