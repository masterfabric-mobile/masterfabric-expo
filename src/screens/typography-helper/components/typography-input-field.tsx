import { Button } from '@/src/shared/components/button';
import { ColorPickerModal } from '@/src/shared/components/ColorPickerModal';
import { Dropdown } from '@/src/shared/components/Dropdown';
import { ThemedText } from '@/src/shared/components/ThemedText';
import { ThemedView } from '@/src/shared/components/ThemedView';
import { t } from '@/src/shared/i18n';
import { applyTypographyPreset, getThemeColors, useTheme } from 'masterfabric-expo-core';
import React, { useEffect, useState } from 'react';
import { Text, TouchableOpacity, View } from 'react-native';
import { TypographyTestInput } from '../models/typography-helper-models';
import { typographyInputFieldStyles } from '../styles/typography-input-field.styles';

interface TypographyInputFieldProps {
  testInput: TypographyTestInput;
  onInputChange: (updates: Partial<TypographyTestInput>) => void;
  onRunTests: () => void;
  isLoading: boolean;
  deviceInfo: {
    fontScale: number;
    screenWidth: number;
    screenHeight: number;
  };
}

export function TypographyInputField({
  testInput,
  onInputChange,
  onRunTests,
  isLoading,
  deviceInfo,
}: TypographyInputFieldProps) {
  const { currentTheme } = useTheme();
  const isDark = currentTheme === 'dark';
  const colors = getThemeColors(isDark);

  // Color picker state
  const [colorPickerVisible, setColorPickerVisible] = useState(false);

  // Style preset options
  const stylePresetOptions = [
    { label: t('helpers.typographyHelper.options.stylePreset.custom'), value: 'custom' },
    { label: t('helpers.typographyHelper.options.stylePreset.h1'), value: 'h1' },
    { label: t('helpers.typographyHelper.options.stylePreset.h2'), value: 'h2' },
    { label: t('helpers.typographyHelper.options.stylePreset.h3'), value: 'h3' },
    { label: t('helpers.typographyHelper.options.stylePreset.h4'), value: 'h4' },
    { label: t('helpers.typographyHelper.options.stylePreset.h5'), value: 'h5' },
    { label: t('helpers.typographyHelper.options.stylePreset.h6'), value: 'h6' },
    { label: t('helpers.typographyHelper.options.stylePreset.title'), value: 'title' },
    { label: t('helpers.typographyHelper.options.stylePreset.subtitle'), value: 'subtitle' },
    { label: t('helpers.typographyHelper.options.stylePreset.body'), value: 'body' },
    { label: t('helpers.typographyHelper.options.stylePreset.caption'), value: 'caption' },
    { label: t('helpers.typographyHelper.options.stylePreset.label'), value: 'label' },
  ];

  // Handle style preset selection
  const handleStylePresetChange = (preset: string) => {
    if (preset === 'custom') {
      onInputChange({ stylePreset: 'custom' });
      return;
    }

    // Apply preset with current text color if available
    const presetStyle = applyTypographyPreset(preset as any, testInput.textColor);
    onInputChange({
      stylePreset: preset as any,
      fontSize: presetStyle.fontSize || testInput.fontSize,
      fontWeight: presetStyle.fontWeight || testInput.fontWeight,
      lineHeightMultiplier: presetStyle.lineHeight && presetStyle.fontSize 
        ? presetStyle.lineHeight / presetStyle.fontSize 
        : testInput.lineHeightMultiplier,
      letterSpacing: presetStyle.letterSpacing ?? testInput.letterSpacing,
      // Preserve existing text color if preset doesn't include one
      textColor: presetStyle.color || testInput.textColor,
    });
  };

  // Handle color selection
  const handleColorSelect = (color: string) => {
    onInputChange({ textColor: color });
    setColorPickerVisible(false);
  };

  // Font size options
  const fontSizeOptions = [
    { label: t('helpers.typographyHelper.options.fontSize.xs'), value: '12' },
    { label: t('helpers.typographyHelper.options.fontSize.sm'), value: '14' },
    { label: t('helpers.typographyHelper.options.fontSize.md'), value: '16' },
    { label: t('helpers.typographyHelper.options.fontSize.lg'), value: '18' },
    { label: t('helpers.typographyHelper.options.fontSize.xl'), value: '20' },
    { label: t('helpers.typographyHelper.options.fontSize.xxl'), value: '24' },
    { label: t('helpers.typographyHelper.options.fontSize.xxxl'), value: '32' },
  ];

  // Font weight options
  const fontWeightOptions = [
    { label: t('helpers.typographyHelper.options.fontWeight.normal'), value: '400' },
    { label: t('helpers.typographyHelper.options.fontWeight.medium'), value: '500' },
    { label: t('helpers.typographyHelper.options.fontWeight.semibold'), value: '600' },
    { label: t('helpers.typographyHelper.options.fontWeight.bold'), value: '700' },
  ];

  // Font style options
  const fontStyleOptions = [
    { label: t('helpers.typographyHelper.options.fontStyle.normal'), value: 'normal' },
    { label: t('helpers.typographyHelper.options.fontStyle.italic'), value: 'italic' },
  ];

  // Line height options
  const lineHeightOptions = [
    { label: t('helpers.typographyHelper.options.lineHeight.tight'), value: '1.2' },
    { label: t('helpers.typographyHelper.options.lineHeight.normal'), value: '1.5' },
    { label: t('helpers.typographyHelper.options.lineHeight.relaxed'), value: '1.8' },
  ];

  // Letter spacing options
  const letterSpacingOptions = [
    { label: t('helpers.typographyHelper.options.letterSpacing.none'), value: '0' },
    { label: t('helpers.typographyHelper.options.letterSpacing.tight'), value: '10' },
    { label: t('helpers.typographyHelper.options.letterSpacing.normal'), value: '20' },
    { label: t('helpers.typographyHelper.options.letterSpacing.wide'), value: '30' },
    { label: t('helpers.typographyHelper.options.letterSpacing.wider'), value: '50' },
    { label: t('helpers.typographyHelper.options.letterSpacing.widest'), value: '100' },
  ];

  // Preview text options
  const previewTextOptions = [
    { label: t('helpers.typographyHelper.options.previewText.default'), value: 'default' },
    { label: t('helpers.typographyHelper.options.previewText.lorem'), value: 'lorem' },
    { label: t('helpers.typographyHelper.options.previewText.short'), value: 'short' },
    { label: t('helpers.typographyHelper.options.previewText.long'), value: 'long' },
    { label: t('helpers.typographyHelper.options.previewText.numbers'), value: 'numbers' },
    { label: t('helpers.typographyHelper.options.previewText.special'), value: 'special' },
    { label: t('helpers.typographyHelper.options.previewText.mixed'), value: 'mixed' },
  ];

  // Get preview text value
  const getPreviewTextValue = () => {
    const text = testInput.text || 'The quick brown fox jumps over the lazy dog';
    const previewTextMap: Record<string, string> = {
      default: t('helpers.typographyHelper.options.previewText.default'),
      lorem: t('helpers.typographyHelper.options.previewText.lorem'),
      short: t('helpers.typographyHelper.options.previewText.short'),
      long: t('helpers.typographyHelper.options.previewText.long'),
      numbers: t('helpers.typographyHelper.options.previewText.numbers'),
      special: t('helpers.typographyHelper.options.previewText.special'),
      mixed: t('helpers.typographyHelper.options.previewText.mixed'),
    };
    
    // Find matching key
    for (const [key, value] of Object.entries(previewTextMap)) {
      if (text === value) return key;
    }
    return 'default';
  };

  // Get preview text by key
  const getPreviewTextByKey = (key: string) => {
    const previewTextMap: Record<string, string> = {
      default: t('helpers.typographyHelper.options.previewText.default'),
      lorem: t('helpers.typographyHelper.options.previewText.lorem'),
      short: t('helpers.typographyHelper.options.previewText.short'),
      long: t('helpers.typographyHelper.options.previewText.long'),
      numbers: t('helpers.typographyHelper.options.previewText.numbers'),
      special: t('helpers.typographyHelper.options.previewText.special'),
      mixed: t('helpers.typographyHelper.options.previewText.mixed'),
    };
    return previewTextMap[key] || previewTextMap.default;
  };

  // Initialize default text on first load if needed
  useEffect(() => {
    const defaultEnglishText = 'The quick brown fox jumps over the lazy dog';
    const defaultTurkishText = 'Hızlı kahverengi tilki tembel köpeğin üzerinden atlar';
    
    if (!testInput.text || 
        testInput.text === defaultEnglishText || 
        testInput.text === defaultTurkishText) {
      const defaultText = t('helpers.typographyHelper.options.previewText.default');
      if (testInput.text !== defaultText) {
        onInputChange({ text: defaultText });
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <ThemedView
      style={[
        typographyInputFieldStyles.container,
        {
          backgroundColor: colors.surfaceBackground,
          borderColor: colors.surfaceBorder + '30',
        }
      ]}
    >
      <ThemedText
        type="subtitle"
        style={[typographyInputFieldStyles.title, { color: colors.sectionTitle }]}
      >
        {t('helpers.typographyHelper.testInput')}
      </ThemedText>

      <View style={typographyInputFieldStyles.inputGroup}>
        <ThemedText
          style={[typographyInputFieldStyles.label, { color: colors.bodyText }]}
        >
          {t('helpers.typographyHelper.stylePreset')}
        </ThemedText>
        <Dropdown
          options={stylePresetOptions}
          selectedValue={testInput.stylePreset || 'custom'}
          onSelect={handleStylePresetChange}
          placeholder={t('helpers.typographyHelper.stylePreset')}
        />
      </View>

      <View style={typographyInputFieldStyles.inputGroup}>
        <ThemedText
          style={[typographyInputFieldStyles.label, { color: colors.bodyText }]}
        >
          {t('helpers.typographyHelper.textInput')}
        </ThemedText>
        <Dropdown
          options={previewTextOptions}
          selectedValue={getPreviewTextValue()}
          onSelect={(value) => onInputChange({ text: getPreviewTextByKey(value) })}
          placeholder={t('helpers.typographyHelper.textPlaceholder')}
        />
      </View>

      <View style={typographyInputFieldStyles.inputGroup}>
        <ThemedText
          style={[typographyInputFieldStyles.label, { color: colors.bodyText }]}
        >
          {t('helpers.typographyHelper.textColor')}
        </ThemedText>
        <TouchableOpacity
          style={[
            typographyInputFieldStyles.colorPickerButton,
            {
              backgroundColor: colors.inputBackground,
              borderColor: colors.surfaceBorder,
            }
          ]}
          onPress={() => setColorPickerVisible(true)}
        >
          <View style={typographyInputFieldStyles.colorPickerContent}>
            <View
              style={[
                typographyInputFieldStyles.colorPreview,
                { backgroundColor: testInput.textColor || '#000000' }
              ]}
            />
            <Text style={[typographyInputFieldStyles.colorPickerText, { color: colors.bodyText }]}>
              {testInput.textColor || '#000000'}
            </Text>
          </View>
        </TouchableOpacity>
      </View>

      <View style={typographyInputFieldStyles.inputRow}>
        <View style={typographyInputFieldStyles.inputGroup}>
          <ThemedText
            style={[typographyInputFieldStyles.label, { color: colors.bodyText }]}
          >
            {t('helpers.typographyHelper.fontSize')}
          </ThemedText>
          <Dropdown
            options={fontSizeOptions}
            selectedValue={testInput.fontSize?.toString() || '16'}
            onSelect={(value) => onInputChange({ fontSize: parseInt(value) })}
            placeholder={t('helpers.typographyHelper.fontSize')}
          />
        </View>

        <View style={typographyInputFieldStyles.inputGroup}>
          <ThemedText
            style={[typographyInputFieldStyles.label, { color: colors.bodyText }]}
          >
            {t('helpers.typographyHelper.fontWeight')}
          </ThemedText>
          <Dropdown
            options={fontWeightOptions}
            selectedValue={testInput.fontWeight?.toString() || '400'}
            onSelect={(value) => onInputChange({ fontWeight: parseInt(value) })}
            placeholder={t('helpers.typographyHelper.fontWeight')}
          />
        </View>
      </View>

      <View style={typographyInputFieldStyles.inputRow}>
        <View style={typographyInputFieldStyles.inputGroup}>
          <ThemedText
            style={[typographyInputFieldStyles.label, { color: colors.bodyText }]}
          >
            {t('helpers.typographyHelper.fontStyle')}
          </ThemedText>
          <Dropdown
            options={fontStyleOptions}
            selectedValue={testInput.fontStyle || 'normal'}
            onSelect={(value) => onInputChange({ fontStyle: value as 'normal' | 'italic' })}
            placeholder={t('helpers.typographyHelper.fontStyle')}
          />
        </View>

        <View style={typographyInputFieldStyles.inputGroup}>
          <ThemedText
            style={[typographyInputFieldStyles.label, { color: colors.bodyText }]}
          >
            {t('helpers.typographyHelper.lineHeightMultiplier')}
          </ThemedText>
          <Dropdown
            options={lineHeightOptions}
            selectedValue={testInput.lineHeightMultiplier?.toString() || '1.5'}
            onSelect={(value) => onInputChange({ lineHeightMultiplier: parseFloat(value) })}
            placeholder={t('helpers.typographyHelper.lineHeightMultiplier')}
          />
        </View>
      </View>

      <View style={typographyInputFieldStyles.inputGroup}>
        <ThemedText
          style={[typographyInputFieldStyles.label, { color: colors.bodyText }]}
        >
          {t('helpers.typographyHelper.letterSpacing')}
        </ThemedText>
        <Dropdown
          options={letterSpacingOptions}
          selectedValue={testInput.letterSpacing?.toString() || '0'}
          onSelect={(value) => onInputChange({ letterSpacing: parseFloat(value) })}
          placeholder={t('helpers.typographyHelper.letterSpacing')}
        />
      </View>

      <Button
        title={isLoading ? t('helpers.typographyHelper.runningTests') : t('helpers.typographyHelper.runTests')}
        onPress={onRunTests}
        disabled={isLoading}
        variant="primary"
        size="large"
      />

      {/* Color Picker Modal */}
      <ColorPickerModal
        visible={colorPickerVisible}
        onClose={() => setColorPickerVisible(false)}
        onSelect={handleColorSelect}
        initialColor={testInput.textColor || '#000000'}
        title={t('helpers.typographyHelper.textColor')}
      />
    </ThemedView>
  );
}

