import { ScreenHeader } from '@/src/shared/components/ScreenHeader';
import { t } from '@/src/shared/i18n';
import { getThemeColors, useTheme } from 'masterfabric-expo-core';
import React, { useEffect } from 'react';
import { ScrollView, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useHelpersViewModel } from '../hooks/use-helpers-view-model';
import { helpersScreenStyles } from '../styles/helpers-screen.styles';
import { HelperItemCard } from './helper-item-card';

export function HelpersScreen() {
  const { currentTheme } = useTheme();
  const isDark = currentTheme === 'dark';
  const colors = getThemeColors(isDark);
  
  const { helpers, isLoading, loadHelpers } = useHelpersViewModel();

  useEffect(() => {
    loadHelpers();
  }, [loadHelpers]);

  return (
    <SafeAreaView 
      style={[helpersScreenStyles.container, { backgroundColor: colors.background }]}
      edges={['top']}
    >
      <ScreenHeader 
        title={t('helpers.title')}
        subtitle={t('helpers.subtitle')}
        variant="minimal"
      />
      <ScrollView 
        style={helpersScreenStyles.scrollView}
        contentContainerStyle={helpersScreenStyles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={helpersScreenStyles.categoriesContainer}>
          {helpers.map((helper) => (
            <HelperItemCard 
              key={helper.id}
              helper={helper}
            />
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
