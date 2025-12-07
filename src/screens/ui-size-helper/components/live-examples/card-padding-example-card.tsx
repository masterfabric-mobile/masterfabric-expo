import { Dropdown } from '@/src/shared/components/Dropdown';
import { ThemedText } from '@/src/shared/components/ThemedText';
import { ThemedView } from '@/src/shared/components/ThemedView';
import { t } from '@/src/shared/i18n';
import { Sizing, getThemeColors, useTheme } from 'masterfabric-expo-core';
import React, { useState } from 'react';
import { View } from 'react-native';

export function CardPaddingExampleCard() {
  const { currentTheme } = useTheme();
  const isDark = currentTheme === 'dark';
  const colors = getThemeColors(isDark);

  const cardPaddingSizes: Array<keyof typeof Sizing.card.padding> = ['xxs', 'xs', 'small', 'medium', 'large', 'xl', 'xxl'];
  const [selectedSize, setSelectedSize] = useState<keyof typeof Sizing.card.padding>('medium');
  const cardPaddingValue = Sizing.card.padding[selectedSize];

  const sizeOptions = cardPaddingSizes.map((size) => ({
    label: `${size.charAt(0).toUpperCase() + size.slice(1)}: ${Sizing.card.padding[size]}px`,
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
        {t('helpers.uiSizeHelper.examples.cardPadding.title')}
      </ThemedText>
      <ThemedText
        style={{
          fontSize: Sizing.typography.fontSize.s,
          marginBottom: Sizing.spacing.m,
          color: colors.bodyText,
        }}
      >
        {t('helpers.uiSizeHelper.examples.cardPadding.description')}
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
          {t('helpers.uiSizeHelper.examples.cardPadding.selectSize')}
        </ThemedText>
        <Dropdown
          options={sizeOptions}
          selectedValue={selectedSize}
          onSelect={(value) => setSelectedSize(value as keyof typeof Sizing.card.padding)}
          placeholder={t('helpers.uiSizeHelper.examples.cardPadding.selectSize')}
        />
      </View>

      {/* Live Example */}
      <View style={{ gap: Sizing.gap.m }}>
        <ThemedView
          style={{
            padding: cardPaddingValue,
            backgroundColor: colors.cardBackground,
            borderRadius: Sizing.borderRadius.large,
            borderWidth: Sizing.borderWidth.s,
            borderColor: colors.surfaceBorder,
          }}
        >
          <ThemedText
            type="defaultSemiBold"
            style={{
              fontSize: Sizing.typography.fontSize.m,
              marginBottom: Sizing.spacing.xs,
              color: colors.titleText,
            }}
          >
            {t('helpers.uiSizeHelper.examples.cardPadding.title')} ({cardPaddingValue}px)
          </ThemedText>
          <ThemedText
            style={{
              fontSize: Sizing.typography.fontSize.s,
              color: colors.bodyText,
            }}
          >
            {t('helpers.uiSizeHelper.examples.cardPadding.description')}
          </ThemedText>
        </ThemedView>
        <ThemedView
          style={{
            padding: cardPaddingValue,
            backgroundColor: colors.cardBackground,
            borderRadius: Sizing.borderRadius.large,
            borderWidth: Sizing.borderWidth.s,
            borderColor: colors.surfaceBorder,
          }}
        >
          <ThemedText
            type="defaultSemiBold"
            style={{
              fontSize: Sizing.typography.fontSize.m,
              marginBottom: Sizing.spacing.xs,
              color: colors.titleText,
            }}
          >
            Another Card
          </ThemedText>
          <ThemedText
            style={{
              fontSize: Sizing.typography.fontSize.s,
              color: colors.bodyText,
            }}
          >
            Padding value controls the space between content and edges.
          </ThemedText>
        </ThemedView>
      </View>
    </ThemedView>
  );
}
