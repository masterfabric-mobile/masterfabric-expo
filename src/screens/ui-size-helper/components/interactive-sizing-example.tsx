import { ThemedText } from '@/src/shared/components/ThemedText';
import { ThemedView } from '@/src/shared/components/ThemedView';
import { t } from '@/src/shared/i18n';
import { Sizing, Spacer } from 'masterfabric-expo-core';
import { getThemeColors, useTheme } from 'masterfabric-expo-core';
import React from 'react';

import { ButtonExample } from './button-example';
import { CardExample } from './card-example';
import { InputExample } from './input-example';
import { SpacingExample } from './spacing-example';

interface InteractiveSizingExampleProps {
  onModalPress: () => void;
}

export function InteractiveSizingExample({ onModalPress }: InteractiveSizingExampleProps) {
  const { currentTheme } = useTheme();
  const isDark = currentTheme === 'dark';
  const colors = getThemeColors(isDark);

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
          marginBottom: Sizing.spacing.l,
          color: colors.bodyText,
        }}
      >
        {t('uiSizeHelper.examples.interactive.description')}
      </ThemedText>

      {/* Spacing Example */}
      <SpacingExample />
      <Spacer size="l" />

      {/* Button Example */}
      <ButtonExample onModalPress={onModalPress} />
      <Spacer size="l" />

      {/* Input Example */}
      <InputExample />
      <Spacer size="l" />

      {/* Card Example */}
      <CardExample />
    </ThemedView>
  );
}
