import { ThemedText } from '@/src/shared/components/ThemedText';
import { ThemedView } from '@/src/shared/components/ThemedView';
import { t } from '@/src/shared/i18n';
import { getThemeColors, Sizing, Spacer, useTheme } from 'masterfabric-expo-core';
import React, { useState } from 'react';
import { TouchableOpacity, View } from 'react-native';

import { ButtonExample } from './button-example';
import { CardExample } from './card-example';
import { InputExample } from './input-example';
import { LayoutPreviewExample } from './layout-preview-example';
import { ScrollExample } from './scroll-example';
import { SpacingExample } from './spacing-example';

interface InteractiveSizingExampleProps {
  onModalPress: () => void;
}

export function InteractiveSizingExample({ onModalPress }: InteractiveSizingExampleProps) {
  const { currentTheme } = useTheme();
  const isDark = currentTheme === 'dark';
  const colors = getThemeColors(isDark);

  const [activeTab, setActiveTab] = useState<'layout' | 'spacing' | 'components' | 'scroll'>('layout');

  const tabs: Array<{ id: 'layout' | 'spacing' | 'components' | 'scroll'; label: string }> = [
    { id: 'layout', label: t('uiSizeHelper.tabs.layout') },
    { id: 'spacing', label: t('uiSizeHelper.tabs.spacing') },
    { id: 'components', label: t('uiSizeHelper.tabs.components') },
    { id: 'scroll', label: t('uiSizeHelper.tabs.scroll') },
  ];

  return (
    <ThemedView
      style={{
        backgroundColor: colors.cardBackground,
        borderRadius: Sizing.card.borderRadius.l,
        padding: Sizing.card.padding.medium,
        borderWidth: Sizing.borderWidth.s,
        borderColor: colors.surfaceBorder,
      }}
    >
      <ThemedText
        type="defaultSemiBold"
        style={{
          fontSize: Sizing.typography.fontSize.xl,
          marginBottom: Sizing.spacing.m,
        }}
      >
        {t('uiSizeHelper.examples.interactive.title')}
      </ThemedText>

      <ThemedText
        style={{
          fontSize: Sizing.typography.fontSize.m,
          marginBottom: Sizing.spacing.m,
          color: colors.bodyText,
        }}
      >
        {t('uiSizeHelper.examples.interactive.description')}
      </ThemedText>

      {/* Simple tab bar to switch between sizing categories */}
      <View
        style={{
          flexDirection: 'row',
          borderRadius: Sizing.card.borderRadius.m,
          borderWidth: Sizing.borderWidth.s,
          borderColor: colors.surfaceBorder,
          overflow: 'hidden',
          marginBottom: Sizing.spacing.l,
        }}
      >
        {tabs.map((tab) => {
          const isActive = activeTab === tab.id;
          return (
            <TouchableOpacity
              key={tab.id}
              onPress={() => setActiveTab(tab.id)}
              style={{
                flex: 1,
                paddingVertical: Sizing.spacing.s,
                paddingHorizontal: Sizing.spacing.m,
                backgroundColor: isActive ? colors.primary : colors.surfaceBackground,
              }}
              activeOpacity={0.8}
            >
              <ThemedText
                style={{
                  textAlign: 'center',
                  color: isActive ? '#FFFFFF' : colors.bodyText,
                  fontWeight: isActive
                    ? Sizing.typography.fontWeight.semibold
                    : Sizing.typography.fontWeight.normal,
                  fontSize: Sizing.typography.fontSize.s,
                }}
              >
                {tab.label}
              </ThemedText>
            </TouchableOpacity>
          );
        })}
      </View>

      {activeTab === 'layout' && (
        <LayoutPreviewExample />
      )}

      {activeTab === 'spacing' && (
        <>
          <SpacingExample />
        </>
      )}

      {activeTab === 'components' && (
        <>
          <ButtonExample onModalPress={onModalPress} />
          <Spacer size="l" />
          <InputExample />
          <Spacer size="l" />
          <CardExample />
        </>
      )}

      {activeTab === 'scroll' && (
        <ScrollExample />
      )}
    </ThemedView>
  );
}
