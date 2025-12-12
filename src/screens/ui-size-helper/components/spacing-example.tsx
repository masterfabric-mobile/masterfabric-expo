import { ThemedText } from '@/src/shared/components/ThemedText';
import { ThemedView } from '@/src/shared/components/ThemedView';
import { Dropdown } from '@/src/shared/components/Dropdown';
import { t } from '@/src/shared/i18n';
import { Sizing, Spacer, uiSizeHelper, useResponsive } from 'masterfabric-expo-core';
import { getThemeColors, useTheme } from 'masterfabric-expo-core';
import React, { useState } from 'react';
import { ScrollView, TouchableOpacity, View } from 'react-native';

export function SpacingExample() {
  const { currentTheme } = useTheme();
  const isDark = currentTheme === 'dark';
  const colors = getThemeColors(isDark);
  const { isPhone } = useResponsive();

  const spacingSizes: Array<keyof typeof Sizing.spacing> = ['xxs', 'xs', 's', 'm', 'l', 'xl', 'xxl', 'xxxl'];
  const [selectedSpacing, setSelectedSpacing] = useState<keyof typeof Sizing.spacing>('m');
  const [selectedSpacer, setSelectedSpacer] = useState<keyof typeof Sizing.spacer>('m');
  const [selectedPadding, setSelectedPadding] = useState<keyof typeof Sizing.padding>('m');
  const [selectedMargin, setSelectedMargin] = useState<keyof typeof Sizing.margin>('m');
  const [selectedGap, setSelectedGap] = useState<keyof typeof Sizing.gap>('m');

  // Helper methods kullan
  const baseUnit = uiSizeHelper.getBaseUnit();
  const calculatedSpacing = uiSizeHelper.calculateSpacing(3);

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
          {t('uiSizeHelper.examples.spacing.title')}
        </ThemedText>

        <ThemedText
          style={{
            fontSize: Sizing.typography.fontSize.s,
            marginBottom: Sizing.spacing.l,
            color: colors.bodyText,
          }}
        >
          {t('uiSizeHelper.examples.spacing.description')}
        </ThemedText>

        {/* Controls Grid */}
        <View
          style={{
            flexDirection: isPhone ? 'column' : 'row',
            flexWrap: 'wrap',
            gap: Sizing.gap.s,
            marginBottom: Sizing.spacing.l,
          }}
        >
          <View style={{ flex: isPhone ? 1 : 0.48, minWidth: Sizing.minWidth.s }}>
            <ThemedText
              type="defaultSemiBold"
              style={{
                fontSize: Sizing.typography.fontSize.xs,
                marginBottom: Sizing.spacing.xs,
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
          </View>

          <View style={{ flex: isPhone ? 1 : 0.48, minWidth: Sizing.minWidth.s }}>
            <ThemedText
              type="defaultSemiBold"
              style={{
                fontSize: Sizing.typography.fontSize.xs,
                marginBottom: Sizing.spacing.xs,
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
          </View>

          <View style={{ flex: isPhone ? 1 : 0.48, minWidth: Sizing.minWidth.s }}>
            <ThemedText
              type="defaultSemiBold"
              style={{
                fontSize: Sizing.typography.fontSize.xs,
                marginBottom: Sizing.spacing.xs,
              }}
            >
              Padding
            </ThemedText>
            <Dropdown
              options={spacingSizes.map((size) => ({
                label: `${size.toUpperCase()}: ${Sizing.padding[size]}px`,
                value: size,
              }))}
              selectedValue={selectedPadding}
              onSelect={(value) => setSelectedPadding(value as keyof typeof Sizing.padding)}
              placeholder="Select padding"
            />
          </View>

          <View style={{ flex: isPhone ? 1 : 0.48, minWidth: Sizing.minWidth.s }}>
            <ThemedText
              type="defaultSemiBold"
              style={{
                fontSize: Sizing.typography.fontSize.xs,
                marginBottom: Sizing.spacing.xs,
              }}
            >
              Gap
            </ThemedText>
            <Dropdown
              options={spacingSizes.map((size) => ({
                label: `${size.toUpperCase()}: ${Sizing.gap[size]}px`,
                value: size,
              }))}
              selectedValue={selectedGap}
              onSelect={(value) => setSelectedGap(value as keyof typeof Sizing.gap)}
              placeholder="Select gap"
            />
          </View>
        </View>

        {/* Live Feed Preview */}
        <ThemedView
          style={{
            backgroundColor: colors.surfaceBackground,
            borderRadius: Sizing.borderRadius.large,
            padding: Sizing.padding[selectedPadding],
            borderWidth: Sizing.borderWidth.s,
            borderColor: colors.surfaceBorder,
          }}
        >
          <ThemedText
            type="defaultSemiBold"
            style={{
              fontSize: Sizing.typography.fontSize.m,
              marginBottom: Sizing.spacing.m,
              color: colors.text,
            }}
          >
            {t('uiSizeHelper.examples.spacing.livePreview')}
          </ThemedText>

          {/* Feed Item 1 */}
          <ThemedView
            style={{
              backgroundColor: colors.cardBackground,
              borderRadius: Sizing.card.borderRadius.m,
              padding: Sizing.spacer[selectedSpacer],
              borderWidth: Sizing.borderWidth.s,
              borderColor: colors.surfaceBorder,
              marginBottom: Sizing.spacing[selectedSpacing],
            }}
          >
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                marginBottom: Sizing.spacing.s,
                gap: Sizing.gap[selectedGap],
              }}
            >
              <ThemedView
                style={{
                  width: Sizing.avatar.s,
                  height: Sizing.avatar.s,
                  borderRadius: Sizing.avatar.s / 2,
                  backgroundColor: colors.primary,
                  justifyContent: 'center',
                  alignItems: 'center',
                }}
              >
                <ThemedText
                  style={{
                    color: '#FFFFFF',
                    fontSize: Sizing.typography.fontSize.xs,
                    fontWeight: Sizing.typography.fontWeight.semibold,
                  }}
                >
                  A
                </ThemedText>
              </ThemedView>
              <View style={{ flex: 1 }}>
                <ThemedText
                  type="defaultSemiBold"
                  style={{
                    fontSize: Sizing.typography.fontSize.m,
                    marginBottom: Sizing.spacing.xxs,
                  }}
                >
                  Feed Item 1
                </ThemedText>
                <ThemedText
                  style={{
                    fontSize: Sizing.typography.fontSize.xs,
                    color: colors.bodyText,
                  }}
                >
                  Spacing: {selectedSpacing} ({Sizing.spacing[selectedSpacing]}px) · Spacer: {selectedSpacer} ({Sizing.spacer[selectedSpacer]}px)
                </ThemedText>
              </View>
            </View>
            <ThemedText
              style={{
                fontSize: Sizing.typography.fontSize.s,
                color: colors.bodyText,
                lineHeight: Sizing.typography.fontSize.s * Sizing.typography.lineHeight.normal,
              }}
            >
              This is a feed item demonstrating spacing, padding, and gap values. All values are controlled by the dropdowns above.
            </ThemedText>
          </ThemedView>

          {/* Feed Item 2 */}
          <ThemedView
            style={{
              backgroundColor: colors.cardBackground,
              borderRadius: Sizing.card.borderRadius.m,
              padding: Sizing.spacer[selectedSpacer],
              borderWidth: Sizing.borderWidth.s,
              borderColor: colors.surfaceBorder,
              marginBottom: Sizing.spacing[selectedSpacing],
            }}
          >
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                marginBottom: Sizing.spacing.s,
                gap: Sizing.gap[selectedGap],
              }}
            >
              <ThemedView
                style={{
                  width: Sizing.avatar.m,
                  height: Sizing.avatar.m,
                  borderRadius: Sizing.avatar.m / 2,
                  backgroundColor: colors.primary,
                  justifyContent: 'center',
                  alignItems: 'center',
                }}
              >
                <ThemedText
                  style={{
                    color: '#FFFFFF',
                    fontSize: Sizing.typography.fontSize.s,
                    fontWeight: Sizing.typography.fontWeight.semibold,
                  }}
                >
                  B
                </ThemedText>
              </ThemedView>
              <View style={{ flex: 1 }}>
                <ThemedText
                  type="defaultSemiBold"
                  style={{
                    fontSize: Sizing.typography.fontSize.m,
                    marginBottom: Sizing.spacing.xxs,
                  }}
                >
                  Feed Item 2
                </ThemedText>
                <ThemedText
                  style={{
                    fontSize: Sizing.typography.fontSize.xs,
                    color: colors.bodyText,
                  }}
                >
                  Padding: {selectedPadding} ({Sizing.padding[selectedPadding]}px) · Gap: {selectedGap} ({Sizing.gap[selectedGap]}px)
                </ThemedText>
              </View>
            </View>
            <ThemedText
              style={{
                fontSize: Sizing.typography.fontSize.s,
                color: colors.bodyText,
                lineHeight: Sizing.typography.fontSize.s * Sizing.typography.lineHeight.normal,
              }}
            >
              Another feed item showing how different spacing values affect the layout. Base unit: {baseUnit}px, calculated spacing (3x): {calculatedSpacing}px.
            </ThemedText>
          </ThemedView>

          {/* Feed Item 3 */}
          <ThemedView
            style={{
              backgroundColor: colors.cardBackground,
              borderRadius: Sizing.card.borderRadius.m,
              padding: Sizing.spacer[selectedSpacer],
              borderWidth: Sizing.borderWidth.s,
              borderColor: colors.surfaceBorder,
            }}
          >
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                marginBottom: Sizing.spacing.s,
                gap: Sizing.gap[selectedGap],
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
                    fontSize: Sizing.typography.fontSize.m,
                    fontWeight: Sizing.typography.fontWeight.semibold,
                  }}
                >
                  C
                </ThemedText>
              </ThemedView>
              <View style={{ flex: 1 }}>
                <ThemedText
                  type="defaultSemiBold"
                  style={{
                    fontSize: Sizing.typography.fontSize.m,
                    marginBottom: Sizing.spacing.xxs,
                  }}
                >
                  Feed Item 3
                </ThemedText>
                <ThemedText
                  style={{
                    fontSize: Sizing.typography.fontSize.xs,
                    color: colors.bodyText,
                  }}
                >
                  All spacing values follow the 8pt grid system
                </ThemedText>
              </View>
            </View>
            <ThemedText
              style={{
                fontSize: Sizing.typography.fontSize.s,
                color: colors.bodyText,
                lineHeight: Sizing.typography.fontSize.s * Sizing.typography.lineHeight.normal,
              }}
            >
              This demonstrates a complete feed layout with all spacing properties working together.
            </ThemedText>
          </ThemedView>
        </ThemedView>

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
            Helper Methods Used:
          </ThemedText>
          <ThemedText
            style={{
              fontSize: Sizing.typography.fontSize.xs,
              color: colors.bodyText,
              marginBottom: Sizing.spacing.xxs,
            }}
          >
            • uiSizeHelper.getBaseUnit() = {baseUnit}px
          </ThemedText>
          <ThemedText
            style={{
              fontSize: Sizing.typography.fontSize.xs,
              color: colors.bodyText,
              marginBottom: Sizing.spacing.xxs,
            }}
          >
            • uiSizeHelper.calculateSpacing(3) = {calculatedSpacing}px
          </ThemedText>
          <ThemedText
            style={{
              fontSize: Sizing.typography.fontSize.xs,
              color: colors.bodyText,
            }}
          >
            • uiSizeHelper.getSpacing('m') = {uiSizeHelper.getSpacing('m')}px
          </ThemedText>
        </ThemedView>
      </ThemedView>
    </ScrollView>
  );
}
