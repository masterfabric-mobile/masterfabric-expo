import { ThemedText } from '@/src/shared/components/ThemedText';
import { ThemedView } from '@/src/shared/components/ThemedView';
import { t } from '@/src/shared/i18n';
import { Sizing, Spacer, getThemeColors, useTheme } from 'masterfabric-expo-core';
import React from 'react';
import { ScrollView, TouchableOpacity, View } from 'react-native';
import { UISizePreview } from '../models/ui-size-helper-models';
import { uiSizePreviewCardStyles } from '../styles/ui-size-preview-card.styles';

interface UISizePreviewCardProps {
  preview: UISizePreview;
}

export function UISizePreviewCard({ preview }: UISizePreviewCardProps) {
  const { currentTheme } = useTheme();
  const isDark = currentTheme === 'dark';
  const colors = getThemeColors(isDark);

  return (
    <ThemedView
      style={[
        uiSizePreviewCardStyles.container,
        {
          backgroundColor: colors.surfaceBackground,
          borderColor: colors.surfaceBorder + '30',
        }
      ]}
    >
      <ThemedText
        type="subtitle"
        style={[uiSizePreviewCardStyles.title, { color: colors.sectionTitle }]}
      >
        {t('helpers.uiSizeHelper.preview')}
      </ThemedText>

      {/* Device Info */}
      <View style={uiSizePreviewCardStyles.infoRow}>
        <ThemedText style={[uiSizePreviewCardStyles.infoText, { color: colors.bodyText }]}>
          Device: {preview.deviceType} · Columns: {preview.columns} · Base: {preview.baseUnit}px
        </ThemedText>
      </View>

      {/* Combined Live Example - All Values Together */}
      <View style={uiSizePreviewCardStyles.previewSection}>
        <ThemedText
          type="defaultSemiBold"
          style={[uiSizePreviewCardStyles.sectionTitle, { color: colors.titleText, marginBottom: Sizing.spacing.m }]}
        >
          Live Example - All Values Combined
        </ThemedText>
        
        {/* Container with margin */}
        <ThemedView
          style={{
            margin: preview.margin,
            backgroundColor: colors.cardBackground,
            borderRadius: preview.borderRadius,
            borderWidth: preview.borderWidth,
            borderColor: colors.surfaceBorder,
            padding: preview.cardPadding,
          }}
        >
          {/* Header with spacing */}
          <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: preview.spacing }}>
            <View style={{ width: preview.spacing, height: preview.spacing, backgroundColor: colors.primary, borderRadius: Sizing.borderRadius.small }} />
            <ThemedText
              type="defaultSemiBold"
              style={{ marginLeft: preview.spacing, color: colors.titleText }}
            >
              Spacing: {preview.spacing}px
            </ThemedText>
          </View>

          {/* Content with padding */}
          <ThemedView
            style={{
              padding: preview.padding,
              backgroundColor: colors.primary + '20',
              borderRadius: Sizing.borderRadius.small,
              marginBottom: preview.spacing,
            }}
          >
            <ThemedText style={{ color: colors.bodyText, fontSize: Sizing.typography.fontSize.s }}>
              Padding: {preview.padding}px · Margin: {preview.margin}px
            </ThemedText>
          </ThemedView>

          {/* Spacer Example */}
          <View style={{ marginBottom: preview.spacing }}>
            <ThemedView
              style={{
                height: Sizing.height.s,
                backgroundColor: colors.secondary + '30',
                borderRadius: Sizing.borderRadius.small,
                justifyContent: 'center',
                alignItems: 'center',
              }}
            >
              <ThemedText style={{ color: colors.text, fontSize: Sizing.typography.fontSize.xs }}>Component A</ThemedText>
            </ThemedView>
            <View style={{ height: preview.gap }} />
            <ThemedView
              style={{
                height: Sizing.height.s,
                backgroundColor: colors.secondary + '30',
                borderRadius: Sizing.borderRadius.small,
                justifyContent: 'center',
                alignItems: 'center',
              }}
            >
              <ThemedText style={{ color: colors.text, fontSize: Sizing.typography.fontSize.xs }}>Component B (Gap: {preview.gap}px)</ThemedText>
            </ThemedView>
          </View>

          {/* Button and Input Row */}
          <View style={{ flexDirection: 'row', gap: preview.spacing, marginBottom: preview.spacing }}>
            <TouchableOpacity
              style={{
                flex: 1,
                height: preview.buttonHeight,
                backgroundColor: colors.primary,
                borderRadius: preview.borderRadius,
                justifyContent: 'center',
                alignItems: 'center',
              }}
              activeOpacity={0.8}
            >
              <ThemedText
                style={{
                  color: '#FFFFFF',
                  fontSize: Sizing.typography.fontSize.xs,
                  fontWeight: Sizing.typography.fontWeight.semibold,
                }}
              >
                H: {preview.buttonHeight}px
              </ThemedText>
            </TouchableOpacity>
            <View
              style={{
                flex: 1,
                height: preview.inputHeight,
                backgroundColor: colors.inputBackground,
                borderRadius: preview.borderRadius,
                borderWidth: preview.borderWidth,
                borderColor: colors.surfaceBorder,
                justifyContent: 'center',
                paddingHorizontal: Sizing.input.padding.horizontal.xs,
              }}
            >
              <ThemedText style={{ color: colors.bodyText, fontSize: Sizing.typography.fontSize.xs }}>
                H: {preview.inputHeight}px
              </ThemedText>
            </View>
          </View>

          {/* Scroll Example */}
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            style={{
              maxHeight: 60,
              borderRadius: Sizing.borderRadius.small,
            }}
            contentContainerStyle={{
              padding: preview.scrollPadding,
              gap: preview.spacing,
            }}
          >
            <ThemedView
              style={{
                width: 80,
                height: 40,
                backgroundColor: colors.tertiary + '30',
                borderRadius: Sizing.borderRadius.small,
                justifyContent: 'center',
                alignItems: 'center',
                marginRight: preview.scrollMargin,
              }}
            >
              <ThemedText style={{ fontSize: Sizing.typography.fontSize.xs, color: colors.bodyText }}>
                Scroll P: {preview.scrollPadding}px
              </ThemedText>
            </ThemedView>
            <ThemedView
              style={{
                width: 80,
                height: 40,
                backgroundColor: colors.tertiary + '30',
                borderRadius: Sizing.borderRadius.small,
                justifyContent: 'center',
                alignItems: 'center',
                marginRight: preview.scrollMargin,
              }}
            >
              <ThemedText style={{ fontSize: Sizing.typography.fontSize.xs, color: colors.bodyText }}>
                Scroll M: {preview.scrollMargin}px
              </ThemedText>
            </ThemedView>
          </ScrollView>
        </ThemedView>
      </View>

    </ThemedView>
  );
}

