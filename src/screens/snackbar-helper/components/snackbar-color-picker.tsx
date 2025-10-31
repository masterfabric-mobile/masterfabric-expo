/**
 * SnackbarColorPicker Component
 * 
 * Modal color picker with gradient square and hue slider
 */

import { LinearGradient } from 'expo-linear-gradient';
import { ThemedText, ThemedView, getThemeColors, useTheme } from 'masterfabric-expo-core';
import React, { useState } from 'react';
import { GestureResponderEvent, Modal, Pressable, StyleSheet, View } from 'react-native';
import Animated, { useAnimatedStyle, useSharedValue, withSpring } from 'react-native-reanimated';
import {
    COLOR_PICKER_COLORS,
    COLOR_PICKER_DEFAULTS,
    COLOR_PICKER_DIMENSIONS,
    HUE_GRADIENT_COLORS,
} from '../constants/color-picker-constants';
import { calculateColorFromPosition, clamp } from '../utils/color-picker-utils';

interface SnackbarColorPickerProps {
  visible: boolean;
  onClose: () => void;
  initialColor: string;
  onColorSelect: (color: string) => void;
}

export function SnackbarColorPicker({ visible, onClose, initialColor, onColorSelect }: SnackbarColorPickerProps) {
  const { currentTheme } = useTheme();
  const isDark = currentTheme === 'dark';
  const colors = getThemeColors(isDark);
  
  const [selectedColor, setSelectedColor] = useState(initialColor);
  const [hueValue, setHueValue] = useState<number>(COLOR_PICKER_DEFAULTS.defaultHue);
  
  // Saturation/Lightness picker position
  const satX = useSharedValue(COLOR_PICKER_DIMENSIONS.gradientSquareWidth / 2);
  const satY = useSharedValue(COLOR_PICKER_DIMENSIONS.gradientSquareHeight / 2);
  
  // Update color based on position
  const updateColor = (sat: number, light: number, h: number) => {
    const newColor = calculateColorFromPosition(sat, light, h);
    setSelectedColor(newColor);
  };
  
  // Handle touch for saturation/lightness picker
  const handleSaturationTouch = (event: GestureResponderEvent) => {
    const { locationX, locationY } = event.nativeEvent;
    const newX = clamp(locationX, 0, COLOR_PICKER_DIMENSIONS.gradientSquareWidth);
    const newY = clamp(locationY, 0, COLOR_PICKER_DIMENSIONS.gradientSquareHeight);
    satX.value = withSpring(newX, { damping: 50, stiffness: 500 });
    satY.value = withSpring(newY, { damping: 50, stiffness: 500 });
    updateColor(newX, newY, hueValue);
  };
  
  // Handle touch for hue slider
  const handleHueTouch = (event: GestureResponderEvent) => {
    const { locationX } = event.nativeEvent;
    const newHue = clamp(
      (locationX / COLOR_PICKER_DIMENSIONS.hueSliderWidth) * COLOR_PICKER_DEFAULTS.maxHue,
      0,
      COLOR_PICKER_DEFAULTS.maxHue
    );
    setHueValue(newHue);
    updateColor(satX.value, satY.value, newHue);
  };
  
  const pointerStyle = useAnimatedStyle(() => ({
    transform: [
      { translateX: satX.value - COLOR_PICKER_DIMENSIONS.pointerSize / 2 },
      { translateY: satY.value - COLOR_PICKER_DIMENSIONS.pointerSize / 2 },
    ],
  }));
  
  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <Pressable style={styles.overlay} onPress={onClose}>
        <Pressable style={styles.modalContent} onPress={(e) => e.stopPropagation()}>
          <ThemedView style={[styles.modalContainer, { backgroundColor: colors.background }]}>
            <ThemedText style={[styles.title, { color: colors.text }]}>
              Select Color
            </ThemedText>
            
            {/* Color Preview */}
            <View style={[styles.colorPreview, { backgroundColor: selectedColor }]} />
            <ThemedText style={[styles.hexText, { color: colors.text }]}>
              {selectedColor}
            </ThemedText>
            
            {/* Saturation/Lightness Gradient Square */}
            <View style={styles.pickerContainer}>
              <View 
                style={styles.gradientSquare}
                onStartShouldSetResponder={() => true}
                onResponderGrant={handleSaturationTouch}
                onResponderMove={handleSaturationTouch}
              >
                {/* Base color layer */}
                <View style={[styles.gradientOverlay, { 
                  backgroundColor: `hsl(${hueValue}, 100%, 50%)`,
                }]} />
                
                {/* Horizontal white to transparent gradient (saturation) */}
                <LinearGradient
                  colors={[COLOR_PICKER_COLORS.white, 'transparent']}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 0 }}
                  style={styles.gradientOverlay}
                />
                
                {/* Vertical transparent to black gradient (lightness) */}
                <LinearGradient
                  colors={['transparent', COLOR_PICKER_COLORS.black]}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 0, y: 1 }}
                  style={styles.gradientOverlay}
                />
                
                {/* Pointer */}
                <Animated.View style={[styles.pointer, pointerStyle]} />
              </View>
            </View>
            
            {/* Hue Slider */}
            <View style={styles.hueSliderContainer}>
              <View 
                style={styles.hueSlider}
                onStartShouldSetResponder={() => true}
                onResponderGrant={handleHueTouch}
                onResponderMove={handleHueTouch}
              >
                <LinearGradient
                  colors={[...HUE_GRADIENT_COLORS]}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 0 }}
                  style={styles.hueGradient}
                />
                <View style={[styles.huePointer, { 
                  transform: [{ 
                    translateX: (hueValue / COLOR_PICKER_DEFAULTS.maxHue) * 
                      COLOR_PICKER_DIMENSIONS.hueSliderWidth - 
                      COLOR_PICKER_DIMENSIONS.huePointerWidth / 2 
                  }] 
                }]} />
              </View>
            </View>
            
            {/* Buttons */}
            <View style={styles.buttonRow}>
              <Pressable
                style={[styles.button, styles.cancelButton, { borderColor: colors.surfaceBorder }]}
                onPress={onClose}
              >
                <ThemedText style={{ color: colors.text }}>Cancel</ThemedText>
              </Pressable>
              <Pressable
                style={[styles.button, styles.selectButton, { backgroundColor: colors.tint }]}
                onPress={() => {
                  onColorSelect(selectedColor);
                  onClose();
                }}
              >
                <ThemedText style={{ color: COLOR_PICKER_COLORS.white }}>Select</ThemedText>
              </Pressable>
            </View>
          </ThemedView>
        </Pressable>
      </Pressable>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    width: '85%',
    maxWidth: 400,
  },
  modalContainer: {
    borderRadius: 20,
    padding: 24,
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 10,
  },
  title: {
    fontSize: 20,
    fontWeight: '700',
    marginBottom: 20,
    textAlign: 'center',
  },
  colorPreview: {
    width: '100%',
    height: 60,
    borderRadius: 12,
    marginBottom: 12,
    borderWidth: 2,
    borderColor: COLOR_PICKER_COLORS.borderLight,
  },
  hexText: {
    fontSize: 18,
    fontWeight: '600',
    textAlign: 'center',
    marginBottom: 20,
  },
  pickerContainer: {
    marginBottom: 20,
  },
  gradientSquare: {
    width: COLOR_PICKER_DIMENSIONS.gradientSquareWidth,
    height: COLOR_PICKER_DIMENSIONS.gradientSquareHeight,
    borderRadius: 12,
    overflow: 'hidden',
    position: 'relative',
  },
  gradientOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  pointer: {
    position: 'absolute',
    width: COLOR_PICKER_DIMENSIONS.pointerSize,
    height: COLOR_PICKER_DIMENSIONS.pointerSize,
    borderRadius: COLOR_PICKER_DIMENSIONS.pointerSize / 2,
    borderWidth: 3,
    borderColor: COLOR_PICKER_COLORS.borderWhite,
    shadowColor: COLOR_PICKER_COLORS.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.5,
    shadowRadius: 4,
    elevation: 5,
  },
  hueSliderContainer: {
    marginBottom: 24,
  },
  hueSlider: {
    width: COLOR_PICKER_DIMENSIONS.hueSliderWidth,
    height: COLOR_PICKER_DIMENSIONS.hueSliderHeight,
    borderRadius: COLOR_PICKER_DIMENSIONS.hueSliderHeight / 2,
    position: 'relative',
    overflow: 'hidden',
  },
  hueGradient: {
    width: '100%',
    height: '100%',
  },
  huePointer: {
    position: 'absolute',
    top: 0,
    width: COLOR_PICKER_DIMENSIONS.huePointerWidth,
    height: COLOR_PICKER_DIMENSIONS.huePointerHeight,
    borderWidth: 3,
    borderColor: COLOR_PICKER_COLORS.borderWhite,
    shadowColor: COLOR_PICKER_COLORS.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.5,
    shadowRadius: 4,
    elevation: 5,
  },
  buttonRow: {
    flexDirection: 'row',
    gap: 12,
  },
  button: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cancelButton: {
    borderWidth: 2,
  },
  selectButton: {
    elevation: 2,
  },
});
