import { ThemedText } from '@/src/shared/components/ThemedText';
import { ThemedView } from '@/src/shared/components/ThemedView';
import { Dropdown } from '@/src/shared/components/Dropdown';
import { t } from '@/src/shared/i18n';
import { Sizing, uiSizeHelper, useResponsive } from 'masterfabric-expo-core';
import { getThemeColors, useTheme } from 'masterfabric-expo-core';
import React, { useState } from 'react';
import { ScrollView, TouchableOpacity, View } from 'react-native';

interface ButtonExampleProps {
  onModalPress: () => void;
}

export function ButtonExample({ onModalPress }: ButtonExampleProps) {
  const { currentTheme } = useTheme();
  const isDark = currentTheme === 'dark';
  const colors = getThemeColors(isDark);
  const { isPhone } = useResponsive();

  const borderRadiusOptions: Array<'small' | 'large'> = ['small', 'large'];
  const buttonHeights: Array<'small' | 'medium' | 'large'> = ['small', 'medium', 'large'];
  const [selectedRadius, setSelectedRadius] = useState<'small' | 'large'>('large');
  const [selectedHeight, setSelectedHeight] = useState<'small' | 'medium' | 'large'>('medium');

  // Helper methods
  const touchTarget = Sizing.touchTarget.minimum;
  const buttonPaddingH = Sizing.button.padding.horizontal.medium;
  const buttonPaddingV = Sizing.button.padding.vertical.medium;

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
          {t('uiSizeHelper.examples.button.title')}
        </ThemedText>

        <ThemedText
          style={{
            fontSize: Sizing.typography.fontSize.s,
            marginBottom: Sizing.spacing.l,
            color: colors.bodyText,
          }}
        >
          {t('uiSizeHelper.examples.button.description')}
        </ThemedText>

        {/* Controls */}
        <View
          style={{
            flexDirection: isPhone ? 'column' : 'row',
            gap: Sizing.gap.m,
            marginBottom: Sizing.spacing.l,
          }}
        >
          <View style={{ flex: 1 }}>
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
          </View>

          <View style={{ flex: 1 }}>
            <ThemedText
              type="defaultSemiBold"
              style={{
                fontSize: Sizing.typography.fontSize.m,
                marginBottom: Sizing.spacing.s,
              }}
            >
              Button Height
            </ThemedText>
            <Dropdown
              options={buttonHeights.map((height) => ({
                label: `${height.toUpperCase()}: ${Sizing.button.height[height]}px`,
                value: height,
              }))}
              selectedValue={selectedHeight}
              onSelect={(value) => setSelectedHeight(value as 'small' | 'medium' | 'large')}
              placeholder="Select height"
            />
          </View>
        </View>

        {/* Button Examples */}
        <View
          style={{
            gap: Sizing.gap.m,
          }}
        >
          {/* Primary Button */}
          <View>
            <ThemedText
              type="defaultSemiBold"
              style={{
                fontSize: Sizing.typography.fontSize.xs,
                marginBottom: Sizing.spacing.xs,
                color: colors.bodyText,
              }}
            >
              Primary Button
            </ThemedText>
            <TouchableOpacity
              style={{
                width: '100%',
                height: Sizing.button.height[selectedHeight],
                backgroundColor: colors.primary,
                borderRadius: Sizing.borderRadius[selectedRadius],
                justifyContent: 'center',
                alignItems: 'center',
                paddingHorizontal: buttonPaddingH,
                paddingVertical: buttonPaddingV,
                minHeight: touchTarget,
              }}
              activeOpacity={0.8}
            >
              <ThemedText
                style={{
                  color: '#FFFFFF',
                  fontWeight: Sizing.typography.fontWeight.semibold,
                  fontSize: Sizing.typography.fontSize.m,
                }}
                numberOfLines={1}
              >
                {t('uiSizeHelper.examples.button.action')}
              </ThemedText>
            </TouchableOpacity>
            <ThemedText
              style={{
                fontSize: Sizing.typography.fontSize.xs,
                color: colors.bodyText,
                marginTop: Sizing.spacing.xs,
                textAlign: 'center',
              }}
            >
              Height: {selectedHeight} ({Sizing.button.height[selectedHeight]}px) · Radius: {selectedRadius} ({Sizing.borderRadius[selectedRadius]}px)
            </ThemedText>
          </View>

          {/* Secondary Button */}
          <View>
            <ThemedText
              type="defaultSemiBold"
              style={{
                fontSize: Sizing.typography.fontSize.xs,
                marginBottom: Sizing.spacing.xs,
                color: colors.bodyText,
              }}
            >
              Secondary Button
            </ThemedText>
            <TouchableOpacity
              style={{
                width: '100%',
                height: Sizing.button.height[selectedHeight],
                backgroundColor: colors.surfaceBackground,
                borderRadius: Sizing.borderRadius[selectedRadius],
                borderWidth: Sizing.borderWidth.s,
                borderColor: colors.surfaceBorder,
                justifyContent: 'center',
                alignItems: 'center',
                paddingHorizontal: buttonPaddingH,
                paddingVertical: buttonPaddingV,
                minHeight: touchTarget,
              }}
              activeOpacity={0.8}
            >
              <ThemedText
                style={{
                  color: colors.text,
                  fontWeight: Sizing.typography.fontWeight.semibold,
                  fontSize: Sizing.typography.fontSize.m,
                }}
                numberOfLines={1}
              >
                Secondary Action
              </ThemedText>
            </TouchableOpacity>
          </View>

          {/* Modal Button */}
          <View>
            <ThemedText
              type="defaultSemiBold"
              style={{
                fontSize: Sizing.typography.fontSize.xs,
                marginBottom: Sizing.spacing.xs,
                color: colors.bodyText,
              }}
            >
              {t('uiSizeHelper.examples.button.modalExample')}
            </ThemedText>
            <TouchableOpacity
              onPress={onModalPress}
              style={{
                width: '100%',
                height: Sizing.button.height.medium,
                backgroundColor: colors.primary,
                borderRadius: Sizing.borderRadius.large,
                paddingHorizontal: Sizing.button.padding.horizontal.medium,
                paddingVertical: Sizing.button.padding.vertical.medium,
                alignItems: 'center',
                justifyContent: 'center',
                minHeight: touchTarget,
              }}
              activeOpacity={0.8}
            >
              <ThemedText
                style={{
                  color: '#FFFFFF',
                  fontWeight: Sizing.typography.fontWeight.semibold,
                  fontSize: Sizing.typography.fontSize.m,
                }}
                numberOfLines={1}
              >
                {t('uiSizeHelper.examples.button.openModal')}
              </ThemedText>
            </TouchableOpacity>
          </View>
        </View>

        {/* Helper Info */}
        <ThemedView
          style={{
            marginTop: Sizing.spacing.l,
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
            Button Properties:
          </ThemedText>
          <ThemedText
            style={{
              fontSize: Sizing.typography.fontSize.xs,
              color: colors.bodyText,
              marginBottom: Sizing.spacing.xxs,
            }}
          >
            • Touch Target: {touchTarget}px (minimum)
          </ThemedText>
          <ThemedText
            style={{
              fontSize: Sizing.typography.fontSize.xs,
              color: colors.bodyText,
              marginBottom: Sizing.spacing.xxs,
            }}
          >
            • Padding H: {buttonPaddingH}px · V: {buttonPaddingV}px
          </ThemedText>
          <ThemedText
            style={{
              fontSize: Sizing.typography.fontSize.xs,
              color: colors.bodyText,
            }}
          >
            • Border Radius: {Sizing.borderRadius.small}px / {Sizing.borderRadius.large}px
          </ThemedText>
        </ThemedView>
      </ThemedView>
    </ScrollView>
  );
}
