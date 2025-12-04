import { Dropdown } from '@/src/shared/components/Dropdown';
import { ThemedText } from '@/src/shared/components/ThemedText';
import { ThemedView } from '@/src/shared/components/ThemedView';
import { t } from '@/src/shared/i18n';
import { Sizing, getThemeColors, useTheme } from 'masterfabric-expo-core';
import React from 'react';
import { View } from 'react-native';
import { UISizeTestInput } from '../models/ui-size-helper-models';
import { uiSizeInputFieldStyles } from '../styles/ui-size-input-field.styles';

interface UISizeInputFieldProps {
  testInput: UISizeTestInput;
  onInputChange: (updates: Partial<UISizeTestInput>) => void;
  deviceInfo: {
    deviceType: 'phone' | 'tablet' | 'desktop';
    screenWidth: number;
    screenHeight: number;
    columns: number;
    baseUnit: number;
  };
}

export function UISizeInputField({
  testInput,
  onInputChange,
  deviceInfo,
}: UISizeInputFieldProps) {
  const { currentTheme } = useTheme();
  const isDark = currentTheme === 'dark';
  const colors = getThemeColors(isDark);

  const sizeOptions = [
    { label: 'XXS', value: 'xxs' },
    { label: 'XS', value: 'xs' },
    { label: 'S', value: 's' },
    { label: 'M', value: 'm' },
    { label: 'L', value: 'l' },
    { label: 'XL', value: 'xl' },
    { label: 'XXL', value: 'xxl' },
    { label: 'XXXL', value: 'xxxl' },
  ];

  const gapSizeOptions = sizeOptions.filter(opt => opt.value !== 'xxxl');
  const borderRadiusOptions = [
    { label: 'Small', value: 'small' },
    { label: 'Large', value: 'large' },
  ];
  const borderWidthOptions = [
    { label: 'S', value: 's' },
    { label: 'M', value: 'm' },
    { label: 'L', value: 'l' },
  ];
  const buttonHeightOptions = [
    { label: 'Small', value: 'small' },
    { label: 'Medium', value: 'medium' },
    { label: 'Large', value: 'large' },
  ];
  const inputHeightOptions = buttonHeightOptions;
  const cardPaddingOptions = [
    { label: 'XXS', value: 'xxs' },
    { label: 'XS', value: 'xs' },
    { label: 'Small', value: 'small' },
    { label: 'Medium', value: 'medium' },
    { label: 'Large', value: 'large' },
    { label: 'XL', value: 'xl' },
    { label: 'XXL', value: 'xxl' },
  ];

  return (
    <ThemedView
      style={[
        uiSizeInputFieldStyles.container,
        {
          backgroundColor: colors.surfaceBackground,
          borderColor: colors.surfaceBorder + '30',
        }
      ]}
    >
      <ThemedText
        type="subtitle"
        style={[uiSizeInputFieldStyles.title, { color: colors.sectionTitle }]}
      >
        {t('helpers.uiSizeHelper.testInput')}
      </ThemedText>

      {/* Device Info */}
      <View style={uiSizeInputFieldStyles.infoGroup}>
        <ThemedText
          style={[uiSizeInputFieldStyles.label, { color: colors.bodyText }]}
        >
          Device: {deviceInfo.deviceType} · Width: {deviceInfo.screenWidth}px · Columns: {deviceInfo.columns} · Base: {deviceInfo.baseUnit}px
        </ThemedText>
      </View>

      {/* Spacing Controls */}
      <View style={uiSizeInputFieldStyles.inputRow}>
        <View style={uiSizeInputFieldStyles.inputGroup}>
          <ThemedText
            style={[uiSizeInputFieldStyles.label, { color: colors.bodyText }]}
          >
            {t('helpers.uiSizeHelper.spacing')}
          </ThemedText>
          <Dropdown
            options={sizeOptions}
            selectedValue={testInput.spacingSize}
            onSelect={(value) => onInputChange({ spacingSize: value as any })}
            placeholder={t('helpers.uiSizeHelper.spacing')}
          />
        </View>

        <View style={uiSizeInputFieldStyles.inputGroup}>
          <ThemedText
            style={[uiSizeInputFieldStyles.label, { color: colors.bodyText }]}
          >
            {t('helpers.uiSizeHelper.padding')}
          </ThemedText>
          <Dropdown
            options={sizeOptions}
            selectedValue={testInput.paddingSize}
            onSelect={(value) => onInputChange({ paddingSize: value as any })}
            placeholder={t('helpers.uiSizeHelper.padding')}
          />
        </View>
      </View>

      <View style={uiSizeInputFieldStyles.inputRow}>
        <View style={uiSizeInputFieldStyles.inputGroup}>
          <ThemedText
            style={[uiSizeInputFieldStyles.label, { color: colors.bodyText }]}
          >
            {t('helpers.uiSizeHelper.margin')}
          </ThemedText>
          <Dropdown
            options={sizeOptions}
            selectedValue={testInput.marginSize}
            onSelect={(value) => onInputChange({ marginSize: value as any })}
            placeholder={t('helpers.uiSizeHelper.margin')}
          />
        </View>

        <View style={uiSizeInputFieldStyles.inputGroup}>
          <ThemedText
            style={[uiSizeInputFieldStyles.label, { color: colors.bodyText }]}
          >
            {t('helpers.uiSizeHelper.gap')}
          </ThemedText>
          <Dropdown
            options={gapSizeOptions}
            selectedValue={testInput.gapSize}
            onSelect={(value) => onInputChange({ gapSize: value as any })}
            placeholder={t('helpers.uiSizeHelper.gap')}
          />
        </View>
      </View>

      {/* Component Controls */}
      <View style={uiSizeInputFieldStyles.inputRow}>
        <View style={uiSizeInputFieldStyles.inputGroup}>
          <ThemedText
            style={[uiSizeInputFieldStyles.label, { color: colors.bodyText }]}
          >
            {t('helpers.uiSizeHelper.borderRadius')}
          </ThemedText>
          <Dropdown
            options={borderRadiusOptions}
            selectedValue={testInput.borderRadius}
            onSelect={(value) => onInputChange({ borderRadius: value as any })}
            placeholder={t('helpers.uiSizeHelper.borderRadius')}
          />
        </View>

        <View style={uiSizeInputFieldStyles.inputGroup}>
          <ThemedText
            style={[uiSizeInputFieldStyles.label, { color: colors.bodyText }]}
          >
            {t('helpers.uiSizeHelper.borderWidth')}
          </ThemedText>
          <Dropdown
            options={borderWidthOptions}
            selectedValue={testInput.borderWidth}
            onSelect={(value) => onInputChange({ borderWidth: value as any })}
            placeholder={t('helpers.uiSizeHelper.borderWidth')}
          />
        </View>
      </View>

      <View style={uiSizeInputFieldStyles.inputRow}>
        <View style={uiSizeInputFieldStyles.inputGroup}>
          <ThemedText
            style={[uiSizeInputFieldStyles.label, { color: colors.bodyText }]}
          >
            {t('helpers.uiSizeHelper.buttonHeight')}
          </ThemedText>
          <Dropdown
            options={buttonHeightOptions}
            selectedValue={testInput.buttonHeight}
            onSelect={(value) => onInputChange({ buttonHeight: value as any })}
            placeholder={t('helpers.uiSizeHelper.buttonHeight')}
          />
        </View>

        <View style={uiSizeInputFieldStyles.inputGroup}>
          <ThemedText
            style={[uiSizeInputFieldStyles.label, { color: colors.bodyText }]}
          >
            {t('helpers.uiSizeHelper.inputHeight')}
          </ThemedText>
          <Dropdown
            options={inputHeightOptions}
            selectedValue={testInput.inputHeight}
            onSelect={(value) => onInputChange({ inputHeight: value as any })}
            placeholder={t('helpers.uiSizeHelper.inputHeight')}
          />
        </View>
      </View>

      <View style={uiSizeInputFieldStyles.inputRow}>
        <View style={uiSizeInputFieldStyles.inputGroup}>
          <ThemedText
            style={[uiSizeInputFieldStyles.label, { color: colors.bodyText }]}
          >
            {t('helpers.uiSizeHelper.cardPadding')}
          </ThemedText>
          <Dropdown
            options={cardPaddingOptions}
            selectedValue={testInput.cardPadding}
            onSelect={(value) => onInputChange({ cardPadding: value as any })}
            placeholder={t('helpers.uiSizeHelper.cardPadding')}
          />
        </View>

        <View style={uiSizeInputFieldStyles.inputGroup}>
          <ThemedText
            style={[uiSizeInputFieldStyles.label, { color: colors.bodyText }]}
          >
            {t('helpers.uiSizeHelper.scrollPadding')}
          </ThemedText>
          <Dropdown
            options={gapSizeOptions}
            selectedValue={testInput.scrollPadding}
            onSelect={(value) => onInputChange({ scrollPadding: value as any })}
            placeholder={t('helpers.uiSizeHelper.scrollPadding')}
          />
        </View>
      </View>

      <View style={uiSizeInputFieldStyles.inputGroup}>
        <ThemedText
          style={[uiSizeInputFieldStyles.label, { color: colors.bodyText }]}
        >
          {t('helpers.uiSizeHelper.scrollMargin')}
        </ThemedText>
        <Dropdown
          options={gapSizeOptions}
          selectedValue={testInput.scrollMargin}
          onSelect={(value) => onInputChange({ scrollMargin: value as any })}
          placeholder={t('helpers.uiSizeHelper.scrollMargin')}
        />
      </View>

    </ThemedView>
  );
}

