import { ThemedText } from '@/src/shared/components/ThemedText';
import { ThemedView } from '@/src/shared/components/ThemedView';
import { t } from '@/src/shared/i18n';
import { convertFontWeightToNumeric, getThemeColors, useTheme } from 'masterfabric-expo-core';
import React, { useMemo } from 'react';
import { View } from 'react-native';
import { TypographyPreview } from '../models/typography-helper-models';
import { typographyPreviewCardStyles } from '../styles/typography-preview-card.styles';

interface TypographyPreviewCardProps {
  preview: TypographyPreview;
}

export function TypographyPreviewCard({ preview }: TypographyPreviewCardProps) {
  const { currentTheme } = useTheme();
  const isDark = currentTheme === 'dark';
  const colors = getThemeColors(isDark);

  // Convert fontWeight to React Native compatible format
  const fontWeightStyle = useMemo(() => {
    const numericWeight = convertFontWeightToNumeric(preview.fontWeight);
    // React Native accepts number (100-900) or string ('normal', 'bold')
    // Convert to number for better compatibility
    return numericWeight as 100 | 200 | 300 | 400 | 500 | 600 | 700 | 800 | 900;
  }, [preview.fontWeight]);

  return (
    <ThemedView
      style={[
        typographyPreviewCardStyles.container,
        {
          backgroundColor: colors.surfaceBackground,
          borderColor: colors.surfaceBorder + '30',
        }
      ]}
    >
      <ThemedText
        type="subtitle"
        style={[typographyPreviewCardStyles.title, { color: colors.sectionTitle }]}
      >
        {t('helpers.typographyHelper.preview')}
      </ThemedText>

      <ThemedView
        style={[
          typographyPreviewCardStyles.previewContainer,
          {
            backgroundColor: colors.inputBackground,
            borderColor: colors.surfaceBorder,
          }
        ]}
      >
        <ThemedText
          style={[
            typographyPreviewCardStyles.previewText,
            {
              fontSize: preview.fontSize,
              lineHeight: preview.lineHeight,
              letterSpacing: preview.letterSpacing,
              fontWeight: fontWeightStyle,
              fontStyle: preview.fontStyle,
              textTransform: preview.textTransform,
              textDecorationLine: preview.textDecoration === 'none' ? 'none' : preview.textDecoration as any,
              color: preview.textColor,
            }
          ]}
        >
          {preview.previewText}
        </ThemedText>
      </ThemedView>

      <View style={typographyPreviewCardStyles.infoRow}>
        <ThemedText style={[typographyPreviewCardStyles.infoLabel, { color: colors.bodyText }]}>
          {t('helpers.typographyHelper.fontSize')}
        </ThemedText>
        <ThemedText style={[typographyPreviewCardStyles.infoValue, { color: colors.titleText }]}>
          {preview.fontSize}px
        </ThemedText>
      </View>

      <View style={typographyPreviewCardStyles.infoRow}>
        <ThemedText style={[typographyPreviewCardStyles.infoLabel, { color: colors.bodyText }]}>
          {t('helpers.typographyHelper.lineHeight')}
        </ThemedText>
        <ThemedText style={[typographyPreviewCardStyles.infoValue, { color: colors.titleText }]}>
          {preview.lineHeight}px
        </ThemedText>
      </View>

      <View style={typographyPreviewCardStyles.infoRow}>
        <ThemedText style={[typographyPreviewCardStyles.infoLabel, { color: colors.bodyText }]}>
          {t('helpers.typographyHelper.letterSpacing')}
        </ThemedText>
        <ThemedText style={[typographyPreviewCardStyles.infoValue, { color: colors.titleText }]}>
          {preview.letterSpacing.toFixed(2)}px
        </ThemedText>
      </View>

      <View style={typographyPreviewCardStyles.infoRow}>
        <ThemedText style={[typographyPreviewCardStyles.infoLabel, { color: colors.bodyText }]}>
          {t('helpers.typographyHelper.fontWeight')}
        </ThemedText>
        <ThemedText style={[typographyPreviewCardStyles.infoValue, { color: colors.titleText }]}>
          {typeof preview.fontWeight === 'number' ? preview.fontWeight.toString() : preview.fontWeight}
        </ThemedText>
      </View>

      <View style={typographyPreviewCardStyles.infoRow}>
        <ThemedText style={[typographyPreviewCardStyles.infoLabel, { color: colors.bodyText }]}>
          {t('helpers.typographyHelper.textColor')}
        </ThemedText>
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
          <View
            style={[
              {
                width: 20,
                height: 20,
                borderRadius: 10,
                backgroundColor: preview.textColor,
                borderWidth: 1,
                borderColor: colors.surfaceBorder,
              }
            ]}
          />
          <ThemedText style={[typographyPreviewCardStyles.infoValue, { color: colors.titleText }]}>
            {preview.textColor}
          </ThemedText>
        </View>
      </View>
    </ThemedView>
  );
}

