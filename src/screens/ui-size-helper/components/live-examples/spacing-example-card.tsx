import { Dropdown } from '@/src/shared/components/Dropdown';
import { ThemedText } from '@/src/shared/components/ThemedText';
import { ThemedView } from '@/src/shared/components/ThemedView';
import { t } from '@/src/shared/i18n';
import { Sizing, getThemeColors, useTheme } from 'masterfabric-expo-core';
import React, { useState } from 'react';
import { View } from 'react-native';

export function SpacingExampleCard() {
  const { currentTheme } = useTheme();
  const isDark = currentTheme === 'dark';
  const colors = getThemeColors(isDark);

  const spacingSizes: Array<keyof typeof Sizing.spacing> = ['xxs', 'xs', 's', 'm', 'l', 'xl', 'xxl', 'xxxl'];
  const [selectedSize, setSelectedSize] = useState<keyof typeof Sizing.spacing>('m');
  const spacingValue = Sizing.spacing[selectedSize];

  const sizeOptions = spacingSizes.map((size) => ({
    label: `${size.toUpperCase()}: ${Sizing.spacing[size]}px`,
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
        {t('helpers.uiSizeHelper.examples.spacing.title')}
      </ThemedText>
      <ThemedText
        style={{
          fontSize: Sizing.typography.fontSize.s,
          marginBottom: Sizing.spacing.m,
          color: colors.bodyText,
        }}
      >
        {t('helpers.uiSizeHelper.examples.spacing.description')}
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
          {t('helpers.uiSizeHelper.examples.spacing.selectSize')}
        </ThemedText>
        <Dropdown
          options={sizeOptions}
          selectedValue={selectedSize}
          onSelect={(value) => setSelectedSize(value as keyof typeof Sizing.spacing)}
          placeholder={t('helpers.uiSizeHelper.examples.spacing.selectSize')}
        />
      </View>

      {/* Live Example */}
      <ThemedView
        style={{
          backgroundColor: colors.cardBackground,
          borderRadius: Sizing.borderRadius.small,
          padding: Sizing.padding.m,
          borderWidth: Sizing.borderWidth.m,
          borderColor: colors.primary + '60',
        }}
      >
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: spacingValue }}>
          <View
            style={{
              width: 50,
              height: 50,
              backgroundColor: colors.primary,
              borderRadius: Sizing.borderRadius.small,
              borderWidth: Sizing.borderWidth.s,
              borderColor: colors.primary + '80',
              justifyContent: 'center',
              alignItems: 'center',
            }}
          >
            <ThemedText style={{ color: '#FFFFFF', fontSize: Sizing.typography.fontSize.xs, fontWeight: Sizing.typography.fontWeight.semibold }}>
              A
            </ThemedText>
          </View>
          <View
            style={{
              width: 50,
              height: 50,
              backgroundColor: colors.secondary,
              borderRadius: Sizing.borderRadius.small,
              borderWidth: Sizing.borderWidth.s,
              borderColor: colors.secondary + '80',
              justifyContent: 'center',
              alignItems: 'center',
            }}
          >
            <ThemedText style={{ color: '#FFFFFF', fontSize: Sizing.typography.fontSize.xs, fontWeight: Sizing.typography.fontWeight.semibold }}>
              B
            </ThemedText>
          </View>
          <View
            style={{
              width: 50,
              height: 50,
              backgroundColor: colors.tertiary,
              borderRadius: Sizing.borderRadius.small,
              borderWidth: Sizing.borderWidth.s,
              borderColor: colors.tertiary + '80',
              justifyContent: 'center',
              alignItems: 'center',
            }}
          >
            <ThemedText style={{ color: '#FFFFFF', fontSize: Sizing.typography.fontSize.xs, fontWeight: Sizing.typography.fontWeight.semibold }}>
              C
            </ThemedText>
          </View>
        </View>
        <ThemedText
          style={{
            marginTop: Sizing.spacing.s,
            fontSize: Sizing.typography.fontSize.xs,
            color: colors.bodyText,
            textAlign: 'center',
          }}
        >
          {t('helpers.uiSizeHelper.examples.spacing.title')}: {selectedSize.toUpperCase()} ({spacingValue}px)
        </ThemedText>
      </ThemedView>
    </ThemedView>
  );
}
