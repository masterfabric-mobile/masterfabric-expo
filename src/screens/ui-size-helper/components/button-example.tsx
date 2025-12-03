import { ThemedText } from '@/src/shared/components/ThemedText';
import { ThemedView } from '@/src/shared/components/ThemedView';
import { Dropdown } from '@/src/shared/components/Dropdown';
import { t } from '@/src/shared/i18n';
import { Sizing } from 'masterfabric-expo-core';
import { getThemeColors, useTheme } from 'masterfabric-expo-core';
import React, { useState } from 'react';
import { TouchableOpacity, View } from 'react-native';

interface ButtonExampleProps {
  onModalPress: () => void;
}

export function ButtonExample({ onModalPress }: ButtonExampleProps) {
  const { currentTheme } = useTheme();
  const isDark = currentTheme === 'dark';
  const colors = getThemeColors(isDark);

  const borderRadiusOptions: Array<'small' | 'large'> = ['small', 'large'];
  
  const [selectedRadius, setSelectedRadius] = useState<'small' | 'large'>('large');

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
        {t('uiSizeHelper.examples.button.title')}
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
          {t('uiSizeHelper.examples.button.interactiveRadius')}
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
        <View style={{ marginTop: Sizing.spacing.m }}>
          <ThemedView
            style={{
              width: '100%',
              height: Sizing.button.height.medium,
              backgroundColor: colors.primary,
              borderRadius: Sizing.borderRadius[selectedRadius],
              justifyContent: 'center',
              alignItems: 'center',
              paddingHorizontal: Sizing.spacing.s,
            }}
          >
            <ThemedText
              style={{
                color: '#FFFFFF',
                fontWeight: Sizing.typography.fontWeight.semibold,
              }}
              numberOfLines={2}
              adjustsFontSizeToFit
            >
              Border Radius: {selectedRadius.toUpperCase()} ({Sizing.borderRadius[selectedRadius]}px)
            </ThemedText>
          </ThemedView>
        </View>
      </View>

      <TouchableOpacity
        onPress={onModalPress}
        style={{
          backgroundColor: colors.primary,
          borderRadius: Sizing.borderRadius.large,
          height: Sizing.button.height.medium,
          paddingHorizontal: Sizing.button.padding.horizontal.medium,
          alignItems: 'center',
          justifyContent: 'center',
          alignSelf: 'stretch',
        }}
      >
        <ThemedText
          style={{
            color: '#FFFFFF',
            fontWeight: Sizing.typography.fontWeight.semibold,
          }}
          numberOfLines={2}
          adjustsFontSizeToFit
        >
          {t('uiSizeHelper.examples.button.openModal')}
        </ThemedText>
      </TouchableOpacity>
    </ThemedView>
  );
}
