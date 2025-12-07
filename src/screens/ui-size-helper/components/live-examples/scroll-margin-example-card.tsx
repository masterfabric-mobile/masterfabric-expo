import { Dropdown } from '@/src/shared/components/Dropdown';
import { ThemedText } from '@/src/shared/components/ThemedText';
import { ThemedView } from '@/src/shared/components/ThemedView';
import { t } from '@/src/shared/i18n';
import { Sizing, getThemeColors, useTheme } from 'masterfabric-expo-core';
import React, { useState } from 'react';
import { ScrollView, View } from 'react-native';

export function ScrollMarginExampleCard() {
  const { currentTheme } = useTheme();
  const isDark = currentTheme === 'dark';
  const colors = getThemeColors(isDark);

  const scrollMarginSizes: Array<keyof typeof Sizing.scroll.margin> = ['xxs', 'xs', 's', 'm', 'l', 'xl', 'xxl'];
  const [selectedSize, setSelectedSize] = useState<keyof typeof Sizing.scroll.margin>('m');
  const scrollMarginValue = Sizing.scroll.margin[selectedSize];

  const sizeOptions = scrollMarginSizes.map((size) => ({
    label: `${size.toUpperCase()}: ${Sizing.scroll.margin[size]}px`,
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
        {t('helpers.uiSizeHelper.examples.scrollMargin.title')}
      </ThemedText>
      <ThemedText
        style={{
          fontSize: Sizing.typography.fontSize.s,
          marginBottom: Sizing.spacing.m,
          color: colors.bodyText,
        }}
      >
        {t('helpers.uiSizeHelper.examples.scrollMargin.description')}
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
          {t('helpers.uiSizeHelper.examples.scrollMargin.selectSize')}
        </ThemedText>
        <Dropdown
          options={sizeOptions}
          selectedValue={selectedSize}
          onSelect={(value) => setSelectedSize(value as keyof typeof Sizing.scroll.margin)}
          placeholder={t('helpers.uiSizeHelper.examples.scrollMargin.selectSize')}
        />
      </View>

      {/* Live Example */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={{
          maxHeight: 100,
          borderRadius: Sizing.borderRadius.small,
          borderWidth: Sizing.borderWidth.s,
          borderColor: colors.surfaceBorder,
        }}
        contentContainerStyle={{
          padding: Sizing.padding.s,
        }}
      >
        {[1, 2, 3, 4, 5].map((item) => (
          <ThemedView
            key={item}
            style={{
              width: 80,
              height: 60,
              backgroundColor: colors.secondary + '30',
              borderRadius: Sizing.borderRadius.small,
              justifyContent: 'center',
              alignItems: 'center',
              marginRight: scrollMarginValue,
            }}
          >
            <ThemedText style={{ fontSize: Sizing.typography.fontSize.xs, color: colors.bodyText }}>
              Item {item}
            </ThemedText>
          </ThemedView>
        ))}
      </ScrollView>
      <ThemedText
        style={{
          marginTop: Sizing.spacing.s,
          fontSize: Sizing.typography.fontSize.xs,
          color: colors.bodyText,
          textAlign: 'center',
        }}
      >
        {t('helpers.uiSizeHelper.examples.scrollMargin.title')}: {selectedSize.toUpperCase()} ({scrollMarginValue}px)
      </ThemedText>
    </ThemedView>
  );
}
