import { ScreenHeader } from '@/src/shared/components/ScreenHeader';
import { ThemedText } from '@/src/shared/components/ThemedText';
import { ThemedView } from '@/src/shared/components/ThemedView';
import { Sizing, Spacer, useResponsive } from 'masterfabric-expo-core';
import { getThemeColors, useTheme } from 'masterfabric-expo-core';
import React, { useState } from 'react';
import {
  ScrollView,
  View,
  TouchableOpacity,
  Modal,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { uiSizeHelperScreenStyles } from '../styles/ui-size-helper-screen.styles';
import { SpacingExample } from './spacing-example';
import { TypographyExample } from './typography-example';
import { ButtonExample } from './button-example';
import { InputExample } from './input-example';
import { CardExample } from './card-example';
import { BorderRadiusExample } from './border-radius-example';
import { IconExample } from './icon-example';
import { ResponsiveExample } from './responsive-example';
import { SizingVariablesViewer } from './sizing-variables-viewer';

export function UISizeHelperScreen() {
  const { currentTheme } = useTheme();
  const isDark = currentTheme === 'dark';
  const colors = getThemeColors(isDark);
  const { isPhone, isTablet, isDesktop, getSpacing } = useResponsive();
  const [modalVisible, setModalVisible] = useState(false);

  const containerPadding = getSpacing(
    Sizing.padding.l,
    Sizing.padding.xl,
    Sizing.padding.xxl
  );

  return (
    <SafeAreaView
      style={[uiSizeHelperScreenStyles.container, { backgroundColor: colors.background }]}
      edges={['top']}
    >
      <ScreenHeader
        title="UI Size Helper"
        subtitle="Sizing system examples"
        variant="minimal"
      />
      <ScrollView
        style={uiSizeHelperScreenStyles.scrollView}
        contentContainerStyle={[
          uiSizeHelperScreenStyles.scrollContent,
          { padding: containerPadding }
        ]}
        showsVerticalScrollIndicator={false}
      >
        {/* Responsive Info */}
        <ThemedView
          style={[
            uiSizeHelperScreenStyles.infoCard,
            {
              backgroundColor: colors.cardBackground,
              borderColor: colors.surfaceBorder,
            }
          ]}
        >
          <ThemedText
            type="defaultSemiBold"
            style={{ fontSize: Sizing.typography.fontSize.m, marginBottom: Sizing.spacing.xs }}
          >
            Device Type
          </ThemedText>
          <ThemedText style={{ fontSize: Sizing.typography.fontSize.s }}>
            {isPhone && '📱 Phone'}
            {isTablet && '📱 Tablet'}
            {isDesktop && '🖥️ Desktop'}
          </ThemedText>
        </ThemedView>

        <Spacer size="l" />

        {/* Spacing Examples */}
        <SpacingExample />

        <Spacer size="xl" />

        {/* Typography Examples */}
        <TypographyExample />

        <Spacer size="xl" />

        {/* Border Radius Examples */}
        <BorderRadiusExample />

        <Spacer size="xl" />

        {/* Icon Examples */}
        <IconExample />

        <Spacer size="xl" />

        {/* Button Examples */}
        <ButtonExample onModalPress={() => setModalVisible(true)} />

        <Spacer size="xl" />

        {/* Input Examples */}
        <InputExample />

        <Spacer size="xl" />

        {/* Card Examples */}
        <CardExample />

        <Spacer size="xl" />

        {/* Responsive Examples */}
        <ResponsiveExample />

        <Spacer size="xl" />

        {/* Sizing Variables Viewer */}
        <SizingVariablesViewer />

        <Spacer size="xxl" />
      </ScrollView>

      {/* Modal Example */}
      <Modal
        visible={modalVisible}
        transparent
        animationType="fade"
        onRequestClose={() => setModalVisible(false)}
      >
        <TouchableOpacity
          style={[
            uiSizeHelperScreenStyles.modalBackdrop,
            {
              backgroundColor: `rgba(0, 0, 0, ${Sizing.modal.backdropOpacity.medium})`,
            }
          ]}
          activeOpacity={1}
          onPress={() => setModalVisible(false)}
        >
          <ThemedView
            style={[
              uiSizeHelperScreenStyles.modal,
              {
                backgroundColor: colors.surfaceBackground,
                borderColor: colors.surfaceBorder,
                width: Sizing.modal.width.medium,
                maxWidth: Sizing.modal.maxWidth.medium,
                maxHeight: Sizing.modal.maxHeight.medium,
                borderRadius: Sizing.modal.borderRadius.l,
                padding: Sizing.modal.padding.m,
              }
            ]}
          >
            <ThemedText
              type="defaultSemiBold"
              style={{
                fontSize: Sizing.typography.fontSize.xl,
                marginBottom: Sizing.spacing.m,
              }}
            >
              Modal Example
            </ThemedText>
            <ThemedText
              style={{
                fontSize: Sizing.typography.fontSize.m,
                marginBottom: Sizing.spacing.l,
                lineHeight: Sizing.typography.fontSize.m * Sizing.typography.lineHeight.normal,
              }}
            >
              This modal uses Sizing.modal values for width, maxWidth, maxHeight, borderRadius, and padding.
            </ThemedText>
            <TouchableOpacity
              style={[
                uiSizeHelperScreenStyles.modalButton,
                {
                  backgroundColor: colors.primary,
                  borderRadius: Sizing.button.borderRadius.l,
                  paddingHorizontal: Sizing.button.padding.horizontal.medium,
                  paddingVertical: Sizing.button.padding.vertical.medium,
                  height: Sizing.button.height.medium,
                }
              ]}
              onPress={() => setModalVisible(false)}
            >
              <ThemedText
                style={{
                  color: '#FFFFFF',
                  fontSize: Sizing.button.fontSize.medium,
                  fontWeight: Sizing.typography.fontWeight.semibold,
                }}
              >
                Close
              </ThemedText>
            </TouchableOpacity>
          </ThemedView>
        </TouchableOpacity>
      </Modal>
    </SafeAreaView>
  );
}

