import { Dropdown } from '@/src/shared/components/Dropdown';
import { ThemedText } from '@/src/shared/components/ThemedText';
import { ThemedView } from '@/src/shared/components/ThemedView';
import { t } from '@/src/shared/i18n';
import { Sizing, getThemeColors, useTheme } from 'masterfabric-expo-core';
import React, { useState } from 'react';
import { View } from 'react-native';

export function PaddingExampleCard() {
  const { currentTheme } = useTheme();
  const isDark = currentTheme === 'dark';
  const colors = getThemeColors(isDark);

  const paddingSizes: Array<keyof typeof Sizing.padding> = ['xxs', 'xs', 's', 'm', 'l', 'xl', 'xxl', 'xxxl'];
  const [selectedSize, setSelectedSize] = useState<keyof typeof Sizing.padding>('m');
  const paddingValue = Sizing.padding[selectedSize];

  const sizeOptions = paddingSizes.map((size) => ({
    label: `${size.toUpperCase()}: ${Sizing.padding[size]}px`,
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
        {t('helpers.uiSizeHelper.examples.padding.title')}
      </ThemedText>
      <ThemedText
        style={{
          fontSize: Sizing.typography.fontSize.s,
          marginBottom: Sizing.spacing.m,
          color: colors.bodyText,
        }}
      >
        {t('helpers.uiSizeHelper.examples.padding.description')}
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
          {t('helpers.uiSizeHelper.examples.padding.selectSize')}
        </ThemedText>
        <Dropdown
          options={sizeOptions}
          selectedValue={selectedSize}
          onSelect={(value) => setSelectedSize(value as keyof typeof Sizing.padding)}
          placeholder={t('helpers.uiSizeHelper.examples.padding.selectSize')}
        />
      </View>

      {/* Live Example */}
      <ThemedView
        style={{
          backgroundColor: colors.cardBackground,
          borderRadius: Sizing.borderRadius.small,
          borderWidth: Sizing.borderWidth.s,
          borderColor: colors.surfaceBorder,
        }}
      >
        <ThemedView
          style={{
            padding: paddingValue,
            backgroundColor: colors.primary + '20',
            borderRadius: Sizing.borderRadius.small,
          }}
        >
          <ThemedText
            style={{
              color: colors.bodyText,
              fontSize: Sizing.typography.fontSize.s,
              textAlign: 'center',
            }}
          >
            {t('helpers.uiSizeHelper.examples.padding.title')}: {selectedSize.toUpperCase()} ({paddingValue}px)
          </ThemedText>
        </ThemedView>
      </ThemedView>
    </ThemedView>
  );
}
