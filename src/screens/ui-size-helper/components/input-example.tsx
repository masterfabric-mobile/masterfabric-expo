import { ThemedText } from '@/src/shared/components/ThemedText';
import { ThemedView } from '@/src/shared/components/ThemedView';
import { Dropdown } from '@/src/shared/components/Dropdown';
import { t } from '@/src/shared/i18n';
import { Sizing } from 'masterfabric-expo-core';
import { getThemeColors, useTheme } from 'masterfabric-expo-core';
import React, { useState } from 'react';
import { TextInput, View } from 'react-native';

export function InputExample() {
  const { currentTheme } = useTheme();
  const isDark = currentTheme === 'dark';
  const colors = getThemeColors(isDark);
  const [text, setText] = useState('');
  const [selectedSize, setSelectedSize] = useState<'small' | 'medium' | 'large'>('medium');
  const [selectedBorderRadius, setSelectedBorderRadius] = useState<'small' | 'large'>('large');
  const [selectedBorderWidth, setSelectedBorderWidth] = useState<'s' | 'm' | 'l'>('s');

  const inputSizes: Array<'small' | 'medium' | 'large'> = ['small', 'medium', 'large'];
  const borderRadiusOptions: Array<'small' | 'large'> = ['small', 'large'];
  const borderWidthOptions: Array<'s' | 'm' | 'l'> = ['s', 'm', 'l'];

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
        {t('uiSizeHelper.examples.input.title')}
      </ThemedText>

      {/* Interactive Input Size */}
      <View style={{ marginBottom: Sizing.spacing.l }}>
        <ThemedText
          type="defaultSemiBold"
          style={{
            fontSize: Sizing.typography.fontSize.m,
            marginBottom: Sizing.spacing.s,
          }}
        >
          {t('uiSizeHelper.examples.input.interactiveSize')}
        </ThemedText>
        <Dropdown
          options={inputSizes.map((size) => ({
            label: `${size.toUpperCase()} (${Sizing.input.height[size]}px)`,
            value: size,
          }))}
          selectedValue={selectedSize}
          onSelect={(value) => setSelectedSize(value as 'small' | 'medium' | 'large')}
          placeholder={t('uiSizeHelper.placeholders.selectInputSize')}
        />
        <TextInput
          style={{
            height: Sizing.input.height[selectedSize],
            width: '100%',
            paddingHorizontal: Sizing.input.padding.horizontal.s,
            paddingVertical: Sizing.input.padding.vertical.s,
            borderRadius: Sizing.borderRadius.large,
            borderWidth: Sizing.borderWidth.s,
            borderColor: colors.surfaceBorder,
            backgroundColor: colors.inputBackground,
            color: colors.text,
            marginTop: Sizing.spacing.m,
          }}
          placeholder={`${selectedSize} (${Sizing.input.height[selectedSize]}px)`}
          placeholderTextColor={colors.placeholderText}
          value={text}
          onChangeText={setText}
        />
      </View>

      {/* Interactive Border Radius */}
      <View style={{ marginBottom: Sizing.spacing.l }}>
        <ThemedText
          type="defaultSemiBold"
          style={{
            fontSize: Sizing.typography.fontSize.m,
            marginBottom: Sizing.spacing.s,
          }}
        >
          {t('uiSizeHelper.examples.input.interactiveRadius')}
        </ThemedText>
        <Dropdown
          options={borderRadiusOptions.map((radius) => ({
            label: `${radius.toUpperCase()} (${Sizing.borderRadius[radius]}px)`,
            value: radius,
          }))}
          selectedValue={selectedBorderRadius}
          onSelect={(value) => setSelectedBorderRadius(value as 'small' | 'large')}
          placeholder={t('uiSizeHelper.placeholders.selectRadius')}
        />
        <TextInput
          style={{
            height: Sizing.input.height.medium,
            width: '100%',
            paddingHorizontal: Sizing.input.padding.horizontal.s,
            paddingVertical: Sizing.input.padding.vertical.s,
            borderRadius: Sizing.borderRadius[selectedBorderRadius],
            borderWidth: Sizing.borderWidth.s,
            borderColor: colors.surfaceBorder,
            backgroundColor: colors.inputBackground,
            color: colors.text,
            marginTop: Sizing.spacing.m,
          }}
          placeholder={`${selectedBorderRadius} (${Sizing.borderRadius[selectedBorderRadius]}px)`}
          placeholderTextColor={colors.placeholderText}
          value={text}
          onChangeText={setText}
        />
      </View>

      {/* Interactive Border Width */}
      <View>
        <ThemedText
          type="defaultSemiBold"
          style={{
            fontSize: Sizing.typography.fontSize.m,
            marginBottom: Sizing.spacing.s,
          }}
        >
          {t('uiSizeHelper.examples.input.interactiveWidth')}
        </ThemedText>
        <Dropdown
          options={borderWidthOptions.map((width) => ({
            label: `${width.toUpperCase()} (${Sizing.borderWidth[width]}px)`,
            value: width,
          }))}
          selectedValue={selectedBorderWidth}
          onSelect={(value) => setSelectedBorderWidth(value as 's' | 'm' | 'l')}
          placeholder={t('uiSizeHelper.placeholders.selectWidth')}
        />
        <TextInput
          style={{
            height: Sizing.input.height.medium,
            width: '100%',
            paddingHorizontal: Sizing.input.padding.horizontal.s,
            paddingVertical: Sizing.input.padding.vertical.s,
            borderRadius: Sizing.borderRadius.large,
            borderWidth: Sizing.borderWidth[selectedBorderWidth],
            borderColor: colors.surfaceBorder,
            backgroundColor: colors.inputBackground,
            color: colors.text,
            marginTop: Sizing.spacing.m,
          }}
          placeholder={`${selectedBorderWidth} (${Sizing.borderWidth[selectedBorderWidth]}px)`}
          placeholderTextColor={colors.placeholderText}
          value={text}
          onChangeText={setText}
        />
      </View>
    </ThemedView>
  );
}
