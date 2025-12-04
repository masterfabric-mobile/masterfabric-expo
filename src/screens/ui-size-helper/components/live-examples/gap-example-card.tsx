import { Dropdown } from '@/src/shared/components/Dropdown';
import { ThemedText } from '@/src/shared/components/ThemedText';
import { ThemedView } from '@/src/shared/components/ThemedView';
import { t } from '@/src/shared/i18n';
import { Sizing, getThemeColors, useTheme } from 'masterfabric-expo-core';
import React, { useState } from 'react';
import { View } from 'react-native';

export function GapExampleCard() {
  const { currentTheme } = useTheme();
  const isDark = currentTheme === 'dark';
  const colors = getThemeColors(isDark);

  const gapSizes: Array<keyof typeof Sizing.gap> = ['xxs', 'xs', 's', 'm', 'l', 'xl', 'xxl'];
  const [selectedSize, setSelectedSize] = useState<keyof typeof Sizing.gap>('m');
  const gapValue = Sizing.gap[selectedSize];

  const sizeOptions = gapSizes.map((size) => ({
    label: `${size.toUpperCase()}: ${Sizing.gap[size]}px`,
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
        {t('helpers.uiSizeHelper.examples.gap.title')}
      </ThemedText>
      <ThemedText
        style={{
          fontSize: Sizing.typography.fontSize.s,
          marginBottom: Sizing.spacing.m,
          color: colors.bodyText,
        }}
      >
        {t('helpers.uiSizeHelper.examples.gap.description')}
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
          {t('helpers.uiSizeHelper.examples.gap.selectSize')}
        </ThemedText>
        <Dropdown
          options={sizeOptions}
          selectedValue={selectedSize}
          onSelect={(value) => setSelectedSize(value as keyof typeof Sizing.gap)}
          placeholder={t('helpers.uiSizeHelper.examples.gap.selectSize')}
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
        <View style={{ flexDirection: 'column', gap: gapValue }}>
          <ThemedView
            style={{
              height: 50,
              backgroundColor: colors.primary + '30',
              borderRadius: Sizing.borderRadius.small,
              justifyContent: 'center',
              alignItems: 'center',
            }}
          >
            <ThemedText style={{ color: colors.bodyText, fontSize: Sizing.typography.fontSize.s }}>
              {t('helpers.uiSizeHelper.examples.gap.title')} 1
            </ThemedText>
          </ThemedView>
          <ThemedView
            style={{
              height: 50,
              backgroundColor: colors.secondary + '30',
              borderRadius: Sizing.borderRadius.small,
              justifyContent: 'center',
              alignItems: 'center',
            }}
          >
            <ThemedText style={{ color: colors.bodyText, fontSize: Sizing.typography.fontSize.s }}>
              {t('helpers.uiSizeHelper.examples.gap.title')} 2
            </ThemedText>
          </ThemedView>
          <ThemedView
            style={{
              height: 50,
              backgroundColor: colors.tertiary + '30',
              borderRadius: Sizing.borderRadius.small,
              justifyContent: 'center',
              alignItems: 'center',
            }}
          >
            <ThemedText style={{ color: colors.bodyText, fontSize: Sizing.typography.fontSize.s }}>
              {t('helpers.uiSizeHelper.examples.gap.title')} 3
            </ThemedText>
          </ThemedView>
        </View>
        <ThemedText
          style={{
            marginTop: Sizing.spacing.s,
            fontSize: Sizing.typography.fontSize.xs,
            color: colors.bodyText,
            textAlign: 'center',
          }}
        >
          {t('helpers.uiSizeHelper.examples.gap.title')}: {selectedSize.toUpperCase()} ({gapValue}px)
        </ThemedText>
      </ThemedView>
    </ThemedView>
  );
}
