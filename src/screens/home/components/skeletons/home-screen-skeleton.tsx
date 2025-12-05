import { useThemeColors } from 'masterfabric-expo-core';
import React from 'react';
import { ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { homeScreenStyles } from '../../styles/home-screen.styles';
import { ActivitySectionSkeleton } from './activity-section-skeleton';
import { DeviceInfoSectionSkeleton } from './device-info-section-skeleton';
import { HomeHeaderSkeleton } from './home-header-skeleton';
import { QuickActionsSectionSkeleton } from './quick-actions-section-skeleton';
import { SupabaseSectionSkeleton } from './supabase-section-skeleton';
import { WelcomeSectionSkeleton } from './welcome-section-skeleton';

export function HomeScreenSkeleton() {
  const colors = useThemeColors();

  return (
    <SafeAreaView
      style={[
        homeScreenStyles.container,
        { backgroundColor: colors.background },
      ]}
      edges={['top']}
    >
      <HomeHeaderSkeleton />

      <ScrollView
        style={homeScreenStyles.content}
        contentContainerStyle={homeScreenStyles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <WelcomeSectionSkeleton />
        <SupabaseSectionSkeleton />
        <QuickActionsSectionSkeleton />
        <ActivitySectionSkeleton />
        <DeviceInfoSectionSkeleton />
      </ScrollView>
    </SafeAreaView>
  );
}

