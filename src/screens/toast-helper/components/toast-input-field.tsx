import { ColorPickerModal } from '@/src/shared/components/ColorPickerModal';
import { ThemedText } from '@/src/shared/components/ThemedText';
import { ThemedView } from '@/src/shared/components/ThemedView';
import { IconSymbol } from '@/src/shared/components/ui/IconSymbol';
import { t } from '@/src/shared/i18n';
import { getThemeColors, useTheme } from 'masterfabric-expo-core';
import React, { useEffect, useState } from 'react';
import { Text, TextInput, TouchableOpacity, View } from 'react-native';
import { AnimationStrength, CUSTOM_TOAST_ICONS, ToastInput, ToastPosition, ToastType } from '../models/toast-helper.models';
import { toastInputFieldStyles } from '../styles/toast-input-field.styles';

interface ToastInputFieldProps {
  input: ToastInput;
  onInputChange: (updates: Partial<ToastInput>) => void;
  onRunExamples: () => void;
  onShowCustomToast: () => void;
  isLoading: boolean;
}

interface OptionButtonProps {
  title: string;
  onPress: () => void;
  isSelected: boolean;
}

function OptionButton({ title, onPress, isSelected }: OptionButtonProps) {
  const { currentTheme } = useTheme();
  const isDark = currentTheme === 'dark';
  const colors = getThemeColors(isDark);

  return (
    <TouchableOpacity
      style={[
        toastInputFieldStyles.optionButton,
        {
          backgroundColor: isSelected ? '#007AFF' : (isDark ? '#2C2C2E' : '#FFFFFF'),
          borderColor: isSelected ? '#007AFF' : (isDark ? '#3C3C43' : '#E5E5E5'),
        }
      ]}
      onPress={onPress}
    >
      <Text
        style={[
          toastInputFieldStyles.optionButtonText,
          {
            color: isSelected ? '#FFFFFF' : colors.text,
            fontWeight: isSelected ? '700' : '500',
          }
        ]}
      >
        {title}
      </Text>
    </TouchableOpacity>
  );
}

export function ToastInputField({ 
  input, 
  onInputChange, 
  onRunExamples, 
  onShowCustomToast, 
  isLoading 
}: ToastInputFieldProps) {
  const { currentTheme } = useTheme();
  const isDark = currentTheme === 'dark';
  const colors = getThemeColors(isDark);
  
  // Duration için local state
  const [durationText, setDurationText] = useState((input.duration / 1000).toFixed(1).replace(/\.0$/, ''));
  
  // Dropdown visibility state
  const [dropdownVisible, setDropdownVisible] = useState(false);
  
  // Color picker states
  const [colorPickerVisible, setColorPickerVisible] = useState(false);
  const [colorPickerType, setColorPickerType] = useState<'backgroundColor' | 'textColor' | 'iconColor'>('backgroundColor');
  
  // Input prop'u değiştiğinde local state'i güncelle
  useEffect(() => {
    setDurationText((input.duration / 1000).toFixed(1).replace(/\.0$/, ''));
  }, [input.duration]);

  const positions: { key: ToastPosition; label: string }[] = [
    { key: 'top', label: t('helpers.toastHelper.controls.top') },
    { key: 'center', label: t('helpers.toastHelper.controls.center') },
    { key: 'bottom', label: t('helpers.toastHelper.controls.bottom') }
  ];

  const types: { key: ToastType; label: string }[] = [
    { key: 'success', label: t('helpers.toastHelper.types.success') },
    { key: 'error', label: t('helpers.toastHelper.types.error') },
    { key: 'warning', label: t('helpers.toastHelper.types.warning') },
    { key: 'info', label: t('helpers.toastHelper.types.info') },
    { key: 'custom', label: t('helpers.toastHelper.types.custom') }
  ];

  const animations: { key: AnimationStrength; label: string }[] = [
    { key: 'none', label: t('helpers.toastHelper.controls.none') },
    { key: 'light', label: t('helpers.toastHelper.controls.light') },
    { key: 'medium', label: t('helpers.toastHelper.controls.medium') },
    { key: 'strong', label: t('helpers.toastHelper.controls.strong') }
  ];

  const handleDurationChange = (value: string) => {
    setDurationText(value);
    
    const cleanValue = value.replace(/[^0-9.]/g, '');
    
    // Eğer input tamamen boşsa, varsayılan değeri kullan
    if (cleanValue === '' || value === '') {
      onInputChange({ duration: 3000 });
      return;
    }
    
    const seconds = parseFloat(cleanValue);
    if (!isNaN(seconds) && seconds > 0) {
      const ms = Math.min(Math.max(Math.round(seconds * 1000), 1000), 10000);
      onInputChange({ duration: ms });
    }
  };

  const formatDurationDisplay = (seconds: number) => {
    return t('helpers.toastHelper.controls.durationInfo', { 
      seconds: seconds, 
      milliseconds: seconds * 1000 
    });
  };

  const openColorPicker = (type: 'backgroundColor' | 'textColor' | 'iconColor') => {
    setColorPickerType(type);
    setColorPickerVisible(true);
  };

  const handleColorSelect = (color: string) => {
    onInputChange({ 
      customConfig: { 
        ...input.customConfig, 
        [colorPickerType]: color 
      } 
    });
  };

  return (
    <ThemedView style={[toastInputFieldStyles.container, { borderColor: colors.surfaceBorder }]}>
      {/* Message Input */}
      <ThemedText 
        type="subtitle" 
        style={[toastInputFieldStyles.sectionTitle, { color: colors.sectionTitle }]}
      >
        {t('helpers.toastHelper.messageInput')}
      </ThemedText>
      <TextInput
        style={[
          toastInputFieldStyles.messageInput,
          {
            color: colors.bodyText,
            backgroundColor: colors.surfaceBackground,
            borderColor: colors.surfaceBorder,
          }
        ]}
        value={input.message}
        onChangeText={(text) => onInputChange({ message: text })}
        placeholder={t('helpers.toastHelper.messagePlaceholder')}
        placeholderTextColor={colors.labelText}
        multiline
        maxLength={500}
        returnKeyType="done"
        blurOnSubmit={false}
        scrollEnabled={true}
        textAlignVertical="top"
      />

      {/* Position Selection */}
      <ThemedText 
        type="subtitle" 
        style={[toastInputFieldStyles.sectionTitle, { color: colors.sectionTitle }]}
      >
        {t('helpers.toastHelper.controls.position')}
      </ThemedText>
      <View style={toastInputFieldStyles.optionsContainer}>
        {positions.map((pos) => (
          <OptionButton
            key={pos.key}
            title={pos.label}
            onPress={() => onInputChange({ position: pos.key })}
            isSelected={input.position === pos.key}
          />
        ))}
      </View>

      {/* Duration Input */}
      <ThemedText 
        type="subtitle" 
        style={[toastInputFieldStyles.sectionTitle, { color: colors.sectionTitle }]}
      >
        {t('helpers.toastHelper.controls.duration')}
      </ThemedText>
      
      <TextInput
        style={[
          toastInputFieldStyles.durationInput,
          {
            color: colors.bodyText,
            backgroundColor: colors.surfaceBackground,
            borderColor: colors.surfaceBorder,
          }
        ]}
        value={durationText}
        onChangeText={handleDurationChange}
        placeholder="3"
        placeholderTextColor={colors.labelText}
        keyboardType="numeric"
        maxLength={5}
      />
      
      <ThemedText style={[toastInputFieldStyles.durationDescription, { color: colors.labelText }]}>
        {formatDurationDisplay(input.duration / 1000)}
      </ThemedText>

      {/* Animation Selection */}
      <ThemedText 
        type="subtitle" 
        style={[toastInputFieldStyles.sectionTitle, { color: colors.sectionTitle }]}
      >
        {t('helpers.toastHelper.controls.animation')}
      </ThemedText>
      <View style={toastInputFieldStyles.optionsContainer}>
        {animations.map((anim) => (
          <OptionButton
            key={anim.key}
            title={anim.label}
            onPress={() => onInputChange({ animation: anim.key })}
            isSelected={input.animation === anim.key}
          />
        ))}
      </View>

      {/* Toast Type Selection */}
      <ThemedText 
        type="subtitle" 
        style={[toastInputFieldStyles.sectionTitle, { color: colors.sectionTitle }]}
      >
        {t('helpers.toastHelper.type')}
      </ThemedText>
      <View style={toastInputFieldStyles.typeOptionsContainer}>
        {types.map((type) => (
          <OptionButton
            key={type.key}
            title={type.label}
            onPress={() => onInputChange({ type: type.key })}
            isSelected={input.type === type.key}
          />
        ))}
      </View>

      {/* Custom Toast Configuration */}
      {input.type === 'custom' && (
        <>
          <ThemedText 
            type="subtitle" 
            style={[toastInputFieldStyles.sectionTitle, { color: colors.sectionTitle }]}
          >
            {t('helpers.toastHelper.customConfig.title')}
          </ThemedText>
          
          {/* Icon Selection Dropdown */}
          <ThemedText 
            type="default" 
            style={[toastInputFieldStyles.fieldLabel, { color: colors.labelText }]}
          >
            {t('helpers.toastHelper.customConfig.selectIcon')}
          </ThemedText>
          
          <TouchableOpacity
            style={[
              toastInputFieldStyles.dropdownButton,
              {
                backgroundColor: colors.surfaceBackground,
                borderColor: colors.surfaceBorder,
              }
            ]}
            onPress={() => {
              // Toggle dropdown visibility
              setDropdownVisible(!dropdownVisible);
            }}
          >
            <View style={toastInputFieldStyles.dropdownContent}>
              {input.customConfig?.icon ? (
                <>
                  <IconSymbol 
                    name={input.customConfig.icon} 
                    size={20} 
                    color={colors.text}
                  />
                  <Text style={[toastInputFieldStyles.dropdownText, { color: colors.text }]}>
                    {CUSTOM_TOAST_ICONS.find(icon => icon.icon === input.customConfig?.icon)?.name || 'Select Icon'}
                  </Text>
                </>
              ) : (
                <Text style={[toastInputFieldStyles.dropdownText, { color: colors.labelText }]}>
                  {t('helpers.toastHelper.customConfig.selectIcon')}
                </Text>
              )}
            </View>
          </TouchableOpacity>

          {/* Icon Dropdown */}
          {dropdownVisible && (
            <View style={[
              toastInputFieldStyles.dropdownContainer,
              {
                backgroundColor: colors.surfaceBackground,
                borderColor: colors.surfaceBorder,
              }
            ]}>
              <View style={toastInputFieldStyles.iconGrid}>
                {CUSTOM_TOAST_ICONS.map((iconOption) => (
                  <TouchableOpacity
                    key={iconOption.id}
                    style={[
                      toastInputFieldStyles.iconCard,
                      {
                        backgroundColor: isDark ? '#2C2C2E' : '#FFFFFF',
                        borderColor: colors.surfaceBorder,
                      },
                      input.customConfig?.icon === iconOption.icon && toastInputFieldStyles.iconCardSelected
                    ]}
                    onPress={() => {
                      onInputChange({ 
                        customConfig: {
                          ...input.customConfig,
                          icon: iconOption.icon,
                        }
                      });
                      setDropdownVisible(false);
                    }}
                  >
                    <IconSymbol 
                      name={iconOption.icon} 
                      size={24} 
                      color={colors.text}
                    />
                    <Text style={[toastInputFieldStyles.iconName, { color: colors.text }]}>
                      {iconOption.name}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>
          )}

          {/* Background Color Input */}
          <ThemedText 
            type="default" 
            style={[toastInputFieldStyles.fieldLabel, { color: colors.labelText }]}
          >
            {t('helpers.toastHelper.customConfig.backgroundColor')}
          </ThemedText>
          <TouchableOpacity
            style={[
              toastInputFieldStyles.colorPickerButton,
              {
                backgroundColor: colors.surfaceBackground,
                borderColor: colors.surfaceBorder,
              }
            ]}
            onPress={() => openColorPicker('backgroundColor')}
          >
            <View style={toastInputFieldStyles.colorPickerContent}>
              <View
                style={[
                  toastInputFieldStyles.colorPreview,
                  { backgroundColor: input.customConfig?.backgroundColor || '#9C27B0' }
                ]}
              />
              <Text style={[toastInputFieldStyles.colorPickerText, { color: colors.text }]}>
                {input.customConfig?.backgroundColor || t('helpers.toastHelper.customConfig.selectColor')}
              </Text>
            </View>
          </TouchableOpacity>

          {/* Text Color Input */}
          <ThemedText 
            type="default" 
            style={[toastInputFieldStyles.fieldLabel, { color: colors.labelText }]}
          >
            {t('helpers.toastHelper.customConfig.textColor')}
          </ThemedText>
          <TouchableOpacity
            style={[
              toastInputFieldStyles.colorPickerButton,
              {
                backgroundColor: colors.surfaceBackground,
                borderColor: colors.surfaceBorder,
              }
            ]}
            onPress={() => openColorPicker('textColor')}
          >
            <View style={toastInputFieldStyles.colorPickerContent}>
              <View
                style={[
                  toastInputFieldStyles.colorPreview,
                  { backgroundColor: input.customConfig?.textColor || '#FFFFFF' }
                ]}
              />
              <Text style={[toastInputFieldStyles.colorPickerText, { color: colors.text }]}>
                {input.customConfig?.textColor || t('helpers.toastHelper.customConfig.selectColor')}
              </Text>
            </View>
          </TouchableOpacity>

          {/* Icon Color Input */}
          <ThemedText 
            type="default" 
            style={[toastInputFieldStyles.fieldLabel, { color: colors.labelText }]}
          >
            {t('helpers.toastHelper.customConfig.iconColor')}
          </ThemedText>
          <TouchableOpacity
            style={[
              toastInputFieldStyles.colorPickerButton,
              {
                backgroundColor: colors.surfaceBackground,
                borderColor: colors.surfaceBorder,
              }
            ]}
            onPress={() => openColorPicker('iconColor')}
          >
            <View style={toastInputFieldStyles.colorPickerContent}>
              <View
                style={[
                  toastInputFieldStyles.colorPreview,
                  { backgroundColor: input.customConfig?.iconColor || '#FFD93D' }
                ]}
              />
              <Text style={[toastInputFieldStyles.colorPickerText, { color: colors.text }]}>
                {input.customConfig?.iconColor || t('helpers.toastHelper.customConfig.selectColor')}
              </Text>
            </View>
          </TouchableOpacity>
        </>
      )}

      {/* Action Buttons */}
      <View style={toastInputFieldStyles.buttonContainer}>
        <TouchableOpacity 
          style={[toastInputFieldStyles.sendButton, { backgroundColor: '#34C759' }]} 
          onPress={onShowCustomToast}
          disabled={isLoading}
        >
          <Text style={toastInputFieldStyles.sendButtonText}>
            {t('helpers.toastHelper.sendToast')}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity 
          style={[toastInputFieldStyles.exampleButton, { backgroundColor: '#007AFF' }]} 
          onPress={onRunExamples}
          disabled={isLoading}
        >
          <Text style={toastInputFieldStyles.exampleButtonText}>
            {isLoading ? t('helpers.toastHelper.runningExamples') : t('helpers.toastHelper.runAllExamples')}
          </Text>
        </TouchableOpacity>
      </View>

      {/* Color Picker Modal */}
      <ColorPickerModal
        visible={colorPickerVisible}
        onClose={() => setColorPickerVisible(false)}
        onSelect={handleColorSelect}
        initialColor={
          colorPickerType === 'backgroundColor' 
            ? input.customConfig?.backgroundColor || '#9C27B0'
            : colorPickerType === 'textColor'
            ? input.customConfig?.textColor || '#FFFFFF'
            : input.customConfig?.iconColor || '#FFD93D'
        }
        title={
          colorPickerType === 'backgroundColor'
            ? t('helpers.toastHelper.customConfig.backgroundColor')
            : colorPickerType === 'textColor'
            ? t('helpers.toastHelper.customConfig.textColor')
            : t('helpers.toastHelper.customConfig.iconColor')
        }
      />
    </ThemedView>
  );
}