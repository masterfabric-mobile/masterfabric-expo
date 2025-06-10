import { Ionicons } from '@expo/vector-icons';
import React, { useState } from 'react';
import { Modal, ScrollView, StyleSheet, TouchableOpacity, View } from 'react-native';
import { useTheme } from '../contexts/theme-context';
import { ThemedText } from './ThemedText';

export interface DropdownOption {
  label: string;
  value: string;
  icon?: string;
}

interface DropdownProps {
  options: DropdownOption[];
  selectedValue: string;
  onSelect: (value: string) => void;
  placeholder?: string;
  style?: any;
}

export function Dropdown({ options, selectedValue, onSelect, placeholder, style }: DropdownProps) {
  const [isOpen, setIsOpen] = useState(false);
  const { currentTheme } = useTheme();
  const isDark = currentTheme === 'dark';

  const selectedOption = options.find(option => option.value === selectedValue);

  const handleSelect = (value: string) => {
    console.log('🔽 Dropdown selecting:', value);
    onSelect(value);
    setIsOpen(false);
  };

  return (
    <>
      <TouchableOpacity
        style={[
          styles.dropdown,
          {
            backgroundColor: isDark ? '#1C1C1E' : '#F2F2F7',
            borderColor: isDark ? '#3C3C43' : '#E5E5E7',
          },
          style
        ]}
        onPress={() => setIsOpen(true)}
        accessibilityRole="button"
        accessibilityLabel={`Select ${placeholder || 'option'}`}
      >
        <ThemedText style={styles.dropdownText}>
          {selectedOption?.label || placeholder}
        </ThemedText>
        <Ionicons 
          name="chevron-down" 
          size={20} 
          color={isDark ? '#FFFFFF' : '#666666'} 
        />
      </TouchableOpacity>

      <Modal
        visible={isOpen}
        transparent
        animationType="fade"
        onRequestClose={() => setIsOpen(false)}
      >
        <TouchableOpacity
          style={styles.overlay}
          activeOpacity={1}
          onPress={() => setIsOpen(false)}
        >
          <View style={[
            styles.modal,
            { backgroundColor: isDark ? '#1C1C1E' : '#FFFFFF' }
          ]}>
            <ScrollView showsVerticalScrollIndicator={false}>
              {options.map((option) => (
                <TouchableOpacity
                  key={option.value}
                  style={[
                    styles.option,
                    {
                      backgroundColor: selectedValue === option.value 
                        ? (isDark ? '#007AFF20' : '#007AFF10') 
                        : 'transparent'
                    }
                  ]}
                  onPress={() => handleSelect(option.value)}
                >
                  {option.icon && (
                    <Ionicons 
                      name={option.icon as any} 
                      size={20} 
                      color={selectedValue === option.value ? '#007AFF' : (isDark ? '#FFFFFF' : '#666666')}
                      style={styles.optionIcon}
                    />
                  )}
                  <ThemedText 
                    style={[
                      styles.optionText,
                      { color: selectedValue === option.value ? '#007AFF' : (isDark ? '#FFFFFF' : '#000000') }
                    ]}
                  >
                    {option.label}
                  </ThemedText>
                  {selectedValue === option.value && (
                    <Ionicons name="checkmark" size={20} color="#007AFF" />
                  )}
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
        </TouchableOpacity>
      </Modal>
    </>
  );
}

const styles = StyleSheet.create({
  dropdown: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    minHeight: 56,
  },
  dropdownText: {
    fontSize: 16,
    fontWeight: '500',
  },
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  modal: {
    width: '100%',
    maxWidth: 300,
    maxHeight: 400,
    borderRadius: 16,
    padding: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.25,
    shadowRadius: 20,
    elevation: 10,
  },
  option: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderRadius: 12,
    marginVertical: 2,
  },
  optionIcon: {
    marginRight: 12,
  },
  optionText: {
    flex: 1,
    fontSize: 16,
    fontWeight: '500',
  },
});
