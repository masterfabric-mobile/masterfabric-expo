import { ThemedText } from '@/src/shared/components/ThemedText';
import { ThemedView } from '@/src/shared/components/ThemedView';
import { Sizing, useResponsive } from 'masterfabric-expo-core';
import { getThemeColors, useTheme } from 'masterfabric-expo-core';
import React from 'react';
import { View } from 'react-native';

export function ResponsiveExample() {
  const { currentTheme } = useTheme();
  const isDark = currentTheme === 'dark';
  const colors = getThemeColors(isDark);
  const { width, isPhone, isTablet, isDesktop, getSpacing } = useResponsive();

  const responsivePadding = getSpacing(
    Sizing.padding.l,
    Sizing.padding.xl,
    Sizing.padding.xxl
  );

  const responsiveFontSize = isDesktop
    ? Sizing.typography.fontSize.xl
    : isTablet
    ? Sizing.typography.fontSize.l
    : Sizing.typography.fontSize.m;

  const gridColumns = isDesktop
    ? Sizing.grid.columns.desktop
    : isTablet
    ? Sizing.grid.columns.tablet
    : Sizing.grid.columns.phone;

  return (
    <ThemedView
      style={{
        backgroundColor: colors.cardBackground,
        borderRadius: Sizing.card.borderRadius.l,
        padding: responsivePadding,
        borderWidth: Sizing.borderWidth.s,
        borderColor: colors.surfaceBorder,
      }}
    >
      <ThemedText
        type="defaultSemiBold"
        style={{
          fontSize: Sizing.typography.fontSize.l,
          marginBottom: Sizing.spacing.m,
        }}
      >
        Responsive Examples
      </ThemedText>

      <View style={{ marginBottom: Sizing.spacing.l }}>
        <ThemedText
          style={{
            fontSize: Sizing.typography.fontSize.s,
            marginBottom: Sizing.spacing.xs,
            color: colors.bodyText,
          }}
        >
          Screen Width: {width}px
        </ThemedText>
        <ThemedText
          style={{
            fontSize: Sizing.typography.fontSize.s,
            marginBottom: Sizing.spacing.xs,
            color: colors.bodyText,
          }}
        >
          Device: {isPhone && 'Phone'} {isTablet && 'Tablet'} {isDesktop && 'Desktop'}
        </ThemedText>
        <ThemedText
          style={{
            fontSize: Sizing.typography.fontSize.s,
            marginBottom: Sizing.spacing.xs,
            color: colors.bodyText,
          }}
        >
          Responsive Padding: {responsivePadding}px
        </ThemedText>
        <ThemedText
          style={{
            fontSize: Sizing.typography.fontSize.s,
            marginBottom: Sizing.spacing.xs,
            color: colors.bodyText,
          }}
        >
          Responsive Font Size: {responsiveFontSize}px
        </ThemedText>
        <ThemedText
          style={{
            fontSize: Sizing.typography.fontSize.s,
            color: colors.bodyText,
          }}
        >
          Grid Columns: {gridColumns}
        </ThemedText>
      </View>

      <View>
        <ThemedText
          type="defaultSemiBold"
          style={{
            fontSize: responsiveFontSize,
            marginBottom: Sizing.spacing.s,
          }}
        >
          Responsive Typography
        </ThemedText>
        <ThemedText
          style={{
            fontSize: responsiveFontSize,
            lineHeight: responsiveFontSize * Sizing.typography.lineHeight.normal,
            color: colors.text,
          }}
        >
          This text size adapts based on screen width. On phones it is {Sizing.typography.fontSize.m}px, 
          on tablets {Sizing.typography.fontSize.l}px, and on desktop {Sizing.typography.fontSize.xl}px.
        </ThemedText>
      </View>

      <View style={{ marginTop: Sizing.spacing.l }}>
        <ThemedText
          type="defaultSemiBold"
          style={{
            fontSize: Sizing.typography.fontSize.m,
            marginBottom: Sizing.spacing.s,
          }}
        >
          Breakpoints
        </ThemedText>
        <View style={{ gap: Sizing.gap.xs }}>
          <ThemedText
            style={{
              fontSize: Sizing.typography.fontSize.s,
              color: colors.bodyText,
            }}
          >
            Phone: {Sizing.breakpoints.phone.xs}px - {Sizing.breakpoints.phone.xl}px
          </ThemedText>
          <ThemedText
            style={{
              fontSize: Sizing.typography.fontSize.s,
              color: colors.bodyText,
            }}
          >
            Tablet: {Sizing.breakpoints.tablet.small}px - {Sizing.breakpoints.tablet.xl}px
          </ThemedText>
          <ThemedText
            style={{
              fontSize: Sizing.typography.fontSize.s,
              color: colors.bodyText,
            }}
          >
            Desktop: {Sizing.breakpoints.desktop.small}px+
          </ThemedText>
        </View>
      </View>
    </ThemedView>
  );
}

