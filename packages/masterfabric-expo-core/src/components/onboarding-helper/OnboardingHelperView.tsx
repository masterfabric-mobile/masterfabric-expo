
import React from 'react';
import { ScrollView, RefreshControl, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { getThemeColors } from '../../constants/Colors';
import { useTheme } from '../../contexts/ThemeContext';
import { ScreenHeader } from '../ScreenHeader';
import { ThemedText } from '../ThemedText';
import { useOnboardingHelperViewModel } from '../../hooks/useOnboardingHelperViewModel';
import { OnboardingStatusCard } from './OnboardingStatusCard';
import { screenStyles } from '../../styles/screen.styles'; // A new generic screen style

export function OnboardingHelperView() {
  const { currentTheme } = useTheme();
  const isDark = currentTheme === 'dark';
  const colors = getThemeColors(isDark);

  const {
    hasCompleted,
    isLoading,
    error,
    statusText,
    statusDescription,
    handleComplete,
    handleReset,
    handleRefresh,
  } = useOnboardingHelperViewModel();

  return (
    <SafeAreaView
      style={[screenStyles.container, { backgroundColor: colors.background }]}
      edges={['top']}
    >
      <ScreenHeader
        title="Onboarding Helper"
        subtitle="Manage and test the onboarding flow"
      />

      <ScrollView
        style={screenStyles.scrollView}
        contentContainerStyle={screenStyles.scrollContent}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={isLoading}
            onRefresh={handleRefresh}
            tintColor={colors.primary}
          />
        }
      >
        {error && (
          <ThemedText style={{ color: colors.errorColor, padding: 16 }}>
            {error}
          </ThemedText>
        )}

        <View style={screenStyles.cardContainer}>
          <OnboardingStatusCard
            hasCompleted={hasCompleted}
            isLoading={isLoading}
            statusText={statusText}
            statusDescription={statusDescription}
            onComplete={handleComplete}
            onReset={handleReset}
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
