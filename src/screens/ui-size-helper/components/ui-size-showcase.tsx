import { ThemedText } from '@/src/shared/components/ThemedText';
import { ThemedView } from '@/src/shared/components/ThemedView';
import { t } from '@/src/shared/i18n';
import { Sizing, Spacer, uiSizeHelper, useResponsive } from 'masterfabric-expo-core';
import { getThemeColors, useTheme } from 'masterfabric-expo-core';
import React from 'react';
import { ScrollView, TextInput, TouchableOpacity, View } from 'react-native';
import { useUISizeHelperStore } from '../store/ui-size-helper-store';

export function UISizeShowcase() {
  const { currentTheme } = useTheme();
  const isDark = currentTheme === 'dark';
  const colors = getThemeColors(isDark);
  const { isPhone } = useResponsive();
  const { testInput } = useUISizeHelperStore();

  const deviceType = uiSizeHelper.getDeviceTypeAuto();
  const columns = uiSizeHelper.getGridColumnsAuto();
  const baseUnit = uiSizeHelper.getBaseUnit();
  const width = uiSizeHelper.getScreenWidth();

  // Get all values from helper
  const spacings = uiSizeHelper.getAllSpacings();
  const paddings = uiSizeHelper.getAllPaddings();
  const margins = uiSizeHelper.getAllMargins();
  const gaps = Object.entries(Sizing.gap).map(([size, value]) => ({ size, value }));
  const buttonHeights = uiSizeHelper.getAllButtonHeights();
  const inputHeights = uiSizeHelper.getAllInputHeights();
  const cardPaddings = uiSizeHelper.getAllCardPaddings();
  const scrollPaddings = uiSizeHelper.getAllScrollPaddings();
  const scrollMargins = uiSizeHelper.getAllScrollMargins();

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
          marginBottom: Sizing.spacing.m,
          color: colors.sectionTitle,
        }}
      >
        {t('helpers.uiSizeHelper.showcase')}
      </ThemedText>

      <ThemedText
        style={{
          fontSize: Sizing.typography.fontSize.s,
          marginBottom: Sizing.spacing.l,
          color: colors.bodyText,
        }}
      >
        {t('helpers.uiSizeHelper.showcaseDescription')}
      </ThemedText>

      {/* Spacing Values */}
      <View style={{ marginBottom: Sizing.spacing.xl }}>
        <ThemedText
          type="defaultSemiBold"
          style={{
            fontSize: Sizing.typography.fontSize.m,
            marginBottom: Sizing.spacing.m,
            color: colors.titleText,
          }}
        >
          {t('helpers.uiSizeHelper.spacing')} ({t('helpers.uiSizeHelper.selected')}: {t(`helpers.uiSizeHelper.sizeLabels.${testInput.spacingSize}`)})
        </ThemedText>
        <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: Sizing.gap.s }}>
          {spacings.map((item, index) => {
            const isSelected = item.size === testInput.spacingSize;
            return (
              <View
                key={index}
                style={{
                  width: Math.max(item.value as number, 30),
                  height: Sizing.height.s,
                  backgroundColor: isSelected ? colors.primary : colors.primary + '80',
                  borderRadius: Sizing.borderRadius.small,
                  justifyContent: 'center',
                  alignItems: 'center',
                  borderWidth: isSelected ? 3 : 0,
                  borderColor: colors.primary,
                  minWidth: 40,
                }}
              >
                <ThemedText
                  style={{
                    color: isSelected ? '#FFFFFF' : '#FFFFFF',
                    fontSize: Sizing.typography.fontSize.xs,
                    fontWeight: Sizing.typography.fontWeight.semibold,
                  }}
                  numberOfLines={1}
                  adjustsFontSizeToFit
                >
                  {item.size}
                </ThemedText>
              </View>
            );
          })}
        </View>
      </View>

      {/* Padding Values */}
      <View style={{ marginBottom: Sizing.spacing.xl }}>
        <ThemedText
          type="defaultSemiBold"
          style={{
            fontSize: Sizing.typography.fontSize.m,
            marginBottom: Sizing.spacing.m,
            color: colors.titleText,
          }}
        >
          {t('helpers.uiSizeHelper.padding')} ({t('helpers.uiSizeHelper.selected')}: {t(`helpers.uiSizeHelper.sizeLabels.${testInput.paddingSize}`)})
        </ThemedText>
        <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: Sizing.gap.s }}>
          {paddings.slice(0, 6).map((item, index) => {
            const isSelected = item.size === testInput.paddingSize;
            return (
              <ThemedView
                key={index}
                style={{
                  padding: item.value as number,
                  backgroundColor: isSelected ? colors.primary + '20' : colors.cardBackground,
                  borderRadius: Sizing.borderRadius.small,
                  borderWidth: isSelected ? 3 : Sizing.borderWidth.s,
                  borderColor: isSelected ? colors.primary : colors.surfaceBorder,
                }}
              >
                <ThemedText
                  style={{
                    color: colors.bodyText,
                    fontSize: Sizing.typography.fontSize.xs,
                    fontWeight: isSelected ? Sizing.typography.fontWeight.semibold : Sizing.typography.fontWeight.normal,
                  }}
                >
                  {item.size}
                </ThemedText>
              </ThemedView>
            );
          })}
        </View>
      </View>

      {/* Gap Values */}
      <View style={{ marginBottom: Sizing.spacing.xl }}>
        <ThemedText
          type="defaultSemiBold"
          style={{
            fontSize: Sizing.typography.fontSize.m,
            marginBottom: Sizing.spacing.m,
            color: colors.titleText,
          }}
        >
          {t('helpers.uiSizeHelper.gap')} ({t('helpers.uiSizeHelper.selected')}: {t(`helpers.uiSizeHelper.sizeLabels.${testInput.gapSize}`)})
        </ThemedText>
        <View style={{ flexDirection: 'row', gap: Sizing.gap.s, flexWrap: 'wrap' }}>
          {gaps.map((item, index) => {
            const isSelected = item.size === testInput.gapSize;
            return (
              <View
                key={index}
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  padding: Sizing.padding.xs,
                  backgroundColor: isSelected ? colors.primary + '15' : 'transparent',
                  borderRadius: Sizing.borderRadius.small,
                  borderWidth: isSelected ? 2 : 0,
                  borderColor: colors.primary,
                }}
              >
                <View style={{ width: 20, height: 20, backgroundColor: colors.primary, borderRadius: Sizing.borderRadius.small }} />
                <View style={{ width: item.value as number, height: 2, backgroundColor: isSelected ? colors.primary : colors.surfaceBorder }} />
                <View style={{ width: 20, height: 20, backgroundColor: colors.secondary, borderRadius: Sizing.borderRadius.small }} />
                <ThemedText
                  style={{
                    marginLeft: Sizing.spacing.xs,
                    color: colors.bodyText,
                    fontSize: Sizing.typography.fontSize.xs,
                    fontWeight: isSelected ? Sizing.typography.fontWeight.semibold : Sizing.typography.fontWeight.normal,
                  }}
                >
                  {item.size} ({item.value}px)
                </ThemedText>
              </View>
            );
          })}
        </View>
      </View>

      {/* Button Heights */}
      <View style={{ marginBottom: Sizing.spacing.xl }}>
        <ThemedText
          type="defaultSemiBold"
          style={{
            fontSize: Sizing.typography.fontSize.m,
            marginBottom: Sizing.spacing.m,
            color: colors.titleText,
          }}
        >
          {t('helpers.uiSizeHelper.buttonHeight')} ({t('helpers.uiSizeHelper.selected')}: {t(`helpers.uiSizeHelper.sizeLabels.${testInput.buttonHeight}`)})
        </ThemedText>
        <View style={{ gap: Sizing.gap.s }}>
          {buttonHeights.map((item, index) => {
            const isSelected = item.size === testInput.buttonHeight;
            return (
              <TouchableOpacity
                key={index}
                style={{
                  height: item.value as number,
                  backgroundColor: isSelected ? colors.primary : colors.primary + '80',
                  borderRadius: Sizing.borderRadius.large,
                  justifyContent: 'center',
                  alignItems: 'center',
                  paddingHorizontal: Sizing.button.padding.horizontal.medium,
                  borderWidth: isSelected ? 2 : 0,
                  borderColor: colors.primary,
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
                  {item.size} ({item.value}px)
                </ThemedText>
              </TouchableOpacity>
            );
          })}
        </View>
      </View>

      {/* Input Heights */}
      <View style={{ marginBottom: Sizing.spacing.xl }}>
        <ThemedText
          type="defaultSemiBold"
          style={{
            fontSize: Sizing.typography.fontSize.m,
            marginBottom: Sizing.spacing.m,
            color: colors.titleText,
          }}
        >
          {t('helpers.uiSizeHelper.inputHeight')} ({t('helpers.uiSizeHelper.selected')}: {t(`helpers.uiSizeHelper.sizeLabels.${testInput.inputHeight}`)})
        </ThemedText>
        <View style={{ gap: Sizing.gap.s }}>
          {inputHeights.map((item, index) => {
            const isSelected = item.size === testInput.inputHeight;
            return (
              <View
                key={index}
                style={{
                  height: item.value as number,
                  backgroundColor: colors.inputBackground,
                  borderRadius: Sizing.borderRadius.large,
                  borderWidth: isSelected ? 3 : Sizing.borderWidth.s,
                  borderColor: isSelected ? colors.primary : colors.surfaceBorder,
                  justifyContent: 'center',
                  paddingHorizontal: Sizing.input.padding.horizontal.s,
                }}
              >
                <ThemedText
                  style={{
                    color: colors.bodyText,
                    fontSize: Sizing.typography.fontSize.s,
                  }}
                >
                  {item.size} ({item.value}px)
                </ThemedText>
              </View>
            );
          })}
        </View>
      </View>

      {/* Card Paddings */}
      <View style={{ marginBottom: Sizing.spacing.xl }}>
        <ThemedText
          type="defaultSemiBold"
          style={{
            fontSize: Sizing.typography.fontSize.m,
            marginBottom: Sizing.spacing.m,
            color: colors.titleText,
          }}
        >
          {t('helpers.uiSizeHelper.cardPadding')} ({t('helpers.uiSizeHelper.selected')}: {t(`helpers.uiSizeHelper.sizeLabels.${testInput.cardPadding}`) || testInput.cardPadding})
        </ThemedText>
        <View style={{ gap: Sizing.gap.m }}>
          {cardPaddings.map((item, index) => {
            const isSelected = item.size === testInput.cardPadding;
            return (
              <ThemedView
                key={index}
                style={{
                  padding: item.value as number,
                  backgroundColor: colors.cardBackground,
                  borderRadius: Sizing.borderRadius.large,
                  borderWidth: isSelected ? 3 : Sizing.borderWidth.s,
                  borderColor: isSelected ? colors.primary : colors.surfaceBorder,
                }}
              >
                <ThemedText
                  style={{
                    color: colors.bodyText,
                    fontSize: Sizing.typography.fontSize.s,
                  }}
                >
                  {item.size} ({item.value}px)
                </ThemedText>
              </ThemedView>
            );
          })}
        </View>
      </View>

      {/* Border Radius */}
      <View style={{ marginBottom: Sizing.spacing.xl }}>
        <ThemedText
          type="defaultSemiBold"
          style={{
            fontSize: Sizing.typography.fontSize.m,
            marginBottom: Sizing.spacing.m,
            color: colors.titleText,
          }}
        >
          {t('helpers.uiSizeHelper.examples.borderRadius.title')} ({t('helpers.uiSizeHelper.selected')}: {t(`helpers.uiSizeHelper.sizeLabels.${testInput.borderRadius}`)})
        </ThemedText>
        <View style={{ flexDirection: 'row', gap: Sizing.gap.m }}>
          {Object.entries(Sizing.borderRadius).map(([size, value]) => {
            const isSelected = size === testInput.borderRadius;
            return (
              <ThemedView
                key={size}
                style={{
                  width: 80,
                  height: 80,
                  backgroundColor: isSelected ? colors.primary : colors.primary + '80',
                  borderRadius: value,
                  justifyContent: 'center',
                  alignItems: 'center',
                  borderWidth: isSelected ? 3 : 0,
                  borderColor: colors.primary,
                }}
              >
                <ThemedText
                  style={{
                    color: '#FFFFFF',
                    fontSize: Sizing.typography.fontSize.xs,
                    fontWeight: Sizing.typography.fontWeight.semibold,
                  }}
                >
                  {size}
                </ThemedText>
              </ThemedView>
            );
          })}
        </View>
      </View>

      {/* Border Width */}
      <View style={{ marginBottom: Sizing.spacing.xl }}>
        <ThemedText
          type="defaultSemiBold"
          style={{
            fontSize: Sizing.typography.fontSize.m,
            marginBottom: Sizing.spacing.m,
            color: colors.titleText,
          }}
        >
          {t('helpers.uiSizeHelper.examples.borderWidth.title')} ({t('helpers.uiSizeHelper.selected')}: {t(`helpers.uiSizeHelper.sizeLabels.${testInput.borderWidth}`)})
        </ThemedText>
        <View style={{ flexDirection: 'row', gap: Sizing.gap.m, flexWrap: 'wrap' }}>
          {Object.entries(Sizing.borderWidth).filter(([size]) => ['s', 'm', 'l'].includes(size)).map(([size, value]) => {
            const isSelected = size === testInput.borderWidth;
            return (
              <ThemedView
                key={size}
                style={{
                  width: 80,
                  height: 80,
                  backgroundColor: colors.surfaceBackground,
                  borderWidth: value,
                  borderColor: isSelected ? colors.primary : colors.error,
                  justifyContent: 'center',
                  alignItems: 'center',
                  borderRadius: Sizing.borderRadius.small,
                }}
              >
                <ThemedText
                  style={{
                    color: colors.bodyText,
                    fontSize: Sizing.typography.fontSize.xs,
                    fontWeight: isSelected ? Sizing.typography.fontWeight.semibold : Sizing.typography.fontWeight.normal,
                  }}
                >
                  {size} ({value}px)
                </ThemedText>
              </ThemedView>
            );
          })}
        </View>
      </View>

      {/* Scroll Padding & Margin */}
      <View style={{ marginBottom: Sizing.spacing.xl }}>
        <ThemedText
          type="defaultSemiBold"
          style={{
            fontSize: Sizing.typography.fontSize.m,
            marginBottom: Sizing.spacing.m,
            color: colors.titleText,
          }}
        >
          {t('helpers.uiSizeHelper.scrollPadding')} ({t('helpers.uiSizeHelper.selected')}: {t(`helpers.uiSizeHelper.sizeLabels.${testInput.scrollPadding}`)}) & {t('helpers.uiSizeHelper.scrollMargin')} ({t('helpers.uiSizeHelper.selected')}: {t(`helpers.uiSizeHelper.sizeLabels.${testInput.scrollMargin}`)})
        </ThemedText>
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
            gap: Sizing.gap.s,
          }}
        >
          {scrollPaddings.map((item, index) => {
            const isSelected = item.size === testInput.scrollPadding;
            return (
              <ThemedView
                key={index}
                style={{
                  padding: item.value as number,
                  backgroundColor: isSelected ? colors.primary + '20' : colors.cardBackground,
                  borderRadius: Sizing.borderRadius.small,
                  borderWidth: isSelected ? 2 : Sizing.borderWidth.s,
                  borderColor: isSelected ? colors.primary : colors.surfaceBorder,
                  minWidth: 60,
                }}
              >
                <ThemedText
                  style={{
                    color: colors.bodyText,
                    fontSize: Sizing.typography.fontSize.xs,
                    fontWeight: isSelected ? Sizing.typography.fontWeight.semibold : Sizing.typography.fontWeight.normal,
                  }}
                >
                  {item.size} ({item.value}px)
                </ThemedText>
              </ThemedView>
            );
          })}
        </ScrollView>
      </View>

      {/* Responsive Info */}
      <View>
        <ThemedText
          type="defaultSemiBold"
          style={{
            fontSize: Sizing.typography.fontSize.m,
            marginBottom: Sizing.spacing.m,
            color: colors.titleText,
          }}
        >
          {t('helpers.uiSizeHelper.responsiveInfo')}
        </ThemedText>
        <ThemedView
          style={{
            padding: Sizing.padding.m,
            backgroundColor: colors.cardBackground,
            borderRadius: Sizing.borderRadius.small,
            borderWidth: Sizing.borderWidth.s,
            borderColor: colors.surfaceBorder,
          }}
        >
          <ThemedText style={{ fontSize: Sizing.typography.fontSize.s, color: colors.bodyText, marginBottom: Sizing.spacing.xs }}>
            {t('helpers.uiSizeHelper.device')}: {deviceType} · {t('helpers.uiSizeHelper.width')}: {width}px
          </ThemedText>
          <ThemedText style={{ fontSize: Sizing.typography.fontSize.s, color: colors.bodyText, marginBottom: Sizing.spacing.xs }}>
            {t('helpers.uiSizeHelper.columns')}: {columns} · {t('helpers.uiSizeHelper.baseUnit')}: {baseUnit}px
          </ThemedText>
          <ThemedText style={{ fontSize: Sizing.typography.fontSize.s, color: colors.bodyText }}>
            {t('helpers.uiSizeHelper.responsivePadding')}: {uiSizeHelper.getResponsiveSpacing(width, {
              phone: Sizing.padding.m,
              tablet: Sizing.padding.l,
              desktop: Sizing.padding.xl,
            })}px
          </ThemedText>
        </ThemedView>
      </View>
    </ThemedView>
  );
}

