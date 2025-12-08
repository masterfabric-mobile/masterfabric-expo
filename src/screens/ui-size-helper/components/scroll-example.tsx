import { ThemedText } from '@/src/shared/components/ThemedText';
import { ThemedView } from '@/src/shared/components/ThemedView';
import { Dropdown } from '@/src/shared/components/Dropdown';
import { t } from '@/src/shared/i18n';
import { Sizing, uiSizeHelper, useResponsive } from 'masterfabric-expo-core';
import { getThemeColors, useTheme } from 'masterfabric-expo-core';
import React, { useState } from 'react';
import { ScrollView, TouchableOpacity, View } from 'react-native';

export function ScrollExample() {
  const { currentTheme } = useTheme();
  const isDark = currentTheme === 'dark';
  const colors = getThemeColors(isDark);
  const { isPhone } = useResponsive();

  const scrollPaddingSizes: Array<keyof typeof Sizing.scroll.padding> = ['xxs', 'xs', 's', 'm', 'l', 'xl', 'xxl'];
  const scrollMarginSizes: Array<keyof typeof Sizing.scroll.margin> = ['xxs', 'xs', 's', 'm', 'l', 'xl', 'xxl'];

  const [selectedScrollPadding, setSelectedScrollPadding] = useState<keyof typeof Sizing.scroll.padding>('m');
  const [selectedScrollMargin, setSelectedScrollMargin] = useState<keyof typeof Sizing.scroll.margin>('m');

  // Helper methods
  const baseUnit = uiSizeHelper.getBaseUnit();

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
          {t('uiSizeHelper.examples.input.scrollPadding')} & {t('uiSizeHelper.examples.input.scrollMargin')}
        </ThemedText>

        <ThemedText
          style={{
            fontSize: Sizing.typography.fontSize.s,
            marginBottom: Sizing.spacing.l,
            color: colors.bodyText,
          }}
        >
          {t('uiSizeHelper.examples.input.description')}
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
              {t('uiSizeHelper.examples.input.scrollPadding')}
            </ThemedText>
            <Dropdown
              options={scrollPaddingSizes.map((size) => ({
                label: `${size.toUpperCase()}: ${Sizing.scroll.padding[size]}px`,
                value: size,
              }))}
              selectedValue={selectedScrollPadding}
              onSelect={(value) => setSelectedScrollPadding(value as keyof typeof Sizing.scroll.padding)}
              placeholder={t('uiSizeHelper.placeholders.selectScrollPadding')}
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
              {t('uiSizeHelper.examples.input.scrollMargin')}
            </ThemedText>
            <Dropdown
              options={scrollMarginSizes.map((size) => ({
                label: `${size.toUpperCase()}: ${Sizing.scroll.margin[size]}px`,
                value: size,
              }))}
              selectedValue={selectedScrollMargin}
              onSelect={(value) => setSelectedScrollMargin(value as keyof typeof Sizing.scroll.margin)}
              placeholder={t('uiSizeHelper.placeholders.selectScrollMargin')}
            />
          </View>
        </View>

        {/* Scroll Padding Example */}
        <View style={{ marginBottom: Sizing.spacing.xl }}>
          <ThemedText
            type="defaultSemiBold"
            style={{
              fontSize: Sizing.typography.fontSize.m,
              marginBottom: Sizing.spacing.s,
            }}
          >
            {t('uiSizeHelper.examples.input.scrollPadding')} Example
          </ThemedText>
          <ThemedView
            style={{
              height: Sizing.height.xl,
              backgroundColor: colors.surfaceBackground,
              borderRadius: Sizing.borderRadius.large,
              borderWidth: Sizing.borderWidth.s,
              borderColor: colors.surfaceBorder,
              overflow: 'hidden',
            }}
          >
            <ScrollView
              contentContainerStyle={{
                padding: Sizing.scroll.padding[selectedScrollPadding],
              }}
              showsVerticalScrollIndicator={true}
            >
              {[1, 2, 3, 4, 5, 6, 7, 8].map((item) => (
                <ThemedView
                  key={item}
                  style={{
                    backgroundColor: colors.primary + '20',
                    padding: Sizing.padding.m,
                    borderRadius: Sizing.borderRadius.small,
                    marginBottom: Sizing.spacing.s,
                  }}
                >
                  <ThemedText
                    style={{
                      fontSize: Sizing.typography.fontSize.s,
                      color: colors.text,
                    }}
                  >
                    {t('uiSizeHelper.examples.input.scrollItem1')} {item}
                  </ThemedText>
                </ThemedView>
              ))}
            </ScrollView>
          </ThemedView>
          <ThemedText
            style={{
              fontSize: Sizing.typography.fontSize.xs,
              color: colors.bodyText,
              marginTop: Sizing.spacing.xs,
            }}
          >
            Scroll Padding: {selectedScrollPadding.toUpperCase()} = {Sizing.scroll.padding[selectedScrollPadding]}px
          </ThemedText>
        </View>

        {/* Scroll Margin Example */}
        <View>
          <ThemedText
            type="defaultSemiBold"
            style={{
              fontSize: Sizing.typography.fontSize.m,
              marginBottom: Sizing.spacing.s,
            }}
          >
            {t('uiSizeHelper.examples.input.scrollMargin')} Example
          </ThemedText>
          <ThemedView
            style={{
              height: Sizing.height.xl,
              backgroundColor: colors.surfaceBackground,
              borderRadius: Sizing.borderRadius.large,
              borderWidth: Sizing.borderWidth.s,
              borderColor: colors.surfaceBorder,
              overflow: 'hidden',
            }}
          >
            <ScrollView
              contentContainerStyle={{
                margin: Sizing.scroll.margin[selectedScrollMargin],
              }}
              showsVerticalScrollIndicator={true}
            >
              <ThemedView
                style={{
                  backgroundColor: colors.cardBackground,
                  padding: Sizing.padding.l,
                  borderRadius: Sizing.borderRadius.small,
                  borderWidth: Sizing.borderWidth.s,
                  borderColor: colors.surfaceBorder,
                }}
              >
                <ThemedText
                  type="defaultSemiBold"
                  style={{
                    fontSize: Sizing.typography.fontSize.m,
                    marginBottom: Sizing.spacing.s,
                  }}
                >
                  {t('uiSizeHelper.examples.input.scrollMarginExample')}
                </ThemedText>
                <ThemedText
                  style={{
                    fontSize: Sizing.typography.fontSize.s,
                    color: colors.bodyText,
                    marginBottom: Sizing.spacing.xs,
                  }}
                >
                  {t('uiSizeHelper.examples.input.scrollItem1')}
                </ThemedText>
                <ThemedText
                  style={{
                    fontSize: Sizing.typography.fontSize.s,
                    color: colors.bodyText,
                    marginBottom: Sizing.spacing.xs,
                  }}
                >
                  {t('uiSizeHelper.examples.input.scrollItem2')}
                </ThemedText>
                <ThemedText
                  style={{
                    fontSize: Sizing.typography.fontSize.s,
                    color: colors.bodyText,
                  }}
                >
                  {t('uiSizeHelper.examples.input.scrollItem3')}
                </ThemedText>
              </ThemedView>
            </ScrollView>
          </ThemedView>
          <ThemedText
            style={{
              fontSize: Sizing.typography.fontSize.xs,
              color: colors.bodyText,
              marginTop: Sizing.spacing.xs,
            }}
          >
            Scroll Margin: {selectedScrollMargin.toUpperCase()} = {Sizing.scroll.margin[selectedScrollMargin]}px
          </ThemedText>
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
            Scroll Properties:
          </ThemedText>
          <ThemedText
            style={{
              fontSize: Sizing.typography.fontSize.xs,
              color: colors.bodyText,
              marginBottom: Sizing.spacing.xxs,
            }}
          >
            • Base Unit: {baseUnit}px
          </ThemedText>
          <ThemedText
            style={{
              fontSize: Sizing.typography.fontSize.xs,
              color: colors.bodyText,
              marginBottom: Sizing.spacing.xxs,
            }}
          >
            • Scroll Padding Range: {Sizing.scroll.padding.xxs}px - {Sizing.scroll.padding.xxl}px
          </ThemedText>
          <ThemedText
            style={{
              fontSize: Sizing.typography.fontSize.xs,
              color: colors.bodyText,
            }}
          >
            • Scroll Margin Range: {Sizing.scroll.margin.xxs}px - {Sizing.scroll.margin.xxl}px
          </ThemedText>
        </ThemedView>
      </ThemedView>
    </ScrollView>
  );
}

