import { Ionicons } from '@expo/vector-icons';
import React, { useState } from 'react';
import {
  ActivityIndicator,
  Platform,
  ScrollView,
  Switch,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ScreenHeader } from '../ScreenHeader';
import { ThemedText } from '../ThemedText';
import { useTheme } from '../../contexts/ThemeContext';
import { getThemeColors } from '../../constants/Colors';
import { useHapticHelper } from '../../hooks/useHapticHelper';
import { isHapticSupported } from '../../helpers/videoPlayerHapticHelper';
import { HapticFeedbackType } from '../../types/videoPlayerHaptic';
import { hapticHelperViewStyles } from './hapticHelperViewStyles';

const HAPTIC_TYPES: Array<{
  type: HapticFeedbackType;
  label: string;
  icon: keyof typeof Ionicons.glyphMap;
  description: string;
  color: string;
}> = [
  {
    type: 'light',
    label: 'Light Impact',
    icon: 'flash-outline',
    description: 'Subtle feedback for light interactions',
    color: '#007AFF',
  },
  {
    type: 'medium',
    label: 'Medium Impact',
    icon: 'flash',
    description: 'Standard feedback for regular interactions',
    color: '#5856D6',
  },
  {
    type: 'heavy',
    label: 'Heavy Impact',
    icon: 'flash',
    description: 'Strong feedback for important actions',
    color: '#AF52DE',
  },
  {
    type: 'success',
    label: 'Success',
    icon: 'checkmark-circle',
    description: 'Positive feedback for successful actions',
    color: '#34C759',
  },
  {
    type: 'warning',
    label: 'Warning',
    icon: 'warning',
    description: 'Alert feedback for warnings',
    color: '#FF9500',
  },
  {
    type: 'error',
    label: 'Error',
    icon: 'close-circle',
    description: 'Negative feedback for errors',
    color: '#FF3B30',
  },
  {
    type: 'selection',
    label: 'Selection',
    icon: 'radio-button-on',
    description: 'Feedback for selection changes',
    color: '#FF2D55',
  },
];

export function HapticHelperView() {
  const { currentTheme } = useTheme();
  const isDark = currentTheme === 'dark';
  const colors = getThemeColors(isDark);
  const [isLoading, setIsLoading] = useState(false);
  const [testingAll, setTestingAll] = useState(false);

  const {
    hapticState,
    triggerHaptic,
    testAllHaptics,
    toggleHapticOnVideoEvents,
  } = useHapticHelper();

  const handleTriggerHaptic = async (type: HapticFeedbackType) => {
    setIsLoading(true);
    try {
      await triggerHaptic(type);
    } finally {
      setTimeout(() => setIsLoading(false), 300);
    }
  };

  const handleTestAll = async () => {
    setTestingAll(true);
    try {
      await testAllHaptics();
    } finally {
      setTestingAll(false);
    }
  };

  // Don't render haptic helper on web platform
  if (Platform.OS === 'web' || !isHapticSupported()) {
    return (
      <SafeAreaView
        style={[hapticHelperViewStyles.container, { backgroundColor: colors.background }]}
        edges={['top']}
      >
        <ScreenHeader
          title="Haptic Helper"
          subtitle="Haptic feedback testing and controls"
        />
        <View style={hapticHelperViewStyles.unsupportedContainer}>
          <View
            style={[
              hapticHelperViewStyles.unsupportedCard,
              {
                backgroundColor: colors.surfaceBackground,
                borderColor: colors.surfaceBorder,
              },
            ]}
          >
            <View
              style={[
                hapticHelperViewStyles.iconContainer,
                {
                  backgroundColor: '#ef444415',
                  borderColor: '#ef444425',
                },
              ]}
            >
              <Ionicons name="phone-portrait-outline" size={32} color="#ef4444" />
            </View>
            <ThemedText
              type="defaultSemiBold"
              style={[
                hapticHelperViewStyles.unsupportedTitle,
                { color: colors.bodyText },
              ]}
            >
              iOS/Android Only Feature
            </ThemedText>
            <ThemedText
              style={[
                hapticHelperViewStyles.unsupportedText,
                { color: colors.actionDescription },
              ]}
            >
              Haptic feedback is only supported on iOS and Android devices. This feature is not
              available on web platforms.
            </ThemedText>
          </View>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView
      style={[hapticHelperViewStyles.container, { backgroundColor: colors.background }]}
      edges={['top']}
    >
      <ScreenHeader
        title="Haptic Helper"
        subtitle="Test haptic feedback types and controls"
        variant="minimal"
      />
      <ScrollView
        style={hapticHelperViewStyles.scrollView}
        contentContainerStyle={hapticHelperViewStyles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Support Status Card */}
        <View
          style={[
            hapticHelperViewStyles.card,
            {
              backgroundColor: colors.surfaceBackground,
              borderColor: hapticState.isSupported ? '#3ECF8E30' : colors.surfaceBorder,
            },
          ]}
        >
          <ThemedText
            style={[
              hapticHelperViewStyles.cardTitle,
              { color: colors.labelText },
            ]}
          >
            Status
          </ThemedText>
          <ThemedText
            style={[
              hapticHelperViewStyles.statusText,
              {
                color: hapticState.isSupported ? '#3ECF8E' : '#ef4444',
                fontWeight: '600',
              },
            ]}
          >
            {hapticState.isSupported ? '✓ Supported' : '✗ Not Supported'}
          </ThemedText>
          {hapticState.isSupported && (
            <ThemedText
              style={[
                hapticHelperViewStyles.statusDescription,
                { color: colors.actionDescription },
              ]}
            >
              Your device supports haptic feedback. Tap any haptic type below to test it.
            </ThemedText>
          )}
          {hapticState.lastTriggered && (
            <View style={hapticHelperViewStyles.currentHapticBadge}>
              <ThemedText
                style={[
                  hapticHelperViewStyles.currentHapticText,
                  { color: colors.bodyText },
                ]}
              >
                Last Triggered:{' '}
                <ThemedText style={{ fontWeight: '600' }}>
                  {HAPTIC_TYPES.find((h) => h.type === hapticState.lastTriggered)?.label ||
                    hapticState.lastTriggered}
                </ThemedText>
              </ThemedText>
            </View>
          )}
        </View>

        {/* Video Events Toggle Card */}
        <View
          style={[
            hapticHelperViewStyles.card,
            {
              backgroundColor: colors.surfaceBackground,
              borderColor: colors.surfaceBorder,
            },
          ]}
        >
          <View style={hapticHelperViewStyles.toggleRow}>
            <View style={hapticHelperViewStyles.toggleContent}>
              <View style={hapticHelperViewStyles.toggleHeader}>
                <View
                  style={[
                    hapticHelperViewStyles.toggleIconContainer,
                    {
                      backgroundColor: colors.tint + '15',
                      borderColor: colors.tint + '25',
                    },
                  ]}
                >
                  <Ionicons name="videocam-outline" size={20} color={colors.tint} />
                </View>
                <ThemedText
                  type="defaultSemiBold"
                  style={[
                    hapticHelperViewStyles.toggleTitle,
                    { color: colors.bodyText },
                  ]}
                >
                  Haptic on Video Events
                </ThemedText>
              </View>
              <ThemedText
                style={[
                  hapticHelperViewStyles.toggleDescription,
                  { color: colors.actionDescription },
                ]}
              >
                Trigger haptics when video plays, pauses, or seeks
              </ThemedText>
            </View>
            <Switch
              value={hapticState.hapticOnVideoEvents}
              onValueChange={toggleHapticOnVideoEvents}
              trackColor={{ false: colors.surfaceBorder, true: colors.tint + '50' }}
              thumbColor={hapticState.hapticOnVideoEvents ? colors.tint : colors.surfaceBorder}
            />
          </View>
        </View>

        {/* Haptic Types */}
        {hapticState.isSupported && (
          <View style={hapticHelperViewStyles.optionsContainer}>
            <ThemedText
              style={[
                hapticHelperViewStyles.sectionTitle,
                { color: colors.sectionTitle },
              ]}
            >
              Haptic Types
            </ThemedText>

            <View style={hapticHelperViewStyles.hapticCardsContainer}>
              {HAPTIC_TYPES.map((haptic) => {
                const isActive = hapticState.lastTriggered === haptic.type;
                const isTriggering = isLoading && isActive;
                return (
                  <TouchableOpacity
                    key={haptic.type}
                    style={[
                      hapticHelperViewStyles.hapticCard,
                      {
                        backgroundColor: colors.surfaceBackground,
                        borderColor: isActive ? haptic.color + '60' : colors.surfaceBorder,
                        borderWidth: isActive ? 2 : 1.5,
                      },
                    ]}
                    onPress={() => handleTriggerHaptic(haptic.type)}
                    disabled={isLoading}
                    activeOpacity={0.8}
                  >
                    <View
                      style={[
                        hapticHelperViewStyles.hapticPreviewContainer,
                        {
                          backgroundColor: haptic.color + '15',
                          borderColor: haptic.color + '25',
                        },
                      ]}
                    >
                      <Ionicons name={haptic.icon} size={28} color={haptic.color} />
                    </View>
                    <View style={hapticHelperViewStyles.hapticCardContent}>
                      <ThemedText
                        type="defaultSemiBold"
                        style={[
                          hapticHelperViewStyles.hapticCardTitle,
                          { color: colors.bodyText },
                        ]}
                      >
                        {haptic.label}
                      </ThemedText>
                      <ThemedText
                        style={[
                          hapticHelperViewStyles.hapticCardDescription,
                          { color: colors.actionDescription },
                        ]}
                      >
                        {haptic.description}
                      </ThemedText>
                    </View>
                    {isActive && !isTriggering && (
                      <View style={hapticHelperViewStyles.selectedBadge}>
                        <Ionicons name="checkmark-circle" size={24} color={haptic.color} />
                      </View>
                    )}
                    {isTriggering && (
                      <View
                        style={[
                          hapticHelperViewStyles.loadingOverlay,
                          { backgroundColor: colors.background + 'CC' },
                        ]}
                      >
                        <ActivityIndicator size="small" color={haptic.color} />
                      </View>
                    )}
                  </TouchableOpacity>
                );
              })}
            </View>
          </View>
        )}

        {/* Test All Button */}
        {hapticState.isSupported && (
          <TouchableOpacity
            style={[
              hapticHelperViewStyles.testAllButton,
              {
                backgroundColor: colors.tint + '15',
                borderColor: colors.tint,
              },
            ]}
            onPress={handleTestAll}
            disabled={testingAll || isLoading}
            activeOpacity={0.8}
          >
            {testingAll ? (
              <ActivityIndicator size="small" color={colors.tint} />
            ) : (
              <Ionicons name="play" size={20} color={colors.tint} />
            )}
            <ThemedText
              type="defaultSemiBold"
              style={[hapticHelperViewStyles.testAllButtonText, { color: colors.tint }]}
            >
              {testingAll ? 'Testing All Haptics...' : 'Test All Haptics Sequentially'}
            </ThemedText>
          </TouchableOpacity>
        )}

        {/* Info Card */}
        <View
          style={[
            hapticHelperViewStyles.card,
            {
              backgroundColor: colors.surfaceBackground,
              borderColor: colors.surfaceBorder,
            },
          ]}
        >
          <View style={hapticHelperViewStyles.infoHeader}>
            <View
              style={[
                hapticHelperViewStyles.infoIconContainer,
                {
                  backgroundColor: '#F59E0B15',
                  borderColor: '#F59E0B25',
                },
              ]}
            >
              <Ionicons name="information-circle" size={20} color="#F59E0B" />
            </View>
            <ThemedText
              style={[
                hapticHelperViewStyles.cardTitle,
                { color: colors.labelText },
              ]}
            >
              Important Note
            </ThemedText>
          </View>
          <ThemedText
            style={[
              hapticHelperViewStyles.infoText,
              { color: colors.actionDescription },
            ]}
          >
            Haptic feedback provides tactile responses to enhance user interactions. Different haptic
            types are optimized for various use cases. Test each type to understand the intensity
            and feel before implementing in your app.
          </ThemedText>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
