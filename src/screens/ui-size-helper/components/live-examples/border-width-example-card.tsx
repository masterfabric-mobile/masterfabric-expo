import { Dropdown } from '@/src/shared/components/Dropdown';
import { ThemedText } from '@/src/shared/components/ThemedText';
import { ThemedView } from '@/src/shared/components/ThemedView';
import { t } from '@/src/shared/i18n';
import { Sizing, getThemeColors, useTheme } from 'masterfabric-expo-core';
import React, { useState } from 'react';
import { View } from 'react-native';

export function BorderWidthExampleCard() {
  const { currentTheme } = useTheme();
  const isDark = currentTheme === 'dark';
  const colors = getThemeColors(isDark);

  const borderWidthSizes: Array<'xs' | 's' | 'm' | 'l'> = ['xs', 's', 'm', 'l'];
  const [selectedSize, setSelectedSize] = useState<'xs' | 's' | 'm' | 'l'>('xs');
  const borderWidthValue = Sizing.borderWidth[selectedSize];

  const sizeOptions = borderWidthSizes.map((size) => ({
    label: `${size.toUpperCase()}: ${Sizing.borderWidth[size]}px`,
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
        {t('helpers.uiSizeHelper.examples.borderWidth.title')}
      </ThemedText>
      <ThemedText
        style={{
          fontSize: Sizing.typography.fontSize.s,
          marginBottom: Sizing.spacing.m,
          color: colors.bodyText,
        }}
      >
        {t('helpers.uiSizeHelper.examples.borderWidth.description')}
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
          {t('helpers.uiSizeHelper.examples.borderWidth.selectSize')}
        </ThemedText>
        <Dropdown
          options={sizeOptions}
          selectedValue={selectedSize}
          onSelect={(value) => setSelectedSize(value as 'xs' | 's' | 'm' | 'l')}
          placeholder={t('helpers.uiSizeHelper.examples.borderWidth.selectSize')}
        />
      </View>

      {/* Live Example */}
      <View style={{ gap: Sizing.gap.m }}>
        <ThemedView
          style={{
            padding: Sizing.padding.m,
            backgroundColor: colors.cardBackground,
            borderRadius: Sizing.borderRadius.small,
            borderWidth: borderWidthValue,
            borderColor: colors.primary,
            justifyContent: 'center',
            alignItems: 'center',
          }}
        >
          <ThemedText style={{ color: colors.bodyText, fontSize: Sizing.typography.fontSize.s }}>
            {t('helpers.uiSizeHelper.examples.borderWidth.title')}: {selectedSize.toUpperCase()} ({borderWidthValue}px)
          </ThemedText>
        </ThemedView>
        <ThemedView
          style={{
            padding: Sizing.padding.m,
            backgroundColor: colors.cardBackground,
            borderRadius: Sizing.borderRadius.small,
            borderWidth: borderWidthValue,
            borderColor: colors.secondary,
            justifyContent: 'center',
            alignItems: 'center',
          }}
        >
          <ThemedText style={{ color: colors.bodyText, fontSize: Sizing.typography.fontSize.s }}>
            {t('helpers.uiSizeHelper.examples.borderWidth.title')}: {selectedSize.toUpperCase()} ({borderWidthValue}px)
          </ThemedText>
        </ThemedView>
      </View>
    </ThemedView>
  );
}
