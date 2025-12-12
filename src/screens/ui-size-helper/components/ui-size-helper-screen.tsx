import { ScreenHeader } from '@/src/shared/components/ScreenHeader';
import { t } from '@/src/shared/i18n';
import { getThemeColors, useTheme } from 'masterfabric-expo-core';
import React from 'react';
import { ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { uiSizeHelperScreenStyles } from '../styles/ui-size-helper-screen.styles';
import { UISizeShowcase } from './ui-size-showcase';
import {
  SpacingExampleCard,
  PaddingExampleCard,
  MarginExampleCard,
  GapExampleCard,
  BorderRadiusExampleCard,
  BorderWidthExampleCard,
  ButtonHeightExampleCard,
  InputHeightExampleCard,
  CardPaddingExampleCard,
  ScrollPaddingExampleCard,
  ScrollMarginExampleCard,
} from './live-examples';

export function UISizeHelperScreen() {
  const { currentTheme } = useTheme();
  const isDark = currentTheme === 'dark';
  const colors = getThemeColors(isDark);

  return (
    <SafeAreaView
      style={[uiSizeHelperScreenStyles.container, { backgroundColor: colors.background }]}
      edges={['top']}
    >
      <ScreenHeader
        title={t('helpers.uiSizeHelper.title')}
        subtitle={t('helpers.uiSizeHelper.description')}
        variant="minimal"
      />
      <ScrollView
        style={uiSizeHelperScreenStyles.scrollView}
        contentContainerStyle={uiSizeHelperScreenStyles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Live Examples - Her kategori kendi dropdown'ı ile */}
        <SpacingExampleCard />
        <PaddingExampleCard />
        <MarginExampleCard />
        <GapExampleCard />
        <BorderRadiusExampleCard />
        <BorderWidthExampleCard />
        <ButtonHeightExampleCard />
        <InputHeightExampleCard />
        <CardPaddingExampleCard />
        <ScrollPaddingExampleCard />
        <ScrollMarginExampleCard />

        <UISizeShowcase />
      </ScrollView>
    </SafeAreaView>
  );
}
