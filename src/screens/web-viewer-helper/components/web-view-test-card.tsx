/**
 * Web View Test Card Component
 * 
 * Displays test results for Web Viewer Helper functions
 */

import { t } from '@/src/shared/i18n';
import { ThemedText, ThemedView, getThemeColors, useTheme } from 'masterfabric-expo-core';
import React from 'react';
import { ScrollView, View } from 'react-native';
import { WebViewTestCardProps } from '../models/models';
import { webViewTestCardStyles } from '../styles/web-view-test-card.styles';

export function WebViewTestCard({ result }: WebViewTestCardProps) {
  const { currentTheme } = useTheme();
  const isDark = currentTheme === 'dark';
  const colors = getThemeColors(isDark);

  return (
    <ThemedView
      style={[
        webViewTestCardStyles.container,
        {
          backgroundColor: colors.surfaceBackground,
          borderColor: result.success
            ? colors.successBorder || colors.surfaceBorder
            : colors.errorColor || colors.surfaceBorder,
        },
      ]}
    >
      <View style={webViewTestCardStyles.header}>
        <ThemedText
          type="defaultSemiBold"
          style={[webViewTestCardStyles.functionName, { color: colors.titleText }]}
        >
          {result.functionName}()
        </ThemedText>
        {result.sourceType && (
          <ThemedView
            style={[
              webViewTestCardStyles.sourceTypeBadge,
              {
                backgroundColor:
                  result.sourceType === 'html'
                    ? colors.primary + '20'
                    : colors.primary + '20',
              },
            ]}
          >
            <ThemedText
              style={[
                webViewTestCardStyles.sourceTypeText,
                {
                  color:
                    result.sourceType === 'html'
                      ? colors.primary
                      : colors.primary,
                },
              ]}
            >
              {result.sourceType === 'html'
                ? t('helpers.webViewerHelper.sourceHtml')
                : t('helpers.webViewerHelper.sourceUri')}
            </ThemedText>
          </ThemedView>
        )}
      </View>

      <ThemedText
        style={[webViewTestCardStyles.description, { color: colors.bodyText }]}
      >
        {result.description}
      </ThemedText>

      <View style={webViewTestCardStyles.inputOutputContainer}>
        <View style={webViewTestCardStyles.inputOutputGroup}>
          <ThemedText
            type="defaultSemiBold"
            style={[webViewTestCardStyles.label, { color: colors.sectionTitle }]}
          >
            {t('helpers.webViewerHelper.input')}
          </ThemedText>
          <ThemedView
            style={[
              webViewTestCardStyles.inputOutputBox,
              {
                backgroundColor: colors.inputBackground,
                borderColor: colors.surfaceBorder,
              },
            ]}
          >
            <ScrollView 
              nestedScrollEnabled={true}
              showsVerticalScrollIndicator={true}
              style={{ maxHeight: 200 }}
            >
              <ThemedText
                style={[webViewTestCardStyles.inputOutputText, { color: colors.bodyText }]}
                selectable={true}
              >
                {result.input}
              </ThemedText>
            </ScrollView>
          </ThemedView>
        </View>

        <View style={webViewTestCardStyles.inputOutputGroup}>
          <ThemedText
            type="defaultSemiBold"
            style={[webViewTestCardStyles.label, { color: colors.sectionTitle }]}
          >
            {t('helpers.webViewerHelper.output')}
          </ThemedText>
          <ThemedView
            style={[
              webViewTestCardStyles.inputOutputBox,
              {
                backgroundColor: result.success
                  ? colors.successBackground || colors.inputBackground
                  : colors.inputBackground,
                borderColor: result.success
                  ? colors.successBorder || colors.surfaceBorder
                  : colors.errorColor || colors.surfaceBorder,
              },
            ]}
          >
            <ScrollView 
              nestedScrollEnabled={true}
              showsVerticalScrollIndicator={true}
              style={{ maxHeight: 300 }}
            >
              <ThemedText
                style={[
                  webViewTestCardStyles.inputOutputText,
                  {
                    color: result.success
                      ? colors.successText || colors.bodyText
                      : colors.errorColor || colors.bodyText,
                  },
                ]}
                selectable={true}
              >
                {result.output}
              </ThemedText>
            </ScrollView>
          </ThemedView>
        </View>
      </View>
    </ThemedView>
  );
}
