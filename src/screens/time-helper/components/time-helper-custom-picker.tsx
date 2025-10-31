import { ThemedText } from '@/src/shared/components/ThemedText';
import { ThemedView } from '@/src/shared/components/ThemedView';
import { t } from '@/src/shared/i18n';
import { getThemeColors, useTheme } from 'masterfabric-expo-core';
import React, { useState } from 'react';
import { Modal, ScrollView, TouchableOpacity, View } from 'react-native';
import { timeHelperCustomPickerStyles } from '../styles/time-helper-custom-picker.styles';

interface TimeHelperPickerItem {
  label: string;
  value: string;
}

interface TimeHelperCustomPickerProps {
  items: TimeHelperPickerItem[] | readonly TimeHelperPickerItem[];
  selectedValue: string;
  onValueChange: (value: string) => void;
  placeholder?: string;
}

/**
 * Time Helper Custom Picker Component
 * Modal-based dropdown picker for selecting timezone, locale, format, and unit options
 */
export function TimeHelperCustomPicker({ items, selectedValue, onValueChange, placeholder }: TimeHelperCustomPickerProps) {
  const { currentTheme } = useTheme();
  const isDark = currentTheme === 'dark';
  const colors = getThemeColors(isDark);
  const [modalVisible, setModalVisible] = useState(false);

  const selectedItem = items.find(item => item.value === selectedValue);

  /**
   * Handle item selection and close modal
   */
  const handleItemSelect = (value: string) => {
    onValueChange(value);
    setModalVisible(false);
  };

  return (
    <>
      <TouchableOpacity
        style={[
          timeHelperCustomPickerStyles.pickerButton,
          { 
            backgroundColor: colors.inputBackground,
            borderColor: colors.surfaceBorder,
          }
        ]}
        onPress={() => setModalVisible(true)}
      >
        <ThemedText 
          style={{ color: colors.bodyText, flex: 1 }}
          numberOfLines={1}
        >
          {selectedItem?.label || placeholder || t('common.select')}
        </ThemedText>
        <ThemedText style={{ color: colors.bodyText }}>▼</ThemedText>
      </TouchableOpacity>

      <Modal
        visible={modalVisible}
        transparent
        animationType="slide"
        onRequestClose={() => setModalVisible(false)}
      >
        <TouchableOpacity
          style={[
            timeHelperCustomPickerStyles.modalOverlay,
            { 
              backgroundColor: isDark 
                ? 'rgba(0, 0, 0, 0.7)' 
                : 'rgba(0, 0, 0, 0.5)' 
            }
          ]}
          activeOpacity={1}
          onPress={() => setModalVisible(false)}
        >
          <ThemedView
            style={[
              timeHelperCustomPickerStyles.modalContent,
              { backgroundColor: colors.surfaceBackground }
            ]}
          >
            <View style={[
              timeHelperCustomPickerStyles.modalHeader,
              { borderBottomColor: colors.surfaceBorder }
            ]}>
              <ThemedText type="subtitle" style={{ color: colors.titleText }}>
                {placeholder || t('common.selectOption')}
              </ThemedText>
              <View style={timeHelperCustomPickerStyles.headerButtons}>
                <TouchableOpacity onPress={() => setModalVisible(false)}>
                  <ThemedText style={[timeHelperCustomPickerStyles.cancelButton, { color: colors.bodyText }]}>
                    {t('common.cancel')}
                  </ThemedText>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => setModalVisible(false)}>
                  <ThemedText style={[timeHelperCustomPickerStyles.confirmButton, { color: colors.primary }]}>
                    {t('common.confirm')}
                  </ThemedText>
                </TouchableOpacity>
              </View>
            </View>

            {/* Items List */}
            <ScrollView style={timeHelperCustomPickerStyles.itemList}>
              {items.map((item) => (
                <TouchableOpacity
                  key={item.value}
                  style={[
                    timeHelperCustomPickerStyles.item,
                    { borderBottomColor: colors.surfaceBorder },
                    selectedValue === item.value && { backgroundColor: colors.primary + '20' }
                  ]}
                  onPress={() => handleItemSelect(item.value)}
                >
                  <ThemedText
                    style={[
                      timeHelperCustomPickerStyles.itemText,
                      { color: selectedValue === item.value ? colors.primary : colors.bodyText }
                    ]}
                    numberOfLines={1}
                  >
                    {item.label}
                  </ThemedText>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </ThemedView>
        </TouchableOpacity>
      </Modal>
    </>
  );
}

