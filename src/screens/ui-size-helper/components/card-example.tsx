import { ThemedText } from '@/src/shared/components/ThemedText';
import { ThemedView } from '@/src/shared/components/ThemedView';
import { Dropdown } from '@/src/shared/components/Dropdown';
import { t } from '@/src/shared/i18n';
import { Sizing } from 'masterfabric-expo-core';
import { getThemeColors, useTheme } from 'masterfabric-expo-core';
import React, { useState } from 'react';
import { View } from 'react-native';

export function CardExample() {
  const { currentTheme } = useTheme();
  const isDark = currentTheme === 'dark';
  const colors = getThemeColors(isDark);

  const cardPaddings: Array<keyof typeof Sizing.card.padding> = [
    'xxs', 'xs', 'small', 'medium', 'large', 'xl', 'xxl'
  ];

  const borderRadiusOptions: Array<'small' | 'large'> = ['small', 'large'];
  const borderWidthOptions: Array<'s' | 'm' | 'l'> = ['s', 'm', 'l'];

  const [selectedPadding, setSelectedPadding] = useState<keyof typeof Sizing.card.padding>('medium');
  const [selectedRadius, setSelectedRadius] = useState<'small' | 'large'>('large');
  const [selectedBorderWidth, setSelectedBorderWidth] = useState<'s' | 'm' | 'l'>('s');

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
        {t('uiSizeHelper.examples.card.title')}
      </ThemedText>

      {/* Interactive Card Padding */}
      <View style={{ marginBottom: Sizing.spacing.l }}>
        <ThemedText
          type="defaultSemiBold"
          style={{
            fontSize: Sizing.typography.fontSize.m,
            marginBottom: Sizing.spacing.s,
          }}
        >
          {t('uiSizeHelper.examples.card.interactivePadding')}
        </ThemedText>
        <Dropdown
          options={cardPaddings.map((padding) => ({
            label: `${padding.toUpperCase()}: ${Sizing.card.padding[padding]}px`,
            value: padding,
          }))}
          selectedValue={selectedPadding}
          onSelect={(value) => setSelectedPadding(value as keyof typeof Sizing.card.padding)}
          placeholder={t('uiSizeHelper.placeholders.selectCardPadding')}
        />
        <ThemedView
          style={{
            backgroundColor: colors.surfaceBackground,
            borderRadius: Sizing.borderRadius.large,
            padding: Sizing.card.padding[selectedPadding],
            marginTop: Sizing.spacing.m,
            borderWidth: Sizing.borderWidth.s,
            borderColor: colors.surfaceBorder,
            width: '100%',
          }}
        >
          <ThemedText
            style={{
              fontSize: Sizing.typography.fontSize.s,
              color: colors.text,
            }}
          >
            {selectedPadding} ({Sizing.card.padding[selectedPadding]}px)
          </ThemedText>
        </ThemedView>
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
          {t('uiSizeHelper.examples.card.interactiveRadius')}
        </ThemedText>
        <Dropdown
          options={borderRadiusOptions.map((radius) => ({
            label: `${radius.toUpperCase()}: ${Sizing.borderRadius[radius]}px`,
            value: radius,
          }))}
          selectedValue={selectedRadius}
          onSelect={(value) => setSelectedRadius(value as 'small' | 'large')}
          placeholder={t('uiSizeHelper.placeholders.selectRadius')}
        />
        <ThemedView
          style={{
            backgroundColor: colors.surfaceBackground,
            borderRadius: Sizing.borderRadius[selectedRadius],
            padding: Sizing.card.padding.medium,
            marginTop: Sizing.spacing.m,
            borderWidth: Sizing.borderWidth.s,
            borderColor: colors.surfaceBorder,
            width: '100%',
          }}
        >
          <ThemedText
            style={{
              fontSize: Sizing.typography.fontSize.s,
              color: colors.text,
            }}
          >
            {selectedRadius.toUpperCase()} ({Sizing.borderRadius[selectedRadius]}px)
          </ThemedText>
        </ThemedView>
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
          {t('uiSizeHelper.examples.card.interactiveWidth')}
        </ThemedText>
        <Dropdown
          options={borderWidthOptions.map((width) => ({
            label: `${width.toUpperCase()}: ${Sizing.borderWidth[width]}px`,
            value: width,
          }))}
          selectedValue={selectedBorderWidth}
          onSelect={(value) => setSelectedBorderWidth(value as 's' | 'm' | 'l')}
          placeholder={t('uiSizeHelper.placeholders.selectWidth')}
        />
        <ThemedView
          style={{
            backgroundColor: colors.surfaceBackground,
            borderRadius: Sizing.borderRadius.large,
            padding: Sizing.card.padding.medium,
            marginTop: Sizing.spacing.m,
            borderWidth: Sizing.borderWidth[selectedBorderWidth],
            borderColor: colors.surfaceBorder,
            width: '100%',
          }}
        >
          <ThemedText
            style={{
              fontSize: Sizing.typography.fontSize.s,
              color: colors.text,
            }}
          >
            {selectedBorderWidth.toUpperCase()} ({Sizing.borderWidth[selectedBorderWidth]}px)
          </ThemedText>
        </ThemedView>
      </View>
    </ThemedView>
  );
}
