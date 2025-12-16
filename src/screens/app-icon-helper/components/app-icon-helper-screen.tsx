import { ScreenHeader } from '@/src/shared/components/ScreenHeader';
import { ThemedText } from '@/src/shared/components/ThemedText';
import { Ionicons } from '@expo/vector-icons';
import { getThemeColors, useTheme } from 'masterfabric-expo-core';
import React from 'react';
import { ActivityIndicator, Alert, Platform, ScrollView, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAppIconHelperViewModel } from '../hooks/use-app-icon-helper-view-model';
import { appIconHelperScreenStyles } from '../styles/app-icon-helper-screen.styles';

export function AppIconHelperScreen() {
  const { currentTheme } = useTheme();
  const isDark = currentTheme === 'dark';
  const colors = getThemeColors(isDark);

  const {
    isSupported,
    currentIcon,
    isLoading,
    checkSupport,
    changeIcon,
    resetToPrimary,
  } = useAppIconHelperViewModel();

  React.useEffect(() => {
    checkSupport();
  }, [checkSupport]);

  const handleChangeIcon = async (iconName: string | null) => {
    try {
      if (iconName === null) {
        await resetToPrimary();
      } else {
        await changeIcon(iconName);
      }
      Alert.alert('Success', `App icon changed successfully!`);
    } catch (error: any) {
      Alert.alert('Error', error?.message || 'Failed to change app icon');
    }
  };

  if (Platform.OS !== 'ios') {
    return (
      <SafeAreaView
        style={[appIconHelperScreenStyles.container, { backgroundColor: colors.background }]}
        edges={['top']}
      >
        <ScreenHeader
          title="App Icon Helper"
          subtitle="Change your app icon"
          variant="minimal"
        />
        <View style={appIconHelperScreenStyles.unsupportedContainer}>
          <View
            style={[
              appIconHelperScreenStyles.unsupportedCard,
              {
                backgroundColor: colors.surfaceBackground,
                borderColor: colors.surfaceBorder,
              },
            ]}
          >
            <View
              style={[
                appIconHelperScreenStyles.iconContainer,
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
                appIconHelperScreenStyles.unsupportedTitle,
                { color: colors.bodyText },
              ]}
            >
              iOS Only Feature
            </ThemedText>
            <ThemedText
              style={[
                appIconHelperScreenStyles.unsupportedText,
                { color: colors.actionDescription },
              ]}
            >
              Alternative app icons are only supported on iOS devices running iOS 10.3 or later.
            </ThemedText>
          </View>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView
      style={[appIconHelperScreenStyles.container, { backgroundColor: colors.background }]}
      edges={['top']}
    >
      <ScreenHeader
        title="App Icon Helper"
        subtitle="Change your app icon"
        variant="minimal"
      />
      <ScrollView
        style={appIconHelperScreenStyles.scrollView}
        contentContainerStyle={appIconHelperScreenStyles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Support Status Card */}
        <View
          style={[
            appIconHelperScreenStyles.card,
            {
              backgroundColor: colors.surfaceBackground,
              borderColor: isSupported ? '#3ECF8E30' : colors.surfaceBorder,
            },
          ]}
        >
          <ThemedText
            style={[
              appIconHelperScreenStyles.cardTitle,
              { color: colors.labelText },
            ]}
          >
            Status
          </ThemedText>
          {isLoading ? (
            <View style={appIconHelperScreenStyles.statusLoadingContainer}>
              <ActivityIndicator size="small" color={colors.tint} />
              <ThemedText
                style={[
                  appIconHelperScreenStyles.statusText,
                  { color: colors.bodyText },
                ]}
              >
                Checking support...
              </ThemedText>
            </View>
          ) : (
            <>
              <ThemedText
                style={[
                  appIconHelperScreenStyles.statusText,
                  {
                    color: isSupported ? '#3ECF8E' : '#ef4444',
                    fontWeight: '600',
                  },
                ]}
              >
                {isSupported ? '✓ Supported' : '✗ Not Supported'}
              </ThemedText>
              {isSupported && (
                <ThemedText
                  style={[
                    appIconHelperScreenStyles.statusDescription,
                    { color: colors.actionDescription },
                  ]}
                >
                  Your device supports alternative app icons. You can change the app icon from the
                  options below.
                </ThemedText>
              )}
              {currentIcon && (
                <View style={appIconHelperScreenStyles.currentIconBadge}>
                  <ThemedText
                    style={[
                      appIconHelperScreenStyles.currentIconText,
                      { color: colors.bodyText },
                    ]}
                  >
                    Current Icon: <ThemedText style={{ fontWeight: '600' }}>{currentIcon}</ThemedText>
                  </ThemedText>
                </View>
              )}
            </>
          )}
        </View>

        {/* Icon Options */}
        {isSupported && (
          <View style={appIconHelperScreenStyles.optionsContainer}>
            <ThemedText
              style={[
                appIconHelperScreenStyles.sectionTitle,
                { color: colors.sectionTitle },
              ]}
            >
              Available Icons
            </ThemedText>

            <View style={appIconHelperScreenStyles.iconCardsContainer}>
              {/* Primary Icon */}
              <TouchableOpacity
                style={[
                  appIconHelperScreenStyles.iconCard,
                  {
                    backgroundColor: colors.surfaceBackground,
                    borderColor:
                      currentIcon === null ? colors.tint + '60' : colors.surfaceBorder,
                    borderWidth: currentIcon === null ? 2 : 1.5,
                  },
                ]}
                onPress={() => handleChangeIcon(null)}
                disabled={isLoading}
                activeOpacity={0.8}
              >
                <View
                  style={[
                    appIconHelperScreenStyles.iconPreviewContainer,
                    {
                      backgroundColor: colors.tint + '15',
                      borderColor: colors.tint + '25',
                    },
                  ]}
                >
                  <Ionicons name="apps" size={32} color={colors.tint} />
                </View>
                <View style={appIconHelperScreenStyles.iconCardContent}>
                  <ThemedText
                    type="defaultSemiBold"
                    style={[
                      appIconHelperScreenStyles.iconCardTitle,
                      { color: colors.bodyText },
                    ]}
                  >
                    Primary Icon
                  </ThemedText>
                  <ThemedText
                    style={[
                      appIconHelperScreenStyles.iconCardDescription,
                      { color: colors.actionDescription },
                    ]}
                  >
                    Default app icon
                  </ThemedText>
                </View>
                {currentIcon === null && (
                  <View style={appIconHelperScreenStyles.selectedBadge}>
                    <Ionicons name="checkmark-circle" size={24} color={colors.tint} />
                  </View>
                )}
                {isLoading && currentIcon === null && (
                  <View style={appIconHelperScreenStyles.loadingOverlay}>
                    <ActivityIndicator size="small" color={colors.tint} />
                  </View>
                )}
              </TouchableOpacity>

              {/* AppIcon1 */}
              <TouchableOpacity
                style={[
                  appIconHelperScreenStyles.iconCard,
                  {
                    backgroundColor: colors.surfaceBackground,
                    borderColor:
                      currentIcon === 'AppIcon1' ? '#007AFF60' : colors.surfaceBorder,
                    borderWidth: currentIcon === 'AppIcon1' ? 2 : 1.5,
                  },
                ]}
                onPress={() => handleChangeIcon('AppIcon1')}
                disabled={isLoading}
                activeOpacity={0.8}
              >
                <View
                  style={[
                    appIconHelperScreenStyles.iconPreviewContainer,
                    {
                      backgroundColor: '#007AFF15',
                      borderColor: '#007AFF25',
                    },
                  ]}
                >
                  <Ionicons name="cube" size={32} color="#007AFF" />
                </View>
                <View style={appIconHelperScreenStyles.iconCardContent}>
                  <ThemedText
                    type="defaultSemiBold"
                    style={[
                      appIconHelperScreenStyles.iconCardTitle,
                      { color: colors.bodyText },
                    ]}
                  >
                    AppIcon1
                  </ThemedText>
                  <ThemedText
                    style={[
                      appIconHelperScreenStyles.iconCardDescription,
                      { color: colors.actionDescription },
                    ]}
                  >
                    Alternative icon variant
                  </ThemedText>
                </View>
                {currentIcon === 'AppIcon1' && (
                  <View style={appIconHelperScreenStyles.selectedBadge}>
                    <Ionicons name="checkmark-circle" size={24} color="#007AFF" />
                  </View>
                )}
                {isLoading && currentIcon === 'AppIcon1' && (
                  <View style={appIconHelperScreenStyles.loadingOverlay}>
                    <ActivityIndicator size="small" color="#007AFF" />
                  </View>
                )}
              </TouchableOpacity>

              {/* AppIcon2 */}
              <TouchableOpacity
                style={[
                  appIconHelperScreenStyles.iconCard,
                  {
                    backgroundColor: colors.surfaceBackground,
                    borderColor:
                      currentIcon === 'AppIcon2' ? '#5856D660' : colors.surfaceBorder,
                    borderWidth: currentIcon === 'AppIcon2' ? 2 : 1.5,
                  },
                ]}
                onPress={() => handleChangeIcon('AppIcon2')}
                disabled={isLoading}
                activeOpacity={0.8}
              >
                <View
                  style={[
                    appIconHelperScreenStyles.iconPreviewContainer,
                    {
                      backgroundColor: '#5856D615',
                      borderColor: '#5856D625',
                    },
                  ]}
                >
                  <Ionicons name="diamond" size={32} color="#5856D6" />
                </View>
                <View style={appIconHelperScreenStyles.iconCardContent}>
                  <ThemedText
                    type="defaultSemiBold"
                    style={[
                      appIconHelperScreenStyles.iconCardTitle,
                      { color: colors.bodyText },
                    ]}
                  >
                    AppIcon2
                  </ThemedText>
                  <ThemedText
                    style={[
                      appIconHelperScreenStyles.iconCardDescription,
                      { color: colors.actionDescription },
                    ]}
                  >
                    Alternative icon variant
                  </ThemedText>
                </View>
                {currentIcon === 'AppIcon2' && (
                  <View style={appIconHelperScreenStyles.selectedBadge}>
                    <Ionicons name="checkmark-circle" size={24} color="#5856D6" />
                  </View>
                )}
                {isLoading && currentIcon === 'AppIcon2' && (
                  <View style={appIconHelperScreenStyles.loadingOverlay}>
                    <ActivityIndicator size="small" color="#5856D6" />
                  </View>
                )}
              </TouchableOpacity>
            </View>
          </View>
        )}

        {/* Info Card */}
        <View
          style={[
            appIconHelperScreenStyles.card,
            {
              backgroundColor: colors.surfaceBackground,
              borderColor: colors.surfaceBorder,
            },
          ]}
        >
          <View style={appIconHelperScreenStyles.infoHeader}>
            <View
              style={[
                appIconHelperScreenStyles.infoIconContainer,
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
                appIconHelperScreenStyles.cardTitle,
                { color: colors.labelText },
              ]}
            >
              Important Note
            </ThemedText>
          </View>
          <ThemedText
            style={[
              appIconHelperScreenStyles.infoText,
              { color: colors.actionDescription },
            ]}
          >
            iOS will show a confirmation alert when changing the app icon. This is a system
            behavior and cannot be customized. The icon change takes effect immediately after
            confirmation.
          </ThemedText>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

