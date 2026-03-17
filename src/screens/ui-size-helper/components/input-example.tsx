import { ThemedText } from '@/src/shared/components/ThemedText';
import { ThemedView } from '@/src/shared/components/ThemedView';
import { Dropdown } from '@/src/shared/components/Dropdown';
import { t } from '@/src/shared/i18n';
import { Sizing, uiSizeHelper, useResponsive } from 'masterfabric-expo-core';
import { getThemeColors, useTheme } from 'masterfabric-expo-core';
import React, { useState } from 'react';
import { ScrollView, TextInput, TouchableOpacity, View } from 'react-native';

export function InputExample() {
  const { currentTheme } = useTheme();
  const isDark = currentTheme === 'dark';
  const colors = getThemeColors(isDark);
  const { isPhone } = useResponsive();

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: '',
  });

  const inputSizes: Array<'small' | 'medium' | 'large'> = ['small', 'medium', 'large'];
  const borderRadiusOptions: Array<'small' | 'large'> = ['small', 'large'];
  const borderWidthOptions: Array<'s' | 'm' | 'l'> = ['s', 'm', 'l'];

  const [selectedSize, setSelectedSize] = useState<'small' | 'medium' | 'large'>('medium');
  const [selectedBorderRadius, setSelectedBorderRadius] = useState<'small' | 'large'>('large');
  const [selectedBorderWidth, setSelectedBorderWidth] = useState<'s' | 'm' | 'l'>('s');

  // Helper methods
  const inputPaddingH = Sizing.input.padding.horizontal.s;
  const inputPaddingV = Sizing.input.padding.vertical.s;

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
          {t('uiSizeHelper.examples.input.title')}
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
            flexWrap: 'wrap',
            gap: Sizing.gap.s,
            marginBottom: Sizing.spacing.l,
          }}
        >
          <View style={{ flex: isPhone ? 1 : 0.32, minWidth: Sizing.minWidth.s }}>
            <ThemedText
              type="defaultSemiBold"
              style={{
                fontSize: Sizing.typography.fontSize.m,
                marginBottom: Sizing.spacing.s,
              }}
            >
              {t('uiSizeHelper.examples.input.interactiveSize')}
            </ThemedText>
            <Dropdown
              options={inputSizes.map((size) => ({
                label: `${size.toUpperCase()} (${Sizing.input.height[size]}px)`,
                value: size,
              }))}
              selectedValue={selectedSize}
              onSelect={(value) => setSelectedSize(value as 'small' | 'medium' | 'large')}
              placeholder={t('uiSizeHelper.placeholders.selectInputSize')}
            />
          </View>

          <View style={{ flex: isPhone ? 1 : 0.32, minWidth: Sizing.minWidth.s }}>
            <ThemedText
              type="defaultSemiBold"
              style={{
                fontSize: Sizing.typography.fontSize.m,
                marginBottom: Sizing.spacing.s,
              }}
            >
              {t('uiSizeHelper.examples.input.interactiveRadius')}
            </ThemedText>
            <Dropdown
              options={borderRadiusOptions.map((radius) => ({
                label: `${radius.toUpperCase()} (${Sizing.borderRadius[radius]}px)`,
                value: radius,
              }))}
              selectedValue={selectedBorderRadius}
              onSelect={(value) => setSelectedBorderRadius(value as 'small' | 'large')}
              placeholder={t('uiSizeHelper.placeholders.selectRadius')}
            />
          </View>

          <View style={{ flex: isPhone ? 1 : 0.32, minWidth: Sizing.minWidth.s }}>
            <ThemedText
              type="defaultSemiBold"
              style={{
                fontSize: Sizing.typography.fontSize.m,
                marginBottom: Sizing.spacing.s,
              }}
            >
              {t('uiSizeHelper.examples.input.interactiveWidth')}
            </ThemedText>
            <Dropdown
              options={borderWidthOptions.map((width) => ({
                label: `${width.toUpperCase()} (${Sizing.borderWidth[width]}px)`,
                value: width,
              }))}
              selectedValue={selectedBorderWidth}
              onSelect={(value) => setSelectedBorderWidth(value as 's' | 'm' | 'l')}
              placeholder={t('uiSizeHelper.placeholders.selectWidth')}
            />
          </View>
        </View>

        {/* Form Example */}
        <ThemedView
          style={{
            backgroundColor: colors.surfaceBackground,
            borderRadius: Sizing.borderRadius.large,
            padding: Sizing.card.padding.medium,
            borderWidth: Sizing.borderWidth.s,
            borderColor: colors.surfaceBorder,
            marginBottom: Sizing.spacing.m,
          }}
        >
          <ThemedText
            type="defaultSemiBold"
            style={{
              fontSize: Sizing.typography.fontSize.xl,
              marginBottom: Sizing.spacing.m,
            }}
          >
            Contact Form
          </ThemedText>

          {/* Name Input */}
          <View style={{ marginBottom: Sizing.spacing.m }}>
            <ThemedText
              style={{
                fontSize: Sizing.typography.fontSize.s,
                marginBottom: Sizing.spacing.xs,
                color: colors.text,
              }}
            >
              Name
            </ThemedText>
            <TextInput
              style={{
                height: Sizing.input.height[selectedSize],
                width: '100%',
                paddingHorizontal: inputPaddingH,
                paddingVertical: inputPaddingV,
                borderRadius: Sizing.borderRadius[selectedBorderRadius],
                borderWidth: Sizing.borderWidth[selectedBorderWidth],
                borderColor: colors.surfaceBorder,
                backgroundColor: colors.inputBackground,
                color: colors.text,
                fontSize: Sizing.typography.fontSize.m,
              }}
              placeholder="Enter your name"
              placeholderTextColor={colors.placeholderText}
              value={formData.name}
              onChangeText={(text) => setFormData({ ...formData, name: text })}
            />
          </View>

          {/* Email Input */}
          <View style={{ marginBottom: Sizing.spacing.m }}>
            <ThemedText
              style={{
                fontSize: Sizing.typography.fontSize.s,
                marginBottom: Sizing.spacing.xs,
                color: colors.text,
              }}
            >
              Email
            </ThemedText>
            <TextInput
              keyboardType="email-address"
              autoCapitalize="none"
              style={{
                height: Sizing.input.height[selectedSize],
                width: '100%',
                paddingHorizontal: inputPaddingH,
                paddingVertical: inputPaddingV,
                borderRadius: Sizing.borderRadius[selectedBorderRadius],
                borderWidth: Sizing.borderWidth[selectedBorderWidth],
                borderColor: colors.surfaceBorder,
                backgroundColor: colors.inputBackground,
                color: colors.text,
                fontSize: Sizing.typography.fontSize.m,
              }}
              placeholder="Enter your email"
              placeholderTextColor={colors.placeholderText}
              value={formData.email}
              onChangeText={(text) => setFormData({ ...formData, email: text })}
            />
          </View>

          {/* Multiline Message Input */}
          <View style={{ marginBottom: Sizing.spacing.m }}>
            <ThemedText
              style={{
                fontSize: Sizing.typography.fontSize.s,
                marginBottom: Sizing.spacing.xs,
                color: colors.text,
              }}
            >
              {t('uiSizeHelper.examples.input.multiline')}
            </ThemedText>
            <TextInput
              multiline
              style={{
                minHeight: Sizing.input.minHeight.m,
                width: '100%',
                paddingHorizontal: inputPaddingH,
                paddingVertical: inputPaddingV,
                borderRadius: Sizing.borderRadius[selectedBorderRadius],
                borderWidth: Sizing.borderWidth[selectedBorderWidth],
                borderColor: colors.surfaceBorder,
                backgroundColor: colors.inputBackground,
                color: colors.text,
                fontSize: Sizing.typography.fontSize.m,
                textAlignVertical: 'top',
              }}
              placeholder={t('uiSizeHelper.examples.input.placeholder')}
              placeholderTextColor={colors.placeholderText}
              value={formData.message}
              onChangeText={(text) => setFormData({ ...formData, message: text })}
            />
          </View>

          {/* Submit Button */}
          <TouchableOpacity
            style={{
              width: '100%',
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
              Submit
            </ThemedText>
          </TouchableOpacity>
        </ThemedView>

        {/* Helper Info */}
        <ThemedView
          style={{
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
            Input Properties:
          </ThemedText>
          <ThemedText
            style={{
              fontSize: Sizing.typography.fontSize.xs,
              color: colors.bodyText,
              marginBottom: Sizing.spacing.xxs,
            }}
          >
            • Height: {selectedSize} = {Sizing.input.height[selectedSize]}px
          </ThemedText>
          <ThemedText
            style={{
              fontSize: Sizing.typography.fontSize.xs,
              color: colors.bodyText,
              marginBottom: Sizing.spacing.xxs,
            }}
          >
            • Padding: H {inputPaddingH}px · V {inputPaddingV}px
          </ThemedText>
          <ThemedText
            style={{
              fontSize: Sizing.typography.fontSize.xs,
              color: colors.bodyText,
              marginBottom: Sizing.spacing.xxs,
            }}
          >
            • Border Radius: {selectedBorderRadius} = {Sizing.borderRadius[selectedBorderRadius]}px
          </ThemedText>
          <ThemedText
            style={{
              fontSize: Sizing.typography.fontSize.xs,
              color: colors.bodyText,
            }}
          >
            • Border Width: {selectedBorderWidth} = {Sizing.borderWidth[selectedBorderWidth]}px
          </ThemedText>
        </ThemedView>
      </ThemedView>
    </ScrollView>
  );
}
