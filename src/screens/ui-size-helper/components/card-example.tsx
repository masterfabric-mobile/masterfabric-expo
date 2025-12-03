import { ThemedText } from '@/src/shared/components/ThemedText';
import { ThemedView } from '@/src/shared/components/ThemedView';
import { Dropdown } from '@/src/shared/components/Dropdown';
import { t } from '@/src/shared/i18n';
import { Sizing, uiSizeHelper, useResponsive } from 'masterfabric-expo-core';
import { getThemeColors, useTheme } from 'masterfabric-expo-core';
import React, { useState } from 'react';
import { ScrollView, TouchableOpacity, View } from 'react-native';

export function CardExample() {
  const { currentTheme } = useTheme();
  const isDark = currentTheme === 'dark';
  const colors = getThemeColors(isDark);
  const { isPhone } = useResponsive();

  const cardPaddings: Array<keyof typeof Sizing.card.padding> = [
    'xxs', 'xs', 'small', 'medium', 'large', 'xl', 'xxl'
  ];

  const borderRadiusOptions: Array<'small' | 'large'> = ['small', 'large'];
  const borderWidthOptions: Array<'s' | 'm' | 'l'> = ['s', 'm', 'l'];

  const [selectedPadding, setSelectedPadding] = useState<keyof typeof Sizing.card.padding>('medium');
  const [selectedRadius, setSelectedRadius] = useState<'small' | 'large'>('large');
  const [selectedBorderWidth, setSelectedBorderWidth] = useState<'s' | 'm' | 'l'>('s');

  // Helper methods
  const deviceType = uiSizeHelper.getDeviceTypeAuto();
  const cardWidth = deviceType === 'phone' 
    ? Sizing.card.width.small 
    : deviceType === 'tablet' 
    ? Sizing.card.width.medium 
    : Sizing.card.width.large;

  return (
    <ScrollView
      style={{ flex: 1 }}
      contentContainerStyle={{
        padding: Sizing.padding.m,
      }}
      showsVerticalScrollIndicator={false}
    >
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
          {t('uiSizeHelper.examples.card.title')}
        </ThemedText>

        <ThemedText
          style={{
            fontSize: Sizing.typography.fontSize.s,
            marginBottom: Sizing.spacing.l,
            color: colors.bodyText,
          }}
        >
          {t('uiSizeHelper.examples.card.description')}
        </ThemedText>

        {/* Controls */}
        <View
          style={{
            flexDirection: isPhone ? 'column' : 'row',
            flexWrap: 'wrap',
            gap: Sizing.gap.s,
            marginBottom: Sizing.spacing.l,
          }}
        >
          <View style={{ flex: isPhone ? 1 : 0.32, minWidth: Sizing.minWidth.s }}>
            <ThemedText
              type="defaultSemiBold"
              style={{
                fontSize: Sizing.typography.fontSize.m,
                marginBottom: Sizing.spacing.s,
              }}
            >
              {t('uiSizeHelper.examples.card.interactivePadding')}
            </ThemedText>
            <Dropdown
              options={cardPaddings.map((padding) => ({
                label: `${padding.toUpperCase()}: ${Sizing.card.padding[padding]}px`,
                value: padding,
              }))}
              selectedValue={selectedPadding}
              onSelect={(value) => setSelectedPadding(value as keyof typeof Sizing.card.padding)}
              placeholder={t('uiSizeHelper.placeholders.selectCardPadding')}
            />
          </View>

          <View style={{ flex: isPhone ? 1 : 0.32, minWidth: Sizing.minWidth.s }}>
            <ThemedText
              type="defaultSemiBold"
              style={{
                fontSize: Sizing.typography.fontSize.m,
                marginBottom: Sizing.spacing.s,
              }}
            >
              {t('uiSizeHelper.examples.card.interactiveRadius')}
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
          </View>

          <View style={{ flex: isPhone ? 1 : 0.32, minWidth: Sizing.minWidth.s }}>
            <ThemedText
              type="defaultSemiBold"
              style={{
                fontSize: Sizing.typography.fontSize.m,
                marginBottom: Sizing.spacing.s,
              }}
            >
              {t('uiSizeHelper.examples.card.interactiveWidth')}
            </ThemedText>
            <Dropdown
              options={borderWidthOptions.map((width) => ({
                label: `${width.toUpperCase()}: ${Sizing.borderWidth[width]}px`,
                value: width,
              }))}
              selectedValue={selectedBorderWidth}
              onSelect={(value) => setSelectedBorderWidth(value as 's' | 'm' | 'l')}
              placeholder={t('uiSizeHelper.placeholders.selectWidth')}
            />
          </View>
        </View>

        {/* Profile Card Example */}
        <ThemedView
          style={{
            backgroundColor: colors.surfaceBackground,
            borderRadius: Sizing.borderRadius[selectedRadius],
            padding: Sizing.card.padding[selectedPadding],
            borderWidth: Sizing.borderWidth[selectedBorderWidth],
            borderColor: colors.surfaceBorder,
            width: '100%',
            maxWidth: cardWidth,
            alignSelf: 'center',
            marginBottom: Sizing.spacing.m,
          }}
        >
          {/* Avatar Section */}
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              marginBottom: Sizing.spacing.m,
              gap: Sizing.gap.m,
            }}
          >
            <ThemedView
              style={{
                width: Sizing.avatar.l,
                height: Sizing.avatar.l,
                borderRadius: Sizing.avatar.l / 2,
                backgroundColor: colors.primary,
                justifyContent: 'center',
                alignItems: 'center',
              }}
            >
              <ThemedText
                style={{
                  color: '#FFFFFF',
                  fontSize: Sizing.typography.fontSize.l,
                  fontWeight: Sizing.typography.fontWeight.semibold,
                }}
              >
                JD
              </ThemedText>
            </ThemedView>
            <View style={{ flex: 1 }}>
              <ThemedText
                type="defaultSemiBold"
                style={{
                  fontSize: Sizing.typography.fontSize.l,
                  marginBottom: Sizing.spacing.xxs,
                }}
              >
                John Doe
              </ThemedText>
              <ThemedText
                style={{
                  fontSize: Sizing.typography.fontSize.s,
                  color: colors.bodyText,
                }}
              >
                Software Developer
              </ThemedText>
            </View>
          </View>

          {/* Content */}
          <ThemedText
            style={{
              fontSize: Sizing.typography.fontSize.m,
              color: colors.text,
              marginBottom: Sizing.spacing.xs,
            }}
          >
            {t('uiSizeHelper.examples.card.title')}
          </ThemedText>
          <ThemedText
            style={{
              fontSize: Sizing.typography.fontSize.s,
              color: colors.bodyText,
              lineHeight: Sizing.typography.fontSize.s * Sizing.typography.lineHeight.normal,
              marginBottom: Sizing.spacing.m,
            }}
          >
            {t('uiSizeHelper.examples.card.content')}
          </ThemedText>

          {/* Action Buttons */}
          <View
            style={{
              flexDirection: 'row',
              gap: Sizing.gap.s,
            }}
          >
            <TouchableOpacity
              style={{
                flex: 1,
                height: Sizing.button.height.small,
                backgroundColor: colors.primary,
                borderRadius: Sizing.borderRadius.small,
                paddingHorizontal: Sizing.button.padding.horizontal.small,
                paddingVertical: Sizing.button.padding.vertical.small,
                justifyContent: 'center',
                alignItems: 'center',
              }}
              activeOpacity={0.8}
            >
              <ThemedText
                style={{
                  color: '#FFFFFF',
                  fontWeight: Sizing.typography.fontWeight.semibold,
                  fontSize: Sizing.typography.fontSize.s,
                }}
              >
                Follow
              </ThemedText>
            </TouchableOpacity>

            <TouchableOpacity
              style={{
                flex: 1,
                height: Sizing.button.height.small,
                backgroundColor: colors.surfaceBackground,
                borderRadius: Sizing.borderRadius.small,
                borderWidth: Sizing.borderWidth.s,
                borderColor: colors.surfaceBorder,
                paddingHorizontal: Sizing.button.padding.horizontal.small,
                paddingVertical: Sizing.button.padding.vertical.small,
                justifyContent: 'center',
                alignItems: 'center',
              }}
              activeOpacity={0.8}
            >
              <ThemedText
                style={{
                  color: colors.text,
                  fontWeight: Sizing.typography.fontWeight.semibold,
                  fontSize: Sizing.typography.fontSize.s,
                }}
              >
                Message
              </ThemedText>
            </TouchableOpacity>
          </View>
        </ThemedView>

        {/* Value Display */}
        <ThemedView
          style={{
            padding: Sizing.padding.m,
            backgroundColor: colors.surfaceBackground,
            borderRadius: Sizing.borderRadius.small,
            borderWidth: Sizing.borderWidth.s,
            borderColor: colors.surfaceBorder,
          }}
        >
          <ThemedText
            style={{
              fontSize: Sizing.typography.fontSize.xs,
              color: colors.bodyText,
              marginBottom: Sizing.spacing.xxs,
            }}
          >
            Padding: {selectedPadding.toUpperCase()} = {Sizing.card.padding[selectedPadding]}px
          </ThemedText>
          <ThemedText
            style={{
              fontSize: Sizing.typography.fontSize.xs,
              color: colors.bodyText,
              marginBottom: Sizing.spacing.xxs,
            }}
          >
            Border Radius: {selectedRadius.toUpperCase()} = {Sizing.borderRadius[selectedRadius]}px
          </ThemedText>
          <ThemedText
            style={{
              fontSize: Sizing.typography.fontSize.xs,
              color: colors.bodyText,
            }}
          >
            Border Width: {selectedBorderWidth.toUpperCase()} = {Sizing.borderWidth[selectedBorderWidth]}px
          </ThemedText>
        </ThemedView>

        {/* Helper Info */}
        <ThemedView
          style={{
            marginTop: Sizing.spacing.m,
            padding: Sizing.padding.m,
            backgroundColor: colors.surfaceBackground,
            borderRadius: Sizing.borderRadius.small,
            borderWidth: Sizing.borderWidth.s,
            borderColor: colors.surfaceBorder,
          }}
        >
          <ThemedText
            type="defaultSemiBold"
            style={{
              fontSize: Sizing.typography.fontSize.xs,
              marginBottom: Sizing.spacing.xs,
              color: colors.primary,
            }}
          >
            Card Properties:
          </ThemedText>
          <ThemedText
            style={{
              fontSize: Sizing.typography.fontSize.xs,
              color: colors.bodyText,
              marginBottom: Sizing.spacing.xxs,
            }}
          >
            • Device Type: {deviceType} · Card Width: {cardWidth}px
          </ThemedText>
          <ThemedText
            style={{
              fontSize: Sizing.typography.fontSize.xs,
              color: colors.bodyText,
              marginBottom: Sizing.spacing.xxs,
            }}
          >
            • Min Height: {Sizing.card.minHeight.small}px / {Sizing.card.minHeight.medium}px
          </ThemedText>
          <ThemedText
            style={{
              fontSize: Sizing.typography.fontSize.xs,
              color: colors.bodyText,
            }}
          >
            • Avatar Sizes: {Sizing.avatar.s}px / {Sizing.avatar.m}px / {Sizing.avatar.l}px
          </ThemedText>
        </ThemedView>
      </ThemedView>
    </ScrollView>
  );
}
