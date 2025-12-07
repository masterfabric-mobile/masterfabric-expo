import { Dropdown } from '@/src/shared/components/Dropdown';
import { ThemedText } from '@/src/shared/components/ThemedText';
import { ThemedView } from '@/src/shared/components/ThemedView';
import { t } from '@/src/shared/i18n';
import { Sizing, getThemeColors, useTheme } from 'masterfabric-expo-core';
import React, { useState } from 'react';
import { TouchableOpacity, View } from 'react-native';

export function ButtonHeightExampleCard() {
  const { currentTheme } = useTheme();
  const isDark = currentTheme === 'dark';
  const colors = getThemeColors(isDark);

  const buttonHeights: Array<'small' | 'medium' | 'large'> = ['small', 'medium', 'large'];
  const [selectedSize, setSelectedSize] = useState<'small' | 'medium' | 'large'>('medium');
  const buttonHeightValue = Sizing.button.height[selectedSize];

  const sizeOptions = buttonHeights.map((size) => ({
    label: `${size.charAt(0).toUpperCase() + size.slice(1)}: ${Sizing.button.height[size]}px`,
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
        {t('helpers.uiSizeHelper.examples.buttonHeight.title')}
      </ThemedText>
      <ThemedText
        style={{
          fontSize: Sizing.typography.fontSize.s,
          marginBottom: Sizing.spacing.m,
          color: colors.bodyText,
        }}
      >
        {t('helpers.uiSizeHelper.examples.buttonHeight.description')}
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
          {t('helpers.uiSizeHelper.examples.buttonHeight.selectSize')}
        </ThemedText>
        <Dropdown
          options={sizeOptions}
          selectedValue={selectedSize}
          onSelect={(value) => setSelectedSize(value as 'small' | 'medium' | 'large')}
          placeholder={t('helpers.uiSizeHelper.examples.buttonHeight.selectSize')}
        />
      </View>

      {/* Live Example */}
      <View style={{ gap: Sizing.gap.m }}>
        <TouchableOpacity
          style={{
            width: '100%',
            height: buttonHeightValue,
            backgroundColor: colors.primary,
            borderRadius: Sizing.borderRadius.large,
            justifyContent: 'center',
            alignItems: 'center',
            paddingHorizontal: Sizing.button.padding.horizontal.medium,
          }}
          activeOpacity={0.8}
        >
          <ThemedText
            style={{
              color: '#FFFFFF',
              fontSize: Sizing.typography.fontSize.m,
              fontWeight: Sizing.typography.fontWeight.semibold,
            }}
          >
            {t('helpers.uiSizeHelper.examples.buttonHeight.title')} ({buttonHeightValue}px)
          </ThemedText>
        </TouchableOpacity>
        <TouchableOpacity
          style={{
            width: '100%',
            height: buttonHeightValue,
            backgroundColor: colors.surfaceBackground,
            borderRadius: Sizing.borderRadius.large,
            borderWidth: Sizing.borderWidth.s,
            borderColor: colors.surfaceBorder,
            justifyContent: 'center',
            alignItems: 'center',
            paddingHorizontal: Sizing.button.padding.horizontal.medium,
          }}
          activeOpacity={0.8}
        >
          <ThemedText
            style={{
              color: colors.text,
              fontSize: Sizing.typography.fontSize.m,
              fontWeight: Sizing.typography.fontWeight.semibold,
            }}
          >
            Secondary ({buttonHeightValue}px)
          </ThemedText>
        </TouchableOpacity>
      </View>
    </ThemedView>
  );
}
