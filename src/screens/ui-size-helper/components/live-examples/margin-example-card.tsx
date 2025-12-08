import { Dropdown } from '@/src/shared/components/Dropdown';
import { ThemedText } from '@/src/shared/components/ThemedText';
import { ThemedView } from '@/src/shared/components/ThemedView';
import { t } from '@/src/shared/i18n';
import { Sizing, getThemeColors, useTheme } from 'masterfabric-expo-core';
import React, { useState } from 'react';
import { View } from 'react-native';

export function MarginExampleCard() {
  const { currentTheme } = useTheme();
  const isDark = currentTheme === 'dark';
  const colors = getThemeColors(isDark);

  const marginSizes: Array<keyof typeof Sizing.margin> = ['xxs', 'xs', 's', 'm', 'l', 'xl', 'xxl', 'xxxl'];
  const [selectedSize, setSelectedSize] = useState<keyof typeof Sizing.margin>('m');
  const marginValue = Sizing.margin[selectedSize];

  const sizeOptions = marginSizes.map((size) => ({
    label: `${size.toUpperCase()}: ${Sizing.margin[size]}px`,
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
        {t('helpers.uiSizeHelper.examples.margin.title')}
      </ThemedText>
      <ThemedText
        style={{
          fontSize: Sizing.typography.fontSize.s,
          marginBottom: Sizing.spacing.m,
          color: colors.bodyText,
        }}
      >
        {t('helpers.uiSizeHelper.examples.margin.description')}
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
          {t('helpers.uiSizeHelper.examples.margin.selectSize')}
        </ThemedText>
        <Dropdown
          options={sizeOptions}
          selectedValue={selectedSize}
          onSelect={(value) => setSelectedSize(value as keyof typeof Sizing.margin)}
          placeholder={t('helpers.uiSizeHelper.examples.margin.selectSize')}
        />
      </View>

      {/* Live Example */}
      <ThemedView
        style={{
          backgroundColor: colors.cardBackground,
          borderRadius: Sizing.borderRadius.small,
          padding: Sizing.padding.m,
          borderWidth: Sizing.borderWidth.s,
          borderColor: colors.surfaceBorder,
        }}
      >
        <ThemedView
          style={{
            margin: marginValue,
            backgroundColor: colors.primary + '30',
            borderRadius: Sizing.borderRadius.small,
            padding: Sizing.padding.m,
            borderWidth: 2,
            borderColor: colors.primary,
            borderStyle: 'dashed',
          }}
        >
          <ThemedText
            style={{
              color: colors.bodyText,
              fontSize: Sizing.typography.fontSize.s,
              textAlign: 'center',
            }}
          >
            {t('helpers.uiSizeHelper.examples.margin.title')}: {selectedSize.toUpperCase()} ({marginValue}px)
          </ThemedText>
        </ThemedView>
      </ThemedView>
    </ThemedView>
  );
}
