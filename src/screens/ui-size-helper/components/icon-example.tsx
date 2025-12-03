import { ThemedText } from '@/src/shared/components/ThemedText';
import { ThemedView } from '@/src/shared/components/ThemedView';
import { Dropdown } from '@/src/shared/components/Dropdown';
import { t } from '@/src/shared/i18n';
import { Ionicons } from '@expo/vector-icons';
import { Sizing } from 'masterfabric-expo-core';
import { getThemeColors, useTheme } from 'masterfabric-expo-core';
import React, { useState } from 'react';
import { View } from 'react-native';

export function IconExample() {
  const { currentTheme } = useTheme();
  const isDark = currentTheme === 'dark';
  const colors = getThemeColors(isDark);

  const iconSizes: Array<keyof typeof Sizing.icon> = [
    'xxs', 'xs', 's', 'm', 'l', 'xl', 'xxl', 'xxxl'
  ];

  const avatarSizes: Array<keyof typeof Sizing.avatar> = [
    'xxs', 'xs', 's', 'm', 'l', 'xl', 'xxl', 'xxxl'
  ];

  const [selectedIconSize, setSelectedIconSize] = useState<keyof typeof Sizing.icon>('m');
  const [selectedAvatarSize, setSelectedAvatarSize] = useState<keyof typeof Sizing.avatar>('m');

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
        {t('uiSizeHelper.examples.icon.title')}
      </ThemedText>

      {/* Interactive Icon Size */}
      <View style={{ marginBottom: Sizing.spacing.l }}>
        <ThemedText
          type="defaultSemiBold"
          style={{
            fontSize: Sizing.typography.fontSize.m,
            marginBottom: Sizing.spacing.s,
          }}
        >
          {t('uiSizeHelper.examples.icon.interactiveIcon')}
        </ThemedText>
        <Dropdown
          options={iconSizes.map((size) => ({
            label: `${size.toUpperCase()}: ${Sizing.icon[size]}px`,
            value: size,
          }))}
          selectedValue={selectedIconSize}
          onSelect={(value) => setSelectedIconSize(value as keyof typeof Sizing.icon)}
          placeholder={t('uiSizeHelper.placeholders.selectIconSize')}
        />
        <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: Sizing.spacing.m }}>
          <Ionicons
            name="star"
            size={Sizing.icon[selectedIconSize]}
            color={colors.primary}
          />
          <ThemedText
            style={{
              fontSize: Sizing.typography.fontSize.s,
              marginLeft: Sizing.spacing.s,
              color: colors.bodyText,
            }}
          >
            {selectedIconSize} = {Sizing.icon[selectedIconSize]}px
          </ThemedText>
        </View>
      </View>

      {/* Interactive Avatar Size */}
      <View>
        <ThemedText
          type="defaultSemiBold"
          style={{
            fontSize: Sizing.typography.fontSize.m,
            marginBottom: Sizing.spacing.s,
          }}
        >
          {t('uiSizeHelper.examples.icon.interactiveAvatar')}
        </ThemedText>
        <Dropdown
          options={avatarSizes.map((size) => ({
            label: `${size.toUpperCase()}: ${Sizing.avatar[size]}px`,
            value: size,
          }))}
          selectedValue={selectedAvatarSize}
          onSelect={(value) => setSelectedAvatarSize(value as keyof typeof Sizing.avatar)}
          placeholder={t('uiSizeHelper.placeholders.selectAvatarSize')}
        />
        <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: Sizing.spacing.m }}>
          <ThemedView
            style={{
              width: Sizing.avatar[selectedAvatarSize],
              height: Sizing.avatar[selectedAvatarSize],
              borderRadius: Sizing.avatar[selectedAvatarSize] / 2,
              backgroundColor: colors.primary,
              justifyContent: 'center',
              alignItems: 'center',
              marginRight: Sizing.spacing.s,
            }}
          >
            <Ionicons
              name="person"
              size={Sizing.avatar[selectedAvatarSize] * 0.6}
              color="#FFFFFF"
            />
          </ThemedView>
          <ThemedText
            style={{
              fontSize: Sizing.typography.fontSize.s,
              color: colors.bodyText,
            }}
          >
            {selectedAvatarSize} = {Sizing.avatar[selectedAvatarSize]}px
          </ThemedText>
        </View>
      </View>
    </ThemedView>
  );
}
