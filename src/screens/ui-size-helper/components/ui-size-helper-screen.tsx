import { ScreenHeader } from '@/src/shared/components/ScreenHeader';
import { ThemedText } from '@/src/shared/components/ThemedText';
import { ThemedView } from '@/src/shared/components/ThemedView';
import { t } from '@/src/shared/i18n';
import {
  getThemeColors,
  Sizing,
  Spacer,
  useResponsive,
  useTheme
} from 'masterfabric-expo-core';
import React, { useState } from 'react';
import {
  Modal,
  ScrollView,
  TouchableOpacity
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { uiSizeHelperScreenStyles } from '../styles/ui-size-helper-screen.styles';
import { SizingVariablesViewer } from './sizing-variables-viewer';
import { InteractiveSizingExample } from './interactive-sizing-example';

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

  const getDeviceTypeText = () => {
    if (isPhone) return t('uiSizeHelper.deviceType.phone');
    if (isTablet) return t('uiSizeHelper.deviceType.tablet');
    if (isDesktop) return t('uiSizeHelper.deviceType.desktop');
    return t('common.unknown');
  };

  return (
    <SafeAreaView
      style={[uiSizeHelperScreenStyles.container, { backgroundColor: colors.background }]}
      edges={['top']}
    >
      <ScreenHeader
        title={t('uiSizeHelper.title')}
        subtitle={t('uiSizeHelper.description')}
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
            {t('uiSizeHelper.deviceType.title')}
          </ThemedText>
          <ThemedText style={{ fontSize: Sizing.typography.fontSize.s }}>
            {getDeviceTypeText()}
          </ThemedText>
        </ThemedView>

        <Spacer size="l" />

        {/* Interactive Sizing Examples */}
        <InteractiveSizingExample onModalPress={() => setModalVisible(true)} />

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
              {t('uiSizeHelper.modal.title')}
            </ThemedText>
            <ThemedText
              style={{
                fontSize: Sizing.typography.fontSize.m,
                marginBottom: Sizing.spacing.l,
                lineHeight: Sizing.typography.fontSize.m * Sizing.typography.lineHeight.normal,
              }}
            >
              {t('uiSizeHelper.modal.description')}
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
                  fontWeight: Sizing.typography.fontWeight.semibold,
                }}
              >
                {t('common.close')}
              </ThemedText>
            </TouchableOpacity>
          </ThemedView>
        </TouchableOpacity>
      </Modal>
    </SafeAreaView>
  );
}
