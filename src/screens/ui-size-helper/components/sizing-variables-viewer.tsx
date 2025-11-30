import { ThemedText } from '@/src/shared/components/ThemedText';
import { ThemedView } from '@/src/shared/components/ThemedView';
import { Sizing, uiSizeHelper } from 'masterfabric-expo-core';
import { getThemeColors, useTheme } from 'masterfabric-expo-core';
import React, { useState } from 'react';
import { ScrollView, TouchableOpacity, View } from 'react-native';

export function SizingVariablesViewer() {
  const { currentTheme } = useTheme();
  const isDark = currentTheme === 'dark';
  const colors = getThemeColors(isDark);
  const [expandedSections, setExpandedSections] = useState<Set<string>>(new Set());

  const toggleSection = (section: string) => {
    const newExpanded = new Set(expandedSections);
    if (newExpanded.has(section)) {
      newExpanded.delete(section);
    } else {
      newExpanded.add(section);
    }
    setExpandedSections(newExpanded);
  };

  const renderSizeList = (items: Array<{ size: string; value: number | string; category: string }>, title: string) => {
    const sectionKey = title.toLowerCase().replace(/\s+/g, '-');
    const isExpanded = expandedSections.has(sectionKey);

    return (
      <ThemedView
        style={{
          backgroundColor: colors.cardBackground,
          borderRadius: Sizing.card.borderRadius.m,
          marginBottom: Sizing.spacing.m,
          borderWidth: Sizing.borderWidth.s,
          borderColor: colors.surfaceBorder,
          overflow: 'hidden',
        }}
      >
        <TouchableOpacity
          onPress={() => toggleSection(sectionKey)}
          style={{
            padding: Sizing.card.padding.medium,
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}
        >
          <ThemedText
            type="defaultSemiBold"
            style={{
              fontSize: Sizing.typography.fontSize.m,
            }}
          >
            {title}
          </ThemedText>
          <ThemedText
            style={{
              fontSize: Sizing.typography.fontSize.s,
              color: colors.bodyText,
            }}
          >
            {isExpanded ? '▼' : '▶'}
          </ThemedText>
        </TouchableOpacity>

        {isExpanded && (
          <View style={{ padding: Sizing.padding.s, paddingTop: 0 }}>
            {items.map((item, index) => (
              <View
                key={index}
                style={{
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                  paddingVertical: Sizing.padding.xs,
                  paddingHorizontal: Sizing.padding.s,
                  backgroundColor: index % 2 === 0 ? 'transparent' : colors.surfaceBackground + '40',
                  borderRadius: Sizing.borderRadius.small,
                  marginBottom: Sizing.spacing.xxs,
                }}
              >
                <ThemedText
                  style={{
                    fontSize: Sizing.typography.fontSize.s,
                    color: colors.text,
                    fontFamily: 'monospace',
                  }}
                >
                  {item.size}
                </ThemedText>
                <ThemedText
                  style={{
                    fontSize: Sizing.typography.fontSize.s,
                    color: colors.primary,
                    fontWeight: Sizing.typography.fontWeight.semibold,
                  }}
                >
                  {typeof item.value === 'number' ? `${item.value}px` : item.value}
                </ThemedText>
              </View>
            ))}
          </View>
        )}
      </ThemedView>
    );
  };

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
        Sizing Variables Viewer
      </ThemedText>
      <ThemedText
        style={{
          fontSize: Sizing.typography.fontSize.s,
          marginBottom: Sizing.spacing.l,
          color: colors.bodyText,
        }}
      >
        Tüm Sizing değişkenlerini görmek için bölümleri genişletin
      </ThemedText>

      <ScrollView
        style={{ maxHeight: 600 }}
        showsVerticalScrollIndicator={true}
      >
        {renderSizeList(uiSizeHelper.getAllSpacings(), 'Spacing')}
        {renderSizeList(uiSizeHelper.getAllPaddings(), 'Padding')}
        {renderSizeList(uiSizeHelper.getAllMargins(), 'Margin')}
        {renderSizeList(uiSizeHelper.getAllFontSizes(), 'Font Sizes')}
        {renderSizeList(uiSizeHelper.getAllIconSizes(), 'Icon Sizes')}
        {renderSizeList(uiSizeHelper.getAllAvatarSizes(), 'Avatar Sizes')}
        {renderSizeList(uiSizeHelper.getAllButtonHeights(), 'Button Heights')}
        {renderSizeList(uiSizeHelper.getAllInputHeights(), 'Input Heights')}
        {renderSizeList(uiSizeHelper.getAllCardPaddings(), 'Card Paddings')}
        {renderSizeList(uiSizeHelper.getAllBorderRadiuses(), 'Border Radius')}
        {renderSizeList(uiSizeHelper.getAllBorderWidths(), 'Border Widths')}
        {renderSizeList(uiSizeHelper.getAllZIndexes(), 'Z-Index')}

        <ThemedView
          style={{
            backgroundColor: colors.surfaceBackground,
            borderRadius: Sizing.card.borderRadius.m,
            padding: Sizing.card.padding.medium,
            marginBottom: Sizing.spacing.m,
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
            Base Unit
          </ThemedText>
          <ThemedText
            style={{
              fontSize: Sizing.typography.fontSize.s,
              color: colors.text,
              fontFamily: 'monospace',
            }}
          >
            {uiSizeHelper.getBaseUnit()}px (8pt grid system)
          </ThemedText>
        </ThemedView>

        <ThemedView
          style={{
            backgroundColor: colors.surfaceBackground,
            borderRadius: Sizing.card.borderRadius.m,
            padding: Sizing.card.padding.medium,
            marginBottom: Sizing.spacing.m,
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
            Breakpoints
          </ThemedText>
          <View style={{ gap: Sizing.gap.xs }}>
            <ThemedText
              style={{
                fontSize: Sizing.typography.fontSize.s,
                color: colors.text,
              }}
            >
              Phone: {Sizing.breakpoints.phone.xs}px - {Sizing.breakpoints.phone.xl}px
            </ThemedText>
            <ThemedText
              style={{
                fontSize: Sizing.typography.fontSize.s,
                color: colors.text,
              }}
            >
              Tablet: {Sizing.breakpoints.tablet.small}px - {Sizing.breakpoints.tablet.xl}px
            </ThemedText>
            <ThemedText
              style={{
                fontSize: Sizing.typography.fontSize.s,
                color: colors.text,
              }}
            >
              Desktop: {Sizing.breakpoints.desktop.small}px+
            </ThemedText>
          </View>
        </ThemedView>

        <ThemedView
          style={{
            backgroundColor: colors.surfaceBackground,
            borderRadius: Sizing.card.borderRadius.m,
            padding: Sizing.card.padding.medium,
            marginBottom: Sizing.spacing.m,
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
            Touch Targets
          </ThemedText>
          <View style={{ gap: Sizing.gap.xs }}>
            <ThemedText
              style={{
                fontSize: Sizing.typography.fontSize.s,
                color: colors.text,
              }}
            >
              Minimum (iOS): {Sizing.touchTarget.minimum}px
            </ThemedText>
            <ThemedText
              style={{
                fontSize: Sizing.typography.fontSize.s,
                color: colors.text,
              }}
            >
              Recommended (Android): {Sizing.touchTarget.recommended}px
            </ThemedText>
            <ThemedText
              style={{
                fontSize: Sizing.typography.fontSize.s,
                color: colors.text,
              }}
            >
              Comfortable: {Sizing.touchTarget.comfortable}px
            </ThemedText>
            <ThemedText
              style={{
                fontSize: Sizing.typography.fontSize.s,
                color: colors.text,
              }}
            >
              Large: {Sizing.touchTarget.large}px
            </ThemedText>
          </View>
        </ThemedView>
      </ScrollView>
    </ThemedView>
  );
}

