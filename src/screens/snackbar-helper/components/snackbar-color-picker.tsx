/**
 * SnackbarColorPicker Component
 * 
 * Modal color picker with gradient square and hue slider
 */

import { LinearGradient } from 'expo-linear-gradient';
import { Sizing, ThemedText, ThemedView, getThemeColors, typographyHelper, useTheme } from 'masterfabric-expo-core';
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
    flex: Sizing.flexNumber.full,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: Sizing.layout.justifyContent.center,
    alignItems: Sizing.layout.alignItems.center,
  },
  modalContent: {
    width: '85%',
    maxWidth: Sizing.maxWidth.m,
  },
  modalContainer: {
    borderRadius: Sizing.padding.l,
    padding: Sizing.padding.xl,
    elevation: Sizing.elevation.l,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: Sizing.spacing.xxs },
    shadowOpacity: Sizing.shadowOpacity.m,
    shadowRadius: Sizing.padding.s,
  },
  title: {
    ...typographyHelper.fromSizing.createStyle(Sizing, 'xl', 'bold', 'normal'),
    marginBottom: Sizing.padding.l,
    textAlign: Sizing.layout.textAlign.center,
  },
  colorPreview: {
    width: '100%',
    height: Sizing.button.height.xl,
    borderRadius: Sizing.card.borderRadius.m,
    marginBottom: Sizing.padding.s,
    borderWidth: Sizing.borderWidth.m,
    borderColor: COLOR_PICKER_COLORS.borderLight,
  },
  hexText: {
    ...typographyHelper.fromSizing.createStyle(Sizing, 'l', 'semibold', 'normal'),
    textAlign: Sizing.layout.textAlign.center,
    marginBottom: Sizing.padding.l,
  },
  pickerContainer: {
    marginBottom: Sizing.padding.l,
  },
  gradientSquare: {
    width: COLOR_PICKER_DIMENSIONS.gradientSquareWidth,
    height: COLOR_PICKER_DIMENSIONS.gradientSquareHeight,
    borderRadius: Sizing.card.borderRadius.m,
    overflow: Sizing.layout.overflow.hidden,
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
    borderWidth: Sizing.spacing.xxs,
    borderColor: COLOR_PICKER_COLORS.borderWhite,
    shadowColor: COLOR_PICKER_COLORS.black,
    shadowOffset: { width: 0, height: Sizing.spacing.xxs },
    shadowOpacity: Sizing.opacity.s,
    shadowRadius: Sizing.spacing.xxs,
    elevation: Sizing.elevation.l,
  },
  hueSliderContainer: {
    marginBottom: Sizing.padding.xl,
  },
  hueSlider: {
    width: COLOR_PICKER_DIMENSIONS.hueSliderWidth,
    height: COLOR_PICKER_DIMENSIONS.hueSliderHeight,
    borderRadius: COLOR_PICKER_DIMENSIONS.hueSliderHeight / 2,
    position: 'relative',
    overflow: Sizing.layout.overflow.hidden,
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
    borderWidth: Sizing.spacing.xxs,
    borderColor: COLOR_PICKER_COLORS.borderWhite,
    shadowColor: COLOR_PICKER_COLORS.black,
    shadowOffset: { width: 0, height: Sizing.spacing.xxs },
    shadowOpacity: Sizing.opacity.s,
    shadowRadius: Sizing.spacing.xxs,
    elevation: Sizing.elevation.l,
  },
  buttonRow: {
    flexDirection: Sizing.layout.flexDirection.row,
    gap: Sizing.padding.s,
  },
  button: {
    flex: Sizing.flexNumber.full,
    paddingVertical: Sizing.padding.s,
    borderRadius: Sizing.card.borderRadius.m,
    alignItems: Sizing.layout.alignItems.center,
    justifyContent: Sizing.layout.justifyContent.center,
  },
  cancelButton: {
    borderWidth: Sizing.borderWidth.m,
  },
  selectButton: {
    elevation: Sizing.elevation.s,
  },
});
