import { t } from '@/src/shared/i18n';
import { LinearGradient } from 'expo-linear-gradient';
import { getThemeColors, useTheme } from 'masterfabric-expo-core';
import React, { useEffect, useState } from 'react';
import {
    GestureResponderEvent,
    Modal,
    Pressable,
    StyleSheet,
    TouchableOpacity,
    View
} from 'react-native';
import Animated, { useAnimatedStyle, useSharedValue, withSpring } from 'react-native-reanimated';
import { ThemedText } from './ThemedText';
import { ThemedView } from './ThemedView';

interface ColorPickerModalProps {
  visible: boolean;
  onClose: () => void;
  onSelect: (color: string) => void;
  initialColor?: string;
  title?: string;
}

export function ColorPickerModal({
  visible,
  onClose,
  onSelect,
  initialColor = '#9C27B0',
  title
}: ColorPickerModalProps) {
  const { currentTheme } = useTheme();
  const isDark = currentTheme === 'dark';
  const colors = getThemeColors(isDark);
  
  const [selectedColor, setSelectedColor] = useState(initialColor);
  const [hueValue, setHueValue] = useState(280); // Default purple hue
  
  // Saturation/Lightness picker position
  const satX = useSharedValue(150);
  const satY = useSharedValue(100);
  
  useEffect(() => {
    if (visible) {
      setSelectedColor(initialColor);
      // Convert initial color to HSL to set initial positions
      const hsl = hexToHsl(initialColor);
      setHueValue(hsl.h);
      satX.value = (hsl.s / 100) * 300;
      satY.value = (1 - hsl.l / 100) * 200;
    }
  }, [visible, initialColor]);

  // Convert Hex to HSL
  const hexToHsl = (hex: string): { h: number; s: number; l: number } => {
    const r = parseInt(hex.slice(1, 3), 16) / 255;
    const g = parseInt(hex.slice(3, 5), 16) / 255;
    const b = parseInt(hex.slice(5, 7), 16) / 255;

    const max = Math.max(r, g, b);
    const min = Math.min(r, g, b);
    let h = 0, s = 0, l = (max + min) / 2;

    if (max !== min) {
      const d = max - min;
      s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
      
      switch (max) {
        case r: h = (g - b) / d + (g < b ? 6 : 0); break;
        case g: h = (b - r) / d + 2; break;
        case b: h = (r - g) / d + 4; break;
      }
      h /= 6;
    }

    return {
      h: Math.round(h * 360),
      s: Math.round(s * 100),
      l: Math.round(l * 100)
    };
  };
  
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

  const handleSelect = () => {
    onSelect(selectedColor);
    onClose();
  };

  const handleCancel = () => {
    setSelectedColor(initialColor);
    onClose();
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={handleCancel}
    >
      <Pressable style={styles.overlay} onPress={handleCancel}>
        <Pressable style={styles.modalContent} onPress={(e) => e.stopPropagation()}>
          <ThemedView style={[styles.modalContainer, { backgroundColor: colors.background }]}>
            <ThemedText style={[styles.title, { color: colors.text }]}>
              {title || t('helpers.toastHelper.customConfig.colorPicker.title')}
            </ThemedText>
            
            {/* Color Preview */}
            <View style={[styles.colorPreview, { backgroundColor: selectedColor, borderColor: colors.surfaceBorder }]} />
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
                  colors={['#FFFFFF', 'transparent']}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 0 }}
                  style={styles.gradientOverlay}
                />
                
                {/* Vertical transparent to black gradient (lightness) */}
                <LinearGradient
                  colors={['transparent', '#000000']}
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
            
            {/* Preset Colors */}
            <View style={styles.presetContainer}>
              <ThemedText style={[styles.presetTitle, { color: colors.labelText }]}>
                {t('helpers.toastHelper.customConfig.colorPicker.quickSelection')}
              </ThemedText>
              <View style={styles.presetGrid}>
                {[
                  '#FF5722', '#E91E63', '#9C27B0', '#673AB7',
                  '#3F51B5', '#2196F3', '#03A9F4', '#00BCD4',
                  '#009688', '#4CAF50', '#8BC34A', '#CDDC39',
                  '#FFEB3B', '#FFC107', '#FF9800', '#795548',
                  '#607D8B', '#9E9E9E', '#000000', '#FFFFFF'
                ].map((color, index) => (
                  <TouchableOpacity
                    key={`${color}-${index}`}
                    style={[
                      styles.presetColor,
                      { backgroundColor: color, borderColor: colors.surfaceBorder },
                      selectedColor === color && styles.presetColorSelected
                    ]}
                    onPress={() => {
                      setSelectedColor(color);
                      const hsl = hexToHsl(color);
                      setHueValue(hsl.h);
                      satX.value = (hsl.s / 100) * 300;
                      satY.value = (1 - hsl.l / 100) * 200;
                    }}
                  />
                ))}
              </View>
            </View>
            
            {/* Buttons */}
            <View style={styles.buttonRow}>
              <Pressable
                style={[styles.button, styles.cancelButton, { borderColor: colors.surfaceBorder }]}
                onPress={handleCancel}
              >
                <ThemedText style={{ color: colors.text }}>
                  {t('helpers.toastHelper.customConfig.colorPicker.cancel')}
                </ThemedText>
              </Pressable>
              <Pressable
                style={[styles.button, styles.selectButton, { backgroundColor: colors.tint }]}
                onPress={handleSelect}
              >
                <ThemedText style={{ color: '#FFFFFF' }}>
                  {t('helpers.toastHelper.customConfig.colorPicker.select')}
                </ThemedText>
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
    width: '90%',
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
  },
  hexText: {
    fontSize: 18,
    fontWeight: '600',
    textAlign: 'center',
    marginBottom: 20,
    fontFamily: 'monospace',
  },
  pickerContainer: {
    marginBottom: 20,
    alignItems: 'center',
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
    borderColor: '#FFFFFF',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.5,
    shadowRadius: 4,
    elevation: 5,
  },
  hueSliderContainer: {
    marginBottom: 20,
    alignItems: 'center',
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
    borderColor: '#FFFFFF',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.5,
    shadowRadius: 4,
    elevation: 5,
  },
  presetContainer: {
    marginBottom: 24,
  },
  presetTitle: {
    fontSize: 16,
    fontWeight: '500',
    marginBottom: 12,
  },
  presetGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  presetColor: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginBottom: 8,
    borderWidth: 2,
  },
  presetColorSelected: {
    borderWidth: 3,
    borderColor: '#007AFF',
    transform: [{ scale: 1.1 }],
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