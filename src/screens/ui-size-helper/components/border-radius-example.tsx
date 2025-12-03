import { ThemedText } from '@/src/shared/components/ThemedText';
import { ThemedView } from '@/src/shared/components/ThemedView';
import { Dropdown } from '@/src/shared/components/Dropdown';
import { t } from '@/src/shared/i18n';
import { Sizing } from 'masterfabric-expo-core';
import { getThemeColors, useTheme } from 'masterfabric-expo-core';
import React, { useState } from 'react';
import { View } from 'react-native';

export function BorderRadiusExample() {
  const { currentTheme } = useTheme();
  const isDark = currentTheme === 'dark';
  const colors = getThemeColors(isDark);

  const borderRadiusOptions: Array<'small' | 'large'> = ['small', 'large'];
  const borderWidthOptions: Array<'none' | 'hairline' | 's' | 'm' | 'l' | 'xl' | 'xxl'> = ['none', 'hairline', 's', 'm', 'l', 'xl', 'xxl'];
  
  const [selectedRadius, setSelectedRadius] = useState<'small' | 'large'>('small');
  const [selectedWidth, setSelectedWidth] = useState<'none' | 'hairline' | 's' | 'm' | 'l' | 'xl' | 'xxl'>('s');

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
        {t('uiSizeHelper.examples.borderRadius.title')}
      </ThemedText>

      {/* Interactive Border Radius */}
      <View style={{ marginBottom: Sizing.spacing.l }}>
        <ThemedText
          type="defaultSemiBold"
          style={{
            fontSize: Sizing.typography.fontSize.m,
            marginBottom: Sizing.spacing.s,
          }}
        >
          {t('uiSizeHelper.examples.borderRadius.interactive')}
        </ThemedText>
        <Dropdown
          options={borderRadiusOptions.map((radius) => ({
            label: `${radius.toUpperCase()} (${Sizing.borderRadius[radius]}px)`,
            value: radius,
          }))}
          selectedValue={selectedRadius}
          onSelect={(value) => setSelectedRadius(value as 'small' | 'large')}
          placeholder={t('uiSizeHelper.placeholders.selectRadius')}
        />
        <View style={{ flexDirection: 'row', gap: Sizing.gap.m, marginTop: Sizing.spacing.m, flexWrap: 'wrap' }}>
          <ThemedView
            style={{
              width: Sizing.width.m,
              minWidth: 80,
              height: Sizing.height.m,
              backgroundColor: colors.primary,
              borderRadius: Sizing.borderRadius[selectedRadius],
              justifyContent: 'center',
              alignItems: 'center',
              paddingHorizontal: Sizing.spacing.xs,
            }}
          >
            <ThemedText
              style={{
                color: '#FFFFFF',
                fontSize: Sizing.typography.fontSize.xs,
              }}
              numberOfLines={2}
              adjustsFontSizeToFit
            >
              {selectedRadius.toUpperCase()} ({Sizing.borderRadius[selectedRadius]}px)
            </ThemedText>
          </ThemedView>
        </View>
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
          {t('uiSizeHelper.examples.borderRadius.interactiveWidth')}
        </ThemedText>
        <Dropdown
          options={borderWidthOptions.map((width) => ({
            label: `${width.toUpperCase()}: ${width === 'none' ? '0' : width === 'hairline' ? 'hairline' : `${Sizing.borderWidth[width]}px`}`,
            value: width,
          }))}
          selectedValue={selectedWidth}
          onSelect={(value) => setSelectedWidth(value as typeof selectedWidth)}
          placeholder={t('uiSizeHelper.placeholders.selectWidth')}
        />
        <ThemedView
          style={{
            width: '100%',
            height: Sizing.height.xs,
            backgroundColor: colors.surfaceBackground,
            borderWidth: selectedWidth === 'none' 
              ? Sizing.borderWidth.none 
              : selectedWidth === 'hairline'
              ? Sizing.borderWidth.hairline
              : Sizing.borderWidth[selectedWidth],
            borderColor: colors.primary,
            borderRadius: Sizing.borderRadius.small,
            marginTop: Sizing.spacing.m,
            justifyContent: 'center',
            paddingHorizontal: Sizing.padding.s,
          }}
        >
          <ThemedText
            style={{
              fontSize: Sizing.typography.fontSize.xs,
              color: colors.text,
            }}
            numberOfLines={1}
          >
            {selectedWidth}: {selectedWidth === 'none' ? '0' : selectedWidth === 'hairline' ? 'hairline' : `${Sizing.borderWidth[selectedWidth]}px`}
          </ThemedText>
        </ThemedView>
      </View>
    </ThemedView>
  );
}
