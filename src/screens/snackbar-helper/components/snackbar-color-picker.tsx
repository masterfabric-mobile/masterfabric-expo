/**
 * SnackbarColorPicker Component
 * 
 * Modal color picker with gradient square
 */

import { ThemedText } from '@/src/shared/components/ThemedText';
import { ThemedView } from '@/src/shared/components/ThemedView';
import { LinearGradient } from 'expo-linear-gradient';
import { getThemeColors, useTheme } from 'masterfabric-expo-core';
import React, { useState } from 'react';
import { GestureResponderEvent, Modal, Pressable, StyleSheet, View } from 'react-native';
import Animated, { useAnimatedStyle, useSharedValue, withSpring } from 'react-native-reanimated';
import { SNACKBAR_HELPER_COLORS } from '../constants/snackbar-colors';

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
  const [hueValue, setHueValue] = useState(280); // Default purple hue
  
  // Saturation/Lightness picker position
  const satX = useSharedValue(150);
  const satY = useSharedValue(100);
  
  // Convert HSL to RGB to Hex
  const hslToHex = (h: number, s: number, l: number): string => {
    h = h / 360;
    s = s / 100;
    l = l / 100;
    
    let r, g, b;
    
    if (s === 0) {
      r = g = b = l;
    } else {
      const hue2rgb = (p: number, q: number, t: number) => {
        if (t < 0) t += 1;
        if (t > 1) t -= 1;
        if (t < 1/6) return p + (q - p) * 6 * t;
        if (t < 1/2) return q;
        if (t < 2/3) return p + (q - p) * (2/3 - t) * 6;
        return p;
      };
      
      const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
      const p = 2 * l - q;
      r = hue2rgb(p, q, h + 1/3);
      g = hue2rgb(p, q, h);
      b = hue2rgb(p, q, h - 1/3);
    }
    
    const toHex = (x: number) => {
      const hex = Math.round(x * 255).toString(16);
      return hex.length === 1 ? '0' + hex : hex;
    };
    
    return `#${toHex(r)}${toHex(g)}${toHex(b)}`.toUpperCase();
  };
  
  // Update color based on position
  const updateColor = (sat: number, light: number, h: number) => {
    const saturation = (sat / 300) * 100;
    const lightness = 100 - (light / 200) * 100;
    const newColor = hslToHex(h, saturation, lightness);
    setSelectedColor(newColor);
  };
  
  // Handle touch for saturation/lightness picker
  const handleSaturationTouch = (event: GestureResponderEvent) => {
    const { locationX, locationY } = event.nativeEvent;
    const newX = Math.max(0, Math.min(300, locationX));
    const newY = Math.max(0, Math.min(200, locationY));
    satX.value = withSpring(newX, { damping: 50, stiffness: 500 });
    satY.value = withSpring(newY, { damping: 50, stiffness: 500 });
    updateColor(newX, newY, hueValue);
  };
  
  // Handle touch for hue slider
  const handleHueTouch = (event: GestureResponderEvent) => {
    const { locationX } = event.nativeEvent;
    const newHue = Math.max(0, Math.min(360, (locationX / 300) * 360));
    setHueValue(newHue);
    updateColor(satX.value, satY.value, newHue);
  };
  
  const pointerStyle = useAnimatedStyle(() => ({
    transform: [
      { translateX: satX.value - 10 },
      { translateY: satY.value - 10 },
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
                  colors={[WHITE, 'transparent']}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 0 }}
                  style={styles.gradientOverlay}
                />
                
                {/* Vertical transparent to black gradient (lightness) */}
                <LinearGradient
                  colors={['transparent', BLACK]}
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
                  colors={['#ff0000', '#ffff00', '#00ff00', '#00ffff', '#0000ff', '#ff00ff', '#ff0000']}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 0 }}
                  style={styles.hueGradient}
                />
                <View style={[styles.huePointer, { 
                  transform: [{ translateX: (hueValue / 360) * 300 - 10 }] 
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
                <ThemedText style={{ color: WHITE }}>Select</ThemedText>
              </Pressable>
            </View>
          </ThemedView>
        </Pressable>
      </Pressable>
    </Modal>
  );
}

// Local color constants for styles
const WHITE = SNACKBAR_HELPER_COLORS.white;
const BLACK = SNACKBAR_HELPER_COLORS.black;
const BORDER_LIGHT = SNACKBAR_HELPER_COLORS.borderLight;
const BORDER_WHITE = SNACKBAR_HELPER_COLORS.borderWhite;

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
    borderColor: BORDER_LIGHT,
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
    width: 300,
    height: 200,
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
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 3,
    borderColor: BORDER_WHITE,
    shadowColor: BLACK,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.5,
    shadowRadius: 4,
    elevation: 5,
  },
  hueSliderContainer: {
    marginBottom: 24,
  },
  hueSlider: {
    width: 300,
    height: 40,
    borderRadius: 20,
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
    width: 20,
    height: 40,
    borderWidth: 3,
    borderColor: BORDER_WHITE,
    shadowColor: BLACK,
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

