import { ThemedText } from '@/src/shared/components/ThemedText';
import { ThemedView } from '@/src/shared/components/ThemedView';
import { t } from '@/src/shared/i18n';
import { Sizing, Spacer, uiSizeHelper, useResponsive } from 'masterfabric-expo-core';
import { getThemeColors, useTheme } from 'masterfabric-expo-core';
import React from 'react';
import { ScrollView, TouchableOpacity, View } from 'react-native';

export function LayoutPreviewExample() {
  const { currentTheme } = useTheme();
  const isDark = currentTheme === 'dark';
  const colors = getThemeColors(isDark);
  const { isPhone, isTablet, isDesktop } = useResponsive();

  // Helper'ın tüm responsive özelliklerini kullan
  const width = uiSizeHelper.getScreenWidth();
  const deviceType = uiSizeHelper.getDeviceTypeAuto();
  const columns = uiSizeHelper.getGridColumnsAuto();
  const baseUnit = uiSizeHelper.getBaseUnit();
  
  // Responsive container padding
  const containerPadding = uiSizeHelper.getResponsiveSpacing(width, {
    phone: Sizing.padding.m,
    tablet: Sizing.padding.l,
    desktop: Sizing.padding.xl,
  });

  // Responsive card width
  const cardWidth = deviceType === 'phone' 
    ? Sizing.card.width.small 
    : deviceType === 'tablet' 
    ? Sizing.card.width.medium 
    : Sizing.card.width.large;

  // Grid-based spacing
  const verticalGap = uiSizeHelper.calculateSpacing(2);
  const horizontalGap = uiSizeHelper.getSpacing('m');

  return (
    <ScrollView
      style={{ flex: 1 }}
      contentContainerStyle={{
        padding: containerPadding,
      }}
      showsVerticalScrollIndicator={false}
    >
      {/* Header Section */}
      <ThemedView
        style={{
          backgroundColor: colors.cardBackground,
          borderRadius: Sizing.card.borderRadius.l,
          padding: Sizing.card.padding.large,
          borderWidth: Sizing.borderWidth.s,
          borderColor: colors.surfaceBorder,
          marginBottom: Sizing.spacing.l,
        }}
      >
        <ThemedText
          type="defaultSemiBold"
          style={{
            fontSize: Sizing.typography.fontSize.xl,
            marginBottom: Sizing.spacing.xs,
          }}
        >
          {t('uiSizeHelper.examples.layout.title')}
        </ThemedText>
        <ThemedText
          style={{
            fontSize: Sizing.typography.fontSize.s,
            color: colors.bodyText,
            marginBottom: Sizing.spacing.m,
          }}
        >
          {deviceType.toUpperCase()} · {columns} {t('uiSizeHelper.examples.layout.columns')} · {t('uiSizeHelper.examples.layout.baseUnit')}: {baseUnit}px
        </ThemedText>

        {/* Stats Grid */}
        <View
          style={{
            flexDirection: isPhone ? 'column' : 'row',
            gap: Sizing.gap.m,
          }}
        >
          <ThemedView
            style={{
              flex: 1,
              backgroundColor: colors.surfaceBackground,
              borderRadius: Sizing.borderRadius.small,
              padding: Sizing.padding.m,
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
              {t('uiSizeHelper.examples.layout.padding')}
            </ThemedText>
            <ThemedText
              type="defaultSemiBold"
              style={{
                fontSize: Sizing.typography.fontSize.l,
                color: colors.primary,
              }}
            >
              {containerPadding}px
            </ThemedText>
          </ThemedView>

          <ThemedView
            style={{
              flex: 1,
              backgroundColor: colors.surfaceBackground,
              borderRadius: Sizing.borderRadius.small,
              padding: Sizing.padding.m,
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
              {t('uiSizeHelper.examples.layout.gap')}
            </ThemedText>
            <ThemedText
              type="defaultSemiBold"
              style={{
                fontSize: Sizing.typography.fontSize.l,
                color: colors.primary,
              }}
            >
              {verticalGap}px
            </ThemedText>
          </ThemedView>
        </View>
      </ThemedView>

      {/* Dashboard Cards Grid */}
      <View
        style={{
          flexDirection: isPhone ? 'column' : 'row',
          flexWrap: 'wrap',
          gap: Sizing.gap.l,
        }}
      >
        {/* Card 1: Layout Info */}
        <ThemedView
          style={{
            flex: isPhone ? 1 : isTablet ? 0.48 : 0.31,
            minWidth: Sizing.minWidth.m,
            backgroundColor: colors.cardBackground,
            borderRadius: Sizing.card.borderRadius.m,
            padding: Sizing.card.padding.medium,
            borderWidth: Sizing.borderWidth.s,
            borderColor: colors.surfaceBorder,
            minHeight: Sizing.card.minHeight.medium,
          }}
        >
          <ThemedText
            type="defaultSemiBold"
            style={{
              fontSize: Sizing.typography.fontSize.m,
              marginBottom: Sizing.spacing.xs,
            }}
          >
            {t('uiSizeHelper.examples.layout.layoutSpacing')}
          </ThemedText>
          <ThemedText
            style={{
              fontSize: Sizing.typography.fontSize.s,
              color: colors.bodyText,
              marginBottom: Sizing.spacing.s,
            }}
          >
            {deviceType}
          </ThemedText>
          <ThemedText
            style={{
              fontSize: Sizing.typography.fontSize.xs,
              color: colors.bodyText,
            }}
          >
            {t('uiSizeHelper.examples.layout.padding')}: {containerPadding}px
          </ThemedText>
          <ThemedText
            style={{
              fontSize: Sizing.typography.fontSize.xs,
              color: colors.bodyText,
            }}
          >
            {t('uiSizeHelper.examples.layout.gap')}: {verticalGap}px
          </ThemedText>
        </ThemedView>

        {/* Card 2: Modal & Grid */}
        <ThemedView
          style={{
            flex: isPhone ? 1 : isTablet ? 0.48 : 0.31,
            minWidth: Sizing.minWidth.m,
            backgroundColor: colors.cardBackground,
            borderRadius: Sizing.card.borderRadius.m,
            padding: Sizing.card.padding.medium,
            borderWidth: Sizing.borderWidth.s,
            borderColor: colors.surfaceBorder,
            minHeight: Sizing.card.minHeight.medium,
          }}
        >
          <ThemedText
            type="defaultSemiBold"
            style={{
              fontSize: Sizing.typography.fontSize.m,
              marginBottom: Sizing.spacing.xs,
            }}
          >
            {t('uiSizeHelper.examples.layout.modalGrid')}
          </ThemedText>
          <ThemedText
            style={{
              fontSize: Sizing.typography.fontSize.s,
              color: colors.bodyText,
              marginBottom: Sizing.spacing.s,
            }}
          >
            {t('uiSizeHelper.examples.layout.columns')}: {columns}
          </ThemedText>
          <ThemedText
            style={{
              fontSize: Sizing.typography.fontSize.xs,
              color: colors.bodyText,
            }}
          >
            Modal: {Sizing.modal.width.medium}px
          </ThemedText>
          <ThemedText
            style={{
              fontSize: Sizing.typography.fontSize.xs,
              color: colors.bodyText,
            }}
          >
            Card: {cardWidth}px
          </ThemedText>
        </ThemedView>

        {/* Card 3: Responsive Info */}
        <ThemedView
          style={{
            flex: isPhone ? 1 : isTablet ? 0.48 : 0.31,
            minWidth: Sizing.minWidth.m,
            backgroundColor: colors.cardBackground,
            borderRadius: Sizing.card.borderRadius.m,
            padding: Sizing.card.padding.medium,
            borderWidth: Sizing.borderWidth.s,
            borderColor: colors.surfaceBorder,
            minHeight: Sizing.card.minHeight.medium,
          }}
        >
          <ThemedText
            type="defaultSemiBold"
            style={{
              fontSize: Sizing.typography.fontSize.m,
              marginBottom: Sizing.spacing.xs,
            }}
          >
            Responsive
          </ThemedText>
          <ThemedText
            style={{
              fontSize: Sizing.typography.fontSize.s,
              color: colors.bodyText,
              marginBottom: Sizing.spacing.s,
            }}
          >
            Width: {width}px
          </ThemedText>
          <ThemedText
            style={{
              fontSize: Sizing.typography.fontSize.xs,
              color: colors.bodyText,
            }}
          >
            Base: {baseUnit}px
          </ThemedText>
          <ThemedText
            style={{
              fontSize: Sizing.typography.fontSize.xs,
              color: colors.bodyText,
            }}
          >
            Spacing.m: {uiSizeHelper.getSpacing('m')}px
          </ThemedText>
        </ThemedView>
      </View>

      <Spacer size="l" />

      {/* Action Buttons */}
      <View
        style={{
          flexDirection: isPhone ? 'column' : 'row',
          gap: Sizing.gap.m,
        }}
      >
        <TouchableOpacity
          style={{
            flex: 1,
            height: Sizing.button.height.medium,
            backgroundColor: colors.primary,
            borderRadius: Sizing.borderRadius.large,
            paddingHorizontal: Sizing.button.padding.horizontal.medium,
            paddingVertical: Sizing.button.padding.vertical.medium,
            justifyContent: 'center',
            alignItems: 'center',
            minHeight: Sizing.touchTarget.minimum,
          }}
          activeOpacity={0.8}
        >
          <ThemedText
            style={{
              color: '#FFFFFF',
              fontWeight: Sizing.typography.fontWeight.semibold,
              fontSize: Sizing.typography.fontSize.m,
            }}
          >
            Primary Action
          </ThemedText>
        </TouchableOpacity>

        <TouchableOpacity
          style={{
            flex: 1,
            height: Sizing.button.height.medium,
            backgroundColor: colors.surfaceBackground,
            borderRadius: Sizing.borderRadius.large,
            paddingHorizontal: Sizing.button.padding.horizontal.medium,
            paddingVertical: Sizing.button.padding.vertical.medium,
            borderWidth: Sizing.borderWidth.s,
            borderColor: colors.surfaceBorder,
            justifyContent: 'center',
            alignItems: 'center',
            minHeight: Sizing.touchTarget.minimum,
          }}
          activeOpacity={0.8}
        >
          <ThemedText
            style={{
              color: colors.text,
              fontWeight: Sizing.typography.fontWeight.semibold,
              fontSize: Sizing.typography.fontSize.m,
            }}
          >
            Secondary
          </ThemedText>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}
