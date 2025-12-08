import { Dropdown } from '@/src/shared/components/Dropdown';
import { ThemedText } from '@/src/shared/components/ThemedText';
import { ThemedView } from '@/src/shared/components/ThemedView';
import { t } from '@/src/shared/i18n';
import { Sizing, getThemeColors, useTheme } from 'masterfabric-expo-core';
import React, { useState } from 'react';
import { View } from 'react-native';

export function BorderRadiusExampleCard() {
  const { currentTheme } = useTheme();
  const isDark = currentTheme === 'dark';
  const colors = getThemeColors(isDark);

  const borderRadiusSizes: Array<keyof typeof Sizing.borderRadius> = ['small', 'large'];
  const [selectedSize, setSelectedSize] = useState<keyof typeof Sizing.borderRadius>('large');
  const borderRadiusValue = Sizing.borderRadius[selectedSize];

  const sizeOptions = borderRadiusSizes.map((size) => ({
    label: `${size.charAt(0).toUpperCase() + size.slice(1)}: ${Sizing.borderRadius[size]}px`,
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
        {t('helpers.uiSizeHelper.examples.borderRadius.title')}
      </ThemedText>
      <ThemedText
        style={{
          fontSize: Sizing.typography.fontSize.s,
          marginBottom: Sizing.spacing.m,
          color: colors.bodyText,
        }}
      >
        {t('helpers.uiSizeHelper.examples.borderRadius.description')}
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
          {t('helpers.uiSizeHelper.examples.borderRadius.selectSize')}
        </ThemedText>
        <Dropdown
          options={sizeOptions}
          selectedValue={selectedSize}
          onSelect={(value) => setSelectedSize(value as keyof typeof Sizing.borderRadius)}
          placeholder={t('helpers.uiSizeHelper.examples.borderRadius.selectSize')}
        />
      </View>

      {/* Live Example */}
      <View style={{ flexDirection: 'row', gap: Sizing.gap.m, flexWrap: 'wrap' }}>
        <ThemedView
          style={{
            width: 100,
            height: 100,
            backgroundColor: colors.primary,
            borderRadius: borderRadiusValue,
            justifyContent: 'center',
            alignItems: 'center',
          }}
        >
          <ThemedText style={{ color: '#FFFFFF', fontSize: Sizing.typography.fontSize.xs, fontWeight: Sizing.typography.fontWeight.semibold }}>
            {borderRadiusValue}px
          </ThemedText>
        </ThemedView>
        <ThemedView
          style={{
            width: 100,
            height: 100,
            backgroundColor: colors.secondary,
            borderRadius: borderRadiusValue,
            justifyContent: 'center',
            alignItems: 'center',
          }}
        >
          <ThemedText style={{ color: '#FFFFFF', fontSize: Sizing.typography.fontSize.xs, fontWeight: Sizing.typography.fontWeight.semibold }}>
            {borderRadiusValue}px
          </ThemedText>
        </ThemedView>
        <ThemedView
          style={{
            width: 100,
            height: 100,
            backgroundColor: colors.tertiary,
            borderRadius: borderRadiusValue,
            justifyContent: 'center',
            alignItems: 'center',
          }}
        >
          <ThemedText style={{ color: '#FFFFFF', fontSize: Sizing.typography.fontSize.xs, fontWeight: Sizing.typography.fontWeight.semibold }}>
            {borderRadiusValue}px
          </ThemedText>
        </ThemedView>
      </View>
    </ThemedView>
  );
}
