import { ThemedText } from '@/src/shared/components/ThemedText';
import { ThemedView } from '@/src/shared/components/ThemedView';
import { Dropdown } from '@/src/shared/components/Dropdown';
import { t } from '@/src/shared/i18n';
import { Sizing, Spacer } from 'masterfabric-expo-core';
import { getThemeColors, useTheme } from 'masterfabric-expo-core';
import React, { useState } from 'react';
import { View } from 'react-native';

export function SpacingExample() {
  const { currentTheme } = useTheme();
  const isDark = currentTheme === 'dark';
  const colors = getThemeColors(isDark);

  const spacingSizes: Array<keyof typeof Sizing.spacing> = ['xxs', 'xs', 's', 'm', 'l', 'xl', 'xxl', 'xxxl'];
  const [selectedSpacing, setSelectedSpacing] = useState<keyof typeof Sizing.spacing>('m');
  const [selectedSpacer, setSelectedSpacer] = useState<keyof typeof Sizing.spacer>('m');

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
        {t('uiSizeHelper.examples.spacing.title')}
      </ThemedText>

      {/* Interactive Spacing */}
      <View style={{ marginBottom: Sizing.spacing.l }}>
        <ThemedText
          type="defaultSemiBold"
          style={{
            fontSize: Sizing.typography.fontSize.m,
            marginBottom: Sizing.spacing.s,
          }}
        >
          {t('uiSizeHelper.examples.spacing.interactive')}
        </ThemedText>
        <Dropdown
          options={spacingSizes.map((size) => ({
            label: `${size.toUpperCase()}: ${Sizing.spacing[size]}px`,
            value: size,
          }))}
          selectedValue={selectedSpacing}
          onSelect={(value) => setSelectedSpacing(value as keyof typeof Sizing.spacing)}
          placeholder={t('uiSizeHelper.placeholders.selectSpacing')}
        />
        <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: Sizing.spacing.m, flexWrap: 'wrap' }}>
          <ThemedView
            style={{
              width: Sizing.spacing[selectedSpacing],
              height: Sizing.spacing[selectedSpacing],
              backgroundColor: colors.primary,
              borderRadius: Sizing.borderRadius.small,
              marginRight: Sizing.spacing.s,
            }}
          />
          <ThemedText
            style={{
              fontSize: Sizing.typography.fontSize.s,
              color: colors.bodyText,
              flex: 1,
              flexShrink: 1,
            }}
            numberOfLines={2}
          >
            {selectedSpacing} = {Sizing.spacing[selectedSpacing]}px
          </ThemedText>
        </View>
      </View>

      {/* Interactive Spacer Component */}
      <View>
        <ThemedText
          type="defaultSemiBold"
          style={{
            fontSize: Sizing.typography.fontSize.m,
            marginBottom: Sizing.spacing.s,
          }}
        >
          {t('uiSizeHelper.examples.spacing.spacerComponent')}
        </ThemedText>
        <Dropdown
          options={spacingSizes.map((size) => ({
            label: `${size.toUpperCase()}: ${Sizing.spacer[size]}px`,
            value: size,
          }))}
          selectedValue={selectedSpacer}
          onSelect={(value) => setSelectedSpacer(value as keyof typeof Sizing.spacer)}
          placeholder={t('uiSizeHelper.placeholders.selectSpacer')}
        />
        <View style={{ marginTop: Sizing.spacing.m }}>
          <ThemedView
            style={{
              height: Sizing.height.xs,
              width: '100%',
              backgroundColor: colors.primary,
              borderRadius: Sizing.borderRadius.small,
            }}
          />
          <Spacer size={selectedSpacer} />
          <ThemedView
            style={{
              height: Sizing.height.xs,
              width: '100%',
              backgroundColor: colors.primary,
              borderRadius: Sizing.borderRadius.small,
            }}
          />
        </View>
      </View>
    </ThemedView>
  );
}
